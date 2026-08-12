import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet } from "react-router-dom";

import App from "../../src/App";

vi.mock("../../src/pages/Login", () => ({ default: () => <div>Login Page</div> }));
vi.mock("../../src/pages/Dashboard", () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock("../../src/pages/Employees", () => ({ default: () => <div>Employees Page</div> }));
vi.mock("../../src/pages/Departments", () => ({ default: () => <div>Departments Page</div> }));
vi.mock("../../src/pages/Attendance", () => ({ default: () => <div>Attendance Page</div> }));
vi.mock("../../src/pages/Payroll", () => ({ default: () => <div>Payroll Page</div> }));

vi.mock("../../src/components/employee/EmployeeDetails", () => ({ default: () => <div>Employee Details</div> }));
vi.mock("../../src/components/employee/EmployeeCreate", () => ({ default: () => <div>Employee Create</div> }));
vi.mock("../../src/components/employee/EmployeeEdit", () => ({ default: () => <div>Employee Edit</div> }));

vi.mock("../../src/components/department/DepartmentDetails", () => ({ default: () => <div>Department Details</div> }));
vi.mock("../../src/components/department/DepartmentCreate", () => ({ default: () => <div>Department Create</div> }));
vi.mock("../../src/components/department/DepartmentEdit", () => ({ default: () => <div>Department Edit</div> }));

vi.mock("../../src/components/attendance/AttendanceDetails", () => ({ default: () => <div>Attendance Details</div> }));
vi.mock("../../src/components/payroll/PayrollDetails", () => ({ default: () => <div>Payroll Details</div> }));

vi.mock("../../src/components/common/ProtectedRoute", () => ({
    default: () => <Outlet />,
}));

vi.mock("../../src/layout/mainLayout", () => ({
    default: () => <Outlet />,
}));
vi.mock("../../src/layout/employeeLayout", () => ({
    default: () => <Outlet />,
}));
vi.mock("../../src/layout/departmentLayout", () => ({
    default: () => <Outlet />,
}));
vi.mock("../../src/layout/attendanceLayout", () => ({
    default: () => <Outlet />,
}));
vi.mock("../../src/layout/payslipLayout", () => ({
    default: () => <Outlet />,
}));

describe("App", () => {
	it("renders the login route", async () => {
        render(
            <MemoryRouter initialEntries={["/login"]}>
                <App />
            </MemoryRouter>,
        );

		expect(await screen.findByText("Login Page")).toBeInTheDocument();
    });

	it("renders a protected module route", async () => {
        render(
            <MemoryRouter initialEntries={["/employees"]}>
                <App />
            </MemoryRouter>,
        );

		expect(await screen.findByText("Employees Page")).toBeInTheDocument();
    });

	it("redirects unknown routes to the dashboard", async () => {
        render(
            <MemoryRouter initialEntries={["/does-not-exist"]}>
                <App />
            </MemoryRouter>,
        );

		expect(await screen.findByText("Dashboard Page")).toBeInTheDocument();
    });

	it("supports nested employee routes", async () => {
        render(
            <MemoryRouter initialEntries={["/employees/new"]}>
                <App />
            </MemoryRouter>,
        );

		expect(await screen.findByText("Employee Create")).toBeInTheDocument();
    });

	it.each([
		["/employees/EMP001", "Employee Details"],
		["/employees/edit/EMP001", "Employee Edit"],
		["/departments", "Departments Page"],
		["/departments/new", "Department Create"],
		["/departments/DEPT001", "Department Details"],
		["/departments/edit/DEPT001", "Department Edit"],
		["/attendance", "Attendance Page"],
		["/attendance/EMP001", "Attendance Details"],
		["/payroll", "Payroll Page"],
		["/payroll/EMP001", "Payroll Details"],
	])("renders %s", async (path, expectedText) => {
		render(
			<MemoryRouter initialEntries={[path]}>
				<App />
			</MemoryRouter>,
		);

		expect(await screen.findByText(expectedText)).toBeInTheDocument();
	});
});
