import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import Payroll from "../../pages/Payroll";

import { useSelector } from "react-redux";
import useMediaQuery from "../../hooks/useMediaQuery";
import useEmployeeListing from "../../hooks/useEmployeeListing";

import { employeeApi } from "../../api/employeeApi";

const navigate = vi.fn();
const dispatch = vi.fn();

let filtersProps;

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
	default: () => ({
		departments: ["IT", "HR"],
		loading: false,
		error: null,
	}),
}));

vi.mock("../../hooks/useMediaQuery", () => ({
	default: vi.fn(),
}));

vi.mock("../../hooks/useEmployeeListing", () => ({
	default: vi.fn(),
}));

vi.mock("../../api/employeeApi", () => ({
	employeeApi: {
		getEmployees: vi.fn().mockResolvedValue([]),
	},
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

vi.mock("../../components/common/ErrorState", () => ({
	default: ({ title, message }) => (
		<div>
			<div>{title}</div>
			<div>{message}</div>
		</div>
	),
}));

vi.mock("../../components/common/Filters", () => ({
	default: (props) => {
		filtersProps = props;

		return (
			<div>
				<button onClick={props.onSearchFocus}>Focus</button>
				<button onClick={props.onSearchBlur}>Blur</button>
			</div>
		);
	},
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

		filtersProps = null;

		useSelector.mockImplementation((selector) =>
			selector({
				filters: {
					payroll: query,
				},
			}),
		);

		useMediaQuery.mockReturnValue(true);
	});

	afterEach(() => {
		vi.restoreAllMocks();
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

	it("calls employee api with filters", async () => {
		useEmployeeListing.mockImplementation(({ fetchEmployees }) => {
			fetchEmployees(1, 10);

			return {
				tableEmployees: [],
				cardEmployees: [],
				loading: false,
				loadingMore: false,
				pagination: {},
			};
		});

		render(<Payroll />);

		expect(employeeApi.getEmployees).toHaveBeenCalledWith({
			page: 1,
			pageSize: 10,
			search: "",
			department: "",
			order: "asc",
			sort: "name",
		});
	});

	it("renders table and navigates", () => {
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
	});

	it("renders cards and load more", () => {
		useMediaQuery.mockReturnValue(false);

		useEmployeeListing.mockReturnValue({
			tableEmployees: [],
			cardEmployees: [employee],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 3,
			},
		});

		render(<Payroll />);

		fireEvent.click(screen.getByText("Load More"));

		expect(dispatch).toHaveBeenCalled();
	});

	it("shows loading more", () => {
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

	it("shows empty state", () => {
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

	it("shows error state", () => {
		useEmployeeListing.mockReturnValue({
			tableEmployees: [],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {},
			error: {
				message: "API failed",
			},
		});

		render(<Payroll />);

		expect(screen.getByText("Unable to load payrolls")).toBeInTheDocument();

		expect(screen.getByText("Reason : API failed")).toBeInTheDocument();
	});

	it("handles focus and blur callbacks", () => {
		useEmployeeListing.mockReturnValue({
			tableEmployees: [],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {},
		});

		render(<Payroll />);

		fireEvent.click(screen.getByText("Focus"));

		expect(filtersProps).not.toBeNull();

		fireEvent.click(screen.getByText("Blur"));
	});
});
