import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import reducer, { login, logout } from "../../store/authSlice";

import { employeeApi } from "../../api/employeeApi";

vi.mock("../../api/employeeApi", () => ({
	employeeApi: {
		getByEmailAndEmployeeCode: vi.fn(),
	},
}));

const mockUserResponse = {
	id: 1,
	employeeId: "EMP001",
	employeeCode: "EMS-001",
	fullName: "John Doe",
	email: "john@test.com",

	employment: {
		designation: "Developer",
	},

	personalInfo: {
		profileImage: "profile.png",
	},
};

describe("authSlice", () => {
	beforeEach(() => {
		localStorage.clear();

		vi.clearAllMocks();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("returns initial state when no session exists", () => {
		const state = reducer(undefined, {});

		expect(state).toEqual({
			user: null,
			loading: false,
			error: null,
		});
	});

	it("loads stored user from localStorage", async () => {
		localStorage.setItem(
			"ems_session",
			JSON.stringify({
				token: "abc",
				fullName: "John",
			}),
		);

		vi.resetModules();

		const { default: reducer } = await import("../../store/authSlice");

		const state = reducer(undefined, {});

		expect(state.user).toEqual({
			token: "abc",
			fullName: "John",
		});
	});

	it("clears user on logout", () => {
		const previousState = {
			user: {
				name: "John",
			},
			loading: false,
			error: "Old error",
		};

		const nextState = reducer(previousState, logout());

		expect(nextState.user).toBeNull();

		expect(nextState.error).toBeNull();

		expect(localStorage.getItem("ems_session")).toBeNull();
	});

	it("handles login pending state", () => {
		const action = {
			type: login.pending.type,
		};

		const nextState = reducer(undefined, action);

		expect(nextState.loading).toBe(true);

		expect(nextState.error).toBeNull();
	});

	it("handles successful login", () => {
		const sessionData = {
			token: "mock-jwt-token-1",
			employeeId: "EMP001",
			fullName: "John Doe",
			role: "Developer",
		};

		const action = {
			type: login.fulfilled.type,
			payload: sessionData,
		};

		const nextState = reducer(undefined, action);

		expect(nextState.loading).toBe(false);

		expect(nextState.user).toEqual(sessionData);
	});

	it("handles failed login", () => {
		const action = {
			type: login.rejected.type,
			payload: "Invalid Email or Employee Code combination.",
		};

		const nextState = reducer(undefined, action);

		expect(nextState.loading).toBe(false);

		expect(nextState.error).toBe(
			"Invalid Email or Employee Code combination.",
		);
	});

	it("login thunk succeeds", async () => {
		const response = {
			json: vi.fn().mockResolvedValue([mockUserResponse]),
		};

		employeeApi.getByEmailAndEmployeeCode.mockResolvedValue(response);

		const result = await login({
			email: "john@test.com",
			employeeCode: "EMS-001",
		})(vi.fn(), vi.fn(), {});

		expect(result.type).toBe("auth/login/fulfilled");

		expect(result.payload).toEqual({
			token: "mock-jwt-token-1",

			employeeId: "EMP001",

			employeeCode: "EMS-001",

			fullName: "John Doe",

			role: "Developer",

			email: "john@test.com",

			profileImage: "profile.png",
		});

		expect(localStorage.getItem("ems_session")).not.toBeNull();
	});

	it("login thunk rejects for invalid credentials", async () => {
		const response = {
			json: vi.fn().mockResolvedValue([]),
		};

		employeeApi.getByEmailAndEmployeeCode.mockResolvedValue(response);

		const result = await login({
			email: "wrong@test.com",
			employeeCode: "BAD",
		})(vi.fn(), vi.fn(), {});

		expect(result.type).toBe("auth/login/rejected");

		expect(result.payload).toBe(
			"Invalid Email or Employee Code combination.",
		);
	});

	it("login thunk rejects on server error", async () => {
		employeeApi.getByEmailAndEmployeeCode.mockRejectedValue(
			new Error("Network error"),
		);

		const result = await login({
			email: "john@test.com",
			employeeCode: "EMS-001",
		})(vi.fn(), vi.fn(), {});

		expect(result.type).toBe("auth/login/rejected");

		expect(result.payload).toBe("Server connection error.");
	});
});
