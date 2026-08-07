import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageLoader from "../common/PageLoader";
import useEmployeeEdit from "../../hooks/useEmployeeEdit";
import { buildEmployeeUpdatePayload } from "../../utils/employeePayload";
import { employeeApi } from "../../api/employeeApi";

const EmployeeEdit = () => {
	const { id } = useParams();

	const {
		employee,
		departments,
		designations,
		loading,
		touched,
		touchField,
		errors,
		isFormValid,
		updateRootField,
		updateNestedField,
		updateDeepField,
		handleDepartmentChange,
		handleDesignationChange,
		validate,
	} = useEmployeeEdit(id);

	const navigate = useNavigate();
	const [saving, setSaving] = useState(false);

	const submitHandler = async (e) => {
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length) {
			return;
		}
		try {
			setSaving(true);
			const updatePayload = buildEmployeeUpdatePayload(employee);
			await employeeApi.updateEmployee(employee.id, updatePayload);
			console.log(updatePayload);
			navigate(`/employees/${employee.employeeId}`);
		} catch (error) {
			console.error("Update employee error:", error);
		} finally {
			setSaving(false);
		}
	};

	if (loading || !employee) {
		return <PageLoader text="Loading employee..." />;
	}

	return (
		<div className="flex flex-col overflow-y-auto border-t border-slate-200">
			<div className="flex items-center gap-8 bg-white p-6">
				<img
					src={employee.personalInfo.profileImage}
					alt={employee.fullName}
					className="h-24 w-24 rounded-full border object-cover"
				/>

				<div className="flex-1">
					<h2 className="text-2xl font-bold text-slate-800">{employee.fullName}</h2>

					<p className="mt-1 text-slate-500">
						{employee.employeeCode} | {employee.employeeId}
					</p>

					<span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
						{employee.employment.status}
					</span>
				</div>
			</div>

			<form onSubmit={submitHandler} className="space-y-8">
				<Section title="Personal Information">
					<div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
						<Input
							label="First Name"
							value={employee.personalInfo.firstName}
							onChange={(e) => updateNestedField("personalInfo", "firstName", e.target.value)}
							error={touched.firstName ? errors.firstName : ""}
							onBlur={() => touchField("firstName")}
						/>

						<Input
							label="Last Name"
							value={employee.personalInfo.lastName}
							error={touched.lastName ? errors.lastName : ""}
							onChange={(e) => {
								updateNestedField("personalInfo", "lastName", e.target.value);
							}}
							onBlur={() => touchField("lastName")}
						/>

						<Input
							label="Email Address"
							type="email"
							value={employee.email}
							error={touched.email ? errors.email : ""}
							onBlur={() => touchField("email")}
							onChange={(e) => updateRootField("email", e.target.value)}
						/>

						<Select
							label="Gender"
							value={employee.personalInfo.gender || ""}
							error={touched.gender ? errors.gender : ""}
							onChange={(e) => updateNestedField("personalInfo", "gender", e.target.value)}
							onBlur={() => touchField("gender")}
						>
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</Select>

						<Input
							label="Date of Birth"
							type="date"
							value={employee.personalInfo.dateOfBirth}
							error={touched.dateOfBirth ? errors.dateOfBirth : ""}
							onChange={(e) => updateNestedField("personalInfo", "dateOfBirth", e.target.value)}
							onBlur={() => touchField("dateOfBirth")}
						/>

						<Select
							label="Marital Status"
							value={employee.personalInfo.maritalStatus}
							error={touched.maritalStatus ? errors.maritalStatus : ""}
							onChange={(e) => updateNestedField("personalInfo", "maritalStatus", e.target.value)}
							onBlur={() => touchField("maritalStatus")}
						>
							<option value="">Select Marital Status</option>
							<option value="Single">Single</option>
							<option value="Married">Married</option>
							<option value="Divorced">Divorced</option>
							<option value="Widowed">Widowed</option>
						</Select>

						<Select
							label="Blood Group"
							value={employee.personalInfo.bloodGroup}
							error={touched.bloodGroup ? errors.bloodGroup : ""}
							onChange={(e) => updateNestedField("personalInfo", "bloodGroup", e.target.value)}
							onBlur={() => touchField("bloodGroup")}
						>
							<option value="">Select Blood Group</option>
							<option value="A+">A+</option>
							<option value="A-">A-</option>
							<option value="B+">B+</option>
							<option value="B-">B-</option>
							<option value="AB+">AB+</option>
							<option value="AB-">AB-</option>
							<option value="O+">O+</option>
							<option value="O-">O-</option>
						</Select>

						<Input
							label="Nationality"
							value={employee.personalInfo.nationality}
							error={touched.nationality ? errors.nationality : ""}
							onChange={(e) => updateNestedField("personalInfo", "nationality", e.target.value)}
							onBlur={() => touchField("nationality")}
						/>

						<Input
							label="Phone Number"
							value={employee.personalInfo.phone}
							error={touched.phone ? errors.phone : ""}
							onChange={(e) => updateNestedField("personalInfo", "phone", e.target.value)}
							onBlur={() => touchField("phone")}
						/>

						<Input
							label="Alternate Phone"
							value={employee.personalInfo.alternatePhone}
							error={touched.alternatePhone ? errors.alternatePhone : ""}
							onChange={(e) => updateNestedField("personalInfo", "alternatePhone", e.target.value)}
							onBlur={() => touchField("alternatePhone")}
						/>
					</div>
				</Section>

				{/* Address Information */}

				<Section title="Address Information">
					<div className="grid p-6 lg:grid-cols-[1fr_auto_1fr]">
						{/* Current Address */}

						<div className="pb-2 lg:pr-10">
							<h3 className="mb-5 text-base font-semibold text-slate-700">Current Address</h3>

							<div className="grid gap-5">
								<Input
									label="Street"
									value={employee.address.currentAddress.street || ""}
									error={touched["currentAddress.street"] ? errors["currentAddress.street"] : ""}
									onChange={(e) =>
										updateDeepField("address", "currentAddress", "street", e.target.value)
									}
									onBlur={() => touchField("currentAddress.street")}
								/>

								<Input
									label="City"
									value={employee.address.currentAddress.city || ""}
									error={touched["currentAddress.city"] ? errors["currentAddress.city"] : ""}
									onChange={(e) =>
										updateDeepField("address", "currentAddress", "city", e.target.value)
									}
									onBlur={() => touchField("currentAddress.city")}
								/>

								<Input
									label="State"
									value={employee.address.currentAddress.state || ""}
									error={touched["currentAddress.state"] ? errors["currentAddress.state"] : ""}
									onChange={(e) =>
										updateDeepField("address", "currentAddress", "state", e.target.value)
									}
									onBlur={() => touchField("currentAddress.state")}
								/>

								<Input
									label="Country"
									value={employee.address.currentAddress.country || ""}
									error={touched["currentAddress.country"] ? errors["currentAddress.country"] : ""}
									onChange={(e) =>
										updateDeepField("address", "currentAddress", "country", e.target.value)
									}
									onBlur={() => touchField("currentAddress.country")}
								/>

								<Input
									label="Pincode"
									value={employee.address.currentAddress.pincode || ""}
									error={touched["currentAddress.pincode"] ? errors["currentAddress.pincode"] : ""}
									onChange={(e) =>
										updateDeepField("address", "currentAddress", "pincode", e.target.value)
									}
									onBlur={() => touchField("currentAddress.pincode")}
								/>
							</div>
						</div>

						{/* Divider */}

						<div className="hidden w-px bg-slate-200 lg:block"></div>

						{/* Permanent Address */}

						<div className="pt-8 lg:pt-0 lg:pl-10">
							<h3 className="mb-5 text-base font-semibold text-slate-700">Permanent Address</h3>

							<div className="grid gap-5">
								<Input
									label="Street"
									value={employee.address.permanentAddress.street || ""}
									error={touched["permanentAddress.street"] ? errors["permanentAddress.street"] : ""}
									onChange={(e) =>
										updateDeepField("address", "permanentAddress", "street", e.target.value)
									}
									onBlur={() => touchField("permanentAddress.street")}
								/>

								<Input
									label="City"
									value={employee.address.permanentAddress.city || ""}
									error={touched["permanentAddress.city"] ? errors["permanentAddress.city"] : ""}
									onChange={(e) =>
										updateDeepField("address", "permanentAddress", "city", e.target.value)
									}
									onBlur={() => touchField("permanentAddress.city")}
								/>

								<Input
									label="State"
									value={employee.address.permanentAddress.state || ""}
									error={touched["permanentAddress.state"] ? errors["permanentAddress.state"] : ""}
									onChange={(e) =>
										updateDeepField("address", "permanentAddress", "state", e.target.value)
									}
									onBlur={() => touchField("permanentAddress.state")}
								/>

								<Input
									label="Country"
									value={employee.address.permanentAddress.country || ""}
									error={
										touched["permanentAddress.country"] ? errors["permanentAddress.country"] : ""
									}
									onChange={(e) =>
										updateDeepField("address", "permanentAddress", "country", e.target.value)
									}
									onBlur={() => touchField("permanentAddress.country")}
								/>

								<Input
									label="Pincode"
									value={employee.address.permanentAddress.pincode || ""}
									error={
										touched["permanentAddress.pincode"] ? errors["permanentAddress.pincode"] : ""
									}
									onChange={(e) =>
										updateDeepField("address", "permanentAddress", "pincode", e.target.value)
									}
									onBlur={() => touchField("permanentAddress.pincode")}
								/>
							</div>
						</div>
					</div>
				</Section>

				{/* Employment Information */}

				<Section title="Employment Information">
					<div className="space-y-8">
						{/* Job Details */}

						<div className="p-6">
							<h3 className="mb-5 text-lg font-semibold text-slate-700">Job Details</h3>

							<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
								<Select
									label="Department"
									value={employee.employment.departmentId}
									error={touched.departmentId ? errors.departmentId : ""}
									onChange={handleDepartmentChange}
									onBlur={() => touchField("departmentId")}
								>
									<option value="">Select Department</option>

									{departments.map((dept) => (
										<option key={dept.departmentId} value={dept.departmentId}>
											{dept.name}
										</option>
									))}
								</Select>

								<Select
									label="Designation"
									value={employee.employment.designationId}
									error={touched.designationId ? errors.designationId : ""}
									onChange={handleDesignationChange}
									onBlur={() => touchField("designationId")}
								>
									<option value="">Select Designation</option>

									{designations.map((desg) => (
										<option key={desg.designationId} value={desg.designationId}>
											{desg.name}
										</option>
									))}
								</Select>

								<Select
									label="Employee Type"
									value={employee.employment.employeeType || ""}
									error={touched.employeeType ? errors.employeeType : ""}
									onChange={(e) => updateNestedField("employment", "employeeType", e.target.value)}
									onBlur={() => touchField("employeeType")}
								>
									<option value="">Select Employee Type</option>
									<option value="Full Time">Full Time</option>
									<option value="Contract">Contract</option>
									<option value="Intern">Intern</option>
								</Select>

								<Select
									label="Work Mode"
									value={employee.employment.workMode || ""}
									error={touched.workMode ? errors.workMode : ""}
									onBlur={() => touchField("workMode")}
									onChange={(e) => {
										const mode = e.target.value;
										updateNestedField("employment", "workMode", mode);
										if (mode === "Remote") {
											updateNestedField("employment", "workLocation", "Remote");
										}
									}}
								>
									<option value="">Select Work Mode</option>
									<option value="Office">Office</option>
									<option value="Hybrid">Hybrid</option>
									<option value="Remote">Remote</option>
								</Select>

								<Select
									label="Work Location"
									value={employee.employment.workLocation || ""}
									error={touched.workLocation ? errors.workLocation : ""}
									onBlur={() => touchField("workLocation")}
									onChange={(e) => updateNestedField("employment", "workLocation", e.target.value)}
									className={employee.employment.workMode === "Remote" ? "hidden" : "block"}
								>
									<option value="">Select Work Location</option>
									<option value="Pune">Pune</option>
									<option value="Mumbai">Mumbai</option>
									<option value="Chennai">Chennai</option>
									<option value="Hyderabad">Hyderabad</option>
									<option value="Bangalore">Bangalore</option>
									<option value="Noida">Noida</option>
									<option value="Nashik">Nashik</option>
									<option value="Delhi">Delhi</option>
								</Select>

								<Input
									label="Work Location"
									value={
										employee.employment.workMode === "Remote"
											? "Remote"
											: employee.employment.workLocation
									}
									error={touched.workLocation ? errors.workLocation : ""}
									onBlur={() => touchField("workLocation")}
									onChange={(e) => updateNestedField("employment", "workLocation", e.target.value)}
									className={employee.employment.workMode === "Remote" ? "block" : "hidden"}
								/>
							</div>
						</div>
					</div>
				</Section>

				{/* Bank Details */}

				<Section title="Bank Details">
					<div className="p-6">
						<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
							<Input
								label="Bank Name"
								value={employee.bankDetails.bankName || ""}
								error={touched.bankName ? errors.bankName : ""}
								onBlur={() => touchField("bankName")}
								onChange={(e) => updateNestedField("bankDetails", "bankName", e.target.value)}
							/>

							<Input
								label="Account Number"
								value={employee.bankDetails.accountNumber || ""}
								error={touched.accountNumber ? errors.accountNumber : ""}
								onBlur={() => touchField("accountNumber")}
								onChange={(e) => updateNestedField("bankDetails", "accountNumber", e.target.value)}
							/>

							<Input
								label="IFSC Code"
								value={employee.bankDetails.ifscCode || ""}
								error={touched.ifscCode ? errors.ifscCode : ""}
								onBlur={() => touchField("ifscCode")}
								onChange={(e) =>
									updateNestedField("bankDetails", "ifscCode", e.target.value.toUpperCase())
								}
							/>

							<Input
								label="Branch"
								value={employee.bankDetails.branch || ""}
								error={touched.branch ? errors.branch : ""}
								onBlur={() => touchField("branch")}
								onChange={(e) => updateNestedField("bankDetails", "branch", e.target.value)}
							/>
						</div>
					</div>
				</Section>

				{/* Emergency Contact */}

				<Section title="Emergency Contact">
					<div className="p-6">
						<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
							<Input
								label="Contact Name"
								value={employee.emergencyContact.name || ""}
								error={touched.emergencyName ? errors.emergencyName : ""}
								onBlur={() => touchField("emergencyName")}
								onChange={(e) => updateNestedField("emergencyContact", "name", e.target.value)}
							/>

							<Select
								label="Relationship"
								value={employee.emergencyContact.relationship || ""}
								error={touched.relationship ? errors.relationship : ""}
								onBlur={() => touchField("relationship")}
								onChange={(e) => updateNestedField("emergencyContact", "relationship", e.target.value)}
							>
								<option value="">Select Relationship</option>
								<option value="Father">Father</option>
								<option value="Mother">Mother</option>
								<option value="Brother">Brother</option>
								<option value="Sister">Sister</option>
								<option value="Spouse">Spouse</option>
								<option value="Friend">Friend</option>
								<option value="Other">Other</option>
							</Select>

							<Input
								label="Phone Number"
								value={employee.emergencyContact.phone || ""}
								error={touched.emergencyPhone ? errors.emergencyPhone : ""}
								onBlur={() => touchField("emergencyPhone")}
								onChange={(e) => updateNestedField("emergencyContact", "phone", e.target.value)}
							/>
						</div>
					</div>
				</Section>

				<div className="sticky bottom-0 mt-8 flex justify-end gap-6 border-t border-slate-200 bg-white p-5">
					<button
						type="submit"
						disabled={!isFormValid || saving}
						className="rounded-sm bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{saving ? "Saving..." : "Save"}
					</button>
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-100"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

const Input = ({ label, error, className = "", ...props }) => {
	return (
		<div className={className}>
			<label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>

			<input
				{...props}
				className={`w-full rounded-sm border bg-white px-4 py-2.5 transition outline-none ${
					error
						? "border-red-500 focus:ring-4 focus:ring-red-100"
						: "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
				}`}
			/>

			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
};

const Select = ({ label, error, children, className = "", ...props }) => {
	return (
		<div className={className}>
			<label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>

			<select
				{...props}
				className={`w-full rounded-sm border bg-white px-4 py-2.5 transition outline-none ${
					error
						? "border-red-500 focus:ring-4 focus:ring-red-100"
						: "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
				}`}
			>
				{children}
			</select>

			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
};

const Section = ({ title, children }) => {
	return (
		<section className="bg-whiteshadow-sm rounded-sm border border-slate-200">
			<h2 className="border-b border-slate-100 px-6 py-3 text-lg font-semibold text-slate-800">{title}</h2>

			{children}
		</section>
	);
};

export default EmployeeEdit;
