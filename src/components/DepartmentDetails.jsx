import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Users,
	BadgeCheck,
	CalendarMinus,
	UserCheck,
	FileText,
	UserX,
} from "lucide-react";

import {
	loadDepartmentDetails,
	loadDepartmentEmployees,
} from "../utils/departmentDetails.util";

import PageLoader from "./common/PageLoader";
import EmptyState from "./common/EmptyState";
import StatCard from "./StatCard";
import DepartmentDetailsTable from "./DepartmentDetailsTable";
import DepartmentEmployeeCard from "./DepartmentEmployeeCard";
import { useDepartmentSummary } from "../hooks/useDepartmentSummary";
import NotFound from "./common/NotFound";

const DepartmentDetails = () => {
	const { id } = useParams();

	const [department, setDepartment] = useState(null);
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const departmentData = await loadDepartmentDetails(id);
				const employeeData = await loadDepartmentEmployees(id);

				setDepartment(departmentData[0]);
				setEmployees(employeeData);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	const summary = useDepartmentSummary(employees);

	if (loading) {
		return <PageLoader text="Loading department details..." />;
	}

	if (!department) {
		return (
			<NotFound
				title="Department Not Found"
				message={`No department exists with ID "${id}".`}
			/>
		);
	}

	return (
		<>
			{/* Department Summary */}
			<div className="rounded-sm bg-white p-4 md:p-6">
				<div className="md:flex md:items-center md:justify-between">
					<div className="flex items-center justify-between md:block">
						<h2 className="text-lg font-semibold text-slate-900 md:text-xl">
							{department?.name}
						</h2>

						<p className="mt-1 text-sm text-slate-500">
							Department ID: {department?.departmentId}
						</p>
					</div>

					<div className="hidden md:flex md:flex-wrap md:items-center md:justify-end md:divide-x md:divide-slate-200">
						<StatCard
							label="Employees"
							value={summary.totalEmployees}
						/>
						<StatCard
							label="Active"
							value={summary.activeEmployees}
						/>
						<StatCard
							label="On Leave"
							value={summary.absentEmployees}
						/>
						<StatCard
							label="Resigned"
							value={summary.resignedEmployees}
						/>
						<StatCard
							label="Permanent"
							value={summary.permanentEmployees}
						/>
						<StatCard
							label="Contract"
							value={summary.contractEmployees}
						/>
					</div>

					<div className="mt-4 grid grid-cols-3 gap-3 md:hidden">
						<StatCard
							label="Employees"
							value={summary.totalEmployees}
							icon={<Users className="h-4 w-4" />}
						/>

						<StatCard
							label="Active"
							value={summary.activeEmployees}
							icon={
								<BadgeCheck className="h-4 w-4 text-green-600" />
							}
						/>

						<StatCard
							label="On Leave"
							value={summary.absentEmployees}
							icon={
								<CalendarMinus className="h-4 w-4 text-amber-600" />
							}
						/>

						<StatCard
							label="Resigned"
							value={summary.resignedEmployees}
							icon={<UserX className="h-4 w-4 text-red-600" />}
						/>

						<StatCard
							label="Permanent"
							value={summary.permanentEmployees}
							icon={
								<UserCheck className="h-4 w-4 text-blue-600" />
							}
						/>

						<StatCard
							label="Contract"
							value={summary.contractEmployees}
							icon={
								<FileText className="h-4 w-4 text-violet-600" />
							}
						/>
					</div>
				</div>
			</div>

			{/* Employee Table */}
			<div className="overflow-y-auto border-t border-slate-200 p-5">
				{employees.length > 0 ? (
					<>
						<div className="hidden md:block">
							<DepartmentDetailsTable employees={employees} />
						</div>

						<div className="grid gap-4 md:hidden">
							{employees.map((employee) => (
								<DepartmentEmployeeCard
									key={employee.id}
									employee={employee}
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

export default DepartmentDetails;
