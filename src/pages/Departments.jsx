import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { employeeApi } from "../api/employeeApi";
import { departmentApi } from "../api/departmentApi";

import DepartmentTable from "../components/department/DepartmentTable";
import DepartmentCard from "../components/department/DepartmentCard";
import PageLoader from "../components/common/PageLoader";
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
					employeeApi.getAll(),
					departmentApi.getAll(),
				]);

				setEmployees(employeesData);
				setDepartments(departmentsData);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	const handleViewDepartment = (department) => {
		navigate(`/departments/${department.departmentId}`);
	};

	const handleEditDepartment = (department) => {
		navigate(`/departments/edit/${department.departmentId}`);
	};

	if (loading) {
		return <PageLoader text="Loading departments..." />;
	}

	return (
		<div className="overflow-y-auto border-t border-slate-200 p-5">
			{departments?.length > 0 ? (
				<>
					<div className="hidden lg:block">
						<DepartmentTable
							departments={departments}
							employees={employees}
							onView={handleViewDepartment}
							onEdit={handleEditDepartment}
						/>
					</div>

					<div className="grid gap-4 lg:hidden">
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
