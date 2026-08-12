import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Attendance from "../../../src/pages/Attendance";
import { employeeApi } from "../../../src/api/employeeApi";

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

const mockUseMediaQuery = vi.fn();
const mockUseDepartments = vi.fn();
const mockUseFilters = vi.fn();
const mockUseDebounce = vi.fn();

const mockState = {
	filters: {
		attendance: {
			search: "",
			department: "",
			tablePage: 1,
			cardPage: 1,
			pageSize: 10,
		},
	},
};

vi.mock("react-redux", () => ({
	useDispatch: () => mockDispatch,
	useSelector: (selector) => selector(mockState),
}));

vi.mock("react-router-dom", () => ({
	useNavigate: () => mockNavigate,
}));

let capturedFetchEmployees;
let attendanceListingState;

vi.mock("../../../src/hooks/useEmployeeListing", () => ({
	default: (params) => {
		capturedFetchEmployees = params.fetchEmployees;
		return attendanceListingState;
	},
}));

vi.mock("../../../src/hooks/useMediaQuery", () => ({
	default: () => mockUseMediaQuery(),
}));

vi.mock("../../../src/hooks/useDepartments", () => ({
	default: () => mockUseDepartments(),
}));

vi.mock("../../../src/hooks/useFilters", () => ({
	default: (args) => mockUseFilters(args),
}));

vi.mock("../../../src/hooks/useDebounce", () => ({
	default: (value) => mockUseDebounce(value),
}));

vi.mock("../../../src/store/filterSlice", () => ({
	setFilters: vi.fn((payload) => ({
		type: "filters/setFilters",
		payload,
	})),
}));

vi.mock("../../../src/components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../../src/components/common/EmptyState", () => ({
	default: () => <div>Empty State</div>,
}));

vi.mock("../../../src/components/common/Filters.jsx", () => ({
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

vi.mock("../../../src/components/common/Pagination", () => ({
	default: () => <div>Pagination</div>,
}));

vi.mock("../../../src/components/attendance/AttendanceTable", () => ({
	default: ({ onView }) => (
		<button
			onClick={() =>
				onView({
					employeeId: "EMP001",
				})
			}
		>
			Table
		</button>
	),
}));

vi.mock("../../../src/components/attendance/AttendanceCard", () => ({
	default: ({ onView }) => (
		<button
			onClick={() =>
				onView({
					employeeId: "EMP001",
				})
			}
		>
			Card
		</button>
	),
}));

vi.mock("../../../src/api/employeeApi", () => ({
	employeeApi: {
		getEmployees: vi.fn().mockResolvedValue({
			employees: [],
			pagination: {},
		}),
	},
}));

describe("Attendance Page", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 0,
			},
		};

		mockUseMediaQuery.mockReturnValue(true);

		mockUseDepartments.mockReturnValue([
			{
				id: 1,
				name: "Engineering",
			},
		]);

		mockUseDebounce.mockImplementation((value) => value);

		mockUseFilters.mockReturnValue({
			onSearchChangeHandler: vi.fn(),
			onDepartmentChangeHandler: vi.fn(),
			onPageChangeHandler: vi.fn(),
			onPageSizeChangeHandler: vi.fn(),
		});
	});

	it("shows loader while loading", () => {
		mockUseMediaQuery.mockReturnValue(true);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: true,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 0,
			},
		};

		render(<Attendance />);

		expect(screen.getByText("Loading attendance...")).toBeInTheDocument();
	});

	it("shows the listing error state", () => {
		attendanceListingState = {
			tableEmployees: [], cardEmployees: [], loading: false, loadingMore: false,
			pagination: {}, error: new Error("Attendance unavailable"),
		};
		render(<Attendance />);
		expect(screen.getByText("Unable to load attendance")).toBeInTheDocument();
		expect(screen.getByText("Reason : Attendance unavailable")).toBeInTheDocument();
	});

	it("uses fallback text for a listing error without a message", () => {
		attendanceListingState = {
			tableEmployees: [], cardEmployees: [], loading: false, loadingMore: false,
			pagination: {}, error: {},
		};
		render(<Attendance />);
		expect(screen.getByText(/Reason :/)).toBeInTheDocument();
	});

	it("renders filters", () => {
		mockUseMediaQuery.mockReturnValue(true);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 0,
			},
		};

		render(<Attendance />);

		expect(screen.getByTestId("filters")).toBeInTheDocument();
	});

	it("fetches employees with correct filters", async () => {
		render(<Attendance />);

		await capturedFetchEmployees(1, 10);

		expect(employeeApi.getEmployees).toHaveBeenCalledWith({
			page: 1,
			pageSize: 10,
			search: "",
			department: "",
		});
	});

	it("renders attendance table and pagination on desktop", () => {
		mockUseMediaQuery.mockReturnValue(true);

		attendanceListingState = {
			tableEmployees: [{ employeeId: "EMP001" }],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 2,
				totalItems: 10,
			},
		};

		render(<Attendance />);

		expect(screen.getByText("Table")).toBeInTheDocument();
		expect(screen.getByText("Pagination")).toBeInTheDocument();
	});

	it("renders attendance cards on mobile", () => {
		mockUseMediaQuery.mockReturnValue(false);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [{ employeeId: "EMP001" }],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 2,
				totalItems: 10,
			},
		};

		render(<Attendance />);

		expect(screen.getByText("Card")).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: "Load More",
			}),
		).toBeInTheDocument();
	});

	it("dispatches Load More action", async () => {
		const user = userEvent.setup();

		mockUseMediaQuery.mockReturnValue(false);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [{ employeeId: "EMP001" }],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 3,
				totalItems: 20,
			},
		};

		render(<Attendance />);

		await user.click(
			screen.getByRole("button", {
				name: "Load More",
			}),
		);

		expect(mockDispatch).toHaveBeenCalled();
	});

	it("shows loading text while loading more", () => {
		mockUseMediaQuery.mockReturnValue(false);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [{ employeeId: "EMP001" }],
			loading: false,
			loadingMore: true,
			pagination: {
				totalPages: 3,
				totalItems: 20,
			},
		};

		render(<Attendance />);

		expect(
			screen.getByRole("button", {
				name: "Loading...",
			}),
		).toBeDisabled();
	});

	it("does not show Load More on last page", () => {
		mockState.filters.attendance.cardPage = 3;

		mockUseMediaQuery.mockReturnValue(false);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [{ employeeId: "EMP001" }],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 3,
				totalItems: 20,
			},
		};

		render(<Attendance />);

		expect(
			screen.queryByRole("button", {
				name: "Load More",
			}),
		).not.toBeInTheDocument();

		mockState.filters.attendance.cardPage = 1;
	});

	it("renders empty state when there is no data", () => {
		mockUseMediaQuery.mockReturnValue(true);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 0,
			},
		};

		render(<Attendance />);

		expect(screen.getByText("Empty State")).toBeInTheDocument();
	});

	it("navigates when viewing employee from table", async () => {
		const user = userEvent.setup();

		mockUseMediaQuery.mockReturnValue(true);

		attendanceListingState = {
			tableEmployees: [{ employeeId: "EMP001" }],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 1,
			},
		};

		render(<Attendance />);

		await user.click(screen.getByText("Table"));

		expect(mockNavigate).toHaveBeenCalledWith("/attendance/EMP001");
	});

	it("navigates when viewing employee from card", async () => {
		const user = userEvent.setup();

		mockUseMediaQuery.mockReturnValue(false);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [{ employeeId: "EMP001" }],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 1,
			},
		};

		render(<Attendance />);

		await user.click(screen.getByText("Card"));

		expect(mockNavigate).toHaveBeenCalledWith("/attendance/EMP001");
	});

	it("passes correct props to useFilters", () => {
		mockUseMediaQuery.mockReturnValue(true);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 0,
			},
		};

		render(<Attendance />);

		expect(mockUseFilters).toHaveBeenCalledWith(
			expect.objectContaining({
				module: "attendance",
				tableRef: expect.any(Object),
			}),
		);
	});

	it("restores focus on search input after loading completes", () => {
		const focusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");

		attendanceListingState = {
			tableEmployees: [{ employeeId: "EMP001" }],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 1,
			},
		};

		const { rerender } = render(<Attendance />);

		fireEvent.focus(screen.getByTestId("filters"));

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: true,
			loadingMore: false,
			pagination: {},
		};

		rerender(<Attendance />);

		attendanceListingState = {
			tableEmployees: [{ employeeId: "EMP001" }],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 1,
			},
		};

		rerender(<Attendance />);

		expect(focusSpy).toHaveBeenCalled();

		focusSpy.mockRestore();
	});

	it("handles search focus and blur", async () => {
		mockUseMediaQuery.mockReturnValue(true);

		attendanceListingState = {
			tableEmployees: [],
			cardEmployees: [],
			loading: false,
			loadingMore: false,
			pagination: {
				totalPages: 1,
				totalItems: 0,
			},
		};

		render(<Attendance />);

		const input = screen.getByTestId("filters");

		fireEvent.focus(input);
		fireEvent.blur(input);
	});
});
