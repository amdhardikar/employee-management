import { Eye } from "lucide-react";
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

const Attendance = () => {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);

	const [search, setSearch] = useState("");
	const [department, setDepartment] = useState("all");

	const navigate = useNavigate();

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			setLoading(true);
			const data = await loadAttendance();
			setEmployees(data);
		} finally {
			setLoading(false);
		}
	};

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
		return <PageLoader text="Loading attendance details..." />;
	}

	return (
		<>
			<div className="sticky top-0 z-20 bg-slate-50">
				<Filters
					search={search}
					department={department}
					departments={departments}
					onSearchChange={(e) => setSearch(e.target.value)}
					onDepartmentChange={(e) => setDepartment(e.target.value)}
					showSearch
					showDepartment
					showStatus={false}
				/>
			</div>
			<div className="p-5 overflow-y-auto border-t border-slate-200">
				{filteredAttendance.length > 0 ? (
					<AttendanceTable
						employees={filteredAttendance}
						onView={handleViewEmployee}
					/>
				) : (
					<EmptyState />
				)}
			</div>
		</>
	);
};
export default Attendance;
