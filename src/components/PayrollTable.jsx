import { Eye } from "lucide-react";
import PropTypes from "prop-types";

import {
	Table,
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from "./common/DataTable";
import { PAYROLL_STATUS_COLORS } from "../constants/EMSconstants";

const PayrollTable = ({ payrolls }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Employee</TableHeader>
					<TableHeader className="text-left">Department</TableHeader>
					<TableHeader className="text-left">
						Gross Salary
					</TableHeader>
					<TableHeader className="text-left">Deductions</TableHeader>
					<TableHeader className="text-left">Net Salary</TableHeader>
					<TableHeader className="text-left">Month</TableHeader>
					<TableHeader className="text-right">Status</TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{payrolls.map((employee) => (
					<TableRow key={employee.id}>
						<TableCell>
							<div className="flex items-center gap-3">
								<img
									src={employee.personalInfo.profileImage}
									alt={employee.personalInfo.fullName}
									className="h-10 w-10 rounded-full object-cover"
								/>

								<div>
									<p className="font-medium">
										{employee.personalInfo.fullName}
									</p>

									<p className="text-xs text-slate-500">
										{employee.employeeCode} |{" "}
										{employee.employeeId}
									</p>
								</div>
							</div>
						</TableCell>

						<TableCell>
							{employee.employment.departmentName}
						</TableCell>

						<TableCell>
							₹
							{employee.recentPayslip.grossSalary.toLocaleString()}
						</TableCell>

						<TableCell>
							₹
							{employee.recentPayslip.deductions.toLocaleString()}
						</TableCell>

						<TableCell className="font-semibold text-emerald-600">
							₹{employee.recentPayslip.netSalary.toLocaleString()}
						</TableCell>

						<TableCell>
							{employee.recentPayslip.month}{" "}
							{employee.recentPayslip.year}
						</TableCell>

						<TableCell className="text-right">
							<span
								className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
									PAYROLL_STATUS_COLORS[
										employee.recentPayslip.status
									] || "bg-slate-100 text-slate-700"
								}`}
							>
								{employee.recentPayslip?.status}
							</span>
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
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,

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
};

export default PayrollTable;
