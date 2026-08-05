import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DepartmentEmployeeCard from "../../../components/department/DepartmentEmployeeCard";
import { STATUS_COLORS } from "../../../constants/EMSconstants";

describe("DepartmentEmployeeCard", () => {
	const employee = {
		employeeId: "EMP001",

		personalInfo: {
			fullName: "John Doe",
		},

		employment: {
			status: "Active",
			designation: "Software Engineer",
			employeeType: "Full Time",
			workLocation: "Pune",

			manager: {
				name: "Jane Smith",
			},
		},
	};

	it("renders employee name", () => {
		render(<DepartmentEmployeeCard employee={employee} />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});

	it("renders employee id", () => {
		render(<DepartmentEmployeeCard employee={employee} />);

		expect(screen.getByText("EMP001")).toBeInTheDocument();
	});

	it("renders employee status", () => {
		render(<DepartmentEmployeeCard employee={employee} />);

		expect(screen.getByText("Active")).toBeInTheDocument();
	});

	it("applies correct status color class", () => {
		render(<DepartmentEmployeeCard employee={employee} />);

		const status = screen.getByText("Active");

		expect(status).toHaveClass(STATUS_COLORS.Active.split(" ")[0]);
	});

	it("renders designation", () => {
		render(<DepartmentEmployeeCard employee={employee} />);

		expect(screen.getByText("Software Engineer")).toBeInTheDocument();
	});

	it("renders employee type", () => {
		render(<DepartmentEmployeeCard employee={employee} />);

		expect(screen.getByText("Full Time")).toBeInTheDocument();
	});

	it("renders work location", () => {
		render(<DepartmentEmployeeCard employee={employee} />);

		expect(screen.getByText("Pune")).toBeInTheDocument();
	});

	it("renders manager name", () => {
		render(<DepartmentEmployeeCard employee={employee} />);

		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
	});

	it("shows dash when manager is unavailable", () => {
		const employeeWithoutManager = {
			...employee,

			employment: {
				...employee.employment,
				manager: undefined,
			},
		};

		render(<DepartmentEmployeeCard employee={employeeWithoutManager} />);

		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("handles missing optional employee fields", () => {
		const minimalEmployee = {
			employeeId: "EMP002",
		};

		render(<DepartmentEmployeeCard employee={minimalEmployee} />);

		expect(screen.getByText("EMP002")).toBeInTheDocument();

		expect(screen.getByText("-")).toBeInTheDocument();
	});
});