/**
 * @fileoverview Maps an attendance percentage to the configured visual status color. Thresholds distinguish strong, moderate, and low attendance while safely handling a missing percentage.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/utils/attendance.util
 */
import { ATTENDANCE_PERCENTAGE_COLORS } from "../constants/EMSconstants";

/**
 * Get attendance percentage color.
 * @param {number} percentage - Attendance percentage used to select a status color.
 * @returns {*} Computed result.
 */
export const getAttendancePercentageColor = (percentage = 0) => {
	if (percentage >= 95) {
		return ATTENDANCE_PERCENTAGE_COLORS.EXCELLENT;
	}

	if (percentage >= 85) {
		return ATTENDANCE_PERCENTAGE_COLORS.AVERAGE;
	}

	return ATTENDANCE_PERCENTAGE_COLORS.POOR;
};
