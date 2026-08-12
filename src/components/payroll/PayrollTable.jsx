/**
 * @fileoverview Renders payroll table data in the desktop table presentation. It defines the domain-specific columns, formats status and values consistently, and invokes supplied view/edit/delete callbacks without owning navigation or server state.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/payroll/PayrollTable
 */
import { Eye } from "lucide-react";
import PropTypes from "prop-types";
import ProfileImage from "../common/ProfileImage";
import { currency } from "../../utils/formatter";

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../common/DataTable";
import { PAYROLL_STATUS_COLORS } from "../../constants/EMSconstants";

/**
 * Renders the payroll table interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {*} props.payrolls - The payrolls value required by this operation.
 * @param {Function} props.onView - Called with the selected record when the user requests details.
 * @returns {JSX.Element} Rendered React user interface.
 */
const PayrollTable = ({ payrolls, onView }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Employee</TableHeader>
					<TableHeader className="text-left">Designation</TableHeader>
					<TableHeader className="text-left">CTC</TableHeader>
					<TableHeader className="text-left">Monthly Gross</TableHeader>
					<TableHeader className="text-left">Net Salary</TableHeader>
					<TableHeader className="text-left">Deduction</TableHeader>
					<TableHeader className="text-left"></TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{payrolls.map((employee) => (
					<TableRow key={employee.id}>
						<TableCell>
							<div className="flex items-center gap-3">
								<ProfileImage
									src={employee.personalInfo.profileImage}
									name={employee.fullName}
									className="h-10 w-10 rounded-full object-cover"
								/>

								<div>
									<p className="font-medium">{employee.fullName}</p>

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

						<TableCell>{currency(employee.salary.employeeCTC)}</TableCell>

						<TableCell>{currency(employee.salary.monthlyGross)}</TableCell>

						<TableCell className="font-semibold">{currency(employee.salary.netSalary)}</TableCell>

						<TableCell>
							{currency(employee.salary.pf)}
							<p className="text-xs">{currency(employee.salary.professionalTax)}</p>
						</TableCell>
						<TableCell>
							<div className="flex justify-center gap-2">
								<button
									onClick={() => onView(employee)}
									className="rounded-md border border-blue-200 p-2 text-blue-700 transition-colors hover:bg-blue-50"
								>
									<Eye className="h-4 w-4" />
								</button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

PayrollTable.propTypes = {
	payrolls: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

			employeeId: PropTypes.string,
			employeeCode: PropTypes.string,

			personalInfo: PropTypes.shape({
				fullName: PropTypes.string,
				profileImage: PropTypes.string,
			}).isRequired,

			employment: PropTypes.shape({
				departmentName: PropTypes.string,
			}).isRequired,

			recentPayslip: PropTypes.shape({
				grossSalary: PropTypes.number,
				deductions: PropTypes.number,
				netSalary: PropTypes.number,
				month: PropTypes.string,
				year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				status: PropTypes.string,
			}).isRequired,
		}),
	).isRequired,
	onView: PropTypes.func,
};

export default PayrollTable;
