/**
 * @fileoverview Renders department table data in the desktop table presentation. It defines the domain-specific columns, formats status and values consistently, and invokes supplied view/edit/delete callbacks without owning navigation or server state.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/department/DepartmentTable
 */
import PropTypes from "prop-types";
import { Eye, Pencil, Star, Trash } from "lucide-react";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../common/DataTable";
import { currency } from "../../utils/formatter";

/**
 * Renders the department table interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Array} props.departments - Available department values shown by the control.
 * @param {Object[]} props.employees - Employee records to display or summarize.
 * @param {Function} props.onView - Called with the selected record when the user requests details.
 * @param {Function} props.onEdit - Called with the selected record when the user requests editing.
 * @param {Function} props.onDelete - Called with the selected record when the user requests deletion.
 * @returns {JSX.Element} Rendered React user interface.
 */
const DepartmentTable = ({ departments = [], employees = [], onView, onEdit, onDelete }) => {
	const getDepartmentStats = (departmentId) => {
		const departmentEmployees = employees.filter((emp) => emp.employment?.departmentId === departmentId);

		const activeEmployees = departmentEmployees.filter((emp) => emp.employment?.status === "Active").length;

		const avgRating =
			departmentEmployees.length > 0
				? (
						departmentEmployees.reduce((sum, emp) => sum + (emp.performance?.currentRating || 0), 0) /
						departmentEmployees.length
					).toFixed(1)
				: 0;

		const avgCTC =
			departmentEmployees.length > 0
				? Math.round(
						departmentEmployees.reduce((sum, emp) => sum + (emp.salary?.employeeCTC || 0), 0) /
							departmentEmployees.length,
					)
				: 0;

		const locations = [...new Set(departmentEmployees.map((emp) => emp.employment?.workLocation))];

		return {
			totalEmployees: departmentEmployees.length,
			activeEmployees,
			inactiveEmployees: departmentEmployees.length - activeEmployees,
			avgRating,
			avgCTC,
			locations,
		};
	};

	return (
		<Table className="min-w-full divide-y divide-slate-200">
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Department</TableHeader>
					<TableHeader className="text-center">Employees</TableHeader>
					<TableHeader className="text-center">Active</TableHeader>
					<TableHeader className="text-center">Avg Rating</TableHeader>
					<TableHeader className="text-left">Locations</TableHeader>
					<TableHeader className="text-right">Avg CTC</TableHeader>
					<TableHeader className="text-center">Actions</TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{departments.map((department) => {
					const stats = getDepartmentStats(department.departmentId);

					return (
						<TableRow key={department.departmentId}>
							<TableCell>
								<div>
									<p className="text-sm font-medium text-slate-900">{department.name}</p>

									<p className="text-xs text-slate-500">{department.departmentId}</p>
								</div>
							</TableCell>

							<TableCell className="text-center font-medium">{stats.totalEmployees}</TableCell>

							<TableCell className="text-center">
								<span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
									{stats.activeEmployees}
								</span>
							</TableCell>

							<TableCell className="text-center">
								<div className="flex items-center justify-center gap-2">
									<Star className="h-[1.2rem] w-[1.2rem] fill-yellow-500 text-amber-300" />{" "}
									<span>{stats.avgRating}</span>
								</div>
							</TableCell>

							<TableCell>
								<div className="flex flex-wrap gap-1">
									{stats.locations.slice(0, 2).map((location) => (
										<span
											key={location}
											className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
										>
											{location}
										</span>
									))}

									{stats.locations.length > 2 && (
										<span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
											+{stats.locations.length - 2}
										</span>
									)}
								</div>
							</TableCell>

							<TableCell className="text-right">{currency(stats.avgCTC)}</TableCell>

							<TableCell>
								<div className="flex justify-center gap-2">
									<button
										onClick={() => onView?.(department)}
										className="rounded-md border border-blue-200 p-2 text-blue-700 transition-colors hover:bg-blue-50"
									>
										<Eye className="h-4 w-4" />
									</button>
									<button
										onClick={() => onEdit?.(department)}
										className="rounded-md border border-green-200 p-2 text-green-700 transition-colors hover:bg-green-50"
									>
										<Pencil className="h-4 w-4" />
									</button>
									<button
										onClick={() => onDelete?.(department)}
										className="rounded-md border border-red-200 p-2 text-red-700 transition-colors hover:bg-red-50"
									>
										<Trash className="h-4 w-4" />
									</button>
								</div>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};

DepartmentTable.propTypes = {
	departments: PropTypes.array.isRequired,
	employees: PropTypes.array.isRequired,
	onView: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func,
};

export default DepartmentTable;
