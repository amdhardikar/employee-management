import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DepartmentDetailsTable from "../../../../src/components/department/DepartmentDetailsTable";
import { STATUS_COLORS } from "../../../../src/constants/EMSconstants";

describe("DepartmentDetailsTable", () => {
	const employees = [
		{
			id: 1,
			employeeId: "EMP001",
			employeeCode: "EMS001",
			fullName: "John Doe",

			employment: {
				designation: "Software Engineer",
				employeeType: "Full Time",
				workLocation: "Pune",
				status: "Active",
				manager: {
					name: "Jane Smith",
				},
			},
		},
	];

	const renderComponent = (data = employees) => {
		return render(
			<MemoryRouter>
				<DepartmentDetailsTable employees={data} />
			</MemoryRouter>,
		);
	};

	it("renders table headers", () => {
		renderComponent();

		expect(screen.getByText("Employee")).toBeInTheDocument();
		expect(screen.getByText("Designation")).toBeInTheDocument();
		expect(screen.getByText("Type")).toBeInTheDocument();
		expect(screen.getByText("Location")).toBeInTheDocument();
		expect(screen.getByText("Manager")).toBeInTheDocument();
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("renders employee information", () => {
		renderComponent();

		expect(screen.getByText("EMP001 | EMS001")).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Software Engineer")).toBeInTheDocument();
		expect(screen.getByText("Full Time")).toBeInTheDocument();
		expect(screen.getByText("Pune")).toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
	});

	it("renders employee link correctly", () => {
		renderComponent();

		const link = screen.getByRole("link", {
			name: "John Doe",
		});

		expect(link).toHaveAttribute("href", "/employees/EMP001");
	});

	it("renders employee status", () => {
		renderComponent();

		expect(screen.getByText("Active")).toBeInTheDocument();
	});

	it("applies correct status class", () => {
		renderComponent();

		const status = screen.getByText("Active");

		expect(status).toHaveClass(STATUS_COLORS.Active.split(" ")[0]);
	});

	it("uses default status class for unknown status", () => {
		const employeeWithUnknownStatus = [
			{
				...employees[0],
				employment: {
					...employees[0].employment,
					status: "Unknown",
				},
			},
		];

		renderComponent(employeeWithUnknownStatus);

		const status = screen.getByText("Unknown");

		expect(status).toHaveClass("bg-slate-100");
	});

	it("renders empty table when employees array is empty", () => {
		renderComponent([]);

		expect(screen.queryByText("EMP001")).not.toBeInTheDocument();
	});
});
