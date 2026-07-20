import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Save, X } from "lucide-react";

import PageLoader from "./common/PageLoader";

import { employeeApi } from "../api/employeeApi";
import { departmentApi } from "../api/departmentApi";
import { designationApi } from "../api/designationApi";

const GENDERS = [
	{ value: "Male", label: "Male" },
	{ value: "Female", label: "Female" },
	{ value: "Other", label: "Other" },
];

const MARITAL_STATUSES = [
	{ value: "Single", label: "Single" },
	{ value: "Married", label: "Married" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
	(v) => ({
		value: v,
		label: v,
	}),
);

const WORK_MODES = ["Remote", "Hybrid", "Onsite"].map((v) => ({
	value: v,
	label: v,
}));

const EMPLOYEE_TYPES = ["Full Time", "Contract", "Intern"].map((v) => ({
	value: v,
	label: v,
}));

const STATUSES = ["Active", "Inactive", "Resigned"].map((v) => ({
	value: v,
	label: v,
}));

export default function EmployeeEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { setActions } = useOutletContext();
	const [loading, setLoading] = useState(true);
	const [employee, setEmployee] = useState(null);
	const [departments, setDepartments] = useState([]);
	const [designations, setDesignations] = useState([]);
	const [managers, setManagers] = useState([]);

	useEffect(() => {
		loadData();
	}, [id]);

	useEffect(() => {
		setActions([
			{
				label: "Cancel",
				icon: <X className="h-4 w-4" />,
				onClick: () => navigate(`/employees/${id}`),
			},
			{
				label: "Save",
				icon: <Save className="h-4 w-4" />,
				onClick: handleSubmit,
			},
		]);
	}, []);

	const loadData = async () => {
		try {
			setLoading(true);

			const [
				employeeResponse,
				departmentsResponse,
				designationsResponse,
				managersResponse,
			] = await Promise.all([
				employeeApi.getById(id),
				departmentApi.getAll(),
				designationApi.getAll(),
				employeeApi.getManagers(),
			]);

			setEmployee(employeeResponse);

			setDepartments(departmentsResponse);

			setDesignations(designationsResponse);

			setManagers(managersResponse);
			console.log(managersResponse);
		} finally {
			setLoading(false);
		}
	};

	const updateField = (path, value) => {
		setEmployee((prev) => {
			const copy = structuredClone(prev);

			const keys = path.split(".");

			let current = copy;

			for (let i = 0; i < keys.length - 1; i++) {
				current = current[keys[i]];
			}

			current[keys[keys.length - 1]] = value;

			return copy;
		});
	};

	const handleSubmit = async () => {
		await employeeApi.update(id, employee);

		navigate(`/employees/${id}`);
	};

	if (loading || !employee) {
		return <PageLoader text="Loading employee..." />;
	}

	return (
		<div className="space-y-6 p-4 md:p-6">
			<SectionCard title="Personal Information">
				<div className="grid gap-4 md:grid-cols-2">
					<InputField
						label="First Name"
						value={employee.personalInfo.firstName}
						onChange={(v) => updateField("personalInfo.firstName", v)}
					/>

					<InputField
						label="Last Name"
						value={employee.personalInfo.lastName}
						onChange={(v) => updateField("personalInfo.lastName", v)}
					/>

					<SelectField
						label="Gender"
						value={employee.personalInfo.gender}
						options={GENDERS}
						onChange={(v) => updateField("personalInfo.gender", v)}
					/>

					<SelectField
						label="Marital Status"
						value={employee.personalInfo.maritalStatus}
						options={MARITAL_STATUSES}
						onChange={(v) => updateField("personalInfo.maritalStatus", v)}
					/>

					<SelectField
						label="Blood Group"
						value={employee.personalInfo.bloodGroup}
						options={BLOOD_GROUPS}
						onChange={(v) => updateField("personalInfo.bloodGroup", v)}
					/>

					<InputField
						type="date"
						label="Date Of Birth"
						value={employee.personalInfo.dateOfBirth}
						onChange={(v) => updateField("personalInfo.dateOfBirth", v)}
					/>

					<InputField
						label="Email"
						value={employee.personalInfo.email}
						onChange={(v) => updateField("personalInfo.email", v)}
					/>

					<InputField
						label="Phone"
						value={employee.personalInfo.phone}
						onChange={(v) => updateField("personalInfo.phone", v)}
					/>
				</div>
			</SectionCard>

			<SectionCard title="Employment Information">
				<div className="grid gap-4 md:grid-cols-2">
					<SelectField
						label="Department"
						value={employee.employment.departmentId}
						options={departments.map((d) => ({
							value: d.id,
							label: d.name,
						}))}
						onChange={(value) => {
							const dept = departments.find((d) => d.id === value);

							updateField("employment.departmentId", value);

							updateField("employment.departmentName", dept?.name || "");
						}}
					/>

					<SelectField
						label="Designation"
						value={employee.employment.designation}
						options={designations.map((d) => ({
							value: d.name,
							label: d.name,
						}))}
						onChange={(v) => updateField("employment.designation", v)}
					/>

					<SelectField
						label="Employee Type"
						value={employee.employment.employeeType}
						options={EMPLOYEE_TYPES}
						onChange={(v) => updateField("employment.employeeType", v)}
					/>

					<SelectField
						label="Work Mode"
						value={employee.employment.workMode}
						options={WORK_MODES}
						onChange={(v) => updateField("employment.workMode", v)}
					/>

					<SelectField
						label="Status"
						value={employee.employment.status}
						options={STATUSES}
						onChange={(v) => updateField("employment.status", v)}
					/>

					<SelectField
						label="Manager"
						value={employee.employment.manager?.id || ""}
						options={managers.map((m) => ({
							value: m.id,
							label: m.name,
						}))}
						onChange={(managerId) => {
							const manager = managers.find((m) => m.id === managerId);

							updateField("employment.manager.id", manager?.id || null);

							updateField(
								"employment.manager.name",
								manager?.name || null,
							);
						}}
					/>
				</div>
			</SectionCard>

			<SectionCard title="Address Information">
				<div className="space-y-6">
					<div>
						<h4 className="mb-3 font-medium">Current Address</h4>

						<div className="grid gap-4 md:grid-cols-2">
							<InputField
								label="Street"
								value={employee.address.currentAddress.street}
								onChange={(v) =>
									updateField("address.currentAddress.street", v)
								}
							/>

							<InputField
								label="City"
								value={employee.address.currentAddress.city}
								onChange={(v) =>
									updateField("address.currentAddress.city", v)
								}
							/>
						</div>
					</div>

					<div>
						<h4 className="mb-3 font-medium">Permanent Address</h4>

						<div className="grid gap-4 md:grid-cols-2">
							<InputField
								label="Street"
								value={employee.address.permanentAddress.street}
								onChange={(v) =>
									updateField("address.permanentAddress.street", v)
								}
							/>

							<InputField
								label="City"
								value={employee.address.permanentAddress.city}
								onChange={(v) =>
									updateField("address.permanentAddress.city", v)
								}
							/>
						</div>
					</div>
				</div>
			</SectionCard>

			<SectionCard title="Bank Details">
				<div className="grid gap-4 md:grid-cols-2">
					<InputField
						label="Bank Name"
						value={employee.bankDetails.bankName}
						onChange={(v) => updateField("bankDetails.bankName", v)}
					/>

					<InputField
						label="Account Number"
						value={employee.bankDetails.accountNumber}
						onChange={(v) => updateField("bankDetails.accountNumber", v)}
					/>

					<InputField
						label="IFSC Code"
						value={employee.bankDetails.ifscCode}
						onChange={(v) => updateField("bankDetails.ifscCode", v)}
					/>

					<InputField
						label="Branch"
						value={employee.bankDetails.branch}
						onChange={(v) => updateField("bankDetails.branch", v)}
					/>
				</div>
			</SectionCard>

			<SectionCard title="Emergency Contact">
				<div className="grid gap-4 md:grid-cols-2">
					<InputField
						label="Contact Name"
						value={employee.emergencyContact.name}
						onChange={(v) => updateField("emergencyContact.name", v)}
					/>

					<InputField
						label="Relationship"
						value={employee.emergencyContact.relationship}
						onChange={(v) =>
							updateField("emergencyContact.relationship", v)
						}
					/>
               
					<InputField
						label="Phone"
						value={employee.emergencyContact.phone}
						onChange={(v) => updateField("emergencyContact.phone", v)}
					/>
				</div>
			</SectionCard>
		</div>
	);
}

function InputField({ label, value, onChange, type = "text" }) {
	return (
		<div>
			<label className="mb-1 block text-sm text-slate-500">{label}</label>

			<input
				type={type}
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded border border-slate-300 px-3 py-2"
			/>
		</div>
	);
}

function SelectField({ label, value, options, onChange }) {
	return (
		<div>
			<label className="mb-1 block text-sm text-slate-500">{label}</label>

			<select
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded border border-slate-300 px-3 py-2"
			>
				<option value="">Select {label}</option>

				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}

function SectionCard({ title, children }) {
	return (
		<div className="bg-white p-6 shadow-sm">
			<h3 className="mb-5 text-lg font-semibold">{title}</h3>

			{children}
		</div>
	);
}

/* postponed */