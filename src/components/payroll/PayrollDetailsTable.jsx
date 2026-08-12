/**
 * @fileoverview Renders payroll details table data in the desktop table presentation. It defines the domain-specific columns, formats status and values consistently, and invokes supplied view/edit/delete callbacks without owning navigation or server state.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/payroll/PayrollDetailsTable
 */
import PropTypes from "prop-types";
import { PAYROLL_STATUS_COLORS } from "../../constants/EMSconstants";
import { currency, date } from "../../utils/formatter";
import {
	Table,
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from "../common/DataTable";

/**
 * Renders the payroll details table interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object} props.payroll - Payroll record to display.
 * @returns {JSX.Element} Rendered React user interface.
 */
const PayrollDetailsTable = ({ payroll }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Payroll ID</TableHeader>
					<TableHeader className="text-left">Month</TableHeader>
					<TableHeader className="text-center">Year</TableHeader>
					<TableHeader className="text-right">
						Gross Salary
					</TableHeader>
					<TableHeader className="text-right">
						Total Deductions
					</TableHeader>
					<TableHeader className="text-right">Net Salary</TableHeader>
					<TableHeader className="text-center">
						Payment Date
					</TableHeader>
					<TableHeader className="text-center">Status</TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{payroll.map((item) => (
					<TableRow key={item.id}>
						<TableCell className="font-medium">
							{item.payrollId}
						</TableCell>

						<TableCell>{item.monthName}</TableCell>

						<TableCell className="text-center">
							{item.year}
						</TableCell>

						<TableCell className="text-right">
							{currency(item.grossSalary)}
						</TableCell>

						<TableCell className="text-right">
							{currency(
								item.deductions?.totalDeductions || 0,
							)}
						</TableCell>

						<TableCell className="text-right font-semibold text-green-600">
							{currency(item.netSalary)}
						</TableCell>

						<TableCell className="text-center">
							{date(item.paymentDate, "-")}
						</TableCell>

						<TableCell className="text-center">
							<span
								className={`rounded-full px-3 py-1 text-sm font-medium ${
									PAYROLL_STATUS_COLORS[item.status]
								}`}
							>
								{item.status}
							</span>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

PayrollDetailsTable.propTypes = {
	payroll: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			payrollId: PropTypes.string.isRequired,
			monthName: PropTypes.string.isRequired,
			year: PropTypes.number.isRequired,
			grossSalary: PropTypes.number.isRequired,
			netSalary: PropTypes.number.isRequired,
			paymentDate: PropTypes.string.isRequired,
			status: PropTypes.string.isRequired,
			deductions: PropTypes.shape({
				totalDeductions: PropTypes.number,
			}),
		}),
	).isRequired,
};

export default PayrollDetailsTable;
