import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DepartmentEditTable from "../../../../src/components/department/DepartmentEditTable";
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
		employeeCode: "EMS001",
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

		expect(screen.getByText("Employee")).toBeInTheDocument();

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

		expect(screen.getAllByText("EMP001 | EMS001").length).toBeGreaterThan(0);

		expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);

		expect(screen.getAllByText("Frontend Developer").length).toBeGreaterThan(0);

		expect(screen.getAllByText("Mumbai").length).toBeGreaterThan(0);

		expect(screen.getAllByText("Manager One").length).toBeGreaterThan(0);
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

		const link = screen.getAllByRole("link", { name: "John Doe" })[0];

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

		await user.click(screen.getAllByTestId("trash-icon")[0]);

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

		expect(screen.getAllByPlaceholderText("EMP001")).toHaveLength(2);

		expect(screen.getAllByText("Select Designation")).toHaveLength(2);
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

		await user.type(screen.getAllByPlaceholderText("EMP001")[0], "emp002");

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

		expect(screen.getAllByText("Employee not found")).toHaveLength(2);
		expect(screen.getAllByText("Designation is required")).toHaveLength(2);
		expect(screen.getAllByPlaceholderText("EMP001")[0].className).toContain("border-red-500");
		expect(screen.getAllByRole("combobox")[0].className).toContain("border-red-500");
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

		await user.type(screen.getAllByPlaceholderText("EMP001")[0], "emp002");

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

		await user.selectOptions(screen.getAllByRole("combobox")[0], "DES001");

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

		await user.selectOptions(screen.getAllByRole("combobox")[0], "");

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

		expect(screen.getAllByText("UNKNOWN")).toHaveLength(2);
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

		expect(screen.getAllByRole("combobox")[0].className).toContain("border-slate-300");
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

		expect(screen.getAllByText("Saving employee...")).toHaveLength(2);
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

	it("supports save, cancel, and remove actions in the mobile card layout", async () => {
		const user = userEvent.setup();
		const onSaveEmployee = vi.fn();
		const onCancelRow = vi.fn();
		const onRemoveEmployee = vi.fn();
		const row = {
			id: "mobile-row",
			employeeId: "EMP002",
			designationId: "DES001",
			error: "",
			designationError: "",
			loading: false,
		};

		render(
			<DepartmentEditTable
				employees={employees}
				designations={designations}
				newRows={[row]}
				setNewRows={vi.fn()}
				onSaveEmployee={onSaveEmployee}
				onRemoveEmployee={onRemoveEmployee}
				onCancelRow={onCancelRow}
			/>,
		);
		await user.click(screen.getByRole("button", { name: "Save" }));
		await user.click(screen.getByRole("button", { name: "Cancel" }));
		await user.click(screen.getByRole("button", { name: "Remove employee" }));

		expect(onSaveEmployee).toHaveBeenCalledWith(row);
		expect(onCancelRow).toHaveBeenCalledWith("mobile-row");
		expect(onRemoveEmployee).toHaveBeenCalledWith(employees[0]);
	});

	it("updates and removes records through the desktop table controls", async () => {
		const user = userEvent.setup();
		const onRemoveEmployee = vi.fn();
		const row = {
			id: "desktop-row",
			employeeId: "EMP002",
			designationId: "",
			error: "",
			designationError: "",
			loading: false,
		};
		const setNewRows = vi.fn((updater) =>
			updater([row, { ...row, id: "unchanged-row", employeeId: "EMP004" }]),
		);

		render(
			<DepartmentEditTable
				employees={employees}
				designations={designations}
				newRows={[row]}
				setNewRows={setNewRows}
				onSaveEmployee={vi.fn()}
				onRemoveEmployee={onRemoveEmployee}
				onCancelRow={vi.fn()}
			/>,
		);
		await user.type(screen.getAllByPlaceholderText("EMP001")[1], "3");
		await user.selectOptions(screen.getAllByRole("combobox")[1], "DES001");
		await user.click(screen.getAllByTestId("trash-icon")[1]);

		expect(setNewRows).toHaveBeenCalled();
		expect(onRemoveEmployee).toHaveBeenCalledWith(employees[0]);
	});
});
