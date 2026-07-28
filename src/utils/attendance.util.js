import { ATTENDANCE_PERCENTAGE_COLORS } from "../constants/EMSconstants";

export const getAttendancePercentageColor = (percentage = 0) => {
	if (percentage >= 95) {
		return ATTENDANCE_PERCENTAGE_COLORS.EXCELLENT;
	}

	if (percentage >= 85) {
		return ATTENDANCE_PERCENTAGE_COLORS.AVERAGE;
	}

	return ATTENDANCE_PERCENTAGE_COLORS.POOR;
};
