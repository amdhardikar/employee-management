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
   console.log(months)
   return months
};

export const filterAttendanceDetails = (attendance, search, year, month) => {
   console.log({
		selectedMonth: month,
		selectedMonthType: typeof month,
	});

	return attendance.filter((item) => {
		const matchesSearch = item.monthName
			.toLowerCase()
			.includes(search.toLowerCase());

		const matchesYear = year === "all" || item.year === Number(year);

		const matchesMonth = month === "all" || item.month === Number(month);

		return matchesSearch && matchesYear && matchesMonth;
	});
};
