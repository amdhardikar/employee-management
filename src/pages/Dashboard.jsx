import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, UserPlus, Briefcase, Calendar } from "lucide-react";
import PageLoader from "../components/common/PageLoader";
import ErrorState from "../components/common/ErrorState";
import { fetchDashboard } from "../store/dashboardSlice";

const Dashboard = () => {
	const dispatch = useDispatch();

	const { data: dashboard, loading, error } = useSelector((state) => state.dashboard);

	useEffect(() => {
		dispatch(fetchDashboard());
	}, [dispatch]);

	if (loading) {
		return <PageLoader text="Loading dashboard..." />;
	}

	if (error) {
		return (
			<ErrorState
				title="Unable to load dashboard"
				message={`Reason : ${error.message || "Unable to load dashboard data."}`}
			/>
		);
	}

	const stats = [
		{
			title: "Total Employees",
			value: dashboard.stats.totalEmployees,
			icon: <Users size={28} />,
		},
		{
			title: "Active Employees",
			value: dashboard.stats.activeEmployees,
			icon: <UserPlus size={28} />,
		},
		{
			title: "Departments",
			value: dashboard.stats.totalDepartments,
			icon: <Briefcase size={28} />,
		},
		{
			title: "Attendance",
			value: `${dashboard.stats.avgAttendance}%`,
			icon: <Calendar size={28} />,
		},
	];

	return (
		<>
			<div className="flex h-full flex-col">
				<div className="overflow-y-auto border-t border-slate-200 p-5">
					{/* Header */}
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
						<p className="text-gray-500">Employee Management System Overview</p>
					</div>

					{/* Stats Cards */}
					<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
						{stats.map((card, index) => (
							<div
								key={index}
								className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
							>
								<div>
									<p className="text-sm text-gray-500">{card.title}</p>
									<h3 className="mt-2 text-3xl font-bold">{card.value}</h3>
								</div>

								<div className="rounded-lg bg-blue-100 p-3 text-blue-600">{card.icon}</div>
							</div>
						))}
					</div>

					{/* Main Content */}
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Recent Employees */}
						<div className="rounded-xl bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-lg font-semibold">Recent Employees</h3>

							<div className="space-y-4">
								{dashboard.recentEmployees.map((emp) => (
									<div key={emp.id} className="flex items-center justify-between border-b pb-3">
										<div>
											<p className="font-medium">{emp.personalInfo.fullName}</p>
											<p className="text-sm text-gray-500">{emp.employment.designation}</p>
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
						<div className="rounded-xl bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-lg font-semibold">Department Overview</h3>

							<div className="space-y-4">
								{dashboard.departmentStats.map((item) => (
									<div key={item.name}>
										<div className="mb-1 flex justify-between">
											<span>{item.name}</span>
											<span>{item.count}</span>
										</div>

										<div className="h-2 rounded-full bg-gray-200">
											<div
												className="h-2 rounded-full bg-blue-500"
												style={{
													width: `${(item.count / dashboard.maxDeptCount) * 100}%`,
												}}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Attendance Summary */}
						<div className="rounded-xl bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-lg font-semibold">Attendance Summary</h3>

							<div className="py-8 text-center">
								<h2 className="text-5xl font-bold text-green-600">{dashboard.stats.avgAttendance}%</h2>

								<p className="mt-2 text-gray-500">Overall Attendance Rate</p>
							</div>
						</div>

						{/* Employee Status */}
						<div className="rounded-xl bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-lg font-semibold">Employee Status</h3>

							<div className="space-y-4">
								<div className="flex justify-between">
									<span>Active</span>
									<span className="font-semibold text-green-600">
										{dashboard.employeeStatus.active}
									</span>
								</div>

								<div className="flex justify-between">
									<span>On Leave</span>
									<span className="font-semibold text-yellow-600">
										{dashboard.employeeStatus.onLeave}
									</span>
								</div>

								<div className="flex justify-between">
									<span>Resigned</span>
									<span className="font-semibold text-red-600">
										{dashboard.employeeStatus.resigned}
									</span>
								</div>
							</div>
						</div>

						{/* Payroll */}
						<div className="rounded-xl bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-lg font-semibold">Monthly Payroll</h3>

							<div className="py-6 text-center">
								<h2 className="text-4xl font-bold text-indigo-600">
									₹{dashboard.stats.monthlyPayroll?.toLocaleString("en-IN")}
								</h2>

								<p className="mt-2 text-gray-500">Total Net Salary Payout</p>
							</div>
						</div>

						{/* Performance */}
						<div className="rounded-xl bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-lg font-semibold">Average Performance Rating</h3>

							<div className="py-6 text-center">
								<h2 className="text-5xl font-bold text-orange-500">{dashboard.stats.avgRating}</h2>

								<p className="mt-2 text-gray-500">Average Employee Rating</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
