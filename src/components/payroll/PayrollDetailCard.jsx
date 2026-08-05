import PropTypes from "prop-types";
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardItem } from "../common/InfoCard";
import { PAYROLL_STATUS_COLORS } from "../../constants/EMSconstants";

const formatCurrency = (amount) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(amount);

const PayrollDetailCard = ({ item }) => {
	return (
		<Card className="rounded-sm">
			<CardHeader className="items-center">
				<div>
					<CardTitle className="text-sm">{item.monthName}</CardTitle>

					<CardSubtitle>{item.year}</CardSubtitle>
				</div>

				<span className={`rounded-full px-2 py-1 text-xs font-medium ${PAYROLL_STATUS_COLORS[item.status]}`}>
					{item.status}
				</span>
			</CardHeader>

			<CardContent className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
				<CardItem variant="horizontal" label="Payroll ID" value={item.payrollId} />

				<CardItem variant="horizontal" label="Gross Salary" value={formatCurrency(item.grossSalary)} />

				<CardItem
					variant="horizontal"
					label="Deductions"
					value={formatCurrency(item.deductions?.totalDeductions || 0)}
				/>

				<CardItem
					variant="horizontal"
					label="Net Salary"
					value={formatCurrency(item.netSalary)}
					valueClassName="font-semibold text-green-600"
				/>

				<CardItem
					variant="horizontal"
					label="Date"
					value={new Date(item.paymentDate).toLocaleDateString("en-IN")}
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
