import { useEffect, useState } from "react";
import Filters from "../components/common/Filters";
import PayrollTable from "../components/PayrollTable";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";

import { loadEmployees, getEmployeeDepartments } from "../utils/payroll.util";

import { IndianRupee, Users, CheckCircle, Clock } from "lucide-react";
import PayrollCard from "../components/PayrollCard";
import { useFilteredPayroll } from "../hooks/usePayRollFilters";

const Payroll = () => {
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [employees, setEmployees] = useState([]);
	const [department, setDepartment] = useState("all");
	const [payStatus, setPayStatus] = useState("all");

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const data = await loadEmployees();
				setEmployees(data);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	const departments = getEmployeeDepartments(employees);

	const filteredPayroll = useFilteredPayroll({
		employees,
		search,
		department,
		payStatus,
	});


	if (loading) {
		return <PageLoader text="Loading payroll..." />;
	}

	return (
		<>
			<div className="sticky top-0 z-10 bg-slate-50 shadow-sm">
				<Filters
					search={search}
					department={department}
					status={payStatus}
					departments={departments}
					statusList={["Paid", "Pending", "Processing"]}
					showSearch
					showDepartment
					showStatus
					onSearchChange={(e) => setSearch(e.target.value)}
					onDepartmentChange={(e) => setDepartment(e.target.value)}
					onStatusChange={(e) => setPayStatus(e.target.value)}
				/>
			</div>

			<div className="p-5 overflow-y-auto border-t border-slate-200">
				{filteredPayroll.length ? (
					<>
						<div className="hidden lg:block">
							<PayrollTable payrolls={filteredPayroll} />
						</div>

						<div className="grid gap-4 lg:hidden">
							{filteredPayroll.map((employee) => (
								<PayrollCard key={employee.id} employee={employee} />
							))}
						</div>
					</>
				) : (
					<EmptyState />
				)}
			</div>
		</>
	);
};

export default Payroll;
