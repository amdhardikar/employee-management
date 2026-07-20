import { useEffect, useMemo, useState } from "react";
import Filters from "../components/common/Filters";
import PayrollTable from "../components/PayrollTable";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";

import { loadEmployees, getEmployeeDepartments } from "../utils/employee.util";

import { IndianRupee, Users, CheckCircle, Clock } from "lucide-react";

const Payroll = () => {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);

	const [search, setSearch] = useState("");
	const [department, setDepartment] = useState("all");
	const [payStatus, setPayStatus] = useState("all");

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			setLoading(true);
			const data = await loadEmployees();
			setEmployees(data);
		} finally {
			setLoading(false);
		}
	};

	const departments = getEmployeeDepartments(employees);

	const filteredPayroll = employees.filter((employee) => {
		const matchesSearch =
			employee.personalInfo?.fullName
				?.toLowerCase()
				.includes(search.toLowerCase()) ||
			employee.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
			employee.personalInfo?.email
				?.toLowerCase()
				.includes(search.toLowerCase());

		const matchesDepartment =
			department === "all" ||
			employee.employment.departmentName === department;

		const matchesStatus =
			payStatus === "all" || employee.recentPayslip.status === payStatus;

		return matchesSearch && matchesDepartment && matchesStatus;
	});

	const summary = useMemo(() => {
		return {
			totalEmployees: employees.length,

			totalPayout: employees.reduce(
				(sum, emp) => sum + emp.recentPayslip.netSalary,
				0,
			),

			paidCount: employees.filter(
				(emp) => emp.recentPayslip.status === "Paid",
			).length,

			pendingCount: employees.filter(
				(emp) => emp.recentPayslip.status !== "Paid",
			).length,
		};
	}, [employees]);

	if (loading) {
		return <PageLoader text="Loading payroll..." />;
	}

	return (
		<>

			<div className="grid gap-5 p-5 md:grid-cols-4 bg-white">
				<Card
					icon={<IndianRupee />}
					title="Total Payroll"
					value={`₹${summary.totalPayout.toLocaleString()}`}
				/>

				<Card
					icon={<Users />}
					title="Employees"
					value={summary.totalEmployees}
				/>

				<Card
					icon={<CheckCircle />}
					title="Paid"
					value={summary.paidCount}
				/>

				<Card
					icon={<Clock />}
					title="Pending"
					value={summary.pendingCount}
				/>
			</div>

			<div className="sticky top-0 z-20 bg-slate-50">
				<Filters
					search={search}
					department={department}
					status={payStatus}
					departments={departments}
					statusList={["Paid", "Pending", "Processing"]}
					onSearchChange={(e) => setSearch(e.target.value)}
					onDepartmentChange={(e) => setDepartment(e.target.value)}
					onStatusChange={(e) => setPayStatus(e.target.value)}
					showSearch
					showDepartment
					showStatus
				/>
			</div>

			<div className="p-5 overflow-y-auto border-t border-slate-200">
				{filteredPayroll.length ? (
					<PayrollTable payrolls={filteredPayroll} />
				) : (
					<EmptyState />
				)}
			</div>
		</>
	);
};

const Card = ({ title, value, icon }) => {
	return (
		<div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-slate-500">{title}</p>

					<h3 className="mt-1 text-2xl font-bold">{value}</h3>
				</div>

				<div className="rounded-lg bg-slate-100 p-3">{icon}</div>
			</div>
		</div>
	);
};

export default Payroll;
