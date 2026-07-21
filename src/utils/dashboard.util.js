import { employeeApi } from "../api/employeeApi";
import { departmentApi } from "../api/departmentApi";

export const loadDashboardData = async () => {
	const [employees, departments] = await Promise.all([
		employeeApi.getAll(),
		departmentApi.getAll(),
	]);

	return { employees, departments };
};

export const getDashboardSummary = (employees, departments) => {
	const totalEmployees = employees.length;

	const activeEmployees = employees.filter(
		(emp) => emp.employment.status === "Active",
	).length;

	const totalDepartments = departments.length;

	const avgAttendance =
		totalEmployees > 0
			? Math.round(
					employees.reduce(
						(sum, emp) => sum + emp.attendance.attendancePercentage,
						0,
					) / totalEmployees,
				)
			: 0;

	const monthlyPayroll = employees.reduce(
		(sum, emp) => sum + emp.salary.netSalary,
		0,
	);

	const avgRating =
		totalEmployees > 0
			? (
					employees.reduce(
						(sum, emp) => sum + emp.performance.currentRating,
						0,
					) / totalEmployees
				).toFixed(1)
			: 0;

	return {
		totalEmployees,
		activeEmployees,
		totalDepartments,
		avgAttendance,
		monthlyPayroll,
		avgRating,
	};
};

export const getRecentEmployees = (employees) => {
	return [...employees]
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);
};

export const getDepartmentStats = (employees, departments) => {
	const departmentStats = departments.map((dept) => ({
		name: dept.name,
		count: employees.filter(
			(emp) => emp.employment.departmentId === dept.departmentId,
		).length,
	}));

	const maxDeptCount = Math.max(
		...departmentStats.map((dept) => dept.count),
		1,
	);

	return {
		departmentStats,
		maxDeptCount,
	};
};

export const getEmployeeStatus = (employees) => ({
	active: employees.filter((emp) => emp.employment.status === "Active").length,
	onLeave: employees.filter((emp) => emp.employment.status === "On Leave")
		.length,
	resigned: employees.filter((emp) => emp.employment.status === "Resigned")
		.length,
});
