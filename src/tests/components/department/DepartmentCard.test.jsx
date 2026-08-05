import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DepartmentCard from "../../../components/department/DepartmentCard";

describe("DepartmentCard", () => {
	const department = {
		departmentId: "D001",
		name: "Engineering",
	};

	const employees = [
		{
			employeeId: "EMP001",

			employment: {
				departmentId: "D001",
				status: "Active",
				workLocation: "Pune",
			},

			performance: {
				currentRating: 4,
			},

			salary: {
				employeeCTC: 600000,
			},
		},

		{
			employeeId: "EMP002",

			employment: {
				departmentId: "D001",
				status: "Inactive",
				workLocation: "Mumbai",
			},

			performance: {
				currentRating: 5,
			},

			salary: {
				employeeCTC: 800000,
			},
		},
	];

	it("renders department information", () => {
		render(<DepartmentCard department={department} employees={employees} onView={vi.fn()} />);

		expect(screen.getByText("Engineering")).toBeInTheDocument();

		expect(screen.getByText("D001")).toBeInTheDocument();
	});

	it("renders employee statistics correctly", () => {
		render(<DepartmentCard department={department} employees={employees} onView={vi.fn()} />);

		// employees
		expect(screen.getByText("2")).toBeInTheDocument();

		// active employees
		expect(screen.getByText("1")).toBeInTheDocument();

		// average rating (4+5)/2
		expect(screen.getByText("4.5")).toBeInTheDocument();

		// average CTC
		expect(screen.getByText("₹7,00,000")).toBeInTheDocument();
	});

	it("calls onView when eye action is clicked", () => {
		const onView = vi.fn();

		render(<DepartmentCard department={department} employees={employees} onView={onView} />);

		const button = screen.getByRole("button");

		fireEvent.click(button);

		expect(onView).toHaveBeenCalledWith(department);
	});

	it("shows employee locations", () => {
		render(<DepartmentCard department={department} employees={employees} onView={vi.fn()} />);

		expect(screen.getByText("Pune")).toBeInTheDocument();
		expect(screen.getByText("Mumbai")).toBeInTheDocument();
	});

	it("shows extra location count when more than two locations exist", () => {
		const manyLocations = [
			...employees,

			{
				employment: {
					departmentId: "D001",
					status: "Active",
					workLocation: "Delhi",
				},

				performance: {
					currentRating: 3,
				},

				salary: {
					employeeCTC: 400000,
				},
			},
		];

		render(<DepartmentCard department={department} employees={manyLocations} onView={vi.fn()} />);

		expect(screen.getByText("+1")).toBeInTheDocument();
	});

	it("handles missing performance rating and salary", () => {
		const incompleteEmployee = [
			{
				employment: {
					departmentId: "D001",
					status: "Active",
					workLocation: "Pune",
				},
			},
		];

		render(<DepartmentCard department={department} employees={incompleteEmployee} onView={vi.fn()} />);

		expect(screen.getByText("0.0")).toBeInTheDocument();
		expect(screen.getByText("₹0")).toBeInTheDocument();
	});

	it("handles department with no employees", () => {
		render(<DepartmentCard department={department} employees={[]} onView={vi.fn()} />);

		expect(screen.getByText("Engineering")).toBeInTheDocument();
		expect(screen.getByText("₹0")).toBeInTheDocument();

		const cardText = screen.getByText("Engineering").closest("div");

		expect(cardText).toBeTruthy();
	});

	it("ignores employees from other departments", () => {
		const otherDepartmentEmployees = [
			{
				employment: {
					departmentId: "D002",
					status: "Active",
					workLocation: "Delhi",
				},

				performance: {
					currentRating: 5,
				},

				salary: {
					employeeCTC: 900000,
				},
			},
		];

		render(<DepartmentCard department={department} employees={otherDepartmentEmployees} onView={vi.fn()} />);

		expect(screen.getByText("₹0")).toBeInTheDocument();
	});
});
