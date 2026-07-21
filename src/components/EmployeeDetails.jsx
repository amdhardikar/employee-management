import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { employeeApi } from "../api/employeeApi";
import { Mail, Phone } from "lucide-react";
import PageLoader from "./common/PageLoader";
import { STATUS_COLORS } from "../constants/EMSconstants";
import NotFound from "./common/NotFound";

const EmployeeDetails = () => {
	const { id } = useParams();
	const [employee, setEmployee] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadEmployee = async () => {
			try {
				setLoading(true);

				const data = await employeeApi.getById(id);

				if (data?.length > 0) {
					setEmployee(data[0]);
				} else {
					setEmployee(null);
				}
			} finally {
				setLoading(false);
			}
		};
		loadEmployee();
	}, []);

	if (loading) {
		return <PageLoader text="Loading employee details..." />;
	}

	if (!employee) {
		return (
			<NotFound
				title="Employee Not Found"
				message={`No employee exists with ID "${id}".`}
			/>
		);
	}

	return (
		<div className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:p-6">
				<div className="flex items-start gap-4">
					<img
						src={employee.personalInfo.profileImage}
						alt={employee.personalInfo.fullName}
						className="h-16 w-16 shrink-0 rounded-full object-cover md:h-24 md:w-24"
					/>

					<div className="min-w-0 flex-1">
						<h1 className="text-lg font-semibold text-slate-900 md:text-2xl">
							{employee.personalInfo.fullName}
						</h1>
						<div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 shrink-0 text-slate-600" />

								<span className="text-sm break-all text-slate-600">
									{employee.personalInfo.email}
								</span>
							</div>

							<div className="flex items-center gap-2">
								<Phone className="h-4 w-4 shrink-0 text-slate-600" />

								<span className="text-sm text-slate-600">
									{employee.personalInfo.phone}
								</span>
							</div>
						</div>

						<div className="mt-2 flex gap-2 md:hidden">
							<span className="text-sm text-slate-600">
								{employee.employment.designation}
							</span>

							<span className="inline text-slate-600">|</span>

							<span className="text-sm text-slate-600">
								{employee.employeeCode}
							</span>
						</div>

						<div className="mt-2 hidden md:flex md:flex-wrap md:items-center md:gap-2">
							<span className="text-sm text-slate-600">
								{employee.employment.designation}
							</span>

							<span className="inline text-slate-600">|</span>

							<span className="text-sm text-slate-600">
								{employee.employeeCode}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="grid gap-4 md:gap-6 lg:grid-cols-2">
				<SectionCard title="Personal Information">
					<InfoRow
						label="Gender"
						value={employee.personalInfo.gender}
					/>
					<InfoRow
						label="Date of Birth"
						value={new Date(
							employee.personalInfo.dateOfBirth,
						).toLocaleDateString()}
					/>
					<InfoRow
						label="Marital Status"
						value={employee.personalInfo.maritalStatus}
					/>
					<InfoRow
						label="Blood Group"
						value={employee.personalInfo.bloodGroup}
					/>
					<InfoRow
						label="Nationality"
						value={employee.personalInfo.nationality}
					/>
					<InfoRow
						label="Alternate Phone"
						value={employee.personalInfo.alternatePhone}
					/>
				</SectionCard>

				<SectionCard title="Year Attendance">
					<InfoRow
						label="Attendance"
						value={`${employee.attendance.attendancePercentage}%`}
					/>
					<InfoRow
						label="Present"
						value={employee.attendance.totalPresentDays}
					/>
					<InfoRow
						label="Absent"
						value={employee.attendance.totalAbsentDays}
					/>
					<InfoRow
						label="Late Entries"
						value={employee.attendance.totalLateEntries}
					/>
					<InfoRow
						label="Leave Days"
						value={employee.attendance.totalLeaveDays}
					/>
				</SectionCard>

				<SectionCard title="Employment">
					<InfoRow
						label="Department"
						value={employee.employment.departmentName}
					/>
					<InfoRow
						label="Employee Type"
						value={employee.employment.employeeType}
					/>
					<InfoRow
						label="Work Mode"
						value={employee.employment.workMode}
					/>
					<InfoRow
						label="Location"
						value={employee.employment.workLocation}
					/>
					<InfoRow
						label="Joining Date"
						value={employee.employment.joiningDate}
					/>
					<InfoRow
						label="Probation End Date"
						value={new Date(
							employee.employment.probationEndDate,
						).toLocaleDateString()}
					/>

					<InfoRow
						label="Manager"
						value={
							employee.employment.manager?.name || "Not Assigned"
						}
					/>
				</SectionCard>

				<SectionCard title="Salary Details">
					<InfoRow
						label="CTC"
						value={`₹${employee.salary.employeeCTC.toLocaleString()}`}
					/>
					<InfoRow
						label="Monthly Gross"
						value={`₹${employee.salary.monthlyGross.toLocaleString()}`}
					/>
					<InfoRow
						label="Basic"
						value={`₹${employee.salary.basic.toLocaleString()}`}
					/>
					<InfoRow
						label="HRA"
						value={`₹${employee.salary.hra.toLocaleString()}`}
					/>
					<InfoRow
						label="Special Allowance"
						value={`₹${employee.salary.specialAllowance.toLocaleString()}`}
					/>
					<InfoRow
						label="PF"
						value={`₹${employee.salary.pf.toLocaleString()}`}
					/>
					<InfoRow
						label="Professional Tax"
						value={`₹${employee.salary.professionalTax.toLocaleString()}`}
					/>
					<InfoRow
						label="Other Deductions"
						value={`₹${employee.salary.otherDeductions.toLocaleString()}`}
					/>
					<InfoRow
						label="Net Salary"
						value={`₹${employee.salary.netSalary.toLocaleString()}`}
					/>
				</SectionCard>

				<SectionCard title="Performance">
					<InfoRow
						label="Current Rating"
						value={employee.performance.currentRating}
					/>

					<InfoRow
						label="Promotion Eligible"
						value={
							employee.performance.promotionEligible
								? "Yes"
								: "No"
						}
					/>

					<InfoRow
						label="Last Appraisal"
						value={new Date(
							employee.performance.lastAppraisalDate,
						).toLocaleDateString()}
					/>
				</SectionCard>

				<SectionCard title="Bank Details">
					<InfoRow
						label="Bank Name"
						value={employee.bankDetails.bankName}
					/>
					<InfoRow
						label="Account Number"
						value={employee.bankDetails.accountNumber}
					/>
					<InfoRow
						label="IFSC Code"
						value={employee.bankDetails.ifscCode}
					/>
					<InfoRow
						label="Branch"
						value={employee.bankDetails.branch}
					/>
				</SectionCard>

				<SectionCard title="Leave Balance">
					<InfoRow
						label="Casual Leaves"
						value={employee.leaveBalance.casualLeave.allocated}
					/>
					<InfoRow
						label="Sick Leaves"
						value={employee.leaveBalance.sickLeave.allocated}
					/>
					<InfoRow
						label="Earned Leaves"
						value={employee.leaveBalance.earnedLeave.allocated}
					/>
					<InfoRow
						label="Allocated Leaves"
						value={employee.leaveBalance.totalAllocated}
					/>
				</SectionCard>

				<SectionCard title="Recent Payslip">
					<InfoRow
						label="Month"
						value={`${employee.recentPayslip.month} ${employee.recentPayslip.year}`}
					/>
					<InfoRow
						label="Gross Salary"
						value={`₹${employee.recentPayslip.grossSalary.toLocaleString()}`}
					/>
					<InfoRow
						label="Deductions"
						value={`₹${employee.recentPayslip.deductions.toLocaleString()}`}
					/>
					<InfoRow
						label="Net Salary"
						value={`₹${employee.recentPayslip.netSalary.toLocaleString()}`}
					/>
					<InfoRow
						label="Status"
						value={employee.recentPayslip.status}
					/>
				</SectionCard>

				<SectionCard title="Address">
					<div className="space-y-4">
						<div>
							<p className="text-sm text-slate-500">
								Current Address
							</p>

							<p className="mt-1.5 text-sm">
								{employee.address.currentAddress.street},
								{employee.address.currentAddress.city}
							</p>
						</div>

						<div>
							<p className="text-sm text-slate-500">
								Permanent Address
							</p>
							<p className="mt-1.5 text-sm">
								{employee.address.permanentAddress.street},
								{employee.address.permanentAddress.city}
							</p>
						</div>
					</div>
				</SectionCard>

				<SectionCard title="Emergency Contact">
					<InfoRow
						label="Name"
						value={employee.emergencyContact.name}
					/>
					<InfoRow
						label="Relationship"
						value={employee.emergencyContact.relationship}
					/>
					<InfoRow
						label="Phone"
						value={employee.emergencyContact.phone}
					/>
				</SectionCard>
			</div>

			<SectionCard title="Skills">
				<div className="flex flex-wrap gap-2">
					{employee.performance.skills.map((skill) => (
						<span
							key={skill}
							className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium md:text-sm"
						>
							{skill}
						</span>
					))}
				</div>
			</SectionCard>

			<SectionCard title="Documents">
				<div className="">
					{employee.documents.map((doc) => (
						<div
							key={doc.id}
							className="flex flex-row items-center justify-between gap-2 border-b border-slate-200 py-3 last:border-none"
						>
							<span className="text-sm">{doc.type}</span>

							<span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
								{doc.status}
							</span>
						</div>
					))}
				</div>
			</SectionCard>
		</div>
	);
};

function InfoRow({ label, value }) {
	return (
		<div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
			<span className="text-sm text-slate-500">{label}</span>

			<span className="wrap-break-words text-sm font-medium text-slate-900 sm:text-right">
				{value}
			</span>
		</div>
	);
}

function SectionCard({ title, children, action }) {
	return (
		<div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:p-6">
			<div className="mb-2 flex items-center justify-between">
				<h3 className="text-base font-semibold text-slate-900 md:text-lg">
					{title}
				</h3>

				{action}
			</div>

			{children}
		</div>
	);
}

InfoRow.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

SectionCard.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	action: PropTypes.node,
};

export default EmployeeDetails;
