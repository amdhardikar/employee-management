/**
 * @fileoverview Renders employee table data in the desktop table presentation. It defines the domain-specific columns, formats status and values consistently, and invokes supplied view/edit/delete callbacks without owning navigation or server state.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/employee/EmployeeTable
 */
import { Eye, Pencil, Trash } from "lucide-react";
import PropTypes from "prop-types";
import ProfileImage from "../common/ProfileImage";
import { STATUS_COLORS } from "../../constants/EMSconstants";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../common/DataTable";
import { display, phone } from "../../utils/formatter";

/**
 * Renders the employee table interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object[]} props.employees - Employee records to display or summarize.
 * @param {Function} props.onView - Called with the selected record when the user requests details.
 * @param {Function} props.onEdit - Called with the selected record when the user requests editing.
 * @param {Function} props.onDelete - Called with the selected record when the user requests deletion.
 * @returns {JSX.Element} Rendered React user interface.
 */
const EmployeeTable = ({ employees, onView, onEdit, onDelete }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Employee</TableHeader>
					<TableHeader className="text-left">Designation</TableHeader>
					<TableHeader className="text-left">Email</TableHeader>
					<TableHeader className="text-left">Phone</TableHeader>
					<TableHeader className="text-left">Status</TableHeader>
					<TableHeader className="text-center">Actions</TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{employees?.map((employee) => (
					<TableRow key={employee.id} className="transition-colors hover:bg-slate-50">
						{/* Employee Info */}
						<TableCell>
							<div className="flex items-center gap-3">
								<ProfileImage
									src={employee.personalInfo?.profileImage}
									name={employee.fullName}
									className="h-10 w-10 rounded-full object-cover"
								/>

								<div>
									<p className="font-medium text-slate-900">{employee.fullName}</p>
									<p className="text-xs text-slate-500">
										{employee.employeeCode} | {employee.employeeId}
									</p>
								</div>
							</div>
						</TableCell>

						<TableCell>
							<p className="font-medium text-slate-900">
								{employee.employment?.designation || "Not Assigned"}
							</p>

							<p className="text-xs text-slate-500">
								{employee.employment?.departmentName || "Not Assigned"}
							</p>
						</TableCell>

						<TableCell className="max-w-55 truncate">{display(employee.email)}</TableCell>

						<TableCell className="whitespace-nowrap">{phone(employee.personalInfo?.phone)}</TableCell>

						<TableCell>
							<span
								className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
									STATUS_COLORS[employee.employment?.status] || "bg-slate-100 text-slate-700"
								}`}
							>
								{employee.employment?.status}
							</span>
						</TableCell>

						<TableCell>
							<div className="flex justify-center gap-2">
								<button
									onClick={() => onView(employee)}
									className="rounded-md border border-blue-200 p-2 text-blue-700 transition-colors hover:bg-blue-50"
								>
									<Eye className="h-4 w-4" />
								</button>
								<button
									onClick={() => onEdit(employee)}
									className="rounded-md border border-green-200 p-2 text-green-700 transition-colors hover:bg-green-50"
								>
									<Pencil className="h-4 w-4" />
								</button>
								<button
									onClick={() => onDelete(employee)}
									className="rounded-md border border-red-200 p-2 text-red-700 transition-colors hover:bg-red-50"
								>
									<Trash className="h-4 w-4" />
								</button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

EmployeeTable.propTypes = {
	employees: PropTypes.array.isRequired,
	onView: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default EmployeeTable;
