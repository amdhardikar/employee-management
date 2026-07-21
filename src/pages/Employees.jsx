import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Filters from "../components/common/Filters";
import EmployeeTable from "../components/EmployeeTable";

import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";

import {
	getEmployeeStatuses,
	getEmployeeDepartments,
	loadEmployees,
} from "../utils/employee.util";
import { useEmployeeFilters } from "../hooks/useEmployeeFilters";
import EmployeeCard from "../components/EmployeeCard";

const Employees = () => {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);

	const [search, setSearch] = useState("");
	const [department, setDepartment] = useState("all");
	const [status, setStatus] = useState("all");
	const navigate = useNavigate();

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

	const handleViewEmployee = (employee) => {
		navigate(`/employee/${employee.employeeId}`);
	};

	const filteredEmployees = useEmployeeFilters({
		employees,
		search,
		department,
		status,
	});
	const statusList = getEmployeeStatuses(employees);
	const departments = getEmployeeDepartments(employees);

	if (loading) {
		return <PageLoader text="Loading employees..." />;
	}

	return (
		<>
			<div className="sticky top-0 z-10 bg-white shadow-sm">
				<Filters
					search={search}
					department={department}
					status={status}
					statusList={statusList}
					departments={departments}
					showSearch
					showDepartment
					showStatus
					onSearchChange={(e) => setSearch(e.target.value)}
					onDepartmentChange={(e) => setDepartment(e.target.value)}
					onStatusChange={(e) => setStatus(e.target.value)}
				/>
			</div>

			<div className="p-5 overflow-y-auto border-t border-slate-200">
				{filteredEmployees.length > 0 ? (
					<>
						<div className="hidden md:block">
							<EmployeeTable
								employees={filteredEmployees}
								onView={handleViewEmployee}
							/>
						</div>

						<div className="grid gap-4 md:hidden">
							{filteredEmployees.map((employee) => (
								<EmployeeCard
									key={employee.id}
									employee={employee}
									onView={handleViewEmployee}
								/>
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

export default Employees;
