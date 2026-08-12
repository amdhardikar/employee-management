import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { Outlet, useLocation } from "react-router-dom";

import AttendanceLayout from "../../../src/layout/attendanceLayout";
import DepartmentLayout from "../../../src/layout/departmentLayout";
import EmployeeLayout from "../../../src/layout/employeeLayout";
import PayslipLayout from "../../../src/layout/payslipLayout";
import MainLayout from "../../../src/layout/mainLayout";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");

	return {
		...actual,
		Outlet: vi.fn(() => (
			<div data-testid="outlet" className="overflow-y-auto">
				Outlet Content
			</div>
		)),
		useLocation: vi.fn(() => ({ pathname: "/dashboard" })),
	};
});

vi.mock("../../../src/components/common/Sidebar", () => ({
	default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock("../../../src/components/common/Header", () => ({
	default: () => <div data-testid="header">Header</div>,
}));

describe("AttendanceLayout", () => {
	it("renders outlet", () => {
		render(<AttendanceLayout />);

		expect(screen.getByTestId("outlet")).toBeInTheDocument();
	});
});

describe("DepartmentLayout", () => {
	it("renders outlet", () => {
		render(<DepartmentLayout />);

		expect(screen.getByTestId("outlet")).toBeInTheDocument();
	});
});

describe("EmployeeLayout", () => {
	it("renders outlet", () => {
		render(<EmployeeLayout />);

		expect(screen.getByTestId("outlet")).toBeInTheDocument();
	});
});

describe("PayslipLayout", () => {
	it("renders outlet", () => {
		render(<PayslipLayout />);

		expect(screen.getByTestId("outlet")).toBeInTheDocument();
	});
});

describe("MainLayout", () => {
	it("renders sidebar, header and outlet", () => {
		render(<MainLayout />);

		expect(screen.getByTestId("sidebar")).toBeInTheDocument();

		expect(screen.getByTestId("header")).toBeInTheDocument();

		expect(screen.getByTestId("outlet")).toBeInTheDocument();
	});

	it("resets the main scroll position when the route changes", () => {
		vi.mocked(useLocation).mockReturnValue({ pathname: "/employees" });
		const { container, rerender } = render(<MainLayout />);
		const main = container.querySelector("main");
		const outlet = screen.getByTestId("outlet");
		main.scrollTop = 250;
		main.scrollLeft = 40;
		outlet.scrollTop = 175;

		vi.mocked(useLocation).mockReturnValue({ pathname: "/departments" });
		rerender(<MainLayout />);

		expect(main.scrollTop).toBe(0);
		expect(main.scrollLeft).toBe(0);
		expect(outlet.scrollTop).toBe(0);
	});
});
