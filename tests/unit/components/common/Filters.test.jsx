import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Filters from "../../../../src/components/common/Filters";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
	useNavigate: () => mockNavigate,
}));

vi.mock("lucide-react", () => ({
	Search: () => <span data-testid="search-icon" />,
}));

describe("Filters Component", () => {
	const defaultProps = {
		searchRef: { current: null },
		search: "",
		department: "all",
		status: "all",
		departments: ["IT", "HR"],
		statusList: ["Active", "Inactive"],
		onSearchChange: vi.fn(),
		onDepartmentChange: vi.fn(),
		onStatusChange: vi.fn(),
		onSearchFocus: vi.fn(),
		onSearchBlur: vi.fn(),
	};

	it("renders search input", () => {
		render(<Filters {...defaultProps} />);

		expect(screen.getByPlaceholderText("Search employees. . .")).toBeInTheDocument();
	});

	it("renders department dropdown", () => {
		render(<Filters {...defaultProps} />);

		expect(screen.getByLabelText("Department")).toBeInTheDocument();

		expect(screen.getByText("IT")).toBeInTheDocument();

		expect(screen.getByText("HR")).toBeInTheDocument();
	});

	it("renders status dropdown", () => {
		render(<Filters {...defaultProps} />);

		expect(screen.getByLabelText("Status")).toBeInTheDocument();

		expect(screen.getByText("Active")).toBeInTheDocument();

		expect(screen.getByText("Inactive")).toBeInTheDocument();
	});

	it("calls search change handler", async () => {
		const user = userEvent.setup();

		const onSearchChange = vi.fn();

		render(<Filters {...defaultProps} onSearchChange={onSearchChange} />);

		const input = screen.getByPlaceholderText("Search employees. . .");

		await user.type(input, "John");

		expect(onSearchChange).toHaveBeenCalled();
	});

	it("calls department change handler", async () => {
		const user = userEvent.setup();

		const onDepartmentChange = vi.fn();

		render(<Filters {...defaultProps} onDepartmentChange={onDepartmentChange} />);

		await user.selectOptions(screen.getByLabelText("Department"), "IT");

		expect(onDepartmentChange).toHaveBeenCalled();
	});

	it("calls status change handler", async () => {
		const user = userEvent.setup();

		const onStatusChange = vi.fn();

		render(<Filters {...defaultProps} onStatusChange={onStatusChange} />);

		await user.selectOptions(screen.getByLabelText("Status"), "Active");

		expect(onStatusChange).toHaveBeenCalled();
	});

	it("calls focus and blur handlers", async () => {
		const user = userEvent.setup();

		const onSearchFocus = vi.fn();
		const onSearchBlur = vi.fn();

		render(<Filters {...defaultProps} onSearchFocus={onSearchFocus} onSearchBlur={onSearchBlur} />);

		const input = screen.getByPlaceholderText("Search employees. . .");

		await user.click(input);

		await user.tab();

		expect(onSearchFocus).toHaveBeenCalled();

		expect(onSearchBlur).toHaveBeenCalled();
	});

	it("hides search when showSearch is false", () => {
		render(<Filters {...defaultProps} showSearch={false} />);

		expect(screen.queryByPlaceholderText("Search employees. . .")).not.toBeInTheDocument();
	});

	it("hides department filter when showDepartment is false", () => {
		render(<Filters {...defaultProps} showDepartment={false} />);

		expect(screen.queryByLabelText("Department")).not.toBeInTheDocument();
	});

	it("hides status filter when showStatus is false", () => {
		render(<Filters {...defaultProps} showStatus={false} />);

		expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
	});

	it("renders new button and navigates", async () => {
		const user = userEvent.setup();

		render(<Filters {...defaultProps} newButton />);

		await user.click(screen.getByRole("button", { name: "Add" }));

		expect(mockNavigate).toHaveBeenCalledWith("/employees/new");
	});

	it("renders search icon", () => {
		render(<Filters {...defaultProps} />);

		expect(screen.getByTestId("search-icon")).toBeInTheDocument();
	});
});
