import { describe, it, expect, vi, beforeEach } from "vitest";

import reducer, { fetchDashboard, clearDashboard, refreshDashboard } from "../../store/dashboardSlice";

import { dashboardApi } from "../../api/dashboardApi";

vi.mock("../../api/dashboardApi", () => ({
	dashboardApi: {
		getDashboard: vi.fn(),
	},
}));

describe("dashboardSlice", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns initial state", () => {
		const state = reducer(undefined, {});

		expect(state).toEqual({
			data: {
				stats: {},
				recentEmployees: [],
				departmentStats: [],
				employeeStatus: {},
				maxDeptCount: 0,
			},
			loading: false,
			error: null,
			lastFetched: null,
		});
	});

	it("clears dashboard data", () => {
		const modifiedState = {
			data: {
				stats: {
					totalEmployees: 100,
				},
				recentEmployees: ["John"],
				departmentStats: ["IT"],
				employeeStatus: {
					active: 90,
				},
				maxDeptCount: 20,
			},
			loading: false,
			error: "Old error",
			lastFetched: 12345,
		};

		const nextState = reducer(modifiedState, clearDashboard());

		expect(nextState.data).toEqual({
			stats: {},
			recentEmployees: [],
			departmentStats: [],
			employeeStatus: {},
			maxDeptCount: 0,
		});

		expect(nextState.error).toBeNull();
		expect(nextState.lastFetched).toBeNull();
	});

	it("refreshes dashboard by clearing lastFetched", () => {
		const previousState = {
			data: {},
			loading: false,
			error: null,
			lastFetched: 123456,
		};

		const nextState = reducer(previousState, refreshDashboard());

		expect(nextState.lastFetched).toBeNull();
	});

	it("handles fetchDashboard pending state", () => {
		const action = {
			type: fetchDashboard.pending.type,
		};

		const nextState = reducer(undefined, action);

		expect(nextState.loading).toBe(true);
		expect(nextState.error).toBeNull();
	});

	it("handles fetchDashboard fulfilled state", () => {
		const dashboardData = {
			stats: {
				totalEmployees: 50,
			},
			recentEmployees: [],
			departmentStats: [],
			employeeStatus: {},
			maxDeptCount: 10,
		};

		const action = {
			type: fetchDashboard.fulfilled.type,
			payload: dashboardData,
		};

		const nextState = reducer(undefined, action);

		expect(nextState.loading).toBe(false);
		expect(nextState.data).toEqual(dashboardData);
		expect(nextState.lastFetched).toEqual(expect.any(Number));
	});

	it("handles fetchDashboard rejected state", () => {
		const action = {
			type: fetchDashboard.rejected.type,
			payload: {
				message: "Failed to load dashboard",
			},
		};

		const nextState = reducer(undefined, action);

		expect(nextState.error).toEqual({
			message: "Failed to load dashboard",
		});
	});

	it("fetchDashboard thunk succeeds", async () => {
		const mockData = {
			stats: {
				totalEmployees: 20,
			},
		};

		dashboardApi.getDashboard.mockResolvedValue(mockData);

		const result = await fetchDashboard()(vi.fn(), vi.fn(), {});

		expect(result.type).toBe("dashboard/fetchDashboard/fulfilled");

		expect(result.payload).toEqual(mockData);

		expect(dashboardApi.getDashboard).toHaveBeenCalledTimes(1);
	});

	it("fetchDashboard thunk rejects on API error", async () => {
		dashboardApi.getDashboard.mockRejectedValue(new Error("Network Error"));

		const result = await fetchDashboard()(vi.fn(), vi.fn(), {});

		expect(result.type).toBe("dashboard/fetchDashboard/rejected");

		expect(result.payload).toEqual({
			message: "Network Error",
		});
	});
});
