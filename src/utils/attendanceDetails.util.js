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
