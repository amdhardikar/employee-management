import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Payroll from "../../pages/Payroll";

import { useSelector } from "react-redux";
import useMediaQuery from "../../hooks/useMediaQuery";
import useEmployeeListing from "../../hooks/useEmployeeListing";

const navigate = vi.fn();
const dispatch = vi.fn();

vi.mock("react-router-dom", () => ({
	useNavigate: () => navigate,
}));

vi.mock("react-redux", () => ({
	useDispatch: () => dispatch,
	useSelector: vi.fn(),
}));

vi.mock("../../hooks/useDebounce", () => ({
	default: (value) => value,
}));

vi.mock("../../hooks/useDepartments", () => ({
	default: () => ["IT", "HR"],
}));

vi.mock("../../hooks/useMediaQuery", () => ({
	default: vi.fn(),
}));

vi.mock("../../hooks/useEmployeeListing", () => ({
	default: vi.fn(),
}));

vi.mock("../../hooks/useFilters", () => ({
	default: () => ({
		onSearchChangeHandler: vi.fn(),
		onDepartmentChangeHandler: vi.fn(),
		onPageChangeHandler: vi.fn(),
		onPageSizeChangeHandler: vi.fn(),
	}),
}));

vi.mock("../../components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../components/common/EmptyState", () => ({
	default: () => <div>Empty State</div>,
}));

vi.mock("../../components/common/Filters", () => ({
	default: ({ onSearchFocus, onSearchBlur }) => (
		<div>
			Filters
			<button onClick={onSearchFocus}>Focus</button>
			<button onClick={onSearchBlur}>Blur</button>
		</div>
	),
}));

vi.mock("../../components/payroll/PayrollTable", () => ({
	default: ({ payrolls, onView }) => <button onClick={() => onView(payrolls[0])}>Table {payrolls.length}</button>,
}));

vi.mock("../../components/payroll/PayrollCard", () => ({
	default: ({ employee, onView }) => <button onClick={() => onView(employee)}>Card {employee.id}</button>,
}));

vi.mock("../../components/common/Pagination", () => ({
	default: () => <div>Pagination</div>,
}));

const query = {
	search: "",
	department: "",
	order: "asc",
	sort: "name",
	tablePage: 1,
	cardPage: 1,
	pageSize: 10,
};

const employee = {
	id: "1",
	employeeId: "EMP001",
};

describe("Payroll", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		// component expects state.filters.payroll
		// but useSelector receives selector callback
		useSelector.mockImplementation((selector) =>
			selector({
				filters: {
					payroll: query,
				},
			}),
		);

		useMediaQuery.mockReturnValue(true);
	});

	it("shows loader while loading", () => {
		useEmployeeListing.mockReturnValue({
			tableEmployees: [],
			cardEmployees: [],
			loading: true,
			loadingMore: false,
			pagination: {},
		});

		render(<Payroll />);

		expect(screen.getByText("Loading payroll...")).toBeInTheDocument();
	});

	it("renders table view and navigates on view", () => {
		useMediaQuery.mockReturnValue(true);

		useEmployeeListing.mockReturnValue({
			tableEmployees: [employee],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 1,
			},
		});

		render(<Payroll />);

		fireEvent.click(screen.getByText("Table 1"));

		expect(navigate).toHaveBeenCalledWith("/payroll/EMP001");

		expect(screen.getByText("Pagination")).toBeInTheDocument();
	});

	it("renders cards and load more button", () => {
		useMediaQuery.mockReturnValue(false);

		useEmployeeListing.mockReturnValue({
			tableEmployees: [],
			cardEmployees: [employee],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 3,
				totalItems: 3,
			},
		});

		render(<Payroll />);

		expect(screen.getByText("Card 1")).toBeInTheDocument();

		expect(screen.getByText("Load More")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Load More"));

		expect(dispatch).toHaveBeenCalled();
	});

	it("shows loading more state", () => {
		useMediaQuery.mockReturnValue(false);

		useEmployeeListing.mockReturnValue({
			tableEmployees: [],
			cardEmployees: [employee],
			loading: false,
			loadingMore: true,
			pagination: {
				totalPages: 3,
			},
		});

		render(<Payroll />);

		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("shows empty state when no employees exist", () => {
		useMediaQuery.mockReturnValue(true);

		useEmployeeListing.mockReturnValue({
			tableEmployees: [],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {},
		});

		render(<Payroll />);

		expect(screen.getByText("Empty State")).toBeInTheDocument();
	});
});