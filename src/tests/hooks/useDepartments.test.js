import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import useDepartments from "../../hooks/useDepartments";
import { departmentApi } from "../../api/departmentApi";
import { setDepartments } from "../../store/departmentSlice";

vi.mock("../../api/departmentApi", () => ({
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

vi.mock("../../store/departmentSlice", () => ({
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

	it("should return empty array initially", () => {
		departmentApi.getAll.mockResolvedValue([]);

		const { result } = renderHook(() => useDepartments());

		expect(result.current.departments).toEqual([]);
		expect(result.current.error).toBeNull();
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
});
