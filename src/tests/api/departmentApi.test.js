import { describe, it, expect, vi, beforeEach } from "vitest";

import { departmentApi } from "../../api/departmentApi";

describe("departmentApi", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("fetches all departments successfully", async () => {
		const mockDepartments = [
			{
				departmentId: "D001",
				name: "Engineering",
			},
		];

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(mockDepartments),
		});

		const result = await departmentApi.getAll();

		expect(fetch).toHaveBeenCalledWith("http://localhost:5000/departments", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(result).toEqual(mockDepartments);
	});

	it("throws error when getAll fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(departmentApi.getAll()).rejects.toThrow("Failed to load departments");
	});

	it("fetches department by id successfully", async () => {
		const mockDepartment = [
			{
				departmentId: "D001",
				name: "Engineering",
			},
		];

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(mockDepartment),
		});

		const result = await departmentApi.getById("D001");

		expect(fetch).toHaveBeenCalledWith("http://localhost:5000/departments?departmentId=D001", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(result).toEqual(mockDepartment[0]);
	});

	it("throws error when getById fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(departmentApi.getById("D001")).rejects.toThrow("Failed to load department by id");
	});

	it("updates department successfully", async () => {
		const updatedDepartment = {
			departmentId: "D001",
			name: "Updated Engineering",
		};

		const body = {
			name: "Updated Engineering",
		};

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(updatedDepartment),
		});

		const result = await departmentApi.updateDepartment("D001", body);

		expect(fetch).toHaveBeenCalledWith("http://localhost:5000/departments/D001", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		expect(result).toEqual(updatedDepartment);
	});

	it("throws default error when update fails without error message", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
			json: vi.fn().mockResolvedValue({}),
		});

		await expect(departmentApi.updateDepartment("D001", {})).rejects.toThrow("Failed to update department");
	});

	it("throws api error message when update fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
			json: vi.fn().mockResolvedValue({
				error: "Department already exists",
			}),
		});

		await expect(departmentApi.updateDepartment("D001", {})).rejects.toThrow("Department already exists");
	});
});
