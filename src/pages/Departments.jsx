import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { employeeApi } from "../api/employeeApi";

import DepartmentTable from "../components/department/DepartmentTable";
import DepartmentCard from "../components/department/DepartmentCard";
import PageLoader from "../components/common/PageLoader";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import useDepartments from "../hooks/useDepartments";

const Departments = () => {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments(false);

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);

				const employeesData = await employeeApi.getAll();

				setEmployees(employeesData);
			} catch (err) {
				setError(err);
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

	const handleNewDepartment = () => {
		navigate(`/departments/new`);
	};

	if (loading || departmentsLoading) {
		return <PageLoader text="Loading departments..." />;
	}

	if (error || departmentsError) {
		return (
			<ErrorState
				title="Unable to load depatments"
				message={`Reason : ${error?.message || departmentsError?.message || "Something went wrong while loading departments"}`}
			/>
		);
	}

	return (
		<>
			<div className="bg-white px-5 py-3">
				<div className="flex items-center justify-start gap-3">
					<button
						onClick={handleNewDepartment}
						className={`rounded-sm bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50`}
					>
						Add Department
					</button>
				</div>
			</div>
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
		</>
	);
};

export default Departments;
