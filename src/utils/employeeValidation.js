/**
 * @fileoverview Validates the complete employee form model before create or update. It checks personal data, age, addresses, employment selections, reporting IDs, bank details, and emergency contacts, returning an error object keyed exactly as the form fields expect.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/utils/employeeValidation
 */
const regex = {
	name: /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^(?:\+91)?\d{10}$/,
	pincode: /^\d{6}$/,
	accountNumber: /^(?:\d{9,18}|[X|x*]{2,14}\d{4})$/,
	ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
	employeeId: /^EMP\d{3,6}$/,
};

/**
 * Is empty.
 * @param {*} value - Value to render, format, debounce, or edit.
 * @returns {*} Computed result.
 */
const isEmpty = (value) => !String(value ?? "").trim();

/**
 * Normalizes supported Indian phone input before validation.
 * Whitespace is removed while the optional +91 prefix is preserved, allowing
 * users to enter either `+91 9876543210`, `+919876543210`, or `9876543210`.
 *
 * @param {*} value - Raw phone value entered by the user.
 * @returns {string} Phone value normalized for the shared phone-number regex.
 */
export const normalizePhone = (value) =>
	String(value ?? "")
		.trim()
		.replace(/\s+/g, "");

/**
 * Validate employee.
 * @param {Object} employee - Employee domain record used by the component or operation.
 * @returns {*} Computed result.
 */
export const validateEmployee = (employee) => {
	const errors = {};

	const personalInfo = employee.personalInfo || {};
	const address = employee.address || {};
	const employment = employee.employment || {};
	const bankDetails = employee.bankDetails || {};
	const emergencyContact = employee.emergencyContact || {};
	// const salary = employee.salary || {};

	// PERSONAL INFO VALIDATION
	if (isEmpty(personalInfo.firstName)) errors.firstName = "First name is required";
	else if (!regex.name.test(personalInfo.firstName)) errors.firstName = "Invalid first name";

	if (isEmpty(personalInfo.lastName)) errors.lastName = "Last name is required";
	else if (!regex.name.test(personalInfo.lastName)) errors.lastName = "Invalid last name";

	if (isEmpty(employee.email)) errors.email = "Email is required";
	else if (!regex.email.test(employee.email)) errors.email = "Invalid email";

	if (!personalInfo.gender) errors.gender = "Gender is required";

	if (!personalInfo.bloodGroup) errors.bloodGroup = "Gender is required";

	if (!personalInfo.dateOfBirth) {
		errors.dateOfBirth = "Date of birth is required";
	} else {
		const age = (Date.now() - new Date(personalInfo.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000);

		if (age < 18) errors.dateOfBirth = "Employee must be at least 18 years old";
	}

	if (!personalInfo.maritalStatus) errors.maritalStatus = "Marital status is required";
	if (isEmpty(personalInfo.nationality)) errors.nationality = "Nationality is required";
	if (!regex.phone.test(normalizePhone(personalInfo.phone))) errors.phone = "Invalid phone number";
	if (personalInfo.alternatePhone && !regex.phone.test(normalizePhone(personalInfo.alternatePhone)))
		errors.alternatePhone = "Invalid alternate phone";

	// ADDRESS VALIDATION
	["currentAddress", "permanentAddress"].forEach((section) => {
		const addr = address[section] || {};

		if (isEmpty(addr.street)) errors[`${section}.street`] = "Street is required";
		if (isEmpty(addr.city)) errors[`${section}.city`] = "City is required";
		if (isEmpty(addr.state)) errors[`${section}.state`] = "State is required";
		if (isEmpty(addr.country)) errors[`${section}.country`] = "Country is required";
		if (!regex.pincode.test(addr.pincode || "")) errors[`${section}.pincode`] = "Invalid pincode";
	});

	// EMPLOYMENT VALIDATION
	if (!employment.departmentId) errors.departmentId = "Department is required";
	if (!employment.designationId) errors.designationId = "Designation is required";
	if (!employment.employeeType) errors.employeeType = "Employee type is required";
	if (!employment.workMode) errors.workMode = "Work mode is required";
	if (!employment.workLocation) errors.workLocation = "Work location is required";
	if (!employment.status) errors.status = "Status is required";

	// REPORTING HIERARCHY VALIDATION
	if (employment.manager?.employeeId && !regex.employeeId.test(employment.manager.employeeId))
		errors.managerEmployeeId = "Invalid manager employee ID";

	if (employment.hr?.employeeId && !regex.employeeId.test(employment.hr.employeeId))
		errors.hrEmployeeId = "Invalid HR employee ID";

	if (employment.lead?.employeeId && !regex.employeeId.test(employment.lead.employeeId))
		errors.leadEmployeeId = "Invalid lead employee ID";

	// BANK DETAILS VALIDATION
	if (isEmpty(bankDetails.bankName)) errors.bankName = "Bank name is required";
	if (!regex.accountNumber.test(bankDetails.accountNumber || "")) errors.accountNumber = "Invalid account number";
	if (!regex.ifsc.test(bankDetails.ifscCode || "")) errors.ifscCode = "Invalid IFSC";
	if (isEmpty(bankDetails.branch)) errors.branch = "Branch is required";

	// EMERGENCY CONTACT VALIDATION
	if (isEmpty(emergencyContact.name)) errors.emergencyName = "Contact name is required";
	if (!emergencyContact.relationship) errors.relationship = "Relationship is required";
	if (!regex.phone.test(normalizePhone(emergencyContact.phone))) errors.emergencyPhone = "Invalid phone number";

	return errors;
};
