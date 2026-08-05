import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DepartmentEditTable from "../../../components/department/DepartmentEditTable";
import React from "react";

vi.mock("lucide-react", () => ({
	Save: () => <span data-testid="save-icon" />,
	Trash: () => <span data-testid="trash-icon" />,
	X: () => <span data-testid="x-icon" />,
}));

vi.mock("react-router-dom", () => ({
	NavLink: ({ children, to }) => <a href={to}>{children}</a>,
}));

const employees = [
	{
		id: 1,
		employeeId: "EMP001",
		fullName: "John Doe",
		employment: {
			designation: "Frontend Developer",
			employeeType: "Full Time",
			workLocation: "Mumbai",
			manager: {
				name: "Manager One",
			},
			status: "Active",
		},
	},
];

const designations = [
	{
		id: "1",
		designationId: "DES001",
		name: "Developer",
	},
];

describe("DepartmentEditTable", () => {
	it("renders table headers correctly", () => {
		render(
			<DepartmentEditTable
				employees={[]}
				designations={[]}
				newRows={[]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		expect(screen.getByText("Employee Code")).toBeInTheDocument();

		expect(screen.getByText("Name")).toBeInTheDocument();

		expect(screen.getByText("Designation")).toBeInTheDocument();

		expect(screen.getByText("Action")).toBeInTheDocument();
	});

	it("renders employee details", () => {
		render(
			<DepartmentEditTable
				employees={employees}
				designations={designations}
				newRows={[]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		expect(screen.getByText("EMP001")).toBeInTheDocument();

		expect(screen.getByText("John Doe")).toBeInTheDocument();

		expect(screen.getByText("Frontend Developer")).toBeInTheDocument();

		expect(screen.getByText("Mumbai")).toBeInTheDocument();

		expect(screen.getByText("Manager One")).toBeInTheDocument();
	});

	it("renders employee link correctly", () => {
		render(
			<DepartmentEditTable
				employees={employees}
				designations={[]}
				newRows={[]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		const link = screen.getByText("EMP001");

		expect(link).toHaveAttribute("href", "/employees/EMP001");
	});

	it("calls onRemoveEmployee when delete clicked", async () => {
		const user = userEvent.setup();

		const onRemoveEmployee = vi.fn();

		render(
			<DepartmentEditTable
				employees={employees}
				designations={[]}
				newRows={[]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={onRemoveEmployee}
				onCancelRow={vi.fn()}
			/>,
		);

		await user.click(screen.getByTestId("trash-icon"));

		expect(onRemoveEmployee).toHaveBeenCalledWith(employees[0]);
	});

	it("renders add employee row", () => {
		const newRows = [
			{
				id: "new-1",
				employeeId: "",
				designationId: "",
				loading: false,
				error: "",
				designationError: "",
			},
		];

		render(
			<DepartmentEditTable
				employees={[]}
				designations={designations}
				newRows={newRows}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		expect(screen.getByPlaceholderText("EMP001")).toBeInTheDocument();

		expect(screen.getByText("Select Designation")).toBeInTheDocument();
	});

	it("updates employee id input", async () => {
		const user = userEvent.setup();

		const setNewRows = vi.fn();

		render(
			<DepartmentEditTable
				employees={[]}
				designations={designations}
				newRows={[
					{
						id: "new-1",
						employeeId: "",
						designationId: "",
						loading: false,
						error: "",
						designationError: "",
					},
				]}
				setNewRows={setNewRows}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		await user.type(screen.getByPlaceholderText("EMP001"), "emp002");

		expect(setNewRows).toHaveBeenCalled();
	});

	it("calls save employee when save button clicked", async () => {
		const user = userEvent.setup();

		const onSaveEmployee = vi.fn();

		render(
			<DepartmentEditTable
				employees={[]}
				designations={designations}
				newRows={[
					{
						id: "new-1",
						employeeId: "EMP002",
						designationId: "DES001",
						loading: false,
						error: "",
						designationError: "",
					},
				]}
				setNewRows={vi.fn()}
				onSaveEmployee={onSaveEmployee}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		await user.click(screen.getByTestId("save-icon"));

		expect(onSaveEmployee).toHaveBeenCalled();
	});

	it("shows validation errors", () => {
		render(
			<DepartmentEditTable
				employees={[]}
				designations={designations}
				newRows={[
					{
						id: "new-1",
						employeeId: "",
						designationId: "",
						loading: false,
						error: "Employee not found",
						designationError: "Designation is required",
					},
				]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		expect(screen.getByText("Employee not found")).toBeInTheDocument();
		expect(screen.getByText("Designation is required")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("EMP001").className).toContain("border-red-500");
		expect(screen.getByRole("combobox").className).toContain("border-red-500");
	});

	it("calls cancel row", async () => {
		const user = userEvent.setup();

		const onCancelRow = vi.fn();

		render(
			<DepartmentEditTable
				employees={[]}
				designations={[]}
				newRows={[
					{
						id: "row1",
						employeeId: "EMP001",
						designationId: "DES001",
						loading: false,
						error: "",
						designationError: "",
					},
				]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={onCancelRow}
			/>,
		);

		await user.click(screen.getByTestId("x-icon"));

		expect(onCancelRow).toHaveBeenCalledWith("row1");
	});

	it("updates employee id with uppercase and clears error", async () => {
		const user = userEvent.setup();

		const Wrapper = () => {
			const [rows, setRows] = React.useState([
				{
					id: "row1",
					employeeId: "",
					designationId: "",
					loading: false,
					error: "Old error",
					designationError: "",
				},
			]);

			return (
				<>
					<DepartmentEditTable
						employees={[]}
						designations={designations}
						newRows={rows}
						setNewRows={setRows}
						onSaveEmployee={vi.fn()}
						onRemoveEmployee={vi.fn()}
						onCancelRow={vi.fn()}
					/>

					<span data-testid="employee-value">{rows[0].employeeId}</span>

					<span data-testid="employee-error">{rows[0].error}</span>
				</>
			);
		};

		render(<Wrapper />);

		await user.type(screen.getByPlaceholderText("EMP001"), "emp002");

		expect(screen.getByTestId("employee-value")).toHaveTextContent("EMP002");
		expect(screen.getByTestId("employee-error")).toHaveTextContent("");
	});

	it("updates designation and clears designation error", async () => {
		const user = userEvent.setup();

		const Wrapper = () => {
			const [rows, setRows] = React.useState([
				{
					id: "row1",
					employeeId: "EMP001",
					designationId: "",
					loading: false,
					error: "",
					designationError: "Designation is required",
				},
			]);

			return (
				<>
					<DepartmentEditTable
						employees={[]}
						designations={designations}
						newRows={rows}
						setNewRows={setRows}
						onSaveEmployee={vi.fn()}
						onRemoveEmployee={vi.fn()}
						onCancelRow={vi.fn()}
					/>

					<span data-testid="designation-value">{rows[0].designationId}</span>

					<span data-testid="designation-error">{rows[0].designationError}</span>
				</>
			);
		};

		render(<Wrapper />);

		await user.selectOptions(screen.getByRole("combobox"), "DES001");

		expect(screen.getByTestId("designation-value")).toHaveTextContent("DES001");

		expect(screen.getByTestId("designation-error")).toHaveTextContent("");
	});

	it("sets designation error when designation is cleared", async () => {
		const user = userEvent.setup();

		const Wrapper = () => {
			const [rows, setRows] = React.useState([
				{
					id: "row1",
					employeeId: "EMP001",
					designationId: "DES001",
					loading: false,
					error: "",
					designationError: "",
				},
			]);

			return (
				<>
					<DepartmentEditTable
						employees={[]}
						designations={designations}
						newRows={rows}
						setNewRows={setRows}
						onSaveEmployee={vi.fn()}
						onRemoveEmployee={vi.fn()}
						onCancelRow={vi.fn()}
					/>

					<span data-testid="designation-error">{rows[0].designationError}</span>
				</>
			);
		};

		render(<Wrapper />);

		await user.selectOptions(screen.getByRole("combobox"), "");

		expect(screen.getByTestId("designation-error")).toHaveTextContent("Designation is required");
	});

	it("uses default status color when status is unknown", () => {
		render(
			<DepartmentEditTable
				employees={[
					{
						id: 2,
						employeeId: "EMP002",
						fullName: "Unknown Status",
						employment: {
							designation: "Developer",
							employeeType: "Full Time",
							workLocation: "Mumbai",
							manager: {},
							status: "UNKNOWN",
						},
					},
				]}
				designations={[]}
				newRows={[]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
	});

	it("covers designation select without error branch", () => {
		render(
			<DepartmentEditTable
				employees={[]}
				designations={designations}
				newRows={[
					{
						id: "row1",
						employeeId: "EMP001",
						designationId: "",
						error: "",
						designationError: "",
						loading: false,
					},
				]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		expect(screen.getByRole("combobox").className).toContain("border-slate-300");
	});

	it("shows saving state when row is loading", () => {
		render(
			<DepartmentEditTable
				employees={[]}
				designations={designations}
				newRows={[
					{
						id: "row1",
						employeeId: "EMP001",
						designationId: "DES001",
						error: "",
						designationError: "",
						loading: true,
					},
				]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		expect(screen.getByText("Saving employee...")).toBeInTheDocument();
	});

	it("disables save button when employee data is incomplete", () => {
		render(
			<DepartmentEditTable
				employees={[]}
				designations={designations}
				newRows={[
					{
						id: "row1",
						employeeId: "",
						designationId: "",
						error: "",
						designationError: "",
						loading: false,
					},
				]}
				setNewRows={vi.fn()}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={vi.fn()}
				onCancelRow={vi.fn()}
			/>,
		);

		expect(screen.getByTestId("save-icon").closest("button")).toBeDisabled();
	});
});
