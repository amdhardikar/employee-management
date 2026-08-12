import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "node:process";

const isCoverageRun = process.argv.includes("--coverage");

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./tests/setup.js",
		exclude: ["node_modules/**", "dist/**", "reports/**", "tests/playwright/**", "tests/performance/**"],
		testTimeout: 10000,
		reporters: [
			"default",
			["json", { outputFile: "./reports/test/results.json" }],
			["junit", { outputFile: "./reports/test/junit.xml", suiteName: "Employee Management" }],
			...(!isCoverageRun ? [["html", { outputFile: "./reports/test/index.html" }]] : []),
		],
		coverage: {
			provider: "v8",
			cleanOnRerun: true,
			reporter: ["text", "html", "json-summary"],
			reportsDirectory: "./reports/coverage",
			thresholds: {
				statements: 97,
				branches: 97,
				functions: 97,
				lines: 97,
			},
		},
	},
});
