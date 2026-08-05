import PropTypes from "prop-types";
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
} from "../common/InfoCard";
import { Eye } from "lucide-react";

const PayrollCard = ({ employee, onView }) => {
	const payslip = employee.recentPayslip;

	return (
		<Card className="rounded-sm">
			<CardHeader className="items-center gap-3">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<img
						src={employee.personalInfo?.profileImage}
						alt={employee.personalInfo?.fullName}
						className="h-12 w-12 rounded-full object-cover"
					/>

					<div className="min-w-0 flex-1">
						<CardTitle className="text-sm">{employee.fullName}</CardTitle>
						<CardSubtitle className="mt-1">
							{employee.employeeCode} | {employee.employeeId}
						</CardSubtitle>
						<CardSubtitle>{employee.employment?.departmentName}</CardSubtitle>
					</div>
				</div>

				<CardAction onClick={() => onView(employee)}>
					<Eye className="h-4 w-4" />
				</CardAction>
			</CardHeader>

			<CardContent>
				<CardGrid>
					<CardItem
						label="Net Salary"
						value={`₹${payslip.netSalary.toLocaleString()}`}
						valueClassName="text-emerald-600 font-semibold"
					/>

					<CardItem label="Month" value={payslip.month} />

					<CardItem
						label="Gross Salary"
						value={`₹${payslip.grossSalary.toLocaleString()}`}
						valueClassName="text-emerald-600 font-semibold"
					/>

					<CardItem
						label="Deduction"
						value={`₹${payslip.deductions.toLocaleString()}`}
						valueClassName="text-emerald-600 font-semibold"
					/>
				</CardGrid>
			</CardContent>
		</Card>
	);
};

PayrollCard.propTypes = {
	employee: PropTypes.object.isRequired,
	onView: PropTypes.func,
};

export default PayrollCard;
