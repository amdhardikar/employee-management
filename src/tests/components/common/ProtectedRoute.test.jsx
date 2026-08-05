import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../../../components/common/ProtectedRoute";
import authReducer from "../../../store/authSlice";

const createStore = (user = null) =>
	configureStore({
		reducer: {
			auth: authReducer,
		},
		preloadedState: {
			auth: {
				user,
				loading: false,
				error: null,
			},
		},
	});

const renderWithProviders = (ui, { user = null, initialRoute = "/" } = {}) => {
	const store = createStore(user);

	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>
		</Provider>,
	);
};

describe("ProtectedRoute", () => {
	it("redirects unauthenticated users to the login page", () => {
		renderWithProviders(
			<Routes>
				<Route path="/login" element={<h1>Login Page</h1>} />

				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<h1>Dashboard</h1>} />
				</Route>
			</Routes>,
			{
				initialRoute: "/dashboard",
			},
		);

		expect(screen.getByText("Login Page")).toBeInTheDocument();
		expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
	});

	it("renders children when the user is authenticated", () => {
		renderWithProviders(
			<ProtectedRoute>
				<h1>Protected Content</h1>
			</ProtectedRoute>,
			{
				user: {
					token: "mock-token",
					fullName: "John Doe",
				},
			},
		);

		expect(screen.getByText("Protected Content")).toBeInTheDocument();
	});

	it("renders the outlet when authenticated and no children are provided", () => {
		renderWithProviders(
			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<h1>Dashboard</h1>} />
				</Route>
			</Routes>,
			{
				user: {
					token: "mock-token",
					fullName: "John Doe",
				},
				initialRoute: "/dashboard",
			},
		);

		expect(screen.getByText("Dashboard")).toBeInTheDocument();
	});
});
