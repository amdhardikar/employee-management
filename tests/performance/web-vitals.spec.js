import { mkdir, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const session = {
	token: "performance-test-token",
	employeeId: "EMP001",
	employeeCode: "EMS-2026-001",
	fullName: "Performance Test User",
	role: "Tester",
	email: "performance.test@company.com",
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

test("collects browser Web Vitals for every application screen", async ({ page }) => {
	test.setTimeout(120_000);
	await page.addInitScript((value) => localStorage.setItem("ems_session", JSON.stringify(value)), session);
	const results = [];

	for (const path of routes) {
		await page.goto(path, { waitUntil: "domcontentloaded" });
		await page.waitForTimeout(2500);
		const metrics = await page.evaluate(() => window.__EMS_WEB_VITALS__ || []);
		results.push({ path, url: page.url(), metrics });
		expect(metrics.some(({ name }) => name === "FCP"), `${path} is missing FCP`).toBe(true);
		expect(metrics.some(({ name }) => name === "TTFB"), `${path} is missing TTFB`).toBe(true);
	}

	await mkdir("reports/web-vitals", { recursive: true });
	await writeFile(
		"reports/web-vitals/metrics.json",
		JSON.stringify({ generatedAt: new Date().toISOString(), routes: results }, null, 2),
	);
});
