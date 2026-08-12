import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

import useEmployeeEdit from "../../../src/hooks/useEmployeeEdit";

import { employeeApi } from "../../../src/api/employeeApi";
import { validateEmployee } from "../../../src/utils/employeeValidation";

vi.mock("../../../src/api/employeeApi", () => ({
	employeeApi: {
		getById: vi.fn(),
	},
}));

const { referenceState } = vi.hoisted(() => ({ referenceState: { error: null } }));

vi.mock("../../../src/hooks/useDepartments", () => ({
	default: () => ({ departments: departmentsMock, loading: false, error: null }),
}));

vi.mock("../../../src/hooks/useDesignations", () => ({
	default: (departmentId) => ({
		designations: departmentId && !referenceState.error ? designationsMock : [],
		loading: false,
		error: referenceState.error,
	}),
}));

vi.mock("../../../src/utils/employeeValidation", () => ({
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
		referenceState.error = null;
	});

	it("loads employee and department data", async () => {
		const { result } = renderHook(() => useEmployeeEdit("e53a7bcc-e9f3-4e47-b575-8269006472ec"));

		expect(result.current.loading).toBe(true);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.employee).toEqual({
			...employeeMock,
			personalInfo: { ...employeeMock.personalInfo, phone: "", alternatePhone: "" },
			emergencyContact: { phone: "" },
		});
		expect(result.current.departments).toEqual(departmentsMock);

		expect(employeeApi.getById).toHaveBeenCalledWith("e53a7bcc-e9f3-4e47-b575-8269006472ec");
	});

	it("loads designations when department exists", async () => {
		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => {
			expect(result.current.designations.length).toBe(1);
		});

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

	it("stops loading when employee initialization fails", async () => {
		const error = new Error("Employee unavailable");
		employeeApi.getById.mockRejectedValue(error);

		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.employee).toBeNull();
		expect(result.current.error).toBe(error);
	});

	it("handles designation lookup failure", async () => {
		const error = new Error("Designations unavailable");
		referenceState.error = error;

		const { result } = renderHook(() => useEmployeeEdit("EMP101"));

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.designations).toEqual([]);
		expect(result.current.error).toBe(error);
	});

	it("handles a missing employee response", async () => {
		employeeApi.getById.mockResolvedValue(null);
		const { result } = renderHook(() => useEmployeeEdit("MISSING"));
		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.employee).toBeNull();
		expect(result.current.isFormValid).toBe(false);
	});

	it("creates missing nested sections and tolerates undefined validation output", async () => {
		validateEmployee.mockReturnValue(undefined);
		const { result } = renderHook(() => useEmployeeEdit("EMP101"));
		await waitFor(() => expect(result.current.employee).not.toBeNull());

		act(() => result.current.setEmployee({}));
		await waitFor(() => expect(result.current.employee).toEqual({}));
		act(() => result.current.updateNestedField("personalInfo", "firstName", "Rahul"));
		expect(result.current.employee.personalInfo.firstName).toBe("Rahul");

		act(() => result.current.setEmployee({ employment: {} }));
		await waitFor(() => expect(result.current.employee).toEqual({ employment: {} }));
		act(() => result.current.updateDeepField("employment", "manager", "name", "Manager"));
		expect(result.current.employee.employment.manager.name).toBe("Manager");
		let validationResult;
		act(() => {
			validationResult = result.current.validate();
		});
		expect(validationResult).toEqual({});
	});
});
