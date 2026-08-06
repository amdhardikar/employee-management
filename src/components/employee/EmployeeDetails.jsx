import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { employeeApi } from "../../api/employeeApi";
import { Mail, Phone } from "lucide-react";
import PageLoader from "../common/PageLoader";
import NotFound from "../common/NotFound";
import ErrorState from "../common/ErrorState";

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
            console.log(err)
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

	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return (
					<div className="grid gap-4 md:gap-6 lg:grid-cols-2">
						<SectionCard title="Personal Information">
							<InfoRow label="Gender" value={employee.personalInfo.gender} />
							<InfoRow
								label="Date of Birth"
								value={new Date(employee.personalInfo.dateOfBirth).toLocaleDateString()}
							/>
							<InfoRow label="Marital Status" value={employee.personalInfo.maritalStatus} />
							<InfoRow label="Blood Group" value={employee.personalInfo.bloodGroup} />
							<InfoRow label="Nationality" value={employee.personalInfo.nationality} />
						</SectionCard>

						<SectionCard title="Address">
							<div className="space-y-4">
								<div>
									<p className="text-sm text-slate-500">Current Address</p>

									<p className="mt-1 text-sm">
										{employee.address.currentAddress.street}, {employee.address.currentAddress.city}
										, {employee.address.currentAddress.state},{" "}
										{employee.address.currentAddress.country} -{" "}
										{employee.address.currentAddress.pincode}
									</p>
								</div>

								<div>
									<p className="text-sm text-slate-500">Permanent Address</p>

									<p className="mt-1 text-sm">
										{employee.address.permanentAddress.street},{" "}
										{employee.address.permanentAddress.city},{" "}
										{employee.address.permanentAddress.state},{" "}
										{employee.address.permanentAddress.country} -{" "}
										{employee.address.permanentAddress.pincode}
									</p>
								</div>
							</div>
						</SectionCard>
					</div>
				);

			case "employment":
				return (
					<div>
						<SectionCard title="Employment">
							<InfoRow label="Department" value={employee.employment.departmentName} />
							<InfoRow label="Designation" value={employee.employment.designation} />
							<InfoRow label="Employee Type" value={employee.employment.employeeType} />
							<InfoRow label="Joining Date" value={employee.employment.joiningDate} />
							<InfoRow label="Manager" value={employee.employment.manager?.name ?? "Not Assigned"} />
							<InfoRow label="Department ID" value={employee.employment.departmentId} />
							<InfoRow label="Designation ID" value={employee.employment.designationId} />
							<InfoRow label="Work Mode" value={employee.employment.workMode} />
							<InfoRow label="Work Location" value={employee.employment.workLocation} />
							<InfoRow label="Status" value={employee.employment.status} />
							<InfoRow label="Probation End Date" value={employee.employment.probationEndDate} />
							<InfoRow label="Probation Status" value={employee.employment.probationStatus} />
							<InfoRow label="HR" value={employee.employment.hr?.name ?? "Not Assigned"} />
							<InfoRow label="Team Lead" value={employee.employment.lead?.name ?? "Not Assigned"} />
						</SectionCard>
					</div>
				);

			case "payroll":
				return (
					<div className="grid gap-4 md:gap-6 lg:grid-cols-2">
						<SectionCard title="Salary Details">
							<InfoRow label="CTC" value={`₹${employee.salary.employeeCTC.toLocaleString()}`} />
							<InfoRow label="Net Salary" value={`₹${employee.salary.netSalary.toLocaleString()}`} />
							<InfoRow
								label="Monthly Gross"
								value={`₹${employee.salary.monthlyGross.toLocaleString()}`}
							/>
							<InfoRow label="Basic Salary" value={`₹${employee.salary.basic.toLocaleString()}`} />
							<InfoRow label="HRA" value={`₹${employee.salary.hra.toLocaleString()}`} />
							<InfoRow
								label="Special Allowance"
								value={`₹${employee.salary.specialAllowance.toLocaleString()}`}
							/>
							<InfoRow label="PF" value={`₹${employee.salary.pf.toLocaleString()}`} />
							<InfoRow
								label="Professional Tax"
								value={`₹${employee.salary.professionalTax.toLocaleString()}`}
							/>
							<InfoRow
								label="Other Deductions"
								value={`₹${employee.salary.otherDeductions.toLocaleString()}`}
							/>
							<InfoRow label="Currency" value={employee.salary.currency} />
						</SectionCard>

						<SectionCard title="Bank Details">
							<InfoRow label="Bank" value={employee.bankDetails.bankName} />
							<InfoRow label="Account" value={employee.bankDetails.accountNumber} />
							<InfoRow label="IFSC Code" value={employee.bankDetails.ifscCode} />
							<InfoRow label="Branch" value={employee.bankDetails.branch} />
						</SectionCard>
						<SectionCard title="Recent Payslip">
							<InfoRow
								label="Month"
								value={`${employee.recentPayslip.month} ${employee.recentPayslip.year}`}
							/>
							<InfoRow label="Gross Salary" value={`₹${employee.recentPayslip.grossSalary}`} />
							<InfoRow label="Deductions" value={`₹${employee.recentPayslip.deductions}`} />
							<InfoRow label="Net Salary" value={`₹${employee.recentPayslip.netSalary}`} />
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
							<div className="flex flex-wrap gap-2">
								{employee.performance.skills.map((skill) => (
									<span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
										{skill}
									</span>
								))}
							</div>
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
								<p className="flex flex-col">
									<span>{doc.type}</span>
									<span className="text-xs text-slate-500">{doc.id}</span>
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
							<InfoRow label="Phone" value={employee.personalInfo.phone} />
							<InfoRow label="Alternate Phone" value={employee.personalInfo.alternatePhone} />
						</SectionCard>

						<SectionCard title="Emergency Contact">
							<InfoRow label="Name" value={employee.emergencyContact.name} />
							<InfoRow label="Relationship" value={employee.emergencyContact.relationship} />
							<InfoRow label="Phone" value={employee.emergencyContact.phone} />
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

			default:
				return null;
		}
	};

	return (
		<div className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div className="flex flex-col rounded-sm border border-slate-200 bg-white px-4 pt-4 shadow-sm md:gap-3 md:px-6 md:pt-6">
				<div className="flex items-start gap-4">
					<img
						src={employee.personalInfo.profileImage}
						alt={employee.fullName}
						className="h-16 w-16 shrink-0 rounded-full object-cover md:h-24 md:w-24"
					/>

					<div className="min-w-0 flex-1">
						<h1 className="text-lg font-semibold text-slate-900 md:text-2xl">{employee.fullName}</h1>
						<div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 shrink-0 text-slate-600" />

								<span className="text-sm break-all text-slate-600">{employee.email}</span>
							</div>

							<div className="flex items-center gap-2">
								<Phone className="h-4 w-4 shrink-0 text-slate-600" />

								<span className="text-sm text-slate-600">{employee.personalInfo.phone}</span>
							</div>
						</div>

						<div className="mt-2 flex gap-2 md:hidden">
							<span className="text-sm text-slate-600">{employee.employment.designation}</span>

							<span className="inline text-slate-600">|</span>

							<span className="text-sm text-slate-600">{employee.employeeCode}</span>
						</div>

						<div className="mt-2 hidden md:flex md:flex-wrap md:items-center md:gap-2">
							<span className="text-sm text-slate-600">{employee.employment.designation}</span>

							<span className="inline text-slate-600">|</span>

							<span className="text-sm text-slate-600">{employee.employeeCode}</span>
						</div>
					</div>
				</div>
				<div className="flex overflow-x-auto">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`border-b-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition ${
								activeTab === tab.id
									? "border-blue-600 text-blue-600"
									: "border-transparent text-slate-500 hover:text-slate-900"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{renderTabContent()}
		</div>
	);
};

function InfoRow({ label, value }) {
	return (
		<div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
			<span className="text-sm text-slate-500">{label}</span>

			<span className="wrap-break-words text-sm font-medium text-slate-900 sm:text-right">{value}</span>
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
