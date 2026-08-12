import { describe, it, expect } from "vitest";

import { buildEmployeeUpdatePayload } from "../../../src/utils/employeePayload";

describe("buildEmployeeUpdatePayload", () => {
	it("builds employee update payload correctly", () => {
		const employee = {
			fullName: "John Doe",
			email: "john@test.com",

			personalInfo: {
				firstName: "John",
				lastName: "Doe",
				gender: "Male",
				dateOfBirth: "1995-01-01",
				maritalStatus: "Single",
				bloodGroup: "O+",
				nationality: "Indian",
				phone: "9999999999",
				alternatePhone: "8888888888",
				profileImage: "image.png",
			},

			address: {
				currentAddress: {
					city: "Mumbai",
				},
				permanentAddress: {
					city: "Pune",
				},
			},

			employment: {
				designationId: "DES001",
				departmentId: "DEP001",
				employeeType: "Full Time",
				workMode: "Office",
				workLocation: "Mumbai",
				status: "Active",

				manager: {
					id: "M001",
					employeeId: "EMP001",
					name: "Manager",
				},

				hr: {
					id: "HR001",
					employeeId: "EMP002",
					name: "HR Person",
				},

				lead: {
					id: "L001",
					employeeId: "EMP003",
					name: "Lead",
				},
			},

			salary: {
				employeeCTC: "600000",
				monthlyGross: "50000",
				basic: "25000",
				hra: "10000",
				specialAllowance: "5000",
				pf: "2000",
				professionalTax: "500",
				otherDeductions: "1000",
				netSalary: "41500",
				currency: "INR",
			},

			bankDetails: {
				bankName: "HDFC",
				accountNumber: "123456",
				ifscCode: "hdfc0001234",
				branch: "Andheri",
			},

			emergencyContact: {
				name: "Jane Doe",
				relationship: "Sister",
				phone: "7777777777",
			},
		};

		const result = buildEmployeeUpdatePayload(employee);

		expect(result.fullName).toBe("John Doe");
		expect(result.email).toBe("john@test.com");

		expect(result.personalInfo.firstName).toBe("John");

		expect(result.address.currentAddress.city).toBe("Mumbai");

		expect(result.employment.designationId).toBe("DES001");

		expect(result.employment.manager).toEqual({
			id: "M001",
			employeeId: "EMP001",
			name: "Manager",
		});

		expect(result.salary.employeeCTC).toBe(600000);

		expect(result.bankDetails.ifscCode).toBe("HDFC0001234");

		expect(result.emergencyContact.name).toBe("Jane Doe");
	});

	it("returns default values when employee fields are missing", () => {
		const result = buildEmployeeUpdatePayload({});

		expect(result).toEqual({
			fullName: "",
			email: "",

			personalInfo: {
				firstName: "",
				lastName: "",
				gender: "",
				dateOfBirth: "",
				maritalStatus: "",
				bloodGroup: "",
				nationality: "",
				phone: "",
				alternatePhone: "",
				profileImage: "",
			},

			address: {
				currentAddress: {},
				permanentAddress: {},
			},

			employment: {
				designationId: "",
				departmentId: "",
				employeeType: "",
				workMode: "",
				workLocation: "",
				status: "",

				manager: {
					id: null,
					employeeId: null,
					name: null,
				},

				hr: {
					id: null,
					employeeId: null,
					name: null,
				},

				lead: {
					id: null,
					employeeId: null,
					name: null,
				},
			},

			salary: {
				employeeCTC: 0,
				monthlyGross: 0,
				basic: 0,
				hra: 0,
				specialAllowance: 0,
				pf: 0,
				professionalTax: 0,
				otherDeductions: 0,
				netSalary: 0,
				currency: "INR",
			},

			bankDetails: {
				bankName: "",
				accountNumber: "",
				ifscCode: "",
				branch: "",
			},

			emergencyContact: {
				name: "",
				relationship: "",
				phone: "",
			},
		});
	});

	it("converts salary values into numbers", () => {
		const employee = {
			salary: {
				employeeCTC: "750000",
				monthlyGross: "60000",
			},
		};

		const result = buildEmployeeUpdatePayload(employee);

		expect(result.salary.employeeCTC).toBe(750000);
		expect(result.salary.monthlyGross).toBe(60000);
	});

	it("converts IFSC code to uppercase", () => {
		const employee = {
			bankDetails: {
				ifscCode: "abcD1234",
			},
		};

		const result = buildEmployeeUpdatePayload(employee);

		expect(result.bankDetails.ifscCode).toBe("ABCD1234");
	});

	it("proper-cases only names and textual address fields", () => {
		const result = buildEmployeeUpdatePayload({
			personalInfo: {
				firstName: "jOHN paul",
				lastName: "dOE",
				nationality: "indIAN",
			},
			address: {
				currentAddress: {
					street: "12A mG ROAD",
					city: "new DELHI",
					state: "delHI",
					country: "inDIA",
					pincode: "110001",
				},
			},
			emergencyContact: {
				name: "jANE dOE",
				relationship: "sISTER",
			},
		});

		expect(result.personalInfo).toMatchObject({
			firstName: "John Paul",
			lastName: "Doe",
			nationality: "indIAN",
		});
		expect(result.address.currentAddress).toEqual({
			street: "12A Mg Road",
			city: "New Delhi",
			state: "Delhi",
			country: "India",
			pincode: "110001",
		});
		expect(result.emergencyContact).toMatchObject({
			name: "Jane Doe",
			relationship: "sISTER",
		});
	});
});
