import { describe, it, expect } from "vitest";

import reducer, { openSidebar, closeSidebar } from "../../../src/store/uiSlice";

describe("uiSlice", () => {
	const initialState = {
		sidebarOpen: false,
	};

	it("returns the initial state", () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

	it("opens sidebar", () => {
		const previousState = {
			sidebarOpen: false,
		};

		const nextState = reducer(previousState, openSidebar());

		expect(nextState.sidebarOpen).toBe(true);
	});

	it("closes sidebar", () => {
		const previousState = {
			sidebarOpen: true,
		};

		const nextState = reducer(previousState, closeSidebar());

		expect(nextState.sidebarOpen).toBe(false);
	});

	it("does not change unrelated state when opening sidebar", () => {
		const previousState = {
			sidebarOpen: false,
		};

		const nextState = reducer(previousState, openSidebar());

		expect(nextState).toEqual({
			sidebarOpen: true,
		});
	});

	it("does not change unrelated state when closing sidebar", () => {
		const previousState = {
			sidebarOpen: true,
		};

		const nextState = reducer(previousState, closeSidebar());

		expect(nextState).toEqual({
			sidebarOpen: false,
		});
	});
});
