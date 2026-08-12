import { describe, it, expect } from "vitest";
import { getDepartmentSummary } from "../../../src/utils/department.util";

describe("getDepartmentSummary", () => {
	const employees = [
		{
			employment: {
				status: "Active",
				employeeType: "Full time",
			},
		},
		{
			employment: {
				status: "Active",
				employeeType: "Contract",
			},
		},
		{
			employment: {
				status: "On Leave",
				employeeType: "Intern",
			},
		},
		{
			employment: {
				status: "Resigned",
				employeeType: "Contract",
			},
		},
	];

	it("should return correct department summary", () => {
		expect(getDepartmentSummary(employees)).toEqual({
			totalEmployees: 4,
			activeEmployees: 2,
			absentEmployees: 1,
			resignedEmployees: 1,
			contractEmployees: 2,
			permanentEmployees: 2,
		});
	});

	it("should return all zeros for empty employee list", () => {
		expect(getDepartmentSummary([])).toEqual({
			totalEmployees: 0,
			activeEmployees: 0,
			absentEmployees: 0,
			resignedEmployees: 0,
			contractEmployees: 0,
			permanentEmployees: 0,
		});
	});

	it("should count interns as permanent employees", () => {
		const employees = [
			{
				employment: {
					status: "Active",
					employeeType: "Intern",
				},
			},
		];

		expect(getDepartmentSummary(employees).permanentEmployees).toBe(1);
	});

	it("should count full time employees as permanent employees", () => {
		const employees = [
			{
				employment: {
					status: "Active",
					employeeType: "Full time",
				},
			},
		];

		expect(getDepartmentSummary(employees).permanentEmployees).toBe(1);
	});

	it("should not count contract employees as permanent employees", () => {
		const employees = [
			{
				employment: {
					status: "Active",
					employeeType: "Contract",
				},
			},
		];

		const summary = getDepartmentSummary(employees);

		expect(summary.contractEmployees).toBe(1);
		expect(summary.permanentEmployees).toBe(0);
	});
});
