/**
 * @fileoverview Summarizes an employee's monthly attendance record. It totals present, absent, leave, half-day, holiday, and weekend entries for the attendance details statistics.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/utils/attendanceDetails.util
 */
/**
 * Get attendance summary.
 * @param {Object} attendance - Monthly attendance record to summarize or display.
 * @returns {*} Computed result.
 */
export const getAttendanceSummary = (attendance) => {
	const totalWorkingDays = attendance.reduce(
		(sum, item) => sum + item.workingDays,
		0,
	);

	const totalPresentDays = attendance.reduce(
		(sum, item) => sum + item.presentDays,
		0,
	);

	const totalAbsentDays = attendance.reduce(
		(sum, item) => sum + item.absentDays + item.leaveDays,
		0,
	);

	const totalLateEntries = attendance.reduce(
		(sum, item) => sum + item.lateLeaveEquivalent,
		0,
	);

	const avgAttendance =
		attendance.length > 0
			? (
					attendance.reduce(
						(sum, item) => sum + item.attendancePercentage,
						0,
					) / attendance.length
				).toFixed(1)
			: 0;

	return {
		totalWorkingDays,
		totalPresentDays,
		totalAbsentDays,
		totalLateEntries,
		avgAttendance,
	};
};
