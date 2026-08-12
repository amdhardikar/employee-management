import { defineConfig } from "@playwright/test";

const viewports = [
	{ name: "mobile", viewport: { width: 375, height: 812 } },
	{ name: "tablet", viewport: { width: 768, height: 1024 } },
	{ name: "small-desktop", viewport: { width: 1024, height: 768 } },
	{ name: "desktop", viewport: { width: 1440, height: 900 } },
];

export default defineConfig({
	testDir: "./tests/playwright",
	testMatch: "responsive.spec.js",
	outputDir: "./reports/responsive/artifacts",
	reporter: [
		["list"],
		["html", { outputFolder: "./reports/responsive/html", open: "never" }],
		["json", { outputFile: "./reports/responsive/results.json" }],
	],
	use: {
		baseURL: "http://127.0.0.1:4174",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: viewports.map(({ name, viewport }) => ({ name, use: { viewport } })),
});
