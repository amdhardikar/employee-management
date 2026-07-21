import PropTypes from "prop-types";
import { PAYROLL_STATUS_COLORS } from "../constants/EMSconstants";
import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardContent,
   CardItem,
   CardGrid
} from "./common/InfoCard";

const PayrollCard = ({ employee }) => {
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
						<CardTitle className="text-sm">
							{employee.personalInfo?.fullName}
						</CardTitle>

						<CardSubtitle>
							{employee.employment?.departmentName}
						</CardSubtitle>
					</div>
				</div>

				<span
					className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
						PAYROLL_STATUS_COLORS[payslip.status] ||
						"bg-slate-100 text-slate-700"
					}`}
				>
					{payslip.status}
				</span>
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
};

export default PayrollCard;
