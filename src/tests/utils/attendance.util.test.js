import { describe, expect, it } from "vitest";

import { ATTENDANCE_PERCENTAGE_COLORS } from "../../constants/EMSconstants";
import { getAttendancePercentageColor } from "../../utils/attendance.util";

describe("getAttendancePercentageColor", () => {
	it("should return EXCELLENT for percentage greater than 95", () => {
		expect(getAttendancePercentageColor(98)).toBe(
			ATTENDANCE_PERCENTAGE_COLORS.EXCELLENT,
		);
	});

	it("should return EXCELLENT for percentage equal to 95", () => {
		expect(getAttendancePercentageColor(95)).toBe(
			ATTENDANCE_PERCENTAGE_COLORS.EXCELLENT,
		);
	});

	it("should return AVERAGE for percentage between 85 and 94.9", () => {
		expect(getAttendancePercentageColor(90)).toBe(
			ATTENDANCE_PERCENTAGE_COLORS.AVERAGE,
		);

		expect(getAttendancePercentageColor(94.9)).toBe(
			ATTENDANCE_PERCENTAGE_COLORS.AVERAGE,
		);
	});

	it("should return AVERAGE for percentage equal to 85", () => {
		expect(getAttendancePercentageColor(85)).toBe(
			ATTENDANCE_PERCENTAGE_COLORS.AVERAGE,
		);
	});

	it("should return POOR for percentage less than 85", () => {
		expect(getAttendancePercentageColor(84.9)).toBe(
			ATTENDANCE_PERCENTAGE_COLORS.POOR,
		);

		expect(getAttendancePercentageColor(50)).toBe(
			ATTENDANCE_PERCENTAGE_COLORS.POOR,
		);
	});

	it("should return POOR when no percentage is provided", () => {
		expect(getAttendancePercentageColor()).toBe(
			ATTENDANCE_PERCENTAGE_COLORS.POOR,
		);
	});
});
