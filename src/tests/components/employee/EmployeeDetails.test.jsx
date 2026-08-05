import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeDetails from "../../../components/employee/EmployeeDetails";
import { employeeApi } from "../../../api/employeeApi";

vi.mock("react-router-dom", () => ({
	useParams: () => ({
		id: "EMP001",
	}),
}));

vi.mock("../../../api/employeeApi", () => ({
	employeeApi: {
		getById: vi.fn(),
	},
}));

vi.mock("../../../components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../../components/common/NotFound", () => ({
	default: ({ title, message }) => (
		<div>
			<h1>{title}</h1>
			<p>{message}</p>
		</div>
	),
}));

const employee = {
	fullName: "John Doe",
	email: "john@example.com",
	employeeCode: "EMP001",

	personalInfo: {
		profileImage: "/profile.png",
		gender: "Male",
		dateOfBirth: "1998-01-01",
		maritalStatus: "Single",
		bloodGroup: "O+",
		nationality: "Indian",
		phone: "9876543210",
		alternatePhone: "9999999999",
	},

	address: {
		currentAddress: {
			street: "Street 1",
			city: "Mumbai",
			state: "MH",
			country: "India",
			pincode: "400001",
		},
		permanentAddress: {
			street: "Street 2",
			city: "Pune",
			state: "MH",
			country: "India",
			pincode: "411001",
		},
	},

	employment: {
		departmentName: "Engineering",
		designation: "Frontend Developer",
		employeeType: "Full Time",
		joiningDate: "2023-01-01",
		manager: {
			name: "Manager One",
		},
		departmentId: "D01",
		designationId: "DES01",
		workMode: "Hybrid",
		workLocation: "Mumbai",
		status: "Active",
		probationEndDate: "2023-06-01",
		probationStatus: "Completed",
		hr: {
			name: "HR One",
		},
		lead: {
			name: "Lead One",
		},
	},

	salary: {
		employeeCTC: 1200000,
		netSalary: 90000,
		monthlyGross: 100000,
		basic: 50000,
		hra: 20000,
		specialAllowance: 15000,
		pf: 1800,
		professionalTax: 200,
		otherDeductions: 500,
		currency: "INR",
	},

	bankDetails: {
		bankName: "HDFC",
		accountNumber: "123456789",
		ifscCode: "HDFC0001",
		branch: "Mumbai",
	},

	recentPayslip: {
		month: "January",
		year: 2025,
		grossSalary: 100000,
		deductions: 2500,
		netSalary: 97500,
		status: "Paid",
	},

	attendance: {
		attendancePercentage: 98,
		totalPresentDays: 24,
		totalAbsentDays: 1,
		totalWorkingDays: 25,
		totalLeaveDays: 2,
		totalLateEntries: 1,
		totalLateLeaveEquivalent: 0,
		lastUpdatedYear: 2025,
	},

	performance: {
		currentRating: 4.5,
		promotionEligible: true,
		ratingScale: "5",
		lastAppraisalDate: "2025-01-01",
		skills: ["React", "Node", "Redux"],
	},

	documents: [
		{
			id: "DOC1",
			type: "PAN",
			status: "Verified",
		},
		{
			id: "DOC2",
			type: "AADHAR",
			status: "Verified",
		},
	],

	emergencyContact: {
		name: "Jane Doe",
		relationship: "Mother",
		phone: "8888888888",
	},

	leaveBalance: {
		casualLeave: {
			remaining: 5,
			allocated: 10,
		},
		sickLeave: {
			remaining: 6,
			allocated: 8,
		},
		earnedLeave: {
			remaining: 12,
			allocated: 20,
		},
		totalRemaining: 23,
	},
};

describe("EmployeeDetails", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows loader initially", () => {
		employeeApi.getById.mockImplementation(() => new Promise(() => {}));

		render(<EmployeeDetails />);

		expect(screen.getByText(/loading employee details/i)).toBeInTheDocument();
	});

	it("shows not found when api returns null", async () => {
		employeeApi.getById.mockResolvedValue(null);

		render(<EmployeeDetails />);

		expect(await screen.findByText(/employee not found/i)).toBeInTheDocument();

		expect(screen.getByText(/no employee exists with id/i)).toBeInTheDocument();
	});

	it("renders employee header", async () => {
		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		expect(
			await screen.findByRole("heading", {
				name: "John Doe",
			}),
		).toBeInTheDocument();

		expect(screen.getByText("john@example.com")).toBeInTheDocument();

		expect(screen.getAllByText("Frontend Developer").length).toBeGreaterThan(0);

		expect(screen.getAllByText("EMP001").length).toBeGreaterThan(0);
	});

	it("renders overview tab by default", async () => {
		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		await screen.findByText("Personal Information");

		expect(screen.getByText("Gender")).toBeInTheDocument();

		expect(screen.getByText("Male")).toBeInTheDocument();

		expect(screen.getByText("Address")).toBeInTheDocument();
	});

	it("switches to employment tab", async () => {
		const user = userEvent.setup();

		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		await screen.findByText("John Doe");

		await user.click(screen.getByRole("button", { name: /employment/i }));

		expect(screen.getByText("Department")).toBeInTheDocument();

		expect(screen.getByText("Engineering")).toBeInTheDocument();

		expect(screen.getByText("Manager One")).toBeInTheDocument();
	});

	it("switches to payroll tab", async () => {
		const user = userEvent.setup();

		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		await screen.findByText("John Doe");

		await user.click(screen.getByRole("button", { name: /payroll/i }));

		expect(screen.getByText("Salary Details")).toBeInTheDocument();

		expect(screen.getByText("Bank Details")).toBeInTheDocument();

		expect(screen.getByText("Recent Payslip")).toBeInTheDocument();
	});

	it("switches to attendance tab", async () => {
		const user = userEvent.setup();

		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		await screen.findByText("John Doe");

		await user.click(
			screen.getByRole("button", {
				name: "Attendance",
			}),
		);

		expect(
			screen.getByRole("heading", {
				name: "Attendance",
			}),
		).toBeInTheDocument();

		expect(screen.getByText("Attendance %")).toBeInTheDocument();

		expect(screen.getByText("98%")).toBeInTheDocument();
	});

	it("switches to performance tab", async () => {
		const user = userEvent.setup();

		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		await screen.findByText("John Doe");

		await user.click(
			screen.getByRole("button", {
				name: "Performance",
			}),
		);

		expect(
			screen.getByRole("heading", {
				name: "Performance",
			}),
		).toBeInTheDocument();

		expect(screen.getByText("Current Rating")).toBeInTheDocument();

		expect(screen.getByText("React")).toBeInTheDocument();

		expect(screen.getByText("Redux")).toBeInTheDocument();
	});

	it("switches to documents tab", async () => {
		const user = userEvent.setup();

		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		await screen.findByText("John Doe");

		await user.click(screen.getByRole("button", { name: /documents/i }));

		expect(screen.getByText("PAN")).toBeInTheDocument();

		expect(screen.getByText("AADHAR")).toBeInTheDocument();

		expect(screen.getAllByText("Verified")).toHaveLength(2);
	});

	it("switches to contact tab", async () => {
		const user = userEvent.setup();

		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		await screen.findByText("John Doe");

		await user.click(screen.getByRole("button", { name: /contact/i }));

		expect(screen.getByText("Emergency Contact")).toBeInTheDocument();

		expect(screen.getByText("Jane Doe")).toBeInTheDocument();

		expect(screen.getByText("Mother")).toBeInTheDocument();
	});

	it("switches to leave tab", async () => {
		const user = userEvent.setup();

		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		await screen.findByText("John Doe");

		await user.click(
			screen.getByRole("button", {
				name: "Leave Balance",
			}),
		);

		expect(
			screen.getByRole("heading", {
				name: "Leave Balance",
			}),
		).toBeInTheDocument();

		expect(screen.getByText("Casual Leave")).toBeInTheDocument();

		expect(screen.getByText("5/10")).toBeInTheDocument();

		expect(screen.getByText("6/8")).toBeInTheDocument();

		expect(screen.getByText("12/20")).toBeInTheDocument();
	});

	it("calls employee api with route id", async () => {
		employeeApi.getById.mockResolvedValue(employee);

		render(<EmployeeDetails />);

		await waitFor(() => {
			expect(employeeApi.getById).toHaveBeenCalledWith("EMP001");
		});
	});
});
