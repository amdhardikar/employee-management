import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

import useEmployeeEdit from "../../hooks/useEmployeeEdit";

import { employeeApi } from "../../api/employeeApi";
import { departmentApi } from "../../api/departmentApi";
import { designationApi } from "../../api/designationApi";
import { validateEmployee } from "../../utils/employeeValidation";

vi.mock("../../api/employeeApi", () => ({
	employeeApi: {
		getById: vi.fn(),
	},
}));

vi.mock("../../api/departmentApi", () => ({
	departmentApi: {
		getAll: vi.fn(),
	},
}));

vi.mock("../../api/designationApi", () => ({
	designationApi: {
		getByDepartment: vi.fn(),
	},
}));

vi.mock("../../utils/employeeValidation", () => ({
	validateEmployee: vi.fn(),
}));

const employeeMock = {
	id: "e53a7bcc-e9f3-4e47-b575-8269006472ec",
	employeeId: "EMP101",
	email: "test@test.com",
	personalInfo: {
		firstName: "Aamod",
		lastName: "Hardikar",
	},
	employment: {
		departmentId: "DEPT003",
		designationId: "DESG013",
	},
};

const departmentsMock = [
	{
		departmentId: "DEPT003",
		name: "Finance",
	},
];

const designationsMock = [
	{
		designationId: "DESG013",
		name: "Accountant",
	},
];

describe("useEmployeeEdit", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		validateEmployee.mockReturnValue({});

		employeeApi.getById.mockResolvedValue(employeeMock);
		departmentApi.getAll.mockResolvedValue(departmentsMock);
		designationApi.getByDepartment.mockResolvedValue(designationsMock);
	});

	it("loads employee and department data", async () => {
		const { result } = renderHook(() => useEmployeeEdit("e53a7bcc-e9f3-4e47-b575-8269006472ec"));

		expect(result.current.loading).toBe(true);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.employee).toEqual(employeeMock);
		expect(result.current.departments).toEqual(departmentsMock);

		expect(employeeApi.getById).toHaveBeenCalledWith("e53a7bcc-e9f3-4e47-b575-8269006472ec");
	});

	it("loads designations when department exists", async () => {
		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => {
			expect(result.current.designations.length).toBe(1);
		});

		expect(designationApi.getByDepartment).toHaveBeenCalledWith("DEPT003");
	});

	it("updates root field", async () => {
		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => {
			expect(result.current.employee).not.toBeNull();
		});

		act(() => {
			result.current.updateRootField("email", "new@test.com");
		});

		expect(result.current.employee.email).toBe("new@test.com");
	});

	it("updates nested field", async () => {
		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => {
			expect(result.current.employee).not.toBeNull();
		});

		act(() => {
			result.current.updateNestedField("personalInfo", "firstName", "Rahul");
		});

		expect(result.current.employee.personalInfo.firstName).toBe("Rahul");
	});

	it("updates deep field", async () => {
		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => {
			expect(result.current.employee).not.toBeNull();
		});

		act(() => {
			result.current.updateDeepField("employment", "department", "name", "HR");
		});

		expect(result.current.employee.employment.department.name).toBe("HR");
	});

	it("changes department and resets designation", async () => {
		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => {
			expect(result.current.employee).not.toBeNull();
		});

		act(() => {
			result.current.handleDepartmentChange({
				target: {
					value: "DEPT002",
				},
			});
		});

		expect(result.current.employee.employment.departmentId).toBe("DEPT002");

		expect(result.current.employee.employment.designationId).toBe("");
	});

	it("changes designation", async () => {
		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => {
			expect(result.current.employee).not.toBeNull();
		});

		act(() => {
			result.current.handleDesignationChange({
				target: {
					value: "DESG999",
				},
			});
		});

		expect(result.current.employee.employment.designationId).toBe("DESG999");
	});

	it("touches field", async () => {
		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => {
			expect(result.current.employee).not.toBeNull();
		});

		act(() => {
			result.current.touchField("email");
		});

		expect(result.current.touched.email).toBe(true);
	});

	it("validates employee", async () => {
		validateEmployee.mockReturnValue({
			email: "Invalid email",
		});

		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => {
			expect(result.current.employee).not.toBeNull();
		});

		let errors;

		act(() => {
			errors = result.current.validate();
		});

		expect(errors).toEqual({
			email: "Invalid email",
		});

		expect(result.current.errors.email).toBe("Invalid email");
	});
});
