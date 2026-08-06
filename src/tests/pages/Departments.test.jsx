import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Departments from "../../pages/Departments";

import { employeeApi } from "../../api/employeeApi";

// Mock APIs
vi.mock("../../api/employeeApi", () => ({
	employeeApi: {
		getAll: vi.fn(),
	},
}));

// Mock navigation
const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
	useNavigate: () => navigateMock,
}));

vi.mock("../../hooks/useDepartments", () => ({
	default: mockUseDepartments,
}));

// Mock children
vi.mock("../../components/common/PageLoader", () => ({
	default: ({ text }) => <div data-testid="loader">{text}</div>,
}));

vi.mock("../../components/common/EmptyState", () => ({
	default: () => <div data-testid="empty">Empty State</div>,
}));

vi.mock("../../components/department/DepartmentTable", () => ({
	default: ({ onView }) => (
		<button
			data-testid="department-table"
			onClick={() =>
				onView({
					departmentId: "D001",
				})
			}
		>
			Table
		</button>
	),
}));

vi.mock("../../components/department/DepartmentCard", () => ({
	default: ({ department, onView }) => (
		<button data-testid={`card-${department.departmentId}`} onClick={() => onView(department)}>
			{department.name}
		</button>
	),
}));

const { mockUseDepartments } = vi.hoisted(() => ({
	mockUseDepartments: vi.fn(),
}));

vi.mock("../../components/common/ErrorState.jsx", () => ({
	default: ({ title, message }) => (
		<div>
			<h2>{title}</h2>
			<p>{message}</p>
		</div>
	),
}));

describe("Departments Page", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		mockUseDepartments.mockReturnValue({
			departments: [
				{
					departmentId: "D001",
					name: "Engineering",
				},
			],
			loading: false,
			error: null,
		});
	});

	it("shows loader while loading", () => {
		employeeApi.getAll.mockReturnValue(new Promise(() => {}));

		mockUseDepartments.mockReturnValue({
			departments: [],
			loading: true,
			error: null,
		});

		render(<Departments />);

		expect(screen.getByTestId("loader")).toHaveTextContent("Loading departments...");
	});

	it("loads and displays departments", async () => {
		employeeApi.getAll.mockResolvedValue([
			{
				employeeId: "EMP001",
			},
		]);

		mockUseDepartments.mockReturnValue({
			departments: [
				{
					departmentId: "D001",
					name: "Engineering",
				},
			],
			loading: false,
			error: null,
		});

		render(<Departments />);

		await waitFor(() => {
			expect(screen.getByTestId("department-table")).toBeInTheDocument();
		});

		expect(screen.getByText("Table")).toBeInTheDocument();
	});

	it("renders department cards", async () => {
		employeeApi.getAll.mockResolvedValue([]);

		mockUseDepartments.mockReturnValue({
			departments: [
				{
					departmentId: "D001",
					name: "Engineering",
				},
				{
					departmentId: "D002",
					name: "HR",
				},
			],
			loading: false,
			error: null,
		});

		render(<Departments />);

		await waitFor(() => {
			expect(screen.getByTestId("card-D001")).toBeInTheDocument();
		});

		expect(screen.getByTestId("card-D002")).toBeInTheDocument();
	});

	it("shows empty state when departments are empty", async () => {
		employeeApi.getAll.mockResolvedValue([]);

		mockUseDepartments.mockReturnValue({
			departments: [],
			loading: false,
			error: null,
		});

		render(<Departments />);

		await waitFor(() => {
			expect(screen.getByTestId("empty")).toBeInTheDocument();
		});
	});

	it("navigates when department view is clicked", async () => {
		employeeApi.getAll.mockResolvedValue([]);

		mockUseDepartments.mockReturnValue({
			departments: [
				{
					departmentId: "D001",
					name: "Engineering",
				},
			],
			loading: false,
			error: null,
		});

		render(<Departments />);

		await waitFor(() => {
			expect(screen.getByTestId("card-D001")).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId("card-D001"));

		expect(navigateMock).toHaveBeenCalledWith("/departments/D001");
	});

	it("handles api failure and still stops loading", async () => {
		employeeApi.getAll.mockRejectedValue(new Error("API Error"));

		mockUseDepartments.mockReturnValue({
			departments: [],
			loading: false,
			error: null,
		});

		render(<Departments />);

		await waitFor(() => {
			expect(screen.getByText("Unable to load depatments")).toBeInTheDocument();
		});

		expect(screen.getByText("Reason : API Error")).toBeInTheDocument();
	});
});
