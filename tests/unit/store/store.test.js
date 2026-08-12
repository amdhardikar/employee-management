import { describe, it, expect } from "vitest";

import { store } from "../../../src/store/store";

describe("Redux store", () => {
    it("registers all application reducers", () => {
        expect(Object.keys(store.getState())).toEqual([
            "ui",
            "auth",
            "dashboard",
            "filters",
            "department",
			"designation",
        ]);
    });

    it("initializes each reducer with its expected state", () => {
        const state = store.getState();

        expect(state.ui).toBeDefined();
        expect(state.auth).toMatchObject({
            user: null,
            loading: false,
            error: null,
        });
        expect(state.dashboard).toMatchObject({
            loading: false,
            error: null,
            data: expect.any(Object),
        });
        expect(state.filters).toBeDefined();
        expect(state.department).toMatchObject({
            departments: [],
            loaded: false,
        });
		expect(state.designation).toMatchObject({ designations: [], loaded: false });
    });
});
