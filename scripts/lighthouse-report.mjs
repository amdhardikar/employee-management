import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import process from "node:process";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import puppeteer from "puppeteer-core";

const origin = "http://127.0.0.1:4176";
const session = {
	token: "lighthouse-test-token",
	employeeId: "EMP001",
	employeeCode: "EMS-2026-001",
	fullName: "Lighthouse Test User",
	role: "Tester",
	email: "lighthouse.test@company.com",
};
const routes = [
	"/login",
	"/dashboard",
	"/employees",
	"/employees/new",
	"/employees/EMP001",
	"/employees/edit/EMP001",
	"/departments",
	"/departments/new",
	"/departments/DEPT001",
	"/departments/edit/DEPT001",
	"/attendance",
	"/attendance/EMP001",
	"/payroll",
	"/payroll/EMP001",
];

const server = spawn(process.execPath, ["scripts/serve-dist.mjs", "4176"], {
	stdio: "ignore",
	windowsHide: true,
	detached: true,
});
let apiServer;

const waitForUrl = async (url, failureMessage) => {
	for (let attempt = 0; attempt < 40; attempt += 1) {
		try {
			const response = await fetch(url);
			if (response.ok) return;
		} catch {
			// The requested local service is still starting.
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	throw new Error(failureMessage);
};

const ensureApiServer = async () => {
	try {
		const response = await fetch("http://127.0.0.1:5000/departments");
		if (response.ok) return;
	} catch {
		// Start the paired data-generator service below.
	}
	apiServer = spawn(process.execPath, ["server/server.js"], {
		cwd: "../data generator",
		stdio: "ignore",
		windowsHide: true,
	});
	await waitForUrl("http://127.0.0.1:5000/departments", "The data-generator API did not start in time.");
};

const stopProcessTree = async (child) => {
	if (!child) return;
	if (process.platform === "win32") {
		const shutdown = spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
			stdio: "ignore",
			windowsHide: true,
		});
		await new Promise((resolve) => shutdown.on("exit", resolve));
	} else {
		child.kill("SIGTERM");
	}
};

let chrome;
try {
	await ensureApiServer();
	await waitForUrl(`${origin}/login`, "The production frontend did not start in time.");
	chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"] });
	const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}` });
	const seedPage = await browser.newPage();
	await seedPage.goto(`${origin}/login`);
	await seedPage.evaluate((value) => localStorage.setItem("ems_session", JSON.stringify(value)), session);
	await seedPage.close();
	browser.disconnect();

	const summaries = [];
	await mkdir("reports/lighthouse", { recursive: true });
	for (const path of routes) {
		const url = `${origin}${path}`;
		const slug = path === "/login" ? "login" : path.slice(1).replaceAll("/", "-").replaceAll(":", "-");
		const result = await lighthouse(url, {
			port: chrome.port,
			output: ["html", "json"],
			logLevel: "error",
			disableStorageReset: true,
			onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
		});
		const outputDirectory = `reports/lighthouse/${slug}`;
		await mkdir(outputDirectory, { recursive: true });
		await writeFile(`${outputDirectory}/index.html`, result.report[0]);
		await writeFile(`${outputDirectory}/report.json`, result.report[1]);
		const scores = Object.fromEntries(
			Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)]),
		);
		summaries.push({ path, url, report: `${slug}/index.html`, scores });
		console.log(`Lighthouse ${path}:`, scores);
	}

	await writeFile(
		"reports/lighthouse/summary.json",
		JSON.stringify({ generatedAt: new Date().toISOString(), routes: summaries }, null, 2),
	);
	const rows = summaries
		.map(
			({ path, report, scores }) =>
				`<tr><td><a href="${report}">${path}</a></td><td>${scores.performance}</td><td>${scores.accessibility}</td><td>${scores["best-practices"]}</td><td>${scores.seo}</td></tr>`,
		)
		.join("");
	await writeFile(
		"reports/lighthouse/index.html",
		`<!doctype html><html><head><meta charset="utf-8"><title>Lighthouse route reports</title><style>body{font-family:system-ui;margin:2rem}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:.65rem;text-align:left}th{background:#f4f6f8}</style></head><body><h1>Lighthouse route reports</h1><table><thead><tr><th>Route</th><th>Performance</th><th>Accessibility</th><th>Best practices</th><th>SEO</th></tr></thead><tbody>${rows}</tbody></table></body></html>`,
	);
} finally {
	if (chrome) {
		try {
			await chrome.kill();
		} catch (error) {
			console.warn("Lighthouse completed, but its temporary Chrome directory could not be removed:", error.message);
		}
	}
	await stopProcessTree(server);
	await stopProcessTree(apiServer);
}

// chrome-launcher can retain a Windows cleanup handle after a successful audit.
setTimeout(() => process.exit(process.exitCode ?? 0), 100);
