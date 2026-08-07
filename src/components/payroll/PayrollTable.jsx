import { Eye } from "lucide-react";
import PropTypes from "prop-types";

import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../common/DataTable";
import { PAYROLL_STATUS_COLORS } from "../../constants/EMSconstants";

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
								<img
									src={employee.personalInfo.profileImage}
									alt={employee.fullName}
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

						<TableCell>₹{employee.salary.employeeCTC.toLocaleString()}</TableCell>

						<TableCell>₹{employee.salary.monthlyGross.toLocaleString()}</TableCell>

						<TableCell className="font-semibold">₹{employee.salary.netSalary.toLocaleString()}</TableCell>

						<TableCell>
							₹{employee.salary.pf}
							<p className="text-xs">₹{employee.salary.professionalTax}</p>
						</TableCell>
						<TableCell>
							<div className="flex justify-center gap-2">
								<button
									onClick={() => onView(employee)}
									className="rounded-md border border-slate-200 p-2 hover:bg-slate-100"
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
