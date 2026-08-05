import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockUseLocation = vi.fn();
const mockMatchPath = vi.fn();

vi.mock("lucide-react", () => ({
	Home: () => <svg data-testid="home-icon" />,
	ChevronRight: () => <svg data-testid="chevron-icon" />,
}));

vi.mock("react-router-dom", () => ({
	NavLink: ({ children, to, ...props }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
	useLocation: () => mockUseLocation(),
	matchPath: (...args) => mockMatchPath(...args),
}));

vi.mock("../../../router", () => ({
	appRoutes: [
		{
			path: "/dashboard",
			breadcrumb: "Dashboard",
		},
		{
			path: "/employees",
			breadcrumb: "Employees",
		},
		{
			path: "/employees/:id",
			breadcrumb: "Employee Details",
			parent: "/employees",
		},
		{
			path: "/departments",
			breadcrumb: "Departments",
		},
	],
}));

describe("Breadcrumb", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns null when route is not found", async () => {
		const { default: Breadcrumb } = await import("../../../components/common/Breadcrumb");

		mockUseLocation.mockReturnValue({
			pathname: "/unknown",
		});

		mockMatchPath.mockReturnValue(false);

		const { container } = render(<Breadcrumb />);

		expect(container.firstChild).toBeNull();
	});

	it("renders breadcrumb without parent", async () => {
		const { default: Breadcrumb } = await import("../../../components/common/Breadcrumb");

		mockUseLocation.mockReturnValue({
			pathname: "/employees",
		});

		mockMatchPath.mockImplementation((route, pathname) => {
			return route === pathname;
		});

		render(<Breadcrumb />);

		expect(
			screen.getByRole("navigation", {
				name: /breadcrumb/i,
			}),
		).toBeInTheDocument();

		expect(screen.getByText("Employees")).toBeInTheDocument();

		expect(screen.getByLabelText(/home/i)).toHaveAttribute("href", "/dashboard");
	});

	it("renders parent breadcrumb link", async () => {
		const { default: Breadcrumb } = await import("../../../components/common/Breadcrumb");

		mockUseLocation.mockReturnValue({
			pathname: "/employees/:id",
		});

		mockMatchPath.mockImplementation((route, pathname) => {
			return route === pathname;
		});

		render(<Breadcrumb />);

		expect(screen.getByText("Employees")).toBeInTheDocument();

		expect(
			screen.getByRole("link", {
				name: "Employees",
			}),
		).toHaveAttribute("href", "/employees");

		expect(screen.getByText("Employee Details")).toBeInTheDocument();
	});

	it("last breadcrumb is not a link", async () => {
		const { default: Breadcrumb } = await import("../../../components/common/Breadcrumb");

		mockUseLocation.mockReturnValue({
			pathname: "/employees/:id",
		});

		mockMatchPath.mockImplementation((route, pathname) => {
			return route === pathname;
		});

		render(<Breadcrumb />);

		expect(
			screen.queryByRole("link", {
				name: "Employee Details",
			}),
		).toBeNull();

		expect(screen.getByText("Employee Details")).toBeInTheDocument();
	});

	it("renders chevron icons", async () => {
		const { default: Breadcrumb } = await import("../../../components/common/Breadcrumb");

		mockUseLocation.mockReturnValue({
			pathname: "/employees/:id",
		});

		mockMatchPath.mockImplementation((route, pathname) => {
			return route === pathname;
		});

		render(<Breadcrumb />);

		expect(screen.getAllByTestId("chevron-icon")).toHaveLength(2);
	});

	it("renders home icon", async () => {
		const { default: Breadcrumb } = await import("../../../components/common/Breadcrumb");

		mockUseLocation.mockReturnValue({
			pathname: "/employees",
		});

		mockMatchPath.mockImplementation((route, pathname) => {
			return route === pathname;
		});

		render(<Breadcrumb />);

		expect(screen.getByTestId("home-icon")).toBeInTheDocument();
	});

	it("handles missing parent route gracefully", async () => {
		vi.resetModules();

		vi.doMock("../../../router", () => ({
			appRoutes: [
				{
					path: "/employees",
					breadcrumb: "Employees",
					parent: "/missing-parent",
				},
			],
		}));

		const { default: Breadcrumb } = await import("../../../components/common/Breadcrumb");

		mockUseLocation.mockReturnValue({
			pathname: "/employees",
		});

		mockMatchPath.mockImplementation((route, pathname) => {
			return route === pathname;
		});

		render(<Breadcrumb />);

		expect(screen.getByText("Employees")).toBeInTheDocument();

		expect(screen.queryByText("Missing Parent")).not.toBeInTheDocument();
	});
});
