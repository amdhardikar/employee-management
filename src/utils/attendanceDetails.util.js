import { attendanceApi } from "../api/attendanceApi";
import { employeeApi } from "../api/employeeApi";

export const loadEmployeeDetails = async (employeeId) => {
	return await employeeApi.getById(employeeId);
};

export const loadAttendanceDetails = async (employeeId) => {
	return await attendanceApi.getByEmployeeId(employeeId);
};

export const getAttendanceYears = (attendance) => {
	return [...new Set(attendance.map((item) => item.year))].sort(
		(a, b) => b - a,
	);
};

export const getAttendanceMonths = (attendance, selectedYear) => {
	const filtered =
		selectedYear === "all"
			? attendance
			: attendance.filter((item) => item.year === Number(selectedYear));

	const months = [
		...new Map(
			filtered.map((item) => [
				item.month,
				{
					value: item.month,
					label: item.monthName,
				},
			]),
		).values(),
	].sort((a, b) => a.value - b.value);
	return months;
};

export const filterAttendanceDetails = (attendance, search, year, month) => {
	return attendance.filter((item) => {
		const matchesSearch = item.monthName
			.toLowerCase()
			.includes(search.toLowerCase());

		const matchesYear = year === "all" || item.year === Number(year);

		const matchesMonth = month === "all" || item.month === Number(month);

		return matchesSearch && matchesYear && matchesMonth;
	});
};

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
