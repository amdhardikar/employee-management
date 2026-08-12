/**
 * @fileoverview Calculates department-level employee totals. It counts all employees and derives active and inactive counts from employment status for department cards and summary views.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/utils/department.util
 */
/**
 * Get department summary.
 * @param {Object[]} employees - Employee records to display or summarize.
 * @returns {*} Computed result.
 */
export const getDepartmentSummary = (employees) => ({
	totalEmployees: employees.length,

	activeEmployees: employees.filter(
		(emp) => emp.employment.status === "Active",
	).length,

	absentEmployees: employees.filter(
		(emp) => emp.employment.status === "On Leave",
	).length,

	resignedEmployees: employees.filter(
		(emp) => emp.employment.status === "Resigned",
	).length,

	contractEmployees: employees.filter(
		(emp) => emp.employment.employeeType === "Contract",
	).length,

	permanentEmployees: employees.filter(
		(emp) =>
			emp.employment.employeeType === "Intern" ||
			emp.employment.employeeType === "Full time",
	).length,
});
