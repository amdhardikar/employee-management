export const STATUS_COLORS = {
	Active: "bg-emerald-100 text-emerald-700",
	Resigned: "bg-red-100 text-red-700",
	OnLeave: "bg-amber-100 text-amber-700",
	Probation: "bg-blue-100 text-blue-700",
};

export const ATTENDANCE_STATUS_COLORS = {
	Present: "bg-emerald-100 text-emerald-700",
	Absent: "bg-red-100 text-red-700",
	Leave: "bg-amber-100 text-amber-700",
};

export const ATTENDANCE_PERCENTAGE_COLORS = {
	EXCELLENT: "bg-green-100 text-green-700",
	AVERAGE: "bg-yellow-100 text-yellow-700",
	POOR: "bg-red-100 text-red-700",
};

export const PAYROLL_STATUS_COLORS = {
	Paid: "bg-emerald-100 text-emerald-700",
	Processing: "bg-sky-100 text-sky-700",
	Pending: "bg-amber-100 text-amber-700",
};

export const EMPLOYEE_DEFAULT_VALUES = {
	id: "",
	employeeCode: "",

	personalInfo: {
		firstName: "",
		lastName: "",
		fullName: "",
		gender: "",
		dateOfBirth: "",
		maritalStatus: "",
		bloodGroup: "",
		nationality: "Indian",
		email: "",
		phone: "",
		alternatePhone: "",
		profileImage: "",
	},

	address: {
		currentAddress: {
			street: "",
			city: "",
			state: "",
			country: "India",
			pincode: "",
		},

		permanentAddress: {
			street: "",
			city: "",
			state: "",
			country: "India",
			pincode: "",
		},
	},

	employment: {
		designation: "",
		departmentId: "",
		departmentName: "",
		employeeType: "Full Time",
		joiningDate: "",
		workLocation: "",
		workMode: "Onsite",
		status: "Active",
		probationEndDate: "",

		manager: {
			id: null,
			name: null,
		},
	},

	salary: {
		employeeCTC: 0,
		monthlyGross: 0,
		basic: 0,
		hra: 0,
		specialAllowance: 0,
		pf: 1800,
		professionalTax: 200,
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

	performance: {
		currentRating: 0,
		promotionEligible: false,
		skills: [],
	},

	documents: [],
};
