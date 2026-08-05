import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Header from "../../../components/common/Header";
import uiReducer from "../../../store/uiSlice";

vi.mock("../../../components/common/Breadcrumb", () => ({
	default: () => <div>Mock Breadcrumb</div>,
}));

const createStore = () =>
	configureStore({
		reducer: {
			ui: uiReducer,
		},
		preloadedState: {
			ui: {
				sidebarOpen: false,
				loading: false,
			},
		},
	});

const renderHeader = () => {
	const store = createStore();

	render(
		<Provider store={store}>
			<Header />
		</Provider>,
	);

	return store;
};

describe("Header", () => {
	it("renders the breadcrumb", () => {
		renderHeader();

		expect(screen.getByText("Mock Breadcrumb")).toBeInTheDocument();
	});

	it("opens the sidebar when the menu button is clicked", async () => {
		const user = userEvent.setup();

		const store = renderHeader();

		await user.click(
			screen.getByRole("button", {
				name: /open menu/i,
			}),
		);

		expect(store.getState().ui.sidebarOpen).toBe(true);
	});
});
