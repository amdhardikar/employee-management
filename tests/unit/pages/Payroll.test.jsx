import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import Payroll from "../../../src/pages/Payroll";

import { useSelector } from "react-redux";
import useMediaQuery from "../../../src/hooks/useMediaQuery";
import useEmployeeListing from "../../../src/hooks/useEmployeeListing";

import { employeeApi } from "../../../src/api/employeeApi";

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

vi.mock("../../../src/hooks/useDebounce", () => ({
	default: (value) => value,
}));

vi.mock("../../../src/hooks/useDepartments", () => ({
	default: () => ({
		departments: ["IT", "HR"],
		loading: false,
		error: null,
	}),
}));

vi.mock("../../../src/hooks/useMediaQuery", () => ({
	default: vi.fn(),
}));

vi.mock("../../../src/hooks/useEmployeeListing", () => ({
	default: vi.fn(),
}));

vi.mock("../../../src/api/employeeApi", () => ({
	employeeApi: {
		getEmployees: vi.fn().mockResolvedValue([]),
	},
}));

vi.mock("../../../src/hooks/useFilters", () => ({
	default: () => ({
		onSearchChangeHandler: vi.fn(),
		onDepartmentChangeHandler: vi.fn(),
		onPageChangeHandler: vi.fn(),
		onPageSizeChangeHandler: vi.fn(),
	}),
}));

vi.mock("../../../src/components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../../src/components/common/EmptyState", () => ({
	default: () => <div>Empty State</div>,
}));

vi.mock("../../../src/components/common/ErrorState", () => ({
	default: ({ title, message }) => (
		<div>
			<div>{title}</div>
			<div>{message}</div>
		</div>
	),
}));

vi.mock("../../../src/components/common/Filters", () => ({
	default: (props) => {
		filtersProps = props;

		return (
			<div>
				<input ref={props.searchRef} aria-label="Payroll search" />
				<button onClick={props.onSearchFocus}>Focus</button>
				<button onClick={props.onSearchBlur}>Blur</button>
			</div>
		);
	},
}));

vi.mock("../../../src/components/payroll/PayrollTable", () => ({
	default: ({ payrolls, onView }) => <button onClick={() => onView(payrolls[0])}>Table {payrolls.length}</button>,
}));

vi.mock("../../../src/components/payroll/PayrollCard", () => ({
	default: ({ employee, onView }) => <button onClick={() => onView(employee)}>Card {employee.id}</button>,
}));

vi.mock("../../../src/components/common/Pagination", () => ({
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

	it("uses fallback text for an error without a message", () => {
		useEmployeeListing.mockReturnValue({
			tableEmployees: [], cardEmployees: [], loading: false, loadingMore: false,
			pagination: {}, error: {},
		});
		render(<Payroll />);
		expect(screen.getByText(/Reason :/)).toBeInTheDocument();
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

	it("restores search focus after a focused request finishes", () => {
		const focus = vi.spyOn(HTMLInputElement.prototype, "focus").mockImplementation(() => {});
		useEmployeeListing.mockReturnValue({
			tableEmployees: [], cardEmployees: [], loading: false, loadingMore: false, pagination: {},
		});
		const { rerender } = render(<Payroll />);
		fireEvent.click(screen.getByText("Focus"));
		useEmployeeListing.mockReturnValue({
			tableEmployees: [], cardEmployees: [], loading: true, loadingMore: false, pagination: {},
		});
		rerender(<Payroll />);
		useEmployeeListing.mockReturnValue({
			tableEmployees: [], cardEmployees: [], loading: false, loadingMore: false, pagination: {},
		});
		rerender(<Payroll />);
		expect(focus).toHaveBeenCalled();
	});
});
