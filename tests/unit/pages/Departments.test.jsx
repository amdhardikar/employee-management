import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Departments from "../../../src/pages/Departments";

import { employeeApi } from "../../../src/api/employeeApi";
import { departmentApi } from "../../../src/api/departmentApi";

// Mock APIs
vi.mock("../../../src/api/employeeApi", () => ({
	employeeApi: {
		getAll: vi.fn(),
	},
}));

vi.mock("../../../src/api/departmentApi", () => ({
	departmentApi: { getDepartments: vi.fn(), removeDepartment: vi.fn() },
}));

const { mockDispatch, mockQuery } = vi.hoisted(() => ({
	mockDispatch: vi.fn(),
	mockQuery: {
		tablePage: 1,
		cardPage: 1,
		pageSize: 10,
		search: "",
		sort: "name",
		order: "asc",
	},
}));

vi.mock("react-redux", () => ({
	useDispatch: () => mockDispatch,
	useSelector: () => mockQuery,
}));

// Mock navigation
const navigateMock = vi.fn();
const { mockUseMediaQuery } = vi.hoisted(() => ({ mockUseMediaQuery: vi.fn() }));

vi.mock("react-router-dom", () => ({
	useNavigate: () => navigateMock,
}));

vi.mock("../../../src/hooks/useMediaQuery", () => ({ default: mockUseMediaQuery }));

vi.mock("../../../src/hooks/useDepartments", () => ({
	default: mockUseDepartments,
}));

vi.mock("../../../src/hooks/useDebounce", () => ({ default: (value) => value }));
vi.mock("../../../src/hooks/useFilters", () => ({
	default: () => ({
		onSearchChangeHandler: vi.fn(),
		onPageChangeHandler: vi.fn(),
		onPageSizeChangeHandler: vi.fn(),
	}),
}));
vi.mock("../../../src/hooks/useEmployeeListing", () => ({
	default: () => {
		const result = mockUseDepartments();
		return {
			tableEmployees: result.departments,
			cardEmployees: result.departments,
			loading: result.loading,
			loadingMore: false,
			pagination: { totalPages: 1, totalItems: result.departments.length },
			error: result.error,
		};
	},
}));

// Mock children
vi.mock("../../../src/components/common/PageLoader", () => ({
	default: ({ text }) => <div data-testid="loader">{text}</div>,
}));

vi.mock("../../../src/components/common/EmptyState", () => ({
	default: () => <div data-testid="empty">Empty State</div>,
}));

vi.mock("../../../src/components/department/DepartmentTable", () => ({
	default: ({ onView, onEdit, onDelete }) => (
		<div data-testid="department-table">
			<button onClick={() => onView({ departmentId: "D001" })}>Table</button>
			<button onClick={() => onEdit({ departmentId: "D001" })}>Edit department</button>
			<button onClick={() => onDelete({ departmentId: "D001" })}>Delete department</button>
		</div>
	),
}));

vi.mock("../../../src/components/department/DepartmentCard", () => ({
	default: ({ department, onView }) => (
		<button data-testid={`card-${department.departmentId}`} onClick={() => onView(department)}>
			{department.name}
		</button>
	),
}));

const { mockUseDepartments } = vi.hoisted(() => ({
	mockUseDepartments: vi.fn(),
}));

vi.mock("../../../src/components/common/ErrorState.jsx", () => ({
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
		mockUseMediaQuery.mockReturnValue(true);

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
		mockUseMediaQuery.mockReturnValue(false);
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
		mockUseMediaQuery.mockReturnValue(false);
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

	it("uses department and generic error fallbacks", async () => {
		employeeApi.getAll.mockResolvedValue([]);
		mockUseDepartments.mockReturnValue({ departments: [], loading: false, error: { message: "Lookup failed" } });
		const view = render(<Departments />);
		expect(await screen.findByText("Reason : Lookup failed")).toBeInTheDocument();

		employeeApi.getAll.mockRejectedValue({});
		mockUseDepartments.mockReturnValue({ departments: [], loading: false, error: null });
		view.unmount();
		render(<Departments />);
		expect(await screen.findByText("Reason : Something went wrong while loading departments")).toBeInTheDocument();
	});

	it("supports create, edit, and delete actions", async () => {
		employeeApi.getAll.mockResolvedValue([]);
		departmentApi.removeDepartment.mockResolvedValue();
		render(<Departments />);
		await screen.findByTestId("department-table");

		fireEvent.click(screen.getByRole("button", { name: "Add" }));
		expect(navigateMock).toHaveBeenCalledWith("/departments/new");
		fireEvent.click(screen.getByRole("button", { name: "Edit department" }));
		expect(navigateMock).toHaveBeenCalledWith("/departments/edit/D001");
		fireEvent.click(screen.getByRole("button", { name: "Delete department" }));
		await waitFor(() => expect(departmentApi.removeDepartment).toHaveBeenCalledWith("D001"));
	});
});
