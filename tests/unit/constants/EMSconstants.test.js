import { describe, it, expect } from "vitest";

import {
    STATUS_COLORS,
    ATTENDANCE_STATUS_COLORS,
    ATTENDANCE_PERCENTAGE_COLORS,
    PAYROLL_STATUS_COLORS,
    EMPLOYEE_DEFAULT_VALUES,
} from "../../../src/constants/EMSconstants";

describe("EMS constants", () => {
    it("contains employee status colors", () => {
        expect(STATUS_COLORS).toEqual({
            Active: "bg-emerald-100 text-emerald-700",
            Resigned: "bg-red-100 text-red-700",
            OnLeave: "bg-amber-100 text-amber-700",
            Probation: "bg-blue-100 text-blue-700",
        });
    });

    it("contains attendance status and percentage colors", () => {
        expect(Object.keys(ATTENDANCE_STATUS_COLORS)).toEqual(["Present", "Absent", "Leave"]);
        expect(Object.keys(ATTENDANCE_PERCENTAGE_COLORS)).toEqual(["EXCELLENT", "AVERAGE", "POOR"]);
    });

    it("contains payroll status colors", () => {
        expect(Object.keys(PAYROLL_STATUS_COLORS)).toEqual(["Paid", "Processing", "Pending"]);
    });

    it("provides a complete default employee form shape", () => {
        expect(EMPLOYEE_DEFAULT_VALUES).toMatchObject({
            id: "",
            employeeId: "",
            employeeCode: "",
            fullName: "",
            email: "",
            personalInfo: expect.any(Object),
            address: expect.any(Object),
            employment: expect.objectContaining({
                status: "Active",
                departmentId: "",
                designationId: "",
            }),
            bankDetails: expect.any(Object),
            emergencyContact: expect.any(Object),
        });

        expect(EMPLOYEE_DEFAULT_VALUES.address).toHaveProperty("currentAddress");
        expect(EMPLOYEE_DEFAULT_VALUES.address).toHaveProperty("permanentAddress");
        expect(EMPLOYEE_DEFAULT_VALUES.employment).toHaveProperty("lead");
        expect(EMPLOYEE_DEFAULT_VALUES.employment).toHaveProperty("manager");
        expect(EMPLOYEE_DEFAULT_VALUES.employment).toHaveProperty("hr");
    });
});
