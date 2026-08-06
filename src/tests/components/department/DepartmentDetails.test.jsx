import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import DepartmentDetails from "../../../components/department/DepartmentDetails";

import { departmentApi } from "../../../api/departmentApi";
import { employeeApi } from "../../../api/employeeApi";

vi.mock("../../../api/departmentApi", () => ({
	departmentApi: {
		getById: vi.fn(),
	},
}));

vi.mock("../../../api/employeeApi", () => ({
	employeeApi: {
		getByDepartment: vi.fn(),
	},
}));

// Mock child components
vi.mock("../../../components/department/DepartmentDetailsTable", () => ({
	default: ({ employees }) => <div data-testid="department-table">{employees.length} employees</div>,
}));

vi.mock("../../../components/department/DepartmentEmployeeCard", () => ({
	default: ({ employee }) => <div data-testid="employee-card">{employee.fullName}</div>,
}));

vi.mock("../../../components/common/PageLoader", () => ({
	default: ({ text }) => <div data-testid="loader">{text}</div>,
}));

vi.mock("../../../components/common/EmptyState", () => ({
	default: () => <div data-testid="empty-state">No Data</div>,
}));

vi.mock("../../../components/common/NotFound", () => ({
	default: ({ title, message }) => (
		<div>
			<h2>{title}</h2>
			<p>{message}</p>
		</div>
	),
}));

vi.mock("../../../components/common/ErrorState", () => ({
	default: ({ title, message }) => (
		<div>
			<h2>{title}</h2>
			<p>{message}</p>
		</div>
	),
}));

const renderComponent = () => {
	return render(
		<MemoryRouter initialEntries={["/departments/D001"]}>
			<Routes>
				<Route path="/departments/:id" element={<DepartmentDetails />} />
			</Routes>
		</MemoryRouter>,
	);
};

describe("DepartmentDetails", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows loader while fetching data", () => {
		departmentApi.getById.mockReturnValue(new Promise(() => {}));

		employeeApi.getByDepartment.mockReturnValue(new Promise(() => {}));

		renderComponent();

		expect(screen.getByTestId("loader")).toHaveTextContent("Loading department details...");
	});

	it("fetches department and employees using id", async () => {
		departmentApi.getById.mockResolvedValue({
			name: "Engineering",
			departmentId: "D001",
		});

		employeeApi.getByDepartment.mockResolvedValue([]);

		renderComponent();

		await waitFor(() => {
			expect(departmentApi.getById).toHaveBeenCalledWith("D001");

			expect(employeeApi.getByDepartment).toHaveBeenCalledWith("D001");
		});
	});

	it("renders department information", async () => {
		departmentApi.getById.mockResolvedValue({
			name: "Engineering",
			departmentId: "D001",
		});

		employeeApi.getByDepartment.mockResolvedValue([]);

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("Engineering")).toBeInTheDocument();
		});

		expect(screen.getByText("Department ID: D001")).toBeInTheDocument();
	});

	it("renders employee table when employees exist", async () => {
		departmentApi.getById.mockResolvedValue({
			name: "Engineering",
			departmentId: "D001",
		});

		employeeApi.getByDepartment.mockResolvedValue([
			{
				id: 1,
				fullName: "John Doe",
				employeeId: "EMP001",

				employment: {
					status: "Active",
					employeeType: "Permanent",
					designation: "Developer",
					workLocation: "Pune",
					manager: {
						name: "Manager",
					},
				},
			},
		]);

		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId("department-table")).toBeInTheDocument();
		});
	});

	it("renders empty state when no employees exist", async () => {
		departmentApi.getById.mockResolvedValue({
			name: "Engineering",
			departmentId: "D001",
		});

		employeeApi.getByDepartment.mockResolvedValue([]);

		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId("empty-state")).toBeInTheDocument();
		});
	});

	it("shows not found when department does not exist", async () => {
		departmentApi.getById.mockResolvedValue(null);

		employeeApi.getByDepartment.mockResolvedValue([]);

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("Department Not Found")).toBeInTheDocument();
		});

		expect(screen.getByText('No department exists with ID "D001".')).toBeInTheDocument();
	});

	it("handles api failure and stops loading", async () => {
		departmentApi.getById.mockRejectedValue(new Error("API Error"));

		employeeApi.getByDepartment.mockRejectedValue(new Error("API Error"));

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("Unable to load department")).toBeInTheDocument();
		});

		expect(screen.getByText("Reason : API Error")).toBeInTheDocument();
	});
});
