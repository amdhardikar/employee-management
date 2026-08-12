import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import useDepartments from "../../../src/hooks/useDepartments";
import { departmentApi } from "../../../src/api/departmentApi";
import { setDepartments } from "../../../src/store/departmentSlice";

vi.mock("../../../src/api/departmentApi", () => ({
	departmentApi: {
		getAll: vi.fn(),
	},
}));

const mockDispatch = vi.fn();

const { mockUseSelector } = vi.hoisted(() => ({
	mockUseSelector: vi.fn(),
}));

vi.mock("react-redux", () => ({
	useDispatch: () => mockDispatch,
	useSelector: mockUseSelector,
}));

vi.mock("../../../src/store/departmentSlice", () => ({
	setDepartments: vi.fn((payload) => ({
		type: "department/setDepartments",
		payload,
	})),
}));

describe("useDepartments hook", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		mockUseSelector.mockImplementation((selector) =>
			selector({
				department: {
					departments: [],
					loaded: false,
				},
			}),
		);
	});

	it("should return an empty array after an empty response", async () => {
		departmentApi.getAll.mockResolvedValue([]);

		const { result } = renderHook(() => useDepartments());

		expect(result.current.departments).toEqual([]);
		expect(result.current.error).toBeNull();
		await waitFor(() => expect(departmentApi.getAll).toHaveBeenCalled());
	});

	it("should fetch departments and dispatch them", async () => {
		const departments = [
			{
				departmentId: 1,
				name: "Engineering",
			},
			{
				departmentId: 2,
				name: "HR",
			},
		];

		departmentApi.getAll.mockResolvedValue(departments);

		renderHook(() => useDepartments());

		await waitFor(() => {
			expect(departmentApi.getAll).toHaveBeenCalledTimes(1);
		});

		expect(setDepartments).toHaveBeenCalledWith(departments);

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "department/setDepartments",
			payload: departments,
		});
	});

	it("should handle empty API response", async () => {
		departmentApi.getAll.mockResolvedValue([]);

		renderHook(() => useDepartments());

		await waitFor(() => {
			expect(departmentApi.getAll).toHaveBeenCalledTimes(1);
		});

		expect(setDepartments).toHaveBeenCalledWith([]);

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "department/setDepartments",
			payload: [],
		});
	});

	it("exposes an API error and stops loading", async () => {
		const error = new Error("Departments unavailable");
		departmentApi.getAll.mockRejectedValue(error);

		const { result } = renderHook(() => useDepartments());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.error).toEqual({ message: "Departments unavailable" });
	});

	it("returns full cached records and skips the API when already loaded", () => {
		const departments = [{ departmentId: "DEP1", name: "Engineering" }];
		mockUseSelector.mockImplementation((selector) =>
			selector({ department: { departments, loaded: true } }),
		);

		const { result } = renderHook(() => useDepartments(false));

		expect(result.current.departments).toEqual(departments);
		expect(departmentApi.getAll).not.toHaveBeenCalled();
	});

	it("returns department names from cached records", () => {
		mockUseSelector.mockImplementation((selector) =>
			selector({ department: { departments: [{ name: "Engineering" }], loaded: true } }),
		);
		const { result } = renderHook(() => useDepartments());
		expect(result.current.departments).toEqual(["Engineering"]);
	});

	it("uses a fallback message for errors without a message", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		departmentApi.getAll.mockRejectedValue({});
		const { result } = renderHook(() => useDepartments());
		await waitFor(() => expect(result.current.error).toEqual({ message: "Unable to load departments" }));
		consoleSpy.mockRestore();
	});

	it("does not update state or dispatch after unmounting", async () => {
		let resolveRequest;
		departmentApi.getAll.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
		const { unmount } = renderHook(() => useDepartments());
		unmount();
		resolveRequest([{ name: "Late" }]);
		await Promise.resolve();
		expect(mockDispatch).not.toHaveBeenCalled();
	});
});
