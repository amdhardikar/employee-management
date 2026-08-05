import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import useDepartments from "../../hooks/useDepartments";
import { departmentApi } from "../../api/departmentApi";

vi.mock("../../api/departmentApi", () => ({
	departmentApi: {
		getAll: vi.fn(),
	},
}));

describe("useDepartments hook", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return empty array initially", () => {
		departmentApi.getAll.mockResolvedValue([]);

		const { result } = renderHook(() => useDepartments());

		expect(result.current).toEqual([]);
	});

	it("should fetch departments and return department names", async () => {
		departmentApi.getAll.mockResolvedValue([
			{
				departmentId: 1,
				name: "Engineering",
			},
			{
				departmentId: 2,
				name: "HR",
			},
		]);

		const { result } = renderHook(() => useDepartments());

		await waitFor(() => {
			expect(result.current).toEqual(["Engineering", "HR"]);
		});

		expect(departmentApi.getAll).toHaveBeenCalledTimes(1);
	});

	it("should handle empty API response", async () => {
		departmentApi.getAll.mockResolvedValue([]);

		const { result } = renderHook(() => useDepartments());

		await waitFor(() => {
			expect(result.current).toEqual([]);
		});

		expect(departmentApi.getAll).toHaveBeenCalled();
	});
});
