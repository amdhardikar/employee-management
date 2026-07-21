import { useEffect, useState } from "react";
import { employeeApi } from "../api/employeeApi";
import { departmentApi } from "../api/departmentApi";
import DepartmentTable from "../components/DepartmentTable";
import PageLoader from "../components/common/PageLoader";
import { useNavigate } from "react-router-dom";
import DepartmentCard from "../components/DepartmentCard";
import EmptyState from "../components/common/EmptyState";

const Departments = () => {
	const [departments, setDepartments] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);

				const [employeesData, departmentsData] = await Promise.all([
					employeeApi.getAll("_sort=-departmentId"),
					departmentApi.getAll(),
				]);

				setEmployees(employeesData);
				setDepartments(departmentsData);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	const handleViewDepartment = (department) => {
		navigate(`/department/${department.departmentId}`);
	};

	if (loading) {
		return <PageLoader text="Loading departments..." />;
	}

	return (
		<div className="p-5 overflow-y-auto border-t border-slate-200">
			{departments?.length > 0 ? (
				<>
					<div className="hidden md:block">
						<DepartmentTable
							departments={departments}
							employees={employees}
							onView={handleViewDepartment}
						/>
					</div>

					<div className="grid gap-4 md:hidden">
						{departments.map((department) => (
							<DepartmentCard
								key={department.departmentId}
								department={department}
								employees={employees}
								onView={handleViewDepartment}
							/>
						))}
					</div>
				</>
			) : (
				<EmptyState />
			)}
		</div>
	);
};

export default Departments;
