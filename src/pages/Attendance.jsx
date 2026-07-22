import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AttendanceTable from "../components/AttendanceTable";
import Filters from "../components/common/Filters";
import PageLoader from "../components/common/PageLoader";
import EmptyState from "../components/common/EmptyState";

import {
	loadAttendance,
	getAttendanceDepartments,
} from "../utils/attendance.util";
import { useAttendanceFilters } from "../hooks/useAttendanceFilter";
import AttendanceCard from "../components/AttendanceCard";

const Attendance = () => {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);

	const [search, setSearch] = useState("");
	const [department, setDepartment] = useState("all");

	const navigate = useNavigate();

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const data = await loadAttendance();
				setEmployees(data);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	const departments = getAttendanceDepartments(employees);

	const filteredAttendance = useAttendanceFilters({
		employees,
		search,
		department,
	});

	const handleViewEmployee = (employee) => {
		navigate(`/attendance/${employee.employeeId}`);
	};

	if (loading) {
		return <PageLoader text="Loading attendance..." />;
	}

	return (
		<>
			<div className="sticky top-0 z-10 bg-slate-50 shadow-sm">
				<Filters
					search={search}
					department={department}
					departments={departments}
					showSearch
					showDepartment
					showStatus={false}
					onSearchChange={(e) => setSearch(e.target.value)}
					onDepartmentChange={(e) => setDepartment(e.target.value)}
				/>
			</div>
			<div className="p-5 overflow-y-auto border-t border-slate-200">
				{filteredAttendance.length > 0 ? (
					<>
						<div className="hidden lg:block">
							<AttendanceTable
								employees={filteredAttendance}
								onView={handleViewEmployee}
							/>
						</div>

						<div className="grid gap-4 lg:hidden">
							{filteredAttendance.map((employee) => (
								<AttendanceCard
									key={employee.employeeId}
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
export default Attendance;
