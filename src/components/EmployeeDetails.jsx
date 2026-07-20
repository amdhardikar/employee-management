import { useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { employeeApi } from "../api/employeeApi";
import {
	Mail,
	Phone,
	MapPin,
	Building2,
	Briefcase,
	Wallet,
	Shield,
	X,
} from "lucide-react";
import PageLoader from "./common/PageLoader";
import { STATUS_COLORS } from "../constants/EMSconstants";

const EmployeeDetails = () => {
	const { id } = useParams();
	const { setActions } = useOutletContext();
	const [employee, setEmployee] = useState(null);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setActions([
			{
				label: "Close",
				icon: <X className="h-4 w-4" />,
				onClick: () => navigate("/employees"),
			},
		]);
		loadEmployee();
	}, []);

	const loadEmployee = async () => {
		try {
			setLoading(true);

			const data = await employeeApi.getById(id);
			setEmployee(data[0]);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <PageLoader text="Loading employee details..." />;
	}

	return (
		<div className="space-y-6 p-4 md:p-6">
			<div className=" bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 md:flex-row">
					<img
						src={employee.personalInfo.profileImage}
						alt=""
						className="h-28 w-28 rounded-full object-cover"
					/>

					<div className="flex-1">
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-2xl font-bold">
								{employee.personalInfo.fullName}
							</h1>

							<span
								className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
									STATUS_COLORS[employee.employment?.status] ||
									"bg-slate-100 text-slate-700"
								}`}
							>
								{employee.employment?.status}
							</span>
						</div>

						<p className="mt-1 text-slate-500">
							{employee.employment.designation}
						</p>

						<p className="text-sm text-slate-400">
							{employee.employeeCode}
						</p>

						<div className="mt-4 flex flex-wrap gap-5 text-sm">
							<div className="flex items-center gap-2">
								<Mail size={16} />
								{employee.personalInfo.email}
							</div>

							<div className="flex items-center gap-2">
								<Phone size={16} />
								{employee.personalInfo.phone}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<SectionCard title="Personal Information">
					<InfoRow label="Gender" value={employee.personalInfo.gender} />
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
						value={employee.employment.manager?.name || "Not Assigned"}
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
						value={employee.performance.promotionEligible ? "Yes" : "No"}
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
					<InfoRow label="Branch" value={employee.bankDetails.branch} />
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
					<InfoRow label="Status" value={employee.recentPayslip.status} />
				</SectionCard>

				<SectionCard title="Address">
					<div className="space-y-4">
						<div>
							<p className=" text-slate-500">Current Address</p>

							<p className="mt-1.5 ">
								{employee.address.currentAddress.street},
								{employee.address.currentAddress.city}
							</p>
						</div>

						<div>
							<p className=" text-slate-500">Permanent Address</p>
							<p className="mt-1.5 ">
								{employee.address.permanentAddress.street},
								{employee.address.permanentAddress.city}
							</p>
						</div>
					</div>
				</SectionCard>

				<SectionCard title="Emergency Contact">
					<InfoRow label="Name" value={employee.emergencyContact.name} />
					<InfoRow
						label="Relationship"
						value={employee.emergencyContact.relationship}
					/>
					<InfoRow label="Phone" value={employee.emergencyContact.phone} />
				</SectionCard>
			</div>

			<SectionCard title="Skills">
				<div className="flex flex-wrap gap-2">
					{employee.performance.skills.map((skill) => (
						<span
							key={skill}
							className="rounded-full bg-slate-100 px-3 py-1 text-sm"
						>
							{skill}
						</span>
					))}
				</div>
			</SectionCard>

			<SectionCard title="Documents">
				<div className="space-y-3">
					{employee.documents.map((doc) => (
						<div
							key={doc.id}
							className="flex items-center justify-between border-b-2 p-3 border-gray-200 last:border-none"
						>
							<span>{doc.type}</span>

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
		<div className="flex justify-between py-2 last:border-none">
			<span className="text-slate-500">{label}</span>
			<span className="font-medium">{value}</span>
		</div>
	);
}

function SectionCard({ title, children, action }) {
	return (
		<div className=" border-slate-200 bg-white p-6 shadow-sm">
			<div className="mb-5 flex items-center justify-between">
				<h3 className="text-lg font-semibold text-slate-900">{title}</h3>

				{action}
			</div>

			{children}
		</div>
	);
}

export default EmployeeDetails;
