import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/performance",
	testMatch: "web-vitals.spec.js",
	reporter: [["list"]],
	use: { baseURL: "http://127.0.0.1:4175", viewport: { width: 1440, height: 900 } },
});
