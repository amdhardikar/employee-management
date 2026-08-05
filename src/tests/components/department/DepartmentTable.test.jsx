import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DepartmentTable from "../../../components/department/DepartmentTable";

vi.mock("lucide-react", () => ({
	Eye: () => <span data-testid="eye-icon" />,
	Pencil: () => <span data-testid="pencil-icon" />,
	Star: () => <span data-testid="star-icon" />,
	Trash: () => <span data-testid="trash-icon" />,
}));

const departments = [
	{
		departmentId: "D001",
		name: "Engineering",
	},
];

const employees = [
	{
		id: 1,
		employment: {
			departmentId: "D001",
			status: "Active",
			workLocation: "Mumbai",
		},
		performance: {
			currentRating: 4.5,
		},
		salary: {
			employeeCTC: 1200000,
		},
	},
	{
		id: 2,
		employment: {
			departmentId: "D001",
			status: "Inactive",
			workLocation: "Pune",
		},
		performance: {
			currentRating: 3.5,
		},
		salary: {
			employeeCTC: 900000,
		},
	},
];

describe("DepartmentTable Component", () => {
	const defaultProps = {
		departments,
		employees,
		onView: vi.fn(),
		onEdit: vi.fn(),
	};

	it("renders table headers correctly", () => {
		render(<DepartmentTable {...defaultProps} departments={[]} />);

		expect(screen.getByText("Department")).toBeInTheDocument();
		expect(screen.getByText("Employees")).toBeInTheDocument();
		expect(screen.getByText("Active")).toBeInTheDocument();
		expect(screen.getByText("Avg Rating")).toBeInTheDocument();
		expect(screen.getByText("Locations")).toBeInTheDocument();
		expect(screen.getByText("Avg CTC")).toBeInTheDocument();
		expect(screen.getByText("Actions")).toBeInTheDocument();
	});

	it("renders department details", () => {
		render(<DepartmentTable {...defaultProps} />);

		expect(screen.getByText("Engineering")).toBeInTheDocument();

		expect(screen.getByText("D001")).toBeInTheDocument();

		expect(screen.getByText("2")).toBeInTheDocument();

		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("calculates average rating correctly", () => {
		render(<DepartmentTable {...defaultProps} />);

		expect(screen.getByText("4.0")).toBeInTheDocument();
	});

	it("calculates average CTC correctly", () => {
		render(<DepartmentTable {...defaultProps} />);

		expect(screen.getByText("₹10,50,000")).toBeInTheDocument();
	});

	it("renders employee locations", () => {
		render(<DepartmentTable {...defaultProps} />);

		expect(screen.getByText("Mumbai")).toBeInTheDocument();

		expect(screen.getByText("Pune")).toBeInTheDocument();
	});

	it("calls onView when view button is clicked", async () => {
		const user = userEvent.setup();

		const onView = vi.fn();

		render(<DepartmentTable {...defaultProps} onView={onView} />);

		const row = screen.getByText("Engineering").closest("tr");

		const buttons = row.querySelectorAll("button");

		await user.click(buttons[0]);

		expect(onView).toHaveBeenCalledTimes(1);

		expect(onView).toHaveBeenCalledWith(departments[0]);
	});

	it("calls onEdit when edit button is clicked", async () => {
		const user = userEvent.setup();

		const onEdit = vi.fn();

		render(<DepartmentTable {...defaultProps} onEdit={onEdit} />);

		const row = screen.getByText("Engineering").closest("tr");

		const buttons = row.querySelectorAll("button");

		await user.click(buttons[1]);

		expect(onEdit).toHaveBeenCalledTimes(1);

		expect(onEdit).toHaveBeenCalledWith(departments[0]);
	});

	it("renders empty table when departments are empty", () => {
		render(<DepartmentTable {...defaultProps} departments={[]} />);

		expect(screen.queryByText("Engineering")).not.toBeInTheDocument();

		expect(screen.getByText("Department")).toBeInTheDocument();
	});

	it("handles departments without employees", () => {
		render(<DepartmentTable departments={departments} employees={[]} onView={vi.fn()} onEdit={vi.fn()} />);

		expect(screen.getByText("Engineering")).toBeInTheDocument();

		expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(2);

		expect(screen.getByText("₹0")).toBeInTheDocument();
	});

	it("renders icons", () => {
		render(<DepartmentTable {...defaultProps} />);

		expect(screen.getByTestId("eye-icon")).toBeInTheDocument();

		expect(screen.getByTestId("pencil-icon")).toBeInTheDocument();

		expect(screen.getByTestId("star-icon")).toBeInTheDocument();
	});
});
