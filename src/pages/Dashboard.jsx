import { useEffect, useState } from "react";
import { Users, UserPlus, Briefcase, Calendar } from "lucide-react";
import {
	loadDashboardData,
	getRecentEmployees,
	getDepartmentStats,
	getEmployeeStatus,
} from "../utils/dashboard.util";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import PageLoader from "../components/common/PageLoader";

const Dashboard = () => {
	const [employees, setEmployees] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const { employees, departments } = await loadDashboardData();

				setEmployees(employees);
				setDepartments(departments);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const summary = useDashboardSummary(employees, departments);
	const recentEmployees = getRecentEmployees(employees);
	const { departmentStats, maxDeptCount } = getDepartmentStats(
		employees,
		departments,
	);
   const employeeStatus = getEmployeeStatus(employees);
   
	const stats = [
		{
			title: "Total Employees",
			value: summary.totalEmployees,
			icon: <Users size={28} />,
		},
		{
			title: "Active Employees",
			value: summary.activeEmployees,
			icon: <UserPlus size={28} />,
		},
		{
			title: "Departments",
			value: summary.totalDepartments,
			icon: <Briefcase size={28} />,
		},
		{
			title: "Attendance",
			value: `${summary.avgAttendance}%`,
			icon: <Calendar size={28} />,
		},
	];

	if (loading) {
		return <PageLoader text="Loading dashboard..."/>;
	}

	return (
		<div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
			<main className="flex-1 p-8">
				{/* Header */}
				<div className="mb-8">
					<h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
					<p className="text-gray-500">
						Employee Management System Overview
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
					{stats.map((card, index) => (
						<div
							key={index}
							className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center hover:shadow-md transition"
						>
							<div>
								<p className="text-gray-500 text-sm">{card.title}</p>
								<h3 className="text-3xl font-bold mt-2">
									{card.value}
								</h3>
							</div>

							<div className="p-3 bg-blue-100 rounded-lg text-blue-600">
								{card.icon}
							</div>
						</div>
					))}
				</div>

				{/* Main Content */}
				<div className="grid lg:grid-cols-2 gap-6">
					{/* Recent Employees */}
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-semibold mb-4">
							Recent Employees
						</h3>

						<div className="space-y-4">
							{recentEmployees.map((emp) => (
								<div
									key={emp.id}
									className="flex justify-between items-center border-b pb-3"
								>
									<div>
										<p className="font-medium">
											{emp.personalInfo.fullName}
										</p>
										<p className="text-sm text-gray-500">
											{emp.employment.designation}
										</p>
									</div>

									<span
										className={`text-sm font-medium ${
											emp.employment.status === "Active"
												? "text-green-600"
												: emp.employment.status === "On Leave"
													? "text-yellow-600"
													: "text-red-600"
										}`}
									>
										{emp.employment.status}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Department Overview */}
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-semibold mb-4">
							Department Overview
						</h3>

						<div className="space-y-4">
							{departmentStats.map((item) => (
								<div key={item.name}>
									<div className="flex justify-between mb-1">
										<span>{item.name}</span>
										<span>{item.count}</span>
									</div>

									<div className="h-2 bg-gray-200 rounded-full">
										<div
											className="h-2 bg-blue-500 rounded-full"
											style={{
												width: `${
													(item.count / maxDeptCount) * 100
												}%`,
											}}
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Attendance Summary */}
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-semibold mb-4">
							Attendance Summary
						</h3>

						<div className="text-center py-8">
							<h2 className="text-5xl font-bold text-green-600">
								{summary.avgAttendance}%
							</h2>

							<p className="text-gray-500 mt-2">
								Overall Attendance Rate
							</p>
						</div>
					</div>

					{/* Employee Status */}
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-semibold mb-4">
							Employee Status
						</h3>

						<div className="space-y-4">
							<div className="flex justify-between">
								<span>Active</span>
								<span className="font-semibold text-green-600">
									{employeeStatus.active}
								</span>
							</div>

							<div className="flex justify-between">
								<span>On Leave</span>
								<span className="font-semibold text-yellow-600">
									{employeeStatus.onLeave}
								</span>
							</div>

							<div className="flex justify-between">
								<span>Resigned</span>
								<span className="font-semibold text-red-600">
									{employeeStatus.resigned}
								</span>
							</div>
						</div>
					</div>

					{/* Payroll */}
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-semibold mb-4">
							Monthly Payroll
						</h3>

						<div className="text-center py-6">
							<h2 className="text-4xl font-bold text-indigo-600">
								₹{summary.monthlyPayroll.toLocaleString("en-IN")}
							</h2>

							<p className="text-gray-500 mt-2">
								Total Net Salary Payout
							</p>
						</div>
					</div>

					{/* Performance */}
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-semibold mb-4">
							Average Performance Rating
						</h3>

						<div className="text-center py-6">
							<h2 className="text-5xl font-bold text-orange-500">
								{summary.avgRating}
							</h2>

							<p className="text-gray-500 mt-2">
								Average Employee Rating
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
