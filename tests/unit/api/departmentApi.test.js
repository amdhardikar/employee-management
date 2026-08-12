import { describe, it, expect, vi, beforeEach } from "vitest";

import { departmentApi } from "../../../src/api/departmentApi";

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

	it("gets a paginated department search", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			headers: new Headers({ "X-Total-Count": "12" }),
			json: vi.fn().mockResolvedValue([{ departmentId: "D001", name: "Engineering" }]),
		});

		const result = await departmentApi.getDepartments({
			page: 2,
			pageSize: 5,
			search: " Engineering ",
			sort: "name",
			order: "asc",
		});

		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining("search=Engineering"),
			expect.any(Object),
		);
		expect(fetch).toHaveBeenCalledWith(expect.stringContaining("_page=2"), expect.any(Object));
		expect(result).toEqual({
			data: [{ departmentId: "D001", name: "Engineering" }],
			page: 2,
			pages: 3,
			items: 12,
		});
	});

	it("reports paginated department HTTP and network failures", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });
		await expect(departmentApi.getDepartments()).rejects.toThrow("Failed to fetch departments by filters");
		globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
		await expect(departmentApi.getDepartments()).rejects.toThrow("Unable to connect to server");
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

	it("creates and removes a department", async () => {
		const body = { name: "Quality" };
		globalThis.fetch = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ department: body }) })
			.mockResolvedValueOnce({ ok: true });

		await expect(departmentApi.createDepartment(body)).resolves.toEqual({ department: body });
		expect(fetch).toHaveBeenNthCalledWith(1, "http://localhost:5000/departments", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		await expect(departmentApi.removeDepartment("D001")).resolves.toBe(true);
	});

	it("reports create and remove failures", async () => {
		globalThis.fetch = vi
			.fn()
			.mockResolvedValueOnce({ ok: false, json: vi.fn().mockResolvedValue({ error: "Create rejected" }) })
			.mockResolvedValueOnce({ ok: false });

		await expect(departmentApi.createDepartment({})).rejects.toThrow("Create rejected");
		await expect(departmentApi.removeDepartment("D001")).rejects.toThrow("Failed to delete department");
	});

	it("translates network failures for every operation", async () => {
		for (const operation of [
			() => departmentApi.getAll(),
			() => departmentApi.getById("D001"),
			() => departmentApi.updateDepartment("D001", {}),
			() => departmentApi.createDepartment({}),
			() => departmentApi.removeDepartment("D001"),
		]) {
			globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
			await expect(operation()).rejects.toThrow("Unable to connect to server. Please try again later.");
		}
	});
});
