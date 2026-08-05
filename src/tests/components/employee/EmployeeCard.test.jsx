import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EmployeeCard from "../../../components/employee/EmployeeCard";

const mockEmployee = {
	id: 1,
	fullName: "John Doe",
	employeeCode: "EMS-001",
	email: "john.doe@test.com",

	personalInfo: {
		profileImage: "https://example.com/john.jpg",
		phone: "9876543210",
	},

	employment: {
		designation: "Software Engineer",
		workLocation: "Pune",
		status: "Active",
	},
};

describe("EmployeeCard Component", () => {
	it("renders employee name and employee code", () => {
		render(<EmployeeCard employee={mockEmployee} onView={vi.fn()} />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();

		expect(screen.getByText("EMS-001")).toBeInTheDocument();
	});

	it("renders employee profile image", () => {
		render(<EmployeeCard employee={mockEmployee} onView={vi.fn()} />);

		const image = screen.getByAltText("John Doe");

		expect(image).toBeInTheDocument();

		expect(image).toHaveAttribute("src", "https://example.com/john.jpg");
	});

	it("renders employee details", () => {
		render(<EmployeeCard employee={mockEmployee} onView={vi.fn()} />);

		expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();

		expect(screen.getByText(/Pune/)).toBeInTheDocument();

		expect(screen.getByText(/john.doe@test.com/)).toBeInTheDocument();

		expect(screen.getByText(/9876543210/)).toBeInTheDocument();
	});

	it("renders employee status badge", () => {
		render(<EmployeeCard employee={mockEmployee} onView={vi.fn()} />);

		const status = screen.getByText("Active");

		expect(status).toBeInTheDocument();

		expect(status.className).toContain("rounded-full");
	});

	it("calls onView when action button is clicked", async () => {
		const user = userEvent.setup();

		const handleView = vi.fn();

		render(<EmployeeCard employee={mockEmployee} onView={handleView} />);

		const button = screen.getByRole("button");

		await user.click(button);

		expect(handleView).toHaveBeenCalledTimes(1);

		expect(handleView).toHaveBeenCalledWith(mockEmployee);
	});

	it("handles missing optional employee data", () => {
		const incompleteEmployee = {
			id: 2,
			fullName: "Jane Smith",
			employeeCode: "EMS-002",
			email: "jane@test.com",

			personalInfo: {},

			employment: {},
		};

		render(<EmployeeCard employee={incompleteEmployee} onView={vi.fn()} />);

		expect(screen.getByText("Jane Smith")).toBeInTheDocument();

		expect(screen.getByText("EMS-002")).toBeInTheDocument();

		expect(screen.getByText(/jane@test.com/)).toBeInTheDocument();
	});

	it("uses default status class when status is unknown", () => {
		const employee = {
			...mockEmployee,
			employment: {
				...mockEmployee.employment,
				status: "Unknown",
			},
		};

		render(<EmployeeCard employee={employee} onView={vi.fn()} />);

		const status = screen.getByText("Unknown");

		expect(status.className).toContain("bg-slate-100");
	});
});
