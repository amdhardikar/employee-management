import { describe, it, expect } from "vitest";

import { validateEmployee } from "../../utils/employeeValidation";

const validEmployee = {
	email: "john@test.com",

	personalInfo: {
		firstName: "John",
		lastName: "Doe",
		gender: "Male",
		bloodGroup: "O+",
		dateOfBirth: "1995-01-01",
		maritalStatus: "Single",
		nationality: "Indian",
		phone: "9876543210",
		alternatePhone: "8765432109",
	},

	address: {
		currentAddress: {
			street: "MG Road",
			city: "Mumbai",
			state: "Maharashtra",
			country: "India",
			pincode: "400001",
		},

		permanentAddress: {
			street: "FC Road",
			city: "Pune",
			state: "Maharashtra",
			country: "India",
			pincode: "411001",
		},
	},

	employment: {
		departmentId: "DEP001",
		designationId: "DES001",
		employeeType: "Full Time",
		workMode: "Office",
		workLocation: "Mumbai",
		status: "Active",

		manager: {
			employeeId: "EMP100",
		},

		hr: {
			employeeId: "EMP101",
		},

		lead: {
			employeeId: "EMP102",
		},
	},

	salary: {
		employeeCTC: 600000,
		monthlyGross: 40000,
		basic: 20000,
		hra: 10000,
		specialAllowance: 5000,
		pf: 2000,
		professionalTax: 500,
		otherDeductions: 500,
		netSalary: 37000,
	},

	bankDetails: {
		bankName: "HDFC",
		accountNumber: "123456789",
		ifscCode: "HDFC0001234",
		branch: "Mumbai",
	},

	emergencyContact: {
		name: "Jane Doe",
		relationship: "Sister",
		phone: "9876543210",
	},
};

describe("validateEmployee", () => {
	it("returns empty errors for valid employee", () => {
		const errors = validateEmployee(validEmployee);

		expect(errors).toEqual({});
	});

	it("validates required personal information", () => {
		const employee = {
			...validEmployee,
			email: "",
			personalInfo: {
				...validEmployee.personalInfo,
				firstName: "",
				lastName: "",
			},
		};

		const errors = validateEmployee(employee);

		expect(errors.firstName).toBe("First name is required");
		expect(errors.lastName).toBe("Last name is required");
		expect(errors.email).toBe("Email is required");
	});

	it("rejects invalid names", () => {
		const employee = {
			...validEmployee,
			personalInfo: {
				...validEmployee.personalInfo,
				firstName: "John123",
			},
		};

		const errors = validateEmployee(employee);

		expect(errors.firstName).toBe("Invalid first name");
	});

	it("validates phone numbers", () => {
		const employee = {
			...validEmployee,
			personalInfo: {
				...validEmployee.personalInfo,
				phone: "12345",
			},
		};

		const errors = validateEmployee(employee);

		expect(errors.phone).toBe("Invalid phone number");
	});

	it("validates employee age should be above 18", () => {
		const employee = {
			...validEmployee,
			personalInfo: {
				...validEmployee.personalInfo,
				dateOfBirth: new Date().toISOString(),
			},
		};

		const errors = validateEmployee(employee);

		expect(errors.dateOfBirth).toBe("Employee must be at least 18 years old");
	});

	it("validates address fields", () => {
		const employee = {
			...validEmployee,
			address: {
				currentAddress: {},
				permanentAddress: {},
			},
		};

		const errors = validateEmployee(employee);

		expect(errors["currentAddress.street"]).toBe("Street is required");

		expect(errors["permanentAddress.city"]).toBe("City is required");
	});

	it("validates employment required fields", () => {
		const employee = {
			...validEmployee,
			employment: {},
		};

		const errors = validateEmployee(employee);

		expect(errors.departmentId).toBe("Department is required");
		expect(errors.designationId).toBe("Designation is required");
		expect(errors.employeeType).toBe("Employee type is required");
		expect(errors.status).toBe("Status is required");
	});

	it("validates employee hierarchy ids", () => {
		const employee = {
			...validEmployee,
			employment: {
				...validEmployee.employment,
				manager: {
					employeeId: "123",
				},
			},
		};

		const errors = validateEmployee(employee);

		expect(errors.managerEmployeeId).toBe("Invalid manager employee ID");
	});

	it("validates salary fields", () => {
		const employee = {
			...validEmployee,
			salary: {
				employeeCTC: -100,
				monthlyGross: 40000,
				basic: 50000,
				netSalary: 90000,
			},
		};

		const errors = validateEmployee(employee);

		expect(errors.employeeCTC).toBe("Cannot be negative");

		expect(errors.basic).toBe("Basic salary cannot exceed monthly gross");

		expect(errors.netSalary).toBe("Net salary cannot exceed gross salary");
   });
   
   it("validates salary numeric fields", () => {
		const employee = {
			...validEmployee,
			salary: {
				monthlyGross: "abc",
			},
		};

		const errors = validateEmployee(employee);

		expect(errors.monthlyGross).toBe("Must be a number");
   });

	it("validates bank details", () => {
		const employee = {
			...validEmployee,
			bankDetails: {
				bankName: "",
				accountNumber: "123",
				ifscCode: "abc",
				branch: "",
			},
		};

		const errors = validateEmployee(employee);

		expect(errors.bankName).toBe("Bank name is required");

		expect(errors.accountNumber).toBe("Invalid account number");

		expect(errors.ifscCode).toBe("Invalid IFSC");

		expect(errors.branch).toBe("Branch is required");
	});

	it("validates emergency contact", () => {
		const employee = {
			...validEmployee,
			emergencyContact: {
				name: "",
				relationship: "",
				phone: "123",
			},
		};

		const errors = validateEmployee(employee);

		expect(errors.emergencyName).toBe("Contact name is required");

		expect(errors.relationship).toBe("Relationship is required");

		expect(errors.emergencyPhone).toBe("Invalid phone number");
	});
});
