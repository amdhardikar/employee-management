import { spawn } from "node:child_process";
import process from "node:process";

const config = process.argv[2] || "playwright.config.js";
const port = config.includes("web-vitals") ? 4175 : 4174;
const server = spawn(process.execPath, ["scripts/serve-dist.mjs", String(port)], {
	stdio: "ignore",
	windowsHide: true,
});
let apiServer;

const stopProcessTree = async (child) => {
	if (!child || child.exitCode !== null) return;

	if (process.platform === "win32") {
		const shutdown = spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
			stdio: "ignore",
			windowsHide: true,
		});
		await new Promise((resolve) => shutdown.on("exit", resolve));
		return;
	}

	child.kill("SIGTERM");
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

	for (let attempt = 0; attempt < 120; attempt += 1) {
		try {
			const response = await fetch("http://127.0.0.1:5000/departments");
			if (response.ok) return;
		} catch {
			// The API is still starting.
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	throw new Error("The data-generator API did not start in time.");
};

const waitForServer = async () => {
	for (let attempt = 0; attempt < 40; attempt += 1) {
		try {
			const response = await fetch(`http://127.0.0.1:${port}`);
			if (response.ok) return;
		} catch {
			// The local browser-test server is still starting.
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	throw new Error("The local browser-test server did not start in time.");
};

let exitCode = 1;
try {
	await ensureApiServer();
	await waitForServer();
	const runner = spawn(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "--config", config], {
		stdio: "inherit",
		windowsHide: true,
	});
	exitCode = await new Promise((resolve) => runner.on("exit", (code) => resolve(code ?? 1)));
} finally {
	await stopProcessTree(server);
	await stopProcessTree(apiServer);
}

process.exitCode = exitCode;
