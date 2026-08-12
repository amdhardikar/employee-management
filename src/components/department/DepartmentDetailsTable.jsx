/**
 * @fileoverview Renders department details table data in the desktop table presentation. It defines the domain-specific columns, formats status and values consistently, and invokes supplied view/edit/delete callbacks without owning navigation or server state.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/department/DepartmentDetailsTable
 */
import { Eye } from "lucide-react";
import PropTypes from "prop-types";
import { STATUS_COLORS } from "../../constants/EMSconstants";
import {
	Table,
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from "../common/DataTable";
import { NavLink } from "react-router-dom";
import { display } from "../../utils/formatter";

/**
 * Renders the department details table interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object[]} props.employees - Employee records to display or summarize.
 * @returns {JSX.Element} Rendered React user interface.
 */
const DepartmentDetailsTable = ({ employees }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Employee</TableHeader>
					<TableHeader className="text-left">Designation</TableHeader>
					<TableHeader className="text-left">Type</TableHeader>
					<TableHeader className="text-left">Location</TableHeader>
					<TableHeader className="text-left">Manager</TableHeader>
					<TableHeader className="text-center">Status</TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{employees.map((employee) => (
					<TableRow key={employee.id}>
						<TableCell>
							<NavLink className="cursor-pointer font-medium text-blue-700 hover:underline" to={`/employees/${employee.employeeId}`}>
								{display(employee.fullName)}
							</NavLink>
							<p className="mt-1 text-xs text-slate-500">{display(employee.employeeId)} | {display(employee.employeeCode)}</p>
						</TableCell>

						<TableCell>{display(employee.employment?.designation, "Not Assigned")}</TableCell>

						<TableCell>
							{display(employee.employment?.employeeType)}
						</TableCell>

						<TableCell>
							{display(employee.employment?.workLocation)}
						</TableCell>

						<TableCell>
							{display(employee.employment?.manager?.name)}
						</TableCell>

						<TableCell className="text-center">
							<span
								className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
									STATUS_COLORS[
										employee.employment?.status
									] || "bg-slate-100 text-slate-700"
								}`}
							>
								{employee.employment?.status}
							</span>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

DepartmentDetailsTable.propTypes = {
	employees: PropTypes.array.isRequired,
};

export default DepartmentDetailsTable;
