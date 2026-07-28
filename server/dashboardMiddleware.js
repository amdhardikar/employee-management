import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "db-final.json");

export const dashboardMiddleware = (req, res, next) => {
	if (req.method !== "GET" || req.path !== "/dashboard") {
		return next();
	}

	const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

	const employees = db.employees;
	const departments = db.departments;

	// Employee Status
	const active = employees.filter(
		(emp) => emp.employment.status === "Active",
	).length;

	const onLeave = employees.filter(
		(emp) => emp.employment.status === "On Leave",
	).length;

	const resigned = employees.filter(
		(emp) => emp.employment.status === "Resigned",
	).length;

	// Attendance
	const avgAttendance =
		employees.reduce(
			(sum, emp) => sum + emp.attendance.attendancePercentage,
			0,
		) / employees.length;

	// Performance
	const avgRating =
		employees.reduce((sum, emp) => sum + emp.performance.currentRating, 0) /
		employees.length;

	// Payroll
	const monthlyPayroll = employees.reduce(
		(sum, emp) => sum + emp.salary.netSalary,
		0,
	);

	// Department Stats
	const departmentStats = departments.map((dept) => {
		const count = employees.filter(
			(emp) => emp.employment.departmentId === dept.departmentId,
		).length;

		return {
			id: dept.departmentId,
			name: dept.name,
			count,
		};
	});

	const maxDeptCount = Math.max(...departmentStats.map((d) => d.count));

	// Recent Employees
	const recentEmployees = [...employees]
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime(),
		)
		.slice(0, 6);

	res.json({
		stats: {
			totalEmployees: employees.length,
			activeEmployees: active,
			totalDepartments: departments.length,
			avgAttendance: Number(avgAttendance.toFixed(1)),
			monthlyPayroll,
			avgRating: Number(avgRating.toFixed(1)),
		},
		employeeStatus: {
			active,
			onLeave,
			resigned,
		},
		departmentStats,
		recentEmployees,
		totalEmployees: employees.length,
		maxDeptCount,
	});
};
