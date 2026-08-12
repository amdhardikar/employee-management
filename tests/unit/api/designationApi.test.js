import { describe, it, expect, vi, beforeEach } from "vitest";

import { designationApi } from "../../../src/api/designationApi";

describe("designationApi", () => {
	it("fetches all designations", async () => {
		const rows = [{ designationId: "D1", departmentId: "DEP1" }];
		globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(rows) });
		await expect(designationApi.getAll()).resolves.toEqual(rows);
		expect(fetch).toHaveBeenCalledWith("http://localhost:5000/designations", undefined);
	});

	it("reports all-designation HTTP and network failures", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });
		await expect(designationApi.getAll()).rejects.toThrow("Failed to load designations");
		globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
		await expect(designationApi.getAll()).rejects.toThrow("Unable to connect to server");
	});
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
