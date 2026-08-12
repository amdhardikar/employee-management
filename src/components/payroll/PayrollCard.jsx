/**
 * @fileoverview Renders one payroll record in the responsive card presentation. It highlights the most important summary fields and status and delegates navigation or actions through its callback properties.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/payroll/PayrollCard
 */
import PropTypes from "prop-types";
import { memo } from "react";
import { currency, display } from "../../utils/formatter";
import { PAYROLL_STATUS_COLORS } from "../../constants/EMSconstants";
import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardContent,
	CardItem,
	CardGrid,
	CardAction,
	CardFooter,
} from "../common/InfoCard";
import { Eye } from "lucide-react";
import ProfileImage from "../common/ProfileImage";

/**
 * Renders the payroll card interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object} props.employee - Employee domain record used by the component or operation.
 * @param {Function} props.onView - Called with the selected record when the user requests details.
 * @returns {JSX.Element} Rendered React user interface.
 */
const PayrollCard = ({ employee, onView }) => {
	const payslip = employee.recentPayslip || {};

	return (
		<Card className="rounded-sm">
			<CardHeader className="items-center gap-3">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<ProfileImage
						src={employee.personalInfo?.profileImage}
						name={display(employee.fullName ?? employee.personalInfo?.fullName)}
						className="h-12 w-12 rounded-full object-cover"
					/>

					<div className="min-w-0 flex-1">
						<CardTitle className="text-sm">{display(employee.fullName ?? employee.personalInfo?.fullName)}</CardTitle>
						<CardSubtitle className="mt-1">
							{display(employee.employeeCode)} | {display(employee.employeeId)}
						</CardSubtitle>
						<CardSubtitle>{display(employee.employment?.departmentName)}</CardSubtitle>
					</div>
				</div>

			</CardHeader>

			<CardContent>
				<CardGrid>
					<CardItem
						label="Net Salary"
						value={currency(payslip.netSalary)}
						valueClassName="text-emerald-600 font-semibold"
					/>

					<CardItem label="Month" value={display(payslip?.month)} />

					<CardItem
						label="Gross Salary"
						value={currency(payslip.grossSalary)}
						valueClassName="text-emerald-600 font-semibold"
					/>

					<CardItem
						label="Deduction"
						value={currency(payslip.deductions)}
						valueClassName="text-emerald-600 font-semibold"
					/>
				</CardGrid>
			</CardContent>
			<CardFooter className="border-t border-slate-100 pt-3">
				<CardAction ariaLabel="View payroll" onClick={() => onView(employee)} className="flex w-full items-center justify-center gap-2 border-blue-200 px-3 text-xs font-medium text-blue-700 hover:bg-blue-50">
					<Eye className="h-4 w-4" /> View details
				</CardAction>
			</CardFooter>
		</Card>
	);
};

PayrollCard.propTypes = {
	employee: PropTypes.object.isRequired,
	onView: PropTypes.func,
};

export default memo(PayrollCard);
