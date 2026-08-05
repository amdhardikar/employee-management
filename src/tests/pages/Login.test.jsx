import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import Login from "../../pages/Login";
import authReducer, { login } from "../../store/authSlice";

const mockedNavigate = vi.fn();
const mockedDispatch = vi.fn();

vi.mock("react-redux", async () => {
	const actual = await vi.importActual("react-redux");

	return {
		...actual,
		useDispatch: () => mockedDispatch,
	};
});

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");

	return {
		...actual,
		useNavigate: () => mockedNavigate,
	};
});

vi.mock("../../store/authSlice", async () => {
	const actual = await vi.importActual("../../store/authSlice");

	const mockLogin = vi.fn(() => ({
		type: "auth/login",
	}));

	mockLogin.fulfilled = {
		match: (result) => result?.type === "auth/login/fulfilled",
	};

	return {
		...actual,
		login: mockLogin,
	};
});

const renderLogin = (preloadedState = {}) => {
	const store = configureStore({
		reducer: {
			auth: authReducer,
		},
		preloadedState: {
			auth: {
				user: null,
				loading: false,
				error: null,
				...preloadedState,
			},
		},
	});

	return {
		store,
		...render(
			<Provider store={store}>
				<MemoryRouter>
					<Login />
				</MemoryRouter>
			</Provider>,
		),
	};
};

describe("Login Page", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();

		mockedDispatch.mockResolvedValue({
			type: "auth/login/fulfilled",
			payload: {
				id: 1,
			},
		});
	});

	it("renders login form correctly", () => {
		renderLogin();

		expect(screen.getByText("EMS Portal Login")).toBeInTheDocument();

		expect(screen.getByLabelText("Email Address")).toBeInTheDocument();

		expect(screen.getByLabelText("Employee Code")).toBeInTheDocument();

		expect(
			screen.getByRole("button", {
				name: "Sign In",
			}),
		).toBeInTheDocument();
	});

	it("allows user to enter email and employee code", async () => {
		const user = userEvent.setup();

		renderLogin();

		const email = screen.getByLabelText("Email Address");

		const employeeCode = screen.getByLabelText("Employee Code");

		await user.type(email, "john@test.com");

		await user.type(employeeCode, "ems-001");

		expect(email).toHaveValue("john@test.com");

		expect(employeeCode).toHaveValue("ems-001");
	});

	it("dispatches login with normalized employee code", async () => {
		const user = userEvent.setup();

		renderLogin();

		await user.type(screen.getByLabelText("Email Address"), "john@test.com");

		await user.type(screen.getByLabelText("Employee Code"), " ems-001 ");

		await user.click(
			screen.getByRole("button", {
				name: "Sign In",
			}),
		);

		await waitFor(() => {
			expect(login).toHaveBeenCalledWith({
				email: "john@test.com",
				employeeCode: "EMS-001",
			});
		});
	});

	it("navigates after successful login", async () => {
		const user = userEvent.setup();

		renderLogin();

		await user.type(screen.getByLabelText("Email Address"), "john@test.com");

		await user.type(screen.getByLabelText("Employee Code"), "EMS001");

		await user.click(
			screen.getByRole("button", {
				name: "Sign In",
			}),
		);

		await waitFor(() => {
			expect(mockedNavigate).toHaveBeenCalledWith("/dashboard", {
				replace: true,
			});
		});
	});

	it("shows authentication error", () => {
		renderLogin({
			error: "Invalid Email or Employee Code combination.",
		});

		expect(screen.getByRole("alert")).toHaveTextContent("Invalid Email or Employee Code combination.");
	});

	it("shows loading state", () => {
		renderLogin({
			loading: true,
		});

		expect(screen.getByRole("button")).toHaveTextContent("Authenticating...");

		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("redirects already logged in users", () => {
		renderLogin({
			user: {
				id: 1,
				name: "John",
			},
		});

		expect(screen.queryByText("EMS Portal Login")).not.toBeInTheDocument();
	});
});
