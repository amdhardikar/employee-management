/**
 * @fileoverview Renders one payroll detail record in the responsive card presentation. It highlights the most important summary fields and status and delegates navigation or actions through its callback properties.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/payroll/PayrollDetailCard
 */
import PropTypes from "prop-types";
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardItem } from "../common/InfoCard";
import { PAYROLL_STATUS_COLORS } from "../../constants/EMSconstants";
import { currency, date, display } from "../../utils/formatter";

/**
 * Renders the payroll detail card interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object} props.item - Domain record rendered by this card.
 * @returns {JSX.Element} Rendered React user interface.
 */
const PayrollDetailCard = ({ item }) => {
	return (
		<Card className="rounded-sm">
			<CardHeader className="items-center">
				<div>
					<CardTitle className="text-sm">{display(item.monthName)}</CardTitle>

					<CardSubtitle>{display(item.year)}</CardSubtitle>
				</div>

				<span className={`rounded-full px-2 py-1 text-xs font-medium ${PAYROLL_STATUS_COLORS[item.status]}`}>
					{item.status}
				</span>
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm md:grid-cols-2">
				<CardItem variant="horizontal" label="Payroll ID" value={display(item.payrollId)} />

				<CardItem variant="horizontal" label="Gross Salary" value={currency(item.grossSalary)} />

				<CardItem
					variant="horizontal"
					label="Deductions"
					value={currency(item.deductions?.totalDeductions || 0)}
				/>

				<CardItem
					variant="horizontal"
					label="Net Salary"
					value={currency(item.netSalary)}
					valueClassName="font-semibold text-green-600"
				/>

				<CardItem
					variant="horizontal"
					label="Date"
					value={date(item.paymentDate)}
				/>
			</CardContent>
		</Card>
	);
};

PayrollDetailCard.propTypes = {
	item: PropTypes.shape({
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
	}).isRequired,
};

export default PayrollDetailCard;
