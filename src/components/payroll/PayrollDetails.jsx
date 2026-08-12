/**
 * @fileoverview Loads and presents payroll history for the employee selected by the current route. It derives record, gross-pay, deduction, and net-pay summaries, renders responsive detailed records, and handles loading, failure, or missing-data states.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/payroll/PayrollDetails
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLoader from "../common/PageLoader";
import NotFound from "../common/NotFound";
import ErrorState from "../common/ErrorState";
import { payrollApi } from "../../api/payrollApi";
import { employeeApi } from "../../api/employeeApi";
import PayrollDetailsTable from "./PayrollDetailsTable";
import PayrollDetailCard from "./PayrollDetailCard";
import StatCard from "../common/StatCard";
import { currency, display } from "../../utils/formatter";
import { Banknote, CircleDollarSign, FileText, ReceiptIndianRupee } from "lucide-react";
import ProfileImage from "../common/ProfileImage";

/**
 * Renders the payroll details interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const PayrollDetails = () => {
	const { id } = useParams();
	const [employee, setEmployee] = useState(null);
	const [payroll, setPayroll] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadPayrollDetails = async () => {
			try {
				setLoading(true);
				setError(null);
				const [payrollData, employeeData] = await Promise.all([
					payrollApi.getByEmployeeId(id),
					employeeApi.getById(id),
				]);

				setPayroll(payrollData);
				setEmployee(employeeData);
			} catch (error) {
				setPayroll([]);
				setError(error);
			} finally {
				setLoading(false);
			}
		};
		loadPayrollDetails();
	}, [id]);

	if (loading) {
		return <PageLoader text="Loading payroll details..." />;
	}

	if (error) {
		return (
			<ErrorState
				title="Unable to load payroll details"
				message={`Reason : ${error.message || "Something went wrong"}`}
			/>
		);
	}

	if (payroll.length === 0) {
		return <NotFound title="Payroll Not Found" message={`No payroll records exist for employee "${id}".`} />;
	}

	const totals = payroll.reduce(
		(summary, item) => ({
			gross: summary.gross + (Number(item.grossSalary) || 0),
			deductions: summary.deductions + (Number(item.deductions?.totalDeductions) || 0),
			net: summary.net + (Number(item.netSalary) || 0),
		}),
		{ gross: 0, deductions: 0, net: 0 },
	);

	return (
		<>
			<div className="bg-white px-4 py-3 md:px-6">
				<div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
					<div className="flex min-w-0 flex-row items-center gap-3 overflow-hidden md:gap-3">
						<ProfileImage
							src={employee?.personalInfo?.profileImage}
							name={display(employee?.fullName)}
							eager
							className="h-14 w-14 shrink-0 rounded-full object-cover md:h-20 md:w-20"
						/>
						<div className="min-w-0 flex-1 space-y-1">
							<h2 className="text-lg font-semibold text-slate-900 lg:text-xl">
								{display(employee?.fullName)}
							</h2>
							<div className="space-y-1 text-sm text-slate-600 md:mt-2">
								<p>
									<span>{display(employee?.employment?.departmentName)}</span> |{" "}
									<span>{display(employee?.employment?.designation)}</span>
								</p>
								<p className="wrap-break-words wrap-anywhere">
									<span>{display(employee?.employeeCode)}</span> |{" "}
									<span>{display(employee?.employeeId)}</span>
								</p>
							</div>
						</div>
					</div>

					<div className="hidden lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:divide-x lg:divide-slate-200">
						<StatCard label="Payrolls" value={payroll.length} />
						<StatCard label="Gross" value={currency(totals.gross)} />
						<StatCard label="Deductions" value={currency(totals.deductions)} />
						<StatCard label="Net Salary" value={currency(totals.net)} />
					</div>

					<div className="grid grid-cols-6 gap-3 py-3 lg:hidden">
						<StatCard
							className="col-span-2"
							label="Payrolls"
							value={payroll.length}
							icon={<FileText className="h-4 w-4 text-blue-600" />}
						/>
						<StatCard
							className="col-span-2"
							label="Gross"
							value={currency(totals.gross)}
							icon={<CircleDollarSign className="h-4 w-4 text-green-600" />}
						/>
						<StatCard
							className="col-span-2"
							label="Deductions"
							value={currency(totals.deductions)}
							icon={<ReceiptIndianRupee className="h-4 w-4 text-red-600" />}
						/>
						<StatCard
							className="col-span-6"
							label="Net Salary"
							value={currency(totals.net)}
							icon={<Banknote className="h-4 w-4 text-violet-600" />}
						/>
					</div>
				</div>
			</div>

			<div className="overflow-y-auto border-t border-slate-200 p-5">
				<div className="hidden lg:block">
					<PayrollDetailsTable payroll={payroll} />
				</div>

				<div className="grid gap-4 lg:hidden">
					{payroll.map((item) => (
						<PayrollDetailCard key={item.id} item={item} />
					))}
				</div>
			</div>
		</>
	);
};

export default PayrollDetails;
