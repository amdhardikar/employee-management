import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useDesignations from "../../../src/hooks/useDesignations";
import designationReducer, { setDesignations } from "../../../src/store/designationSlice";
import { designationApi } from "../../../src/api/designationApi";

vi.mock("../../../src/api/designationApi", () => ({ designationApi: { getAll: vi.fn() } }));

const createWrapper = (store) => {
	function StoreWrapper({ children }) {
		return <Provider store={store}>{children}</Provider>;
	}
	return StoreWrapper;
};

describe("useDesignations", () => {
	beforeEach(() => vi.clearAllMocks());

	it("loads once and filters cached designations by department", async () => {
		const store = configureStore({ reducer: { designation: designationReducer } });
		designationApi.getAll.mockResolvedValue([
			{ designationId: "D1", departmentId: "DEP1" },
			{ designationId: "D2", departmentId: "DEP2" },
		]);
		const { result } = renderHook(() => useDesignations("DEP1"), { wrapper: createWrapper(store) });
		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.designations).toEqual([{ designationId: "D1", departmentId: "DEP1" }]);
		expect(designationApi.getAll).toHaveBeenCalledOnce();
	});

	it("reuses an already loaded cache", () => {
		const store = configureStore({ reducer: { designation: designationReducer } });
		act(() => store.dispatch(setDesignations([{ designationId: "D1", departmentId: "DEP1" }])));
		const { result } = renderHook(() => useDesignations("DEP1"), { wrapper: createWrapper(store) });
		expect(result.current.designations).toHaveLength(1);
		expect(designationApi.getAll).not.toHaveBeenCalled();
	});

	it("exposes lookup failures and stops loading", async () => {
		const store = configureStore({ reducer: { designation: designationReducer } });
		const error = new Error("Offline");
		designationApi.getAll.mockRejectedValue(error);
		const { result } = renderHook(() => useDesignations("DEP1"), { wrapper: createWrapper(store) });
		await waitFor(() => expect(result.current.error).toBe(error));
		expect(result.current.loading).toBe(false);
	});

	it("does not dispatch or update state after unmounting", async () => {
		const store = configureStore({ reducer: { designation: designationReducer } });
		let resolveRequest;
		designationApi.getAll.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
		const dispatchSpy = vi.spyOn(store, "dispatch");
		const { unmount } = renderHook(() => useDesignations("DEP1"), { wrapper: createWrapper(store) });
		unmount();
		resolveRequest([{ designationId: "D1", departmentId: "DEP1" }]);
		await Promise.resolve();
		expect(dispatchSpy).not.toHaveBeenCalled();
	});
});
