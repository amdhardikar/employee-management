import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, BadgeCheck, CalendarMinus, UserCheck, FileText, UserX } from "lucide-react";

import { employeeApi } from "../../api/employeeApi";
import { departmentApi } from "../../api/departmentApi";

import DepartmentDetailsTable from "./DepartmentDetailsTable";
import DepartmentEmployeeCard from "./DepartmentEmployeeCard";

import PageLoader from "../common/PageLoader";
import EmptyState from "../common/EmptyState";
import StatCard from "../common/StatCard";
import NotFound from "../common/NotFound";
import ErrorState from "../common/ErrorState";

import { getDepartmentSummary } from "../../utils/department.util";

const DepartmentDetails = () => {
	const { id } = useParams();

	const [department, setDepartment] = useState(null);
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				const [departmentData, employeeData] = await Promise.all([
					departmentApi.getById(id),
					employeeApi.getByDepartment(id),
				]);

				setDepartment(departmentData);
				setEmployees(employeeData);
			} catch (error) {
				setError({
					message: error.message || "Unable to load department details",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	const summary = getDepartmentSummary(employees);

	if (loading) {
		return <PageLoader text="Loading department details..." />;
	}

	if (error) {
		return (
			<ErrorState
				title="Unable to load department"
				message={`Reason : ${error?.message || "Something went wrong"}`}
			/>
		);
	}

	if (!department) {
		return <NotFound title="Department Not Found" message={`No department exists with ID "${id}".`} />;
	}

	return (
		<>
			{/* Department Summary */}
			<div className="bg-white px-6 py-3">
				<div className="grid grid-cols-1 md:grid-cols-[30%_70%]">
					<div className="flex justify-between py-3 sm:flex-col sm:justify-center">
						<h2 className="text-lg font-semibold text-slate-900 xl:text-xl">{department?.name}</h2>

						<p className="mt-1 text-sm text-slate-500">Department ID: {department?.departmentId}</p>
					</div>

					<div className="hidden lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:divide-x lg:divide-slate-200">
						<StatCard label="Employees" value={summary.totalEmployees} />
						<StatCard label="Active" value={summary.activeEmployees} />
						<StatCard label="On Leave" value={summary.absentEmployees} />
						<StatCard label="Resigned" value={summary.resignedEmployees} />
						<StatCard label="Permanent" value={summary.permanentEmployees} />
						<StatCard label="Contract" value={summary.contractEmployees} />
					</div>

					<div className="mt-4 grid grid-cols-3 gap-3 lg:hidden">
						<StatCard
							label="Employees"
							value={summary.totalEmployees}
							icon={<Users className="h-4 w-4" />}
						/>

						<StatCard
							label="Active"
							value={summary.activeEmployees}
							icon={<BadgeCheck className="h-4 w-4 text-green-600" />}
						/>

						<StatCard
							label="On Leave"
							value={summary.absentEmployees}
							icon={<CalendarMinus className="h-4 w-4 text-amber-600" />}
						/>

						<StatCard
							label="Resigned"
							value={summary.resignedEmployees}
							icon={<UserX className="h-4 w-4 text-red-600" />}
						/>

						<StatCard
							label="Permanent"
							value={summary.permanentEmployees}
							icon={<UserCheck className="h-4 w-4 text-blue-600" />}
						/>

						<StatCard
							label="Contract"
							value={summary.contractEmployees}
							icon={<FileText className="h-4 w-4 text-violet-600" />}
						/>
					</div>
				</div>
			</div>

			<div className="overflow-y-auto border-t border-slate-200 p-5">
				{employees.length > 0 ? (
					<>
						<div className="hidden lg:block">
							<DepartmentDetailsTable employees={employees} />
						</div>

						<div className="grid gap-4 lg:hidden">
							{employees.map((employee) => (
								<DepartmentEmployeeCard key={employee.id} employee={employee} />
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

export default DepartmentDetails;
