import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import Employees from "../../pages/Employees";
import React from "react";

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
const { mockUseMediaQuery } = vi.hoisted(() => ({
	mockUseMediaQuery: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");

	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock("react-redux", async () => {
	const actual = await vi.importActual("react-redux");

	return {
		...actual,
		useDispatch: () => mockDispatch,
		useSelector: (callback) =>
			callback({
				filters: {
					employee: {
						search: "",
						department: "",
						status: "",
						tablePage: 1,
						cardPage: 1,
						pageSize: 10,
					},
				},
			}),
	};
});

vi.mock("../../hooks/useDepartments.js", () => ({
	default: () => ["IT", "HR"],
}));

vi.mock("../../hooks/useDebounce", () => ({
	default: (value) => value,
}));

vi.mock("../../hooks/useMediaQuery", () => ({
	default: mockUseMediaQuery,
}));

vi.mock("../../hooks/useFilters", () => ({
	default: () => ({
		onSearchChangeHandler: vi.fn(),
		onDepartmentChangeHandler: vi.fn(),
		onStatusChangeHandler: vi.fn(),
		onPageChangeHandler: vi.fn(),
		onPageSizeChangeHandler: vi.fn(),
	}),
}));

const mockEmployee = {
	id: 1,
	employeeId: "EMP001",
	name: "John Doe",
};

let capturedFetchEmployees;
let employeeListingState;

vi.mock("../../hooks/useEmployeeListing", () => ({
	default: (params) => {
		capturedFetchEmployees = params.fetchEmployees;

		return employeeListingState;
	},
}));

vi.mock("../../api/employeeApi.js", () => ({
	employeeApi: {
		getEmployees: vi.fn(() => Promise.resolve([])),
	},
}));

vi.mock("../../components/common/Filters.jsx", () => ({
	default: ({ onSearchChange, onSearchFocus, onSearchBlur, searchRef }) => (
		<input
			ref={searchRef}
			data-testid="filters"
			onChange={onSearchChange}
			onFocus={onSearchFocus}
			onBlur={onSearchBlur}
		/>
	),
}));

vi.mock("../../components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../components/common/EmptyState", () => ({
	default: () => <div>Empty State</div>,
}));

vi.mock("../../components/common/Pagination", () => ({
	default: ({ onPageChange }) => (
		<button data-testid="pagination" onClick={() => onPageChange(2)}>
			Pagination
		</button>
	),
}));

vi.mock("../../components/employee/EmployeeTable", () => ({
	default: ({ employees, onView }) => (
		<div>
			<div data-testid="employee-table">{employees[0].name}</div>

			<button onClick={() => onView(employees[0])}>View Employee</button>
		</div>
	),
}));

vi.mock("../../components/employee/EmployeeCard", () => ({
	default: ({ employee, onView }) => (
		<div>
			<div data-testid="employee-card">{employee.name}</div>

			<button onClick={() => onView(employee)}>View Card Employee</button>
		</div>
	),
}));

const renderComponent = () => {
	const store = configureStore({
		reducer: {
			dummy: (state = {}) => state,
		},
	});

	return render(
		<Provider store={store}>
			<MemoryRouter>
				<Employees />
			</MemoryRouter>
		</Provider>,
	);
};

describe("Employees Page", () => {
	beforeEach(() => {
		capturedFetchEmployees = undefined;
		vi.clearAllMocks();
		mockUseMediaQuery.mockReturnValue(true);
		employeeListingState = {
			tableEmployees: [mockEmployee],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 2,
				totalItems: 20,
			},
		};
	});

	it("renders filters", () => {
		renderComponent();

		expect(screen.getByTestId("filters")).toBeInTheDocument();
	});

	it("renders employee table when data exists", () => {
		renderComponent();

		expect(screen.getByTestId("employee-table")).toHaveTextContent("John Doe");
	});

	it("navigates to employee details when view clicked", () => {
		renderComponent();

		fireEvent.click(screen.getByText("View Employee"));

		expect(mockNavigate).toHaveBeenCalledWith("/employees/EMP001");
	});

	it("renders pagination", () => {
		renderComponent();

		expect(screen.getByTestId("pagination")).toBeInTheDocument();
	});

	it("restores focus on search input after loading completes", () => {
		const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");

		// Initial render - page loaded
		employeeListingState = {
			tableEmployees: [mockEmployee],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 1,
			},
		};

		const { rerender } = renderComponent();

		// User focused search input
		const input = screen.getByTestId("filters");

		fireEvent.focus(input);

		// Loading starts
		employeeListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: true,
			loadingMore: false,
			pagination: {},
		};

		rerender(
			<Provider
				store={configureStore({
					reducer: {
						dummy: (state = {}) => state,
					},
				})}
			>
				<MemoryRouter>
					<Employees />
				</MemoryRouter>
			</Provider>,
		);

		// Loading completes
		employeeListingState = {
			tableEmployees: [mockEmployee],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 1,
			},
		};

		rerender(
			<Provider
				store={configureStore({
					reducer: {
						dummy: (state = {}) => state,
					},
				})}
			>
				<MemoryRouter>
					<Employees />
				</MemoryRouter>
			</Provider>,
		);

		expect(focusSpy).toHaveBeenCalled();

		focusSpy.mockRestore();
	});

	it("handles search focus and blur events", () => {
		renderComponent();

		const input = screen.getByTestId("filters");

		fireEvent.focus(input);
		fireEvent.blur(input);

		expect(input).toBeInTheDocument();
	});

	it("shows Loading text when loading more employees", () => {
		mockUseMediaQuery.mockReturnValue(false);

		employeeListingState = {
			tableEmployees: [],
			cardEmployees: [mockEmployee],
			loading: false,
			loadingMore: true,
			pagination: {
				totalPages: 2,
				totalItems: 20,
			},
		};

		renderComponent();

		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("shows loader while loading", () => {
		employeeListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: true,
			loadingMore: false,
			pagination: {},
		};

		renderComponent();

		expect(screen.getByText("Loading employees...")).toBeInTheDocument();

		expect(screen.queryByTestId("filters")).not.toBeInTheDocument();
	});

	it("shows empty state when no employees", () => {
		employeeListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 0,
				totalItems: 0,
			},
		};

		renderComponent();

		expect(screen.getByText("Empty State")).toBeInTheDocument();
	});

	it("renders employee cards on mobile", () => {
		mockUseMediaQuery.mockReturnValue(false);

		employeeListingState = {
			tableEmployees: [],
			cardEmployees: [mockEmployee],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 1,
			},
		};

		renderComponent();

		expect(screen.getByTestId("employee-card")).toHaveTextContent("John Doe");
	});

	it("renders Load More button for mobile cards", () => {
		mockUseMediaQuery.mockReturnValue(false);

		employeeListingState = {
			tableEmployees: [],
			cardEmployees: [mockEmployee],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 2,
				totalItems: 20,
			},
		};

		renderComponent();

		expect(screen.getByText("Load More")).toBeInTheDocument();
	});

	it("dispatches load more action on mobile", () => {
		mockUseMediaQuery.mockReturnValue(false);

		employeeListingState = {
			tableEmployees: [],
			cardEmployees: [mockEmployee],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 2,
				totalItems: 20,
			},
		};

		renderComponent();

		fireEvent.click(screen.getByText("Load More"));

		expect(mockDispatch).toHaveBeenCalled();
	});

	it("fetches employees with correct filters", async () => {
		renderComponent();

		await capturedFetchEmployees(1, 10);

		const { employeeApi } = await import("../../api/employeeApi.js");

		expect(employeeApi.getEmployees).toHaveBeenCalledWith({
			page: 1,
			pageSize: 10,
			search: "",
			department: "",
			status: "",
		});
	});
});
