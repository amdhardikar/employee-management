import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DepartmentEdit from "../../../../src/components/department/DepartmentEdit";

import { departmentApi } from "../../../../src/api/departmentApi";
import { employeeApi } from "../../../../src/api/employeeApi";
import { designationApi } from "../../../../src/api/designationApi";

vi.mock("react-router-dom", () => ({
	useParams: () => ({
		id: "D001",
	}),
}));

vi.mock("../../../../src/api/departmentApi", () => ({
	departmentApi: {
		getById: vi.fn(),
		updateDepartment: vi.fn(),
	},
}));

vi.mock("../../../../src/api/employeeApi", () => ({
	employeeApi: {
		getByDepartment: vi.fn(),
		getById: vi.fn(),
	},
}));

vi.mock("../../../../src/api/designationApi", () => ({
	designationApi: {
		getByDepartment: vi.fn(),
	},
}));

vi.mock("../../../../src/components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../../../src/components/common/NotFound", () => ({
	default: ({ title, message }) => (
		<div>
			<h1>{title}</h1>
			<p>{message}</p>
		</div>
	),
}));
vi.mock("../../../../src/components/common/ErrorState", () => ({
	default: ({ title, message }) => (
		<div>
			<h1>{title}</h1>
			<p>{message}</p>
		</div>
	),
}));

vi.mock("../../../../src/components/common/EmptyState", () => ({
	default: () => <div>Empty State</div>,
}));

vi.mock("../../../../src/components/department/DepartmentEditTable", () => ({
	default: ({ employees, newRows, onRemoveEmployee, onSaveEmployee, onCancelRow }) => (
		<div>
			<h3>Department Edit Table</h3>

			{employees.map((emp) => (
				<div key={emp.id}>
					<span>{emp.fullName}</span>

					<button onClick={() => onRemoveEmployee(emp)}>Remove</button>
				</div>
			))}

			{newRows.map((row) => (
				<div key={row.id}>
					<button
						onClick={() =>
							onSaveEmployee({
								...row,
								employeeId: "EMP001",
								designationId: "DES001",
							})
						}
					>
						Save Employee
					</button>
					<button onClick={() => onSaveEmployee({ ...row, employeeId: "EMP001", designationId: "" })}>
						Save Without Designation
					</button>

					<button onClick={() => onCancelRow(row.id)}>Cancel</button>
				</div>
			))}

			<p data-testid="new-row-count">{newRows.length}</p>
		</div>
	),
}));

const department = {
	id: "D001",
	name: "Engineering",
	departmentId: "D001",
};

const employees = [
	{
		id: 1,
		employeeId: "EMP001",
		fullName: "John Doe",
	},
];

const designations = [
	{
		id: "DES001",
		name: "Developer",
	},
];

describe("DepartmentEdit", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows loader initially", () => {
		departmentApi.getById.mockImplementation(() => new Promise(() => {}));

		employeeApi.getByDepartment.mockImplementation(() => new Promise(() => {}));

		designationApi.getByDepartment.mockImplementation(() => new Promise(() => {}));

		render(<DepartmentEdit />);

		expect(screen.getByText(/Loading department details/i)).toBeInTheDocument();
	});

	it("shows department not found when api returns empty", async () => {
		departmentApi.getById.mockResolvedValue(null);

		employeeApi.getByDepartment.mockResolvedValue([]);

		designationApi.getByDepartment.mockResolvedValue([]);

		render(<DepartmentEdit />);

		expect(await screen.findByText(/Department Not Found/i)).toBeInTheDocument();
	});

	it("renders department details", async () => {
		departmentApi.getById.mockResolvedValue(department);

		employeeApi.getByDepartment.mockResolvedValue(employees);

		designationApi.getByDepartment.mockResolvedValue(designations);

		render(<DepartmentEdit />);

		expect(await screen.findByText("Engineering")).toBeInTheDocument();

		expect(screen.getByText(/Department ID: D001/)).toBeInTheDocument();
	});

	it("renders employee table when employees exist", async () => {
		departmentApi.getById.mockResolvedValue(department);

		employeeApi.getByDepartment.mockResolvedValue(employees);

		designationApi.getByDepartment.mockResolvedValue(designations);

		render(<DepartmentEdit />);

		expect(await screen.findByText("Department Edit Table")).toBeInTheDocument();

		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});

	it("renders empty state when no employees", async () => {
		departmentApi.getById.mockResolvedValue([department]);

		employeeApi.getByDepartment.mockResolvedValue([]);

		designationApi.getByDepartment.mockResolvedValue(designations);

		render(<DepartmentEdit />);

		expect(await screen.findByText("Empty State")).toBeInTheDocument();
	});

	it("adds new employee row when Add Employee clicked", async () => {
		const user = userEvent.setup();

		departmentApi.getById.mockResolvedValue(department);

		employeeApi.getByDepartment.mockResolvedValue(employees);

		designationApi.getByDepartment.mockResolvedValue(designations);

		render(<DepartmentEdit />);

		await screen.findByText("Department Edit Table");

		await user.click(
			screen.getByRole("button", {
				name: /add employee/i,
			}),
		);

		expect(screen.getByTestId("new-row-count").textContent).toBe("1");
	});

	it("adds employee successfully", async () => {
		const user = userEvent.setup();

		departmentApi.getById.mockResolvedValue(department);
		employeeApi.getByDepartment.mockResolvedValue(employees);
		designationApi.getByDepartment.mockResolvedValue(designations);

		employeeApi.getById.mockResolvedValue({
			employeeId: "EMP001",
			fullName: "John Doe",
		});

		departmentApi.updateDepartment.mockResolvedValue({
			employee: {
				id: 2,
				fullName: "John Doe",
			},
		});

		render(<DepartmentEdit />);

		await screen.findByText("Department Edit Table");

		await user.click(
			screen.getByRole("button", {
				name: /add employee/i,
			}),
		);

		await user.click(
			screen.getByRole("button", {
				name: "Save Employee",
			}),
		);

		await waitFor(() => {
			expect(employeeApi.getById).toHaveBeenCalledWith("EMP001");

			expect(departmentApi.updateDepartment).toHaveBeenCalledWith("D001", {
				action: "addEmployee",
				employeeId: "EMP001",
				designationId: "DES001",
			});
		});
	});

	it("handles add employee api failure", async () => {
		const user = userEvent.setup();

		departmentApi.getById.mockResolvedValue(department);
		employeeApi.getByDepartment.mockResolvedValue(employees);
		designationApi.getByDepartment.mockResolvedValue(designations);

		employeeApi.getById.mockRejectedValue(new Error("Failed"));

		render(<DepartmentEdit />);

		await screen.findByText("Department Edit Table");

		await user.click(
			screen.getByRole("button", {
				name: /add employee/i,
			}),
		);

		await user.click(
			screen.getByRole("button", {
				name: "Save Employee",
			}),
		);

		await waitFor(() => {
			expect(employeeApi.getById).toHaveBeenCalledWith("EMP001");
		});
		expect(screen.getByTestId("new-row-count")).toHaveTextContent("1");
	});

	it("does not add another row when row already exists", async () => {
		const user = userEvent.setup();

		departmentApi.getById.mockResolvedValue(department);
		employeeApi.getByDepartment.mockResolvedValue(employees);
		designationApi.getByDepartment.mockResolvedValue(designations);

		render(<DepartmentEdit />);

		await screen.findByText("Department Edit Table");

		const button = screen.getByRole("button", {
			name: /add employee/i,
		});

		await user.click(button);
		await user.click(button);

		expect(screen.getByTestId("new-row-count")).toHaveTextContent("1");
	});

	it("removes employee successfully", async () => {
		const user = userEvent.setup();

		departmentApi.getById.mockResolvedValue(department);

		employeeApi.getByDepartment.mockResolvedValue(employees);

		designationApi.getByDepartment.mockResolvedValue(designations);

		departmentApi.updateDepartment.mockResolvedValue({});

		render(<DepartmentEdit />);

		await screen.findByText("John Doe");

		await user.click(
			screen.getByRole("button", {
				name: "Remove",
			}),
		);

		await waitFor(() => {
			expect(departmentApi.updateDepartment).toHaveBeenCalledWith("D001", {
				action: "removeEmployee",
				employeeId: "EMP001",
			});
		});
	});

	it("calls all api methods with department id", async () => {
		departmentApi.getById.mockResolvedValue(department);

		employeeApi.getByDepartment.mockResolvedValue(employees);

		designationApi.getByDepartment.mockResolvedValue(designations);

		render(<DepartmentEdit />);

		await waitFor(() => {
			expect(departmentApi.getById).toHaveBeenCalledWith("D001");

			expect(employeeApi.getByDepartment).toHaveBeenCalledWith("D001");

			expect(designationApi.getByDepartment).toHaveBeenCalledWith("D001");
		});
	});

	it("handles fetchData api error gracefully", async () => {
		departmentApi.getById.mockRejectedValue(new Error("Failed"));

		employeeApi.getByDepartment.mockResolvedValue([]);
		designationApi.getByDepartment.mockResolvedValue([]);

		render(<DepartmentEdit />);

		expect(await screen.findByText(/Unable to load department/i)).toBeInTheDocument();

		expect(screen.getByText(/Reason : Failed/i)).toBeInTheDocument();
	});

	it("handles remove employee api failure", async () => {
		const user = userEvent.setup();

		departmentApi.getById.mockResolvedValue(department);
		employeeApi.getByDepartment.mockResolvedValue(employees);
		designationApi.getByDepartment.mockResolvedValue(designations);

		departmentApi.updateDepartment.mockRejectedValue(new Error("Remove failed"));

		render(<DepartmentEdit />);

		await screen.findByText("John Doe");

		await user.click(
			screen.getByRole("button", {
				name: "Remove",
			}),
		);

		expect(await screen.findByRole("heading", { name: "Unable to remove employee" })).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent("Remove failed");
	});

	it("shows designation required error while adding employee", async () => {
		const user = userEvent.setup();

		departmentApi.getById.mockResolvedValue(department);
		employeeApi.getByDepartment.mockResolvedValue(employees);
		designationApi.getByDepartment.mockResolvedValue(designations);

		render(<DepartmentEdit />);

		await screen.findByText("Department Edit Table");

		await user.click(
			screen.getByRole("button", {
				name: /add employee/i,
			}),
		);

		expect(screen.getByTestId("new-row-count")).toHaveTextContent("1");
	});

	it("validates a missing designation and allows cancelling the row", async () => {
		const user = userEvent.setup();
		departmentApi.getById.mockResolvedValue(department);
		employeeApi.getByDepartment.mockResolvedValue(employees);
		designationApi.getByDepartment.mockResolvedValue(designations);
		render(<DepartmentEdit />);
		await screen.findByText("Department Edit Table");
		await user.click(screen.getByRole("button", { name: /add employee/i }));
		await user.click(screen.getByRole("button", { name: "Save Without Designation" }));
		expect(employeeApi.getById).not.toHaveBeenCalled();
		await user.click(screen.getByRole("button", { name: "Cancel" }));
		expect(screen.getByTestId("new-row-count")).toHaveTextContent("0");
	});

	it("keeps the row when the entered employee cannot be found", async () => {
		const user = userEvent.setup();
		departmentApi.getById.mockResolvedValue(department);
		employeeApi.getByDepartment.mockResolvedValue(employees);
		designationApi.getByDepartment.mockResolvedValue(designations);
		employeeApi.getById.mockResolvedValue(null);
		render(<DepartmentEdit />);
		await screen.findByText("Department Edit Table");
		await user.click(screen.getByRole("button", { name: /add employee/i }));
		await user.click(screen.getByRole("button", { name: "Save Employee" }));
		await waitFor(() => expect(employeeApi.getById).toHaveBeenCalledWith("EMP001"));
		expect(departmentApi.updateDepartment).not.toHaveBeenCalled();
	});
});
