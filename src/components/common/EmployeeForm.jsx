import { useState } from "react";

const EmployeeForm = ({ initialData, onSubmit, loading }) => {
	const [formData, setFormData] = useState(initialData);

	const updateField = (section, field, value) => {
		setFormData((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: value,
			},
		}));
	};

	const updateNestedAddress = (addressType, field, value) => {
		setFormData((prev) => ({
			...prev,
			address: {
				...prev.address,
				[addressType]: {
					...prev.address[addressType],
					[field]: value,
				},
			},
		}));
	};

	const handleChange = (path, value) => {
		setFormData((prev) => {
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

	const submit = (e) => {
		e.preventDefault();

		const payload = structuredClone(formData);

		payload.personalInfo.fullName =
			`${payload.personalInfo.firstName} ${payload.personalInfo.lastName}`.trim();

		onSubmit(payload);
	};

	const inputClass =
		"w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit(formData);
			}}
			className="space-y-6"
		>
			{/* PERSONAL */}

			<SectionCard title="Personal Information">
				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						label="First Name"
						value={formData.personalInfo.firstName}
						onChange={(e) =>
							updateField("personalInfo", "firstName", e.target.value)
						}
					/>

					<FormField
						label="Last Name"
						value={formData.personalInfo.lastName}
						onChange={(e) =>
							updateField("personalInfo", "lastName", e.target.value)
						}
					/>

					<FormField
						label="Email"
						type="email"
						value={formData.personalInfo.email}
						onChange={(e) =>
							updateField("personalInfo", "email", e.target.value)
						}
					/>

					<FormField
						label="Phone"
						value={formData.personalInfo.phone}
						onChange={(e) =>
							updateField("personalInfo", "phone", e.target.value)
						}
					/>

					<FormField
						label="DOB"
						type="date"
						value={formData.personalInfo.dateOfBirth}
						onChange={(e) =>
							updateField("personalInfo", "dateOfBirth", e.target.value)
						}
					/>

					<FormField
						label="Blood Group"
						value={formData.personalInfo.bloodGroup}
						onChange={(e) =>
							updateField("personalInfo", "bloodGroup", e.target.value)
						}
					/>
				</div>
			</SectionCard>

			{/* EMPLOYMENT */}

			<SectionCard title="Employment">
				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						label="Employee Code"
						value={formData.employeeCode}
						onChange={(e) =>
							setFormData({
								...formData,
								employeeCode: e.target.value,
							})
						}
					/>

					<FormField
						label="Designation"
						value={formData.employment.designation}
						onChange={(e) =>
							updateField("employment", "designation", e.target.value)
						}
					/>

					<FormField
						label="Department"
						value={formData.employment.departmentName}
						onChange={(e) =>
							updateField("employment", "departmentName", e.target.value)
						}
					/>

					<FormField
						label="Joining Date"
						type="date"
						value={formData.employment.joiningDate}
						onChange={(e) =>
							updateField("employment", "joiningDate", e.target.value)
						}
					/>
				</div>
			</SectionCard>

			{/* ADDRESS */}

			<SectionCard title="Current Address">
				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						label="Street"
						value={formData.address.currentAddress.street}
						onChange={(e) =>
							updateNestedAddress(
								"currentAddress",
								"street",
								e.target.value,
							)
						}
					/>

					<FormField
						label="City"
						value={formData.address.currentAddress.city}
						onChange={(e) =>
							updateNestedAddress(
								"currentAddress",
								"city",
								e.target.value,
							)
						}
					/>

					<FormField
						label="State"
						value={formData.address.currentAddress.state}
						onChange={(e) =>
							updateNestedAddress(
								"currentAddress",
								"state",
								e.target.value,
							)
						}
					/>

					<FormField
						label="Pincode"
						value={formData.address.currentAddress.pincode}
						onChange={(e) =>
							updateNestedAddress(
								"currentAddress",
								"pincode",
								e.target.value,
							)
						}
					/>
				</div>
			</SectionCard>

			{/* BANK */}

			<SectionCard title="Bank Details">
				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						label="Bank Name"
						value={formData.bankDetails.bankName}
						onChange={(e) =>
							updateField("bankDetails", "bankName", e.target.value)
						}
					/>

					<FormField
						label="Account Number"
						value={formData.bankDetails.accountNumber}
						onChange={(e) =>
							updateField("bankDetails", "accountNumber", e.target.value)
						}
					/>

					<FormField
						label="IFSC"
						value={formData.bankDetails.ifscCode}
						onChange={(e) =>
							updateField("bankDetails", "ifscCode", e.target.value)
						}
					/>

					<FormField
						label="Branch"
						value={formData.bankDetails.branch}
						onChange={(e) =>
							updateField("bankDetails", "branch", e.target.value)
						}
					/>
				</div>
			</SectionCard>

			{/* ACTIONS */}

			<div className="flex justify-end">
				<button
					disabled={loading}
					className="rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
				>
					{loading ? "Saving..." : "Save Employee"}
				</button>
			</div>
		</form>
	);
};

function FormField({ label, ...props }) {
	return (
		<div>
			<label className="mb-2 block text-sm font-medium text-slate-600">
				{label}
			</label>

			<input
				{...props}
				className="w-full rounded-sm border border-slate-200 px-4 py-2.5 outline-none transition focus:border-slate-900"
			/>
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

function InfoRow({ label, value }) {
	return (
		<div className="flex justify-between py-2 last:border-none">
			<span className="text-slate-500">{label}</span>
			<span className="font-medium">{value}</span>
		</div>
	);
}

export default EmployeeForm;
