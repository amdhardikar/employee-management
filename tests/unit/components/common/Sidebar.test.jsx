import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import Sidebar from "../../../../src/components/common/Sidebar";
import authReducer from "../../../../src/store/authSlice";
import uiReducer from "../../../../src/store/uiSlice";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");

	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

const createStore = (sidebarOpen = true) =>
	configureStore({
		reducer: {
			auth: authReducer,
			ui: uiReducer,
		},
		preloadedState: {
			auth: {
				user: {
					token: "mock-token",
					fullName: "John Doe",
				},
				loading: false,
				error: null,
			},
			ui: {
				sidebarOpen,
				loading: false,
			},
		},
	});

const renderSidebar = ({
	sidebarOpen = true,
	initialRoute = "/dashboard",
} = {}) => {
	const store = createStore(sidebarOpen);

	render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[initialRoute]}>
				<Sidebar />
			</MemoryRouter>
		</Provider>,
	);

	return store;
};

describe("Sidebar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders application title", () => {
		renderSidebar();

		expect(screen.getByText("EMS Dashboard")).toBeInTheDocument();
	});

	it("renders all navigation links", () => {
		renderSidebar();

		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByText("Employees")).toBeInTheDocument();
		expect(screen.getByText("Departments")).toBeInTheDocument();
		expect(screen.getByText("Attendance")).toBeInTheDocument();
		expect(screen.getByText("Payroll")).toBeInTheDocument();
	});

	it("renders logout button", () => {
		renderSidebar();

		expect(
			screen.getByRole("button", { name: /logout/i }),
		).toBeInTheDocument();
	});

	it("shows overlay when sidebar is open", () => {
		renderSidebar({ sidebarOpen: true });

		expect(screen.getByTestId("sidebar-overlay")).toBeInTheDocument();
	});

	it("does not show overlay when sidebar is closed", () => {
		renderSidebar({ sidebarOpen: false });

		expect(screen.queryByTestId("sidebar-overlay")).not.toBeInTheDocument();
	});

	it("closes sidebar when close menu button is clicked", async () => {
		const user = userEvent.setup();

		const store = renderSidebar({ sidebarOpen: true });

		await user.click(screen.getByRole("button", { name: /close menu/i }));

		expect(store.getState().ui.sidebarOpen).toBe(false);
	});

	it("closes sidebar when navigation link is clicked", async () => {
		const user = userEvent.setup();

		const store = renderSidebar({ sidebarOpen: true });

		await user.click(screen.getByRole("link", { name: /employees/i }));

		expect(store.getState().ui.sidebarOpen).toBe(false);
	});

	it("closes sidebar when overlay is clicked", async () => {
		const user = userEvent.setup();

		const store = renderSidebar({ sidebarOpen: true });

		await user.click(screen.getByTestId("sidebar-overlay"));

		expect(store.getState().ui.sidebarOpen).toBe(false);
	});

	it("logs out user and navigates to login", async () => {
		const user = userEvent.setup();

		const store = renderSidebar({ sidebarOpen: true });

		await user.click(screen.getByRole("button", { name: /logout/i }));

		expect(mockNavigate).toHaveBeenCalledWith("/login", {
			replace: true,
		});

		expect(store.getState().auth.user).toBeNull();
		expect(store.getState().ui.sidebarOpen).toBe(false);
	});

	it("highlights the active navigation link", () => {
		renderSidebar({
			sidebarOpen: true,
			initialRoute: "/employees",
		});

		expect(screen.getByRole("link", { name: /employees/i })).toHaveClass(
			"bg-slate-600",
		);
	});
});
