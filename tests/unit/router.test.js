import { describe, it, expect } from "vitest";

import { appRoutes } from "../../src/router";

describe("appRoutes", () => {
    it("contains all primary EMS routes", () => {
        const paths = appRoutes.map((route) => route.path);

        expect(paths).toEqual([
            "/dashboard",
            "/employees",
            "/employees/new",
            "/employees/:id",
            "/employees/edit/:id",
            "/departments",
            "/departments/new",
            "/departments/:id",
            "/departments/edit/:id",
            "/attendance",
            "/attendance/:id",
            "/payroll",
            "/payroll/:id",
        ]);
    });

    it("defines parent relationships for nested routes", () => {
        expect(appRoutes.find((route) => route.path === "/employees/new").parent).toBe("/employees");
        expect(appRoutes.find((route) => route.path === "/employees/:id").parent).toBe("/employees");
        expect(appRoutes.find((route) => route.path === "/departments/new").parent).toBe("/departments");
        expect(appRoutes.find((route) => route.path === "/attendance/:id").parent).toBe("/attendance");
        expect(appRoutes.find((route) => route.path === "/payroll/:id").parent).toBe("/payroll");
    });

    it("provides breadcrumb metadata for every route", () => {
        expect(appRoutes.every((route) => typeof route.breadcrumb === "string")).toBe(true);
    });
});
