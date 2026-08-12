/**
 * @fileoverview Loads the employee identified by the route and presents their complete profile in grouped information cards. It formats personal, address, employment, reporting, bank, emergency, and salary data and handles loading, request failure, missing records, and edit navigation.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/employee/EmployeeDetails
 */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { employeeApi } from "../../api/employeeApi";
import { Mail, Phone } from "lucide-react";
import PageLoader from "../common/PageLoader";
import NotFound from "../common/NotFound";
import ErrorState from "../common/ErrorState";
import { display, date, currency, address, phone, mask } from "../../utils/formatter";
import ProfileImage from "../common/ProfileImage";
import logger from "../../logging/logger";

/**
 * Renders the employee details interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const EmployeeDetails = () => {
	const { id } = useParams();
	const [employee, setEmployee] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState("overview");

	const tabs = [
		{ id: "overview", label: "Overview" },
		{ id: "employment", label: "Employment" },
		{ id: "payroll", label: "Payroll" },
		{ id: "attendance", label: "Attendance" },
		{ id: "performance", label: "Performance" },
		{ id: "documents", label: "Documents" },
		{ id: "contact", label: "Contact" },
		{ id: "leave", label: "Leave Balance" },
	];

	useEffect(() => {
		const loadEmployee = async () => {
			try {
				setLoading(true);
				setError(null);

				const data = await employeeApi.getById(id);

				if (data) {
					setEmployee(data);
				} else {
					setEmployee(null);
				}
			} catch (err) {
				logger.error("Unable to load employee details", err);
				setError({
					message: err.message || "Unable to load employee details",
				});
			} finally {
				setLoading(false);
			}
		};
		loadEmployee();
	}, [id]);

	if (loading) {
		return <PageLoader text="Loading employee details..." />;
	}

	if (error) {
		return (
			<ErrorState
				title="Unable to load employee details"
				message={`Reason : ${error?.message || "Something went wrong"}`}
			/>
		);
	}

	if (!employee) {
		return <NotFound title="Employee Not Found" message={`No employee exists with ID "${id}".`} />;
	}

	const emailSeparatorIndex = employee.email?.indexOf("@") ?? -1;

	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return (
					<div className="grid gap-4 md:gap-6 lg:grid-cols-2">
						<SectionCard title="Personal Information">
							<InfoRow label="Gender" value={employee.personalInfo.gender} />
							<InfoRow label="Date of Birth" value={date(employee.personalInfo.dateOfBirth)} />
							<InfoRow label="Marital Status" value={employee.personalInfo.maritalStatus} />
							<InfoRow label="Blood Group" value={employee.personalInfo.bloodGroup} />
							<InfoRow label="Nationality" value={employee.personalInfo.nationality} />
						</SectionCard>

						<SectionCard title="Address">
							<div className="space-y-4">
								<div>
									<p className="text-sm text-slate-500">Current Address</p>
									<p className="mt-1 text-sm">{address(employee.address.currentAddress)}</p>
								</div>

								<div>
									<p className="text-sm text-slate-500">Permanent Address</p>
									<p className="mt-1 text-sm">{address(employee.address.permanentAddress)}</p>
								</div>
							</div>
						</SectionCard>
					</div>
				);

			case "employment":
				return (
					<div>
						<SectionCard title="Employment">
							<InfoRow label="Department" value={employee.employment.departmentName ?? "Not Assigned"} />
							<InfoRow label="Department ID" value={employee.employment.departmentId ?? "Not Assigned"} />
							<InfoRow label="Designation" value={employee.employment.designation ?? "Not Assigned"} />
							<InfoRow
								label="Designation ID"
								value={employee.employment.designationId ?? "Not Assigned"}
							/>
							<InfoRow label="Joining Date" value={date(employee.employment.joiningDate)} />
							<InfoRow label="Employee Type" value={employee.employment.employeeType} />
							<InfoRow label="Work Mode" value={employee.employment.workMode} />
							<InfoRow label="Work Location" value={employee.employment.workLocation} />
							<InfoRow label="Status" value={employee.employment.status} />
							<InfoRow label="Probation End Date" value={date(employee.employment.probationEndDate)} />
							<InfoRow label="Probation Status" value={employee.employment.probationStatus} />
							<InfoRow label="Team Lead" value={employee.employment.lead?.name ?? "Not Assigned"} />
							<InfoRow label="Manager" value={employee.employment.manager?.name ?? "Not Assigned"} />
							<InfoRow label="HR" value={employee.employment.hr?.name ?? "Not Assigned"} />
						</SectionCard>
					</div>
				);

			case "payroll":
				return (
					<div className="grid gap-4 md:gap-6 lg:grid-cols-3">
						<SectionCard title="Salary Details">
							<InfoRow label="CTC" value={currency(employee.salary.employeeCTC)} />
							<InfoRow label="Net Salary" value={currency(employee.salary.netSalary)} />
							<InfoRow label="Monthly Gross" value={currency(employee.salary.monthlyGross)} />
							<InfoRow label="Basic Salary" value={currency(employee.salary.basic)} />
							<InfoRow label="HRA" value={currency(employee.salary.hra)} />
							<InfoRow label="Special Allowance" value={currency(employee.salary.specialAllowance)} />
							<InfoRow label="PF" value={currency(employee.salary.pf)} />
							<InfoRow label="Professional Tax" value={currency(employee.salary.professionalTax)} />
							<InfoRow label="Other Deductions" value={currency(employee.salary.otherDeductions)} />
							<InfoRow label="Currency" value={employee.salary.currency} />
						</SectionCard>

						<SectionCard title="Bank Details">
							<InfoRow label="Bank" value={employee.bankDetails.bankName} />
							<InfoRow label="Account" value={mask(employee.bankDetails.accountNumber)} />
							<InfoRow label="IFSC Code" value={employee.bankDetails.ifscCode} />
							<InfoRow label="Branch" value={employee.bankDetails.branch} />
						</SectionCard>
						<SectionCard title="Recent Payslip">
							<InfoRow
								label="Month"
								value={`${employee.recentPayslip.month} ${employee.recentPayslip.year}`}
							/>
							<InfoRow label="Gross Salary" value={currency(employee.recentPayslip.grossSalary)} />
							<InfoRow label="Deductions" value={currency(employee.recentPayslip.deductions)} />
							<InfoRow label="Net Salary" value={currency(employee.recentPayslip.netSalary)} />
							<InfoRow label="Status" value={employee.recentPayslip.status} />
						</SectionCard>
					</div>
				);

			case "attendance":
				return (
					<SectionCard title="Attendance">
						<InfoRow label="Attendance %" value={`${employee.attendance.attendancePercentage}%`} />
						<InfoRow label="Present" value={employee.attendance.totalPresentDays} />
						<InfoRow label="Absent" value={employee.attendance.totalAbsentDays} />
						<InfoRow label="Working Days" value={employee.attendance.totalWorkingDays} />
						<InfoRow label="Leave Days" value={employee.attendance.totalLeaveDays} />
						<InfoRow label="Late Entries" value={employee.attendance.totalLateEntries} />
						<InfoRow label="Late Leave Equivalent" value={employee.attendance.totalLateLeaveEquivalent} />
						<InfoRow label="Updated Year" value={employee.attendance.lastUpdatedYear} />
					</SectionCard>
				);

			case "performance":
				return (
					<div className="space-y-4">
						<SectionCard title="Performance">
							<InfoRow label="Current Rating" value={employee.performance.currentRating} />
							<InfoRow
								label="Promotion Eligible"
								value={employee.performance.promotionEligible ? "Yes" : "No"}
							/>
							<InfoRow label="Rating Scale" value={employee.performance.ratingScale} />
							<InfoRow
								label="Last Appraisal"
								value={
									employee.performance.lastAppraisalDate
										? new Date(employee.performance.lastAppraisalDate).toLocaleDateString()
										: "Not Available"
								}
							/>
						</SectionCard>

						<SectionCard title="Skills">
							{employee.performance.skills?.length ? (
								<div className="flex flex-wrap gap-2">
									{employee.performance.skills.map((skill) => (
										<span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
											{skill}
										</span>
									))}
								</div>
							) : (
								<span className="text-sm text-slate-500">—</span>
							)}
						</SectionCard>
					</div>
				);

			case "documents":
				return (
					<SectionCard title="Documents">
						{employee.documents.map((doc) => (
							<div
								key={doc.id}
								className="flex items-center justify-between border-b border-slate-300 py-3"
							>
								<p className="flex flex-col text-sm">
									<span>{doc.type}</span>
								</p>

								<span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
									{doc.status}
								</span>
							</div>
						))}
					</SectionCard>
				);

			case "contact":
				return (
					<div className="grid gap-4 md:gap-6 lg:grid-cols-2">
						<SectionCard title="Contact">
							<InfoRow label="Email" value={employee.email} />
							<InfoRow label="Phone" value={phone(employee.personalInfo.phone)} />
							<InfoRow label="Alternate Phone" value={phone(employee.personalInfo.alternatePhone)} />
						</SectionCard>

						<SectionCard title="Emergency Contact">
							<InfoRow label="Name" value={employee.emergencyContact.name} />
							<InfoRow label="Relationship" value={employee.emergencyContact.relationship} />
							<InfoRow label="Phone" value={phone(employee.emergencyContact.phone)} />
						</SectionCard>
					</div>
				);
			case "leave":
				return (
					<SectionCard title="Leave Balance">
						<InfoRow
							label="Casual Leave"
							value={`${employee.leaveBalance.casualLeave.remaining}/${employee.leaveBalance.casualLeave.allocated}`}
						/>
						<InfoRow
							label="Sick Leave"
							value={`${employee.leaveBalance.sickLeave.remaining}/${employee.leaveBalance.sickLeave.allocated}`}
						/>
						<InfoRow
							label="Earned Leave"
							value={`${employee.leaveBalance.earnedLeave.remaining}/${employee.leaveBalance.earnedLeave.allocated}`}
						/>
						<InfoRow label="Total Remaining" value={employee.leaveBalance.totalRemaining} />
					</SectionCard>
				);

		}
	};

	return (
		<div className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:p-6">
				<div className="flex flex-col items-start gap-3 md:flex-row md:gap-4">
					<ProfileImage
						src={employee.personalInfo.profileImage}
						name={employee.fullName}
						eager
						className="h-16 w-16 shrink-0 rounded-full object-cover md:h-24 md:w-24"
					/>

					<div className="min-w-0 flex-1">
						<h1 className="text-lg font-semibold text-slate-900 md:text-2xl">{employee.fullName}</h1>
						<div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 shrink-0 text-slate-600" />
								<span className="min-w-0 text-sm text-slate-600">
									{emailSeparatorIndex >= 0 ? (
										<>
											{employee.email.slice(0, emailSeparatorIndex + 1)}
											<wbr />
											{employee.email.slice(emailSeparatorIndex + 1)}
										</>
									) : (
										employee.email
									)}
								</span>
							</div>

							<div className="flex items-center gap-2">
								<Phone className="h-4 w-4 shrink-0 text-slate-600" />
								<span className="text-sm text-slate-600">{phone(employee.personalInfo.phone)}</span>
							</div>
						</div>

						<div className="mt-2 flex flex-wrap gap-2 md:hidden">
							<span className="text-sm text-slate-600">{display(employee.employment.departmentName)}</span>
							<span className="text-slate-600">|</span>
							<span className="text-sm text-slate-600">{display(employee.employment.designation)}</span>
						</div>

						<div className="mt-2 hidden md:flex md:flex-wrap md:items-center md:gap-2">
							{employee.employment.designation && (
								<span className="text-sm text-slate-600">{employee.employment.designation}</span>
							)}

							{employee.employment.designation && employee.employeeCode && (
								<span className="inline text-slate-600">|</span>
							)}

							{employee.employeeCode && (
								<span className="text-sm text-slate-600">{employee.employeeCode}</span>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="md:hidden">
				<label htmlFor="employee-detail-section" className="mb-2 block text-sm font-medium text-slate-700">
					Profile section
				</label>
				<select
					id="employee-detail-section"
					aria-label="Employee detail sections"
					value={activeTab}
					onChange={(event) => setActiveTab(event.target.value)}
					className="w-full rounded-sm border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
				>
					{tabs.map((tab) => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
				</select>
			</div>

			<div className="grid items-start gap-4 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
				<nav aria-label="Employee detail sections" className="sticky top-0 hidden rounded-sm border border-slate-200 bg-white p-2 shadow-sm md:block">
					<p className="px-3 py-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">Profile sections</p>
					<div className="space-y-1">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								aria-current={activeTab === tab.id ? "page" : undefined}
								className={`w-full rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
							>
								{tab.label}
							</button>
						))}
					</div>
				</nav>
				<main className="min-w-0">{renderTabContent()}</main>
			</div>
		</div>
	);
};

function InfoRow({ label, value }) {
	return (
		<div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
			<span className="text-sm text-slate-500">{label}</span>
			<span className="wrap-break-words text-sm font-medium text-slate-900 sm:text-right">{display(value)}</span>
		</div>
	);
}

function SectionCard({ title, children, action }) {
	return (
		<div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:p-6">
			<div className="mb-2 flex items-center justify-between">
				<h3 className="text-base font-semibold text-slate-900 md:text-lg">{title}</h3>

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
