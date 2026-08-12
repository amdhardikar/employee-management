import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EmployeeTable from "../../../../src/components/employee/EmployeeTable";

const mockEmployees = [
	{
		id: 1,
		fullName: "John Doe",
		employeeCode: "EMS-001",
		employeeId: "EMP001",
		email: "john.doe@test.com",

		personalInfo: {
			profileImage: "https://example.com/john.jpg",
			phone: "9876543210",
		},

		employment: {
			designation: "Software Engineer",
			departmentName: "IT",
			status: "Active",
		},
	},
];

vi.mock("lucide-react", () => ({
	Eye: () => <span data-testid="eye-icon" />,
	Pencil: () => <span data-testid="pencil-icon" />,
	Trash: () => <span data-testid="trash-icon" />,
}));

describe("EmployeeTable Component", () => {
	const defaultProps = {
		employees: mockEmployees,
		onView: vi.fn(),
		onEdit: vi.fn(),
		onDelete: vi.fn(),
	};

	it("renders table headers correctly", () => {
		render(<EmployeeTable {...defaultProps} employees={[]} />);

		expect(screen.getByText("Employee")).toBeInTheDocument();
		expect(screen.getByText("Designation")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("Phone")).toBeInTheDocument();
		expect(screen.getByText("Status")).toBeInTheDocument();
		expect(screen.getByText("Actions")).toBeInTheDocument();
	});

	it("renders employee details", () => {
		render(<EmployeeTable {...defaultProps} />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("EMS-001 | EMP001")).toBeInTheDocument();
		expect(screen.getByText("Software Engineer")).toBeInTheDocument();
		expect(screen.getByText("IT")).toBeInTheDocument();
		expect(screen.getByText("john.doe@test.com")).toBeInTheDocument();
		expect(screen.getByText("+91 9876543210")).toBeInTheDocument();
	});

	it("renders employee profile image with correct alt text", () => {
		render(<EmployeeTable {...defaultProps} />);

		const image = screen.getByAltText("John Doe");

		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute("src", "https://example.com/john.jpg");
	});

	it("renders employee status badge", () => {
		render(<EmployeeTable {...defaultProps} />);

		const status = screen.getByText("Active");

		expect(status).toBeInTheDocument();
		expect(status.className).toContain("rounded-full");
	});

	it("calls onView when view button is clicked", async () => {
		const user = userEvent.setup();

		const onView = vi.fn();

		render(<EmployeeTable {...defaultProps} onView={onView} />);

		const row = screen.getByText("John Doe").closest("tr");

		const buttons = row.querySelectorAll("button");

		await user.click(buttons[0]);

		expect(onView).toHaveBeenCalledTimes(1);

		expect(onView).toHaveBeenCalledWith(mockEmployees[0]);
	});

	it("calls edit and delete handlers", async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		const onDelete = vi.fn();
		render(<EmployeeTable {...defaultProps} onEdit={onEdit} onDelete={onDelete} />);
		const row = screen.getByText("John Doe").closest("tr");
		const buttons = row.querySelectorAll("button");

		await user.click(buttons[1]);
		await user.click(buttons[2]);
		expect(onEdit).toHaveBeenCalledWith(mockEmployees[0]);
		expect(onDelete).toHaveBeenCalledWith(mockEmployees[0]);
	});

	it("renders empty table when employees array is empty", () => {
		render(<EmployeeTable {...defaultProps} employees={[]} />);

		expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

		expect(screen.getByText("Employee")).toBeInTheDocument();
	});

	it("handles missing optional employee fields", () => {
		const incompleteEmployee = [
			{
				id: 2,
				fullName: "Jane Smith",
				employeeCode: "EMS-002",
				employeeId: "EMP002",
				email: "jane@test.com",
				personalInfo: {},
				employment: {},
			},
		];

		render(<EmployeeTable employees={incompleteEmployee} onView={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);

		expect(screen.getByText("Jane Smith")).toBeInTheDocument();

		expect(screen.getByText("jane@test.com")).toBeInTheDocument();
	});
});
