import { describe, it, expect, vi, beforeEach } from "vitest";

import { designationApi } from "../../api/designationApi";

describe("designationApi", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("fetches designations by department successfully", async () => {
		const designations = [
			{
				id: 1,
				name: "Frontend Developer",
			},
		];

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(designations),
		});

		const result = await designationApi.getByDepartment("D001");

		expect(fetch).toHaveBeenCalledWith("http://localhost:5000/designations?departmentId=D001");

		expect(result).toEqual(designations);
	});

	it("throws error when fetching designations fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(designationApi.getByDepartment("D001")).rejects.toThrow("Failed to load designations");
	});
});
