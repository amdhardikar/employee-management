import { beforeEach, describe, expect, it, vi } from "vitest";

import { attendanceApi } from "../../../src/api/attendanceApi";
import { dashboardApi } from "../../../src/api/dashboardApi";
import { designationApi } from "../../../src/api/designationApi";
import { employeeApi } from "../../../src/api/employeeApi";
import { payrollApi } from "../../../src/api/payrollApi";

describe("API network-failure normalization", () => {
	beforeEach(() => {
		globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
	});

	it.each([
		["all employees", () => employeeApi.getAll()],
		["filtered employees", () => employeeApi.getEmployees()],
		["managers", () => employeeApi.getManagers()],
		["employee by ID", () => employeeApi.getById("EMP001")],
		["employees by department", () => employeeApi.getByDepartment("D001")],
		["authentication lookup", () => employeeApi.getByEmailAndEmployeeCode("a@b.com", "E001")],
		["employee creation", () => employeeApi.createEmployee({})],
		["employee update", () => employeeApi.updateEmployee("1", {})],
		["employee deletion", () => employeeApi.removeEmployee("1")],
		["attendance", () => attendanceApi.getByEmployeeId("EMP001")],
		["dashboard", () => dashboardApi.getDashboard()],
		["designations", () => designationApi.getByDepartment("D001")],
		["payroll", () => payrollApi.getByEmployeeId("EMP001")],
	])("converts a failed %s request into the shared connection error", async (_label, operation) => {
		await expect(operation()).rejects.toThrow("Unable to connect to server. Please try again later.");
	});
});
