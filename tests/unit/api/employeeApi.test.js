import { describe, it, expect, vi, beforeEach } from "vitest";

import { employeeApi } from "../../../src/api/employeeApi";

describe("employeeApi", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("gets all employees successfully", async () => {
		const employees = [{ id: 1, name: "John" }];

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(employees),
		});

		const result = await employeeApi.getAll();

		expect(fetch).toHaveBeenCalledWith("http://localhost:5000/employees", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(result).toEqual(employees);
	});

	it("throws error when getAll fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(employeeApi.getAll()).rejects.toThrow("Failed to load employees");
	});

	it("gets employees with default filters", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			headers: {
				get: vi.fn().mockReturnValue("25"),
			},
			json: vi.fn().mockResolvedValue([{ id: 1 }]),
		});

		const result = await employeeApi.getEmployees();

		expect(fetch).toHaveBeenCalledWith(expect.stringContaining("_page=1"), expect.any(Object));

		expect(result).toEqual({
			data: [{ id: 1 }],
			page: 1,
			pages: 3,
			items: 25,
		});
	});

	it("gets employees with search department and status filters", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			headers: {
				get: vi.fn().mockReturnValue("10"),
			},
			json: vi.fn().mockResolvedValue([]),
		});

		await employeeApi.getEmployees({
			page: 2,
			pageSize: 5,
			search: " John ",
			department: "IT",
			status: "Active",
			sort: "name",
			order: "asc",
		});

		expect(fetch).toHaveBeenCalledWith(expect.stringContaining("_page=2"), expect.any(Object));

		expect(fetch).toHaveBeenCalledWith(expect.stringContaining("search=John"), expect.any(Object));

		expect(fetch).toHaveBeenCalledWith(expect.stringContaining("employment.departmentName=IT"), expect.any(Object));

		expect(fetch).toHaveBeenCalledWith(expect.stringContaining("employment.status=Active"), expect.any(Object));
	});

	it("throws error when getEmployees fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(employeeApi.getEmployees()).rejects.toThrow("Failed to fetch employees by filters");
	});

	it("gets employee managers successfully", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue([
				{
					id: 1,
					personalInfo: {
						fullName: "Manager One",
					},
				},
			]),
		});

		const result = await employeeApi.getManagers();

		expect(result).toEqual([
			{
				id: 1,
				name: "Manager One",
			},
		]);

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:5000/employees/?employment.manager.id=null",
			expect.any(Object),
		);
	});

	it("throws error when getManagers fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(employeeApi.getManagers()).rejects.toThrow("Failed to load employee managers");
	});

	it("gets employee by id successfully", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue([
				{
					employeeId: "EMP001",
				},
			]),
		});

		const result = await employeeApi.getById("EMP001");

		expect(result).toEqual({
			employeeId: "EMP001",
		});

		expect(fetch).toHaveBeenCalledWith("http://localhost:5000/employees?employeeId=EMP001", expect.any(Object));
	});

	it("throws error when getById fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(employeeApi.getById("EMP001")).rejects.toThrow("Failed to load employee by id");
	});

	it("gets employees by department", async () => {
		const employees = [{ id: 1 }];

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(employees),
		});

		const result = await employeeApi.getByDepartment("D001");

		expect(result).toEqual(employees);

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:5000/employees?employment.departmentId=D001",
			expect.any(Object),
		);
	});

	it("throws error when getByDepartment fails", async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
			}),
		);

		await expect(employeeApi.getByDepartment("DEP001")).rejects.toThrow("Failed to load department wise employees");
	});

	it("authenticates employee by email and code", async () => {
		const response = {
			ok: true,
		};

		globalThis.fetch = vi.fn().mockResolvedValue(response);

		const result = await employeeApi.getByEmailAndEmployeeCode("john@test.com", "EMP001");

		expect(result).toBe(response);

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:5000/employees?email=john@test.com&employeeCode=EMP001",
			expect.any(Object),
		);
	});

	it("throws error when authentication fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(employeeApi.getByEmailAndEmployeeCode("john@test.com", "EMP001")).rejects.toThrow(
			"Failed to authenticate user",
		);
	});

	it("creates employee successfully", async () => {
		const employee = {
			name: "John",
		};

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(employee),
		});

		const result = await employeeApi.createEmployee(employee);

		expect(result).toEqual(employee);

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:5000/employees",
			expect.objectContaining({
				method: "POST",
			}),
		);
   });
   
   it("throws error when createEmployee fails", async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
			}),
		);

		await expect(
			employeeApi.createEmployee({
				name: "Test Employee",
			}),
		).rejects.toThrow("Failed to create employee");
   });

	it("updates employee successfully", async () => {
		const employee = {
			name: "Updated",
		};

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(employee),
		});

		const result = await employeeApi.updateEmployee(1, employee);

		expect(result).toEqual(employee);

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:5000/employees/1",
			expect.objectContaining({
				method: "PATCH",
			}),
		);
	});

	it("throws error when update fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(employeeApi.updateEmployee(1, {})).rejects.toThrow("Failed to update employee");
	});

	it("removes employee successfully", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
		});

		const result = await employeeApi.removeEmployee(1);

		expect(result).toBe(true);

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:5000/employees/1",
			expect.objectContaining({
				method: "DELETE",
			}),
		);
	});

	it("throws error when removeEmployee fails", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		await expect(employeeApi.removeEmployee(1)).rejects.toThrow("Failed to delete employee");
	});
});
