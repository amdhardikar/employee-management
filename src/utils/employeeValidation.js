const regex = {
	name: /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^(?:\+91)?[6-9]\d{9}$/,
	pincode: /^\d{6}$/,
	accountNumber: /^(?:\d{9,18}|[X|x*]{2,14}\d{4})$/,
	ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
	employeeId: /^EMP\d{3,6}$/,
};

const isEmpty = (value) => !String(value ?? "").trim();

export const validateEmployee = (employee) => {
	const errors = {};

	const personalInfo = employee.personalInfo || {};
	const address = employee.address || {};
	const employment = employee.employment || {};
	const bankDetails = employee.bankDetails || {};
	const emergencyContact = employee.emergencyContact || {};
	const salary = employee.salary || {};

	/* -------------------------------------------------------------------------- */
	/*                               Personal Info                                */
	/* -------------------------------------------------------------------------- */

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
	if (!regex.phone.test(personalInfo.phone || "")) errors.phone = "Invalid phone number";
	if (personalInfo.alternatePhone && !regex.phone.test(personalInfo.alternatePhone))
		errors.alternatePhone = "Invalid alternate phone";

	/* -------------------------------------------------------------------------- */
	/*                                  Address                                   */
	/* -------------------------------------------------------------------------- */

	["currentAddress", "permanentAddress"].forEach((section) => {
		const addr = address[section] || {};

		if (isEmpty(addr.street)) errors[`${section}.street`] = "Street is required";
		if (isEmpty(addr.city)) errors[`${section}.city`] = "City is required";
		if (isEmpty(addr.state)) errors[`${section}.state`] = "State is required";
		if (isEmpty(addr.country)) errors[`${section}.country`] = "Country is required";
		if (!regex.pincode.test(addr.pincode || "")) errors[`${section}.pincode`] = "Invalid pincode";
	});

	/* -------------------------------------------------------------------------- */
	/*                                Employment                                  */
	/* -------------------------------------------------------------------------- */

	if (!employment.departmentId) errors.departmentId = "Department is required";
	if (!employment.designationId) errors.designationId = "Designation is required";
	if (!employment.employeeType) errors.employeeType = "Employee type is required";
	if (!employment.workMode) errors.workMode = "Work mode is required";
	if (!employment.workLocation) errors.workLocation = "Work location is required";
	if (!employment.status) errors.status = "Status is required";

	/* -------------------------------------------------------------------------- */
	/*                          Reporting Hierarchy                               */
	/* -------------------------------------------------------------------------- */

	if (employment.manager?.employeeId && !regex.employeeId.test(employment.manager.employeeId))
		errors.managerEmployeeId = "Invalid manager employee ID";

	if (employment.hr?.employeeId && !regex.employeeId.test(employment.hr.employeeId))
		errors.hrEmployeeId = "Invalid HR employee ID";

	if (employment.lead?.employeeId && !regex.employeeId.test(employment.lead.employeeId))
		errors.leadEmployeeId = "Invalid lead employee ID";

	/* -------------------------------------------------------------------------- */
	/*                                   Salary                                   */
	/* -------------------------------------------------------------------------- */

	if (Object.keys(salary).length) {
		const salaryFields = [
			"employeeCTC",
			"monthlyGross",
			"basic",
			"hra",
			"specialAllowance",
			"pf",
			"professionalTax",
			"otherDeductions",
			"netSalary",
		];

		salaryFields.forEach((field) => {
			const value = salary[field];

			if (value === "" || value == null) errors[field] = "Required";
			else if (Number.isNaN(Number(value))) errors[field] = "Must be a number";
			else if (Number(value) < 0) errors[field] = "Cannot be negative";
		});

		if (salary.employeeCTC != null && salary.monthlyGross != null && salary.monthlyGross > salary.employeeCTC / 12)
			errors.monthlyGross = "Monthly gross exceeds annual CTC";

		if (salary.basic != null && salary.monthlyGross != null && salary.basic > salary.monthlyGross)
			errors.basic = "Basic salary cannot exceed monthly gross";

		if (salary.netSalary != null && salary.monthlyGross != null && salary.netSalary > salary.monthlyGross)
			errors.netSalary = "Net salary cannot exceed gross salary";
	}

	/* -------------------------------------------------------------------------- */
	/*                               Bank Details                                 */
	/* -------------------------------------------------------------------------- */

	if (isEmpty(bankDetails.bankName)) errors.bankName = "Bank name is required";
	if (!regex.accountNumber.test(bankDetails.accountNumber || "")) errors.accountNumber = "Invalid account number";
	if (!regex.ifsc.test(bankDetails.ifscCode || "")) errors.ifscCode = "Invalid IFSC";
	if (isEmpty(bankDetails.branch)) errors.branch = "Branch is required";

	/* -------------------------------------------------------------------------- */
	/*                            Emergency Contact                               */
	/* -------------------------------------------------------------------------- */

	if (isEmpty(emergencyContact.name)) errors.emergencyName = "Contact name is required";
	if (!emergencyContact.relationship) errors.relationship = "Relationship is required";
	if (!regex.phone.test(emergencyContact.phone || "")) errors.emergencyPhone = "Invalid phone number";

	return errors;
};
