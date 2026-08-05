import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { Outlet } from "react-router-dom";

import AttendanceLayout from "../../layout/attendanceLayout";
import DepartmentLayout from "../../layout/departmentLayout";
import EmployeeLayout from "../../layout/employeeLayout";
import PayslipLayout from "../../layout/payslipLayout";
import MainLayout from "../../layout/mainLayout";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");

	return {
		...actual,
		Outlet: vi.fn(() => <div data-testid="outlet">Outlet Content</div>),
	};
});

vi.mock("../../components/common/Sidebar", () => ({
	default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock("../../components/common/Header", () => ({
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
});
