import { expect, test } from "@playwright/test";

const session = {
	token: "responsive-test-token",
	employeeId: "EMP001",
	employeeCode: "EMS-2026-001",
	fullName: "Responsive Test User",
	role: "Tester",
	email: "responsive.test@company.com",
};

const protectedRoutes = [
	{ path: "/dashboard", marker: "Dashboard" },
	{ path: "/employees", marker: "Employees" },
	{ path: "/employees/new", marker: "Personal Information" },
	{ path: "/employees/EMP001", marker: "Personal Information" },
	{ path: "/employees/edit/EMP001", marker: "Personal Information" },
	{ path: "/departments", marker: "Departments" },
	{ path: "/departments/new", marker: "Create Department" },
	{ path: "/departments/DEPT001", marker: "Engineering" },
	{ path: "/departments/edit/DEPT001", marker: "Engineering" },
	{ path: "/attendance", marker: "Attendance" },
	{ path: "/attendance/EMP001", marker: "Attendance" },
	{ path: "/payroll", marker: "Payroll" },
	{ path: "/payroll/EMP001", marker: "Payroll" },
];

const expectNoHorizontalOverflow = async (page, path) => {
	const dimensions = await page.evaluate(() => ({
		documentWidth: document.documentElement.scrollWidth,
		viewportWidth: document.documentElement.clientWidth,
	}));
	expect(dimensions.documentWidth, `${path} has horizontal overflow`).toBeLessThanOrEqual(
		dimensions.viewportWidth + 1,
	);
};

test("login remains usable without horizontal overflow", async ({ page }) => {
	const consoleErrors = [];
	page.on("console", (message) => message.type() === "error" && consoleErrors.push(message.text()));
	await page.goto("/login");
	await expect(page.getByRole("heading", { name: "EMS Portal Login" })).toBeVisible();
	await expect(page.getByLabel("Email Address")).toBeVisible();
	await expect(page.getByLabel("Employee Code")).toBeVisible();
	await expectNoHorizontalOverflow(page, "/login");
	expect(consoleErrors).toEqual([]);
});

test("every authenticated screen loads and remains responsive", async ({ page }) => {
	test.setTimeout(120_000);
	await page.addInitScript((value) => localStorage.setItem("ems_session", JSON.stringify(value)), session);
	const consoleErrors = [];
	page.on("console", (message) => message.type() === "error" && consoleErrors.push(message.text()));
	page.on("pageerror", (error) => consoleErrors.push(error.message));

	for (const route of protectedRoutes) {
		await test.step(route.path, async () => {
			consoleErrors.length = 0;
			await page.goto(route.path, { waitUntil: "domcontentloaded" });
			await expect(page).toHaveURL(new RegExp(`${route.path.replaceAll("/", "\\/")}$`));
			await expect(page.getByText("Loading page...", { exact: true })).toHaveCount(0, { timeout: 15_000 });
			await expect(page.getByText(route.marker, { exact: false }).first()).toBeVisible({ timeout: 15_000 });
			await expect(page.getByText(/unable to connect to server/i)).toHaveCount(0);
			await expectNoHorizontalOverflow(page, route.path);
			expect(consoleErrors, `${route.path} logged browser errors`).toEqual([]);
		});
	}
});
