import { describe, expect, it } from "vitest";
import { getAttendanceSummary } from "../../utils/attendanceDetails.util";

describe("getAttendanceSummary", () => {
	it("should calculate attendance summary correctly", () => {
		const attendance = [
			{
				workingDays: 22,
				presentDays: 20,
				absentDays: 1,
				leaveDays: 1,
				lateLeaveEquivalent: 2,
				attendancePercentage: 90.9,
			},
			{
				workingDays: 20,
				presentDays: 18,
				absentDays: 1,
				leaveDays: 1,
				lateLeaveEquivalent: 1,
				attendancePercentage: 90,
			},
		];

		expect(getAttendanceSummary(attendance)).toEqual({
			totalWorkingDays: 42,
			totalPresentDays: 38,
			totalAbsentDays: 4,
			totalLateEntries: 3,
			avgAttendance: "90.5",
		});
	});

	it("should return zeros for empty attendance list", () => {
		expect(getAttendanceSummary([])).toEqual({
			totalWorkingDays: 0,
			totalPresentDays: 0,
			totalAbsentDays: 0,
			totalLateEntries: 0,
			avgAttendance: 0,
		});
	});

	it("should include leave days in total absent days", () => {
		const attendance = [
			{
				workingDays: 22,
				presentDays: 18,
				absentDays: 2,
				leaveDays: 2,
				lateLeaveEquivalent: 0,
				attendancePercentage: 81.8,
			},
		];

		expect(getAttendanceSummary(attendance).totalAbsentDays).toBe(4);
	});

	it("should calculate average attendance to one decimal place", () => {
		const attendance = [
			{
				workingDays: 22,
				presentDays: 20,
				absentDays: 1,
				leaveDays: 1,
				lateLeaveEquivalent: 0,
				attendancePercentage: 90,
			},
			{
				workingDays: 22,
				presentDays: 21,
				absentDays: 1,
				leaveDays: 0,
				lateLeaveEquivalent: 0,
				attendancePercentage: 95,
			},
			{
				workingDays: 22,
				presentDays: 19,
				absentDays: 2,
				leaveDays: 1,
				lateLeaveEquivalent: 0,
				attendancePercentage: 86,
			},
		];

		expect(getAttendanceSummary(attendance).avgAttendance).toBe("90.3");
	});

	it("should handle a single attendance record", () => {
		const attendance = [
			{
				workingDays: 20,
				presentDays: 19,
				absentDays: 1,
				leaveDays: 0,
				lateLeaveEquivalent: 1,
				attendancePercentage: 95,
			},
		];

		expect(getAttendanceSummary(attendance)).toEqual({
			totalWorkingDays: 20,
			totalPresentDays: 19,
			totalAbsentDays: 1,
			totalLateEntries: 1,
			avgAttendance: "95.0",
		});
	});
});
