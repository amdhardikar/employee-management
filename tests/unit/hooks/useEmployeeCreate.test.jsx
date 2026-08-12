import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import useEmployeeCreate from "../../../src/hooks/useEmployeeCreate";

import { validateEmployee } from "../../../src/utils/employeeValidation";
import { EMPLOYEE_DEFAULT_VALUES } from "../../../src/constants/EMSconstants";

const { referenceState } = vi.hoisted(() => ({
	referenceState: { error: null },
}));

vi.mock("../../../src/hooks/useDepartments", () => ({
	default: () => ({
		departments: [{ departmentId: "DEPT001", name: "Engineering" }],
		loading: false,
		error: referenceState.error,
	}),
}));

vi.mock("../../../src/hooks/useDesignations", () => ({
	default: (departmentId) => ({
		designations: departmentId ? [{ designationId: "DESG001", name: "Developer" }] : [],
		loading: false,
		error: null,
	}),
}));

vi.mock("../../../src/utils/employeeValidation", () => ({
	validateEmployee: vi.fn(),
}));

describe("useEmployeeCreate", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		referenceState.error = null;
		validateEmployee.mockReturnValue({});
	});

	it("initializes with default employee values", async () => {
		const { result } = renderHook(() => useEmployeeCreate());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.employee).toEqual(EMPLOYEE_DEFAULT_VALUES);
		expect(result.current.departments).toHaveLength(1);
	});

	it("loads departments on mount", async () => {
		const { result } = renderHook(() => useEmployeeCreate());

		await waitFor(() => {
			expect(result.current.departments).toEqual([
				{
					departmentId: "DEPT001",
					name: "Engineering",
				},
			]);
		});

	});

	it("loads designations when department exists", async () => {
		const { result } = renderHook(() => useEmployeeCreate());

		act(() => {
			result.current.handleDepartmentChange({
				target: {
					value: "DEPT001",
				},
			});
		});

		await waitFor(() => expect(result.current.designations).toHaveLength(1));

		expect(result.current.employee.employment.departmentId).toBe("DEPT001");
		expect(result.current.employee.employment.designationId).toBe("");
	});

	it("updates root field", () => {
		const { result } = renderHook(() => useEmployeeCreate());

		act(() => {
			result.current.updateRootField("email", "test@mail.com");
		});

		expect(result.current.employee.email).toBe("test@mail.com");
		expect(validateEmployee).toHaveBeenCalled();
	});

	it("updates nested field", () => {
		const { result } = renderHook(() => useEmployeeCreate());

		act(() => {
			result.current.updateNestedField("personalInfo", "firstName", "Rahul");
		});

		expect(result.current.employee.personalInfo.firstName).toBe("Rahul");
	});

	it("updates deep field", () => {
		const { result } = renderHook(() => useEmployeeCreate());

		act(() => {
			result.current.updateDeepField("address", "currentAddress", "city", "Pune");
		});

		expect(result.current.employee.address.currentAddress.city).toBe("Pune");
	});

	it("updates designation", () => {
		const { result } = renderHook(() => useEmployeeCreate());

		act(() => {
			result.current.handleDesignationChange({
				target: {
					value: "DESG001",
				},
			});
		});

		expect(result.current.employee.employment.designationId).toBe("DESG001");
	});

	it("marks field as touched", () => {
		const { result } = renderHook(() => useEmployeeCreate());

		act(() => {
			result.current.touchField("email");
		});

		expect(result.current.touched.email).toBe(true);
	});

	it("returns validation errors", () => {
		validateEmployee.mockReturnValue({
			email: "Email required",
		});

		const { result } = renderHook(() => useEmployeeCreate());

		let errors;

		act(() => {
			errors = result.current.validate();
		});

		expect(errors).toEqual({
			email: "Email required",
		});

		expect(result.current.errors.email).toBe("Email required");
	});

	it("sets form validity correctly", () => {
		validateEmployee.mockReturnValue({});

		const { result } = renderHook(() => useEmployeeCreate());

		expect(result.current.isFormValid).toBe(true);

		validateEmployee.mockReturnValue({
			email: "Invalid",
		});

		act(() => {
			result.current.updateRootField("email", "wrong");
		});

		expect(result.current.isFormValid).toBe(false);
	});

	it("stops loading when department lookup fails", async () => {
		const error = new Error("Lookup unavailable");
		referenceState.error = error;

		const { result } = renderHook(() => useEmployeeCreate());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.error).toBe(error);
	});

	it("creates missing nested and deeply nested sections while updating", () => {
		const { result } = renderHook(() => useEmployeeCreate());
		act(() => result.current.setEmployee({}));
		act(() => result.current.updateNestedField("personalInfo", "firstName", "Rahul"));
		expect(result.current.employee.personalInfo.firstName).toBe("Rahul");

		act(() => result.current.setEmployee({ address: {} }));
		act(() => result.current.updateDeepField("address", "currentAddress", "city", "Pune"));
		expect(result.current.employee.address.currentAddress.city).toBe("Pune");

		act(() => result.current.setEmployee({}));
		act(() => result.current.updateDeepField("address", "currentAddress", "city", "Mumbai"));
		expect(result.current.employee.address.currentAddress.city).toBe("Mumbai");
	});
});
