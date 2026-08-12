/**
 * @fileoverview Implements the department edit workflow. It coordinates route or form state, department API operations, employee assignments, validation, navigation, and the appropriate loading, error, or not-found presentation.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/department/DepartmentEdit
 */
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
import ErrorState from "../common/ErrorState";
import Popup from "../common/Popup";

import DepartmentEditTable from "./DepartmentEditTable";

/**
 * Renders the department edit interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const DepartmentEdit = () => {
	const { id } = useParams();

	const [designations, setDesignations] = useState([]);
	const [department, setDepartment] = useState(null);
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [newRows, setNewRows] = useState([]);
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				const [departmentData, employeeData, designationData] = await Promise.all([
					departmentApi.getById(id),
					employeeApi.getByDepartment(id),
					designationApi.getByDepartment(id),
				]);

				setDepartment(departmentData);
				setEmployees(employeeData);
				setDesignations(designationData);
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

	const handleRemoveEmployee = async (employee) => {
		try {
			setDeleteError(null);
			setDeleting(true);
			await departmentApi.updateDepartment(department.departmentId, {
				action: "removeEmployee",
				employeeId: employee.employeeId,
			});

			setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));
		} catch (error) {
			setDeleteError(error);
		} finally {
			setDeleting(false);
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
				setNewRows((prev) =>
					prev.map((item) =>
						item.id === row.id
							? { ...item, loading: false, error: "Employee not found" }
							: item,
					),
				);
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
			<Popup
				saving={deleting}
				error={deleteError}
				progressTitle="Removing"
				savingMessage="Removing employee from department..."
				errorTitle="Unable to remove employee"
				onClose={() => setDeleteError(null)}
			/>
			{/* Department Summary */}
			<div className="bg-white px-4 py-3 sm:px-6">
				<div className="grid grid-cols-1 md:grid-cols-[30%_70%]">
					<div className="min-w-0 py-3">
						<h2 className="text-lg font-semibold break-words text-slate-900 xl:text-xl">
							{department?.name}
						</h2>

						<p className="mt-1 text-sm text-slate-500">Department ID: {department?.departmentId}</p>
					</div>

					<div className="flex items-center md:mb-5 md:justify-end">
						<button
							onClick={handleAddRow}
							disabled={newRows.length > 0}
							className="w-full rounded-sm bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
						>
							Add Employee
						</button>
					</div>
				</div>
			</div>

			<div className="min-w-0 overflow-y-auto border-t border-slate-200 p-3 sm:p-5">
				{employees.length > 0 || newRows.length > 0 ? (
					<DepartmentEditTable
						designations={designations}
						employees={employees}
						newRows={newRows}
						setNewRows={setNewRows}
						onSaveEmployee={handleAddEmployee}
						onRemoveEmployee={handleRemoveEmployee}
						onCancelRow={handleCancelRow}
					/>
				) : (
					<EmptyState />
				)}
			</div>
		</>
	);
};

export default DepartmentEdit;
