/**
 * @fileoverview Builds the employee object sent by create and update screens. It derives the employee code and full name, preserves nested domain groups, and omits client-only or server-managed values so API calls receive a consistent payload.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/utils/employeePayload
 */
import { properCase } from "./formatter";

const formatAddress = (address = {}) => {
	const formattedAddress = { ...address };

	["street", "city", "state", "country"].forEach((field) => {
		if (Object.hasOwn(address, field)) {
			formattedAddress[field] = properCase(address[field]);
		}
	});

	return formattedAddress;
};

/**
 * Build employee update payload.
 * @param {Object} employee - Employee domain record used by the component or operation.
 * @returns {*} Computed result.
 */
export const buildEmployeeUpdatePayload = (employee) => {
	return {
		fullName: employee.fullName || "",
		email: employee.email || "",

		personalInfo: {
			firstName: properCase(employee.personalInfo?.firstName),
			lastName: properCase(employee.personalInfo?.lastName),
			gender: employee.personalInfo?.gender || "",
			dateOfBirth: employee.personalInfo?.dateOfBirth || "",
			maritalStatus: employee.personalInfo?.maritalStatus || "",
			bloodGroup: employee.personalInfo?.bloodGroup || "",
			nationality: employee.personalInfo?.nationality || "",
			phone: employee.personalInfo?.phone || "",
			alternatePhone: employee.personalInfo?.alternatePhone || "",
			profileImage: employee.personalInfo?.profileImage || "",
		},

		address: {
			currentAddress: formatAddress(employee.address?.currentAddress),
			permanentAddress: formatAddress(employee.address?.permanentAddress),
		},

		employment: {
			designationId: employee.employment?.designationId || "",
			departmentId: employee.employment?.departmentId || "",
			employeeType: employee.employment?.employeeType || "",
			workMode: employee.employment?.workMode || "",
			workLocation: employee.employment?.workLocation || "",
			status: employee.employment?.status || "",
			manager: {
				id: employee.employment?.manager?.id || null,
				employeeId: employee.employment?.manager?.employeeId || null,
				name: employee.employment?.manager?.name || null,
			},

			hr: {
				id: employee.employment?.hr?.id || null,
				employeeId: employee.employment?.hr?.employeeId || null,
				name: employee.employment?.hr?.name || null,
			},

			lead: {
				id: employee.employment?.lead?.id || null,
				employeeId: employee.employment?.lead?.employeeId || null,
				name: employee.employment?.lead?.name || null,
			},
		},

		salary: {
			employeeCTC: Number(employee.salary?.employeeCTC || 0),
			monthlyGross: Number(employee.salary?.monthlyGross || 0),
			basic: Number(employee.salary?.basic || 0),
			hra: Number(employee.salary?.hra || 0),
			specialAllowance: Number(employee.salary?.specialAllowance || 0),
			pf: Number(employee.salary?.pf || 0),
			professionalTax: Number(employee.salary?.professionalTax || 0),
			otherDeductions: Number(employee.salary?.otherDeductions || 0),
			netSalary: Number(employee.salary?.netSalary || 0),
			currency: employee.salary?.currency || "INR",
		},

		bankDetails: {
			bankName: employee.bankDetails?.bankName || "",
			accountNumber: employee.bankDetails?.accountNumber || "",
			ifscCode: employee.bankDetails?.ifscCode?.toUpperCase() || "",
			branch: employee.bankDetails?.branch || "",
		},

		emergencyContact: {
			name: properCase(employee.emergencyContact?.name),
			relationship: employee.emergencyContact?.relationship || "",
			phone: employee.emergencyContact?.phone || "",
		},
	};
};
