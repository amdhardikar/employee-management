import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
	loadDepartmentDetails,
	loadDepartmentEmployees,
} from "../utils/departmentDetails.util";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./common/DataTable";
import PageLoader from "./common/PageLoader";
import { STATUS_COLORS } from "../constants/EMSconstants";

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

	if (loading) {
		return <PageLoader text="Loading department details..." />;
	}

	const totalEmployees = employees.length;

	const activeEmployees = employees.filter(
		(emp) => emp.employment.status === "Active",
	).length;

	const absentEmployees = employees.filter(
		(emp) => emp.employment.status === "On Leave",
	).length;

	const contractEmployees = employees.filter(
		(emp) => emp.employment.employeeType === "Contract",
	).length;

	const permanentEmployees = employees.filter(
		(emp) =>
			emp.employment.employeeType === "Intern" ||
			emp.employment.employeeType === "Full time",
	).length;

	const resignedEmployees = employees.filter(
		(emp) => emp.employment.status === "Resigned",
	).length;

	return (
		<>
			{/* Department Summary */}
			<div className="bg-white p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="space-y-3">
						<h2 className="text-xl font-semibold text-slate-900">
							{department?.name}
						</h2>

						<p className="text-slate-500">
							Department ID: {department?.departmentId}
						</p>
					</div>

					<div className="flex flex-wrap items-center justify-end  divide-x divide-slate-200">
						<div className="px-6 py-4">
							<div className="text-sm text-slate-500">Employees</div>
							<div className="text-2xl font-semibold">
								{totalEmployees}
							</div>
						</div>

						<div className="px-6 py-4">
							<div className="text-sm text-slate-500">Active</div>
							<div className="text-2xl font-semibold">
								{activeEmployees}
							</div>
						</div>

						<div className="px-6 py-4">
							<div className="text-sm text-slate-500">On Leave</div>
							<div className="text-2xl font-semibold">
								{absentEmployees}
							</div>
						</div>

						<div className="px-6 py-4">
							<div className="text-sm text-slate-500">Resigned</div>
							<div className="text-2xl font-semibold">
								{resignedEmployees}
							</div>
						</div>

						<div className="px-6 py-4">
							<div className="text-sm text-slate-500">Permanent</div>
							<div className="text-2xl font-semibold">
								{permanentEmployees}
							</div>
						</div>

						<div className="px-6 py-4">
							<div className="text-sm text-slate-500">Contract</div>
							<div className="text-2xl font-semibold">
								{contractEmployees}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Employee Table */}
			<div className="p-5 overflow-y-auto border-t border-slate-200">
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader className="text-left">
								Employee Code
							</TableHeader>
							<TableHeader className="text-left">Name</TableHeader>
							<TableHeader className="text-left">
								Designation
							</TableHeader>
							<TableHeader className="text-left">Type</TableHeader>
							<TableHeader className="text-left">Location</TableHeader>
							<TableHeader className="text-left">Manager</TableHeader>
							<TableHeader className="text-center">Status</TableHeader>
						</TableRow>
					</TableHead>

					<TableBody>
						{employees.map((employee) => (
							<TableRow key={employee.id}>
								<TableCell>{employee.employeeId}</TableCell>

								<TableCell>{employee.personalInfo.fullName}</TableCell>

								<TableCell>{employee.employment.designation}</TableCell>

								<TableCell>
									{employee.employment.employeeType}
								</TableCell>

								<TableCell>
									{employee.employment.workLocation}
								</TableCell>

								<TableCell>
									{employee.employment.manager?.name}
								</TableCell>

								<TableCell>
									<span
										className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
											STATUS_COLORS[employee.employment?.status] ||
											"bg-slate-100 text-slate-700"
										}`}
									>
										{employee.employment?.status}
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
};

export default DepartmentDetails;
