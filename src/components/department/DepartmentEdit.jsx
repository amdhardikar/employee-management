import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, BadgeCheck, CalendarMinus, UserCheck, FileText, UserX } from "lucide-react";

import { employeeApi } from "../../api/employeeApi";
import { departmentApi } from "../../api/departmentApi";
import { designationApi } from "../../api/designationApi";

import DepartmentDetailsTable from "./DepartmentDetailsTable";
import DepartmentEmployeeCard from "./DepartmentEmployeeCard";

import PageLoader from "../common/PageLoader";
import EmptyState from "../common/EmptyState";
import StatCard from "../common/StatCard";
import NotFound from "../common/NotFound";

import DepartmentEditTable from "./DepartmentEditTable";

const DepartmentEdit = () => {
	const { id } = useParams();

	const [designations, setDesignations] = useState([]);
	const [department, setDepartment] = useState(null);
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newRows, setNewRows] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [departmentData, employeeData, designationData] = await Promise.all([
					departmentApi.getById(id),
					employeeApi.getByDepartment(id),
					designationApi.getByDepartment(id),
				]);

				setDepartment(departmentData[0]);
				setEmployees(employeeData);
				setDesignations(designationData);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	const handleRemoveEmployee = async (employee) => {
		try {
			await departmentApi.updateDepartment(department.departmentId, {
				action: "removeEmployee",
				employeeId: employee.employeeId,
			});

			setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));
		} catch (error) {
			console.error(error);
		}
	};

	const handleAddEmployee = async (row) => {
		setNewRows((prev) =>
			prev.map((r) =>
				r.id === row.id
					? {
							...r,
							loading: true,
						}
					: r,
			),
		);
		try {
			if (!row.designationId) {
				setNewRows((prev) =>
					prev.map((r) =>
						r.id === row.id
							? {
									...r,
									designationError: "Designation is required",
								}
							: r,
					),
				);

				return;
			}

			const result = await employeeApi.getById(row.employeeId);
			if (!result) {
				return;
			}

			const employee = result;
			const response = await departmentApi.updateDepartment(department.departmentId, {
				action: "addEmployee",
				employeeId: employee.employeeId,
				designationId: row.designationId,
			});

			setEmployees((prev) => [...prev, response.employee]);
			setNewRows((prev) => prev.filter((r) => r.id !== row.id));
		} catch (error) {
			console.log(error);
			setNewRows((prev) =>
				prev.map((r) =>
					r.id === row.id
						? {
								...r,
								error: error.message,
								loading: false,
							}
						: r,
				),
			);
		}
	};

	const handleAddRow = () => {
		if (newRows.length > 0) return;
		setNewRows([
			{
				id: crypto.randomUUID(),
				employeeId: "",
				designationId: "",
				loading: false,
				error: "",
				designationError: "",
			},
		]);
	};

	const handleCancelRow = (rowId) => {
		setNewRows((prev) => prev.filter((row) => row.id !== rowId));
	};

	if (loading) {
		return <PageLoader text="Loading department details..." />;
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

					<div className="mb-5 flex items-center justify-end gap-3">
						<button
							onClick={handleAddRow}
							disabled={newRows.length > 0}
							className={`rounded-sm bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50`}
						>
							Add Employee
						</button>
					</div>
				</div>
			</div>

			<div className="overflow-y-auto border-t border-slate-200 p-5">
				{employees.length > 0 ? (
					<>
						<div className="hidden lg:block">
							<DepartmentEditTable
								designations={designations}
								employees={employees}
								newRows={newRows}
								setNewRows={setNewRows}
								onSaveEmployee={handleAddEmployee}
								onRemoveEmployee={handleRemoveEmployee}
								onCancelRow={handleCancelRow}
							/>
						</div>
					</>
				) : (
					<EmptyState />
				)}
			</div>
		</>
	);
};

export default DepartmentEdit;
