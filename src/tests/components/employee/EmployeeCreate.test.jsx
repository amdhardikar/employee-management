import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EmployeeCreate from "../../../components/employee/EmployeeCreate";

import useEmployeeCreate from "../../../hooks/useEmployeeCreate";
import { employeeApi } from "../../../api/employeeApi";
import { buildEmployeeUpdatePayload } from "../../../utils/employeePayload";

import { MemoryRouter } from "react-router-dom";

vi.mock("../../../hooks/useEmployeeCreate");

vi.mock("../../../api/employeeApi", () => ({
   employeeApi: {
      createEmployee: vi.fn(),
   },
}));

vi.mock("../../../utils/employeePayload", () => ({
	buildEmployeeUpdatePayload: vi.fn(),
}));

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");

	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});


const employee = {
	employeeId: "EMP101",
	email: "amdhardikar@company.com",

	personalInfo: {
		firstName: "Aamod",
		lastName: "Hardikar",
		gender: "Male",
		dateOfBirth: "1973-09-15",
		maritalStatus: "Single",
		bloodGroup: "AB+",
		nationality: "Indian",
		phone: "+918766999381",
		alternatePhone: "+917219352039",
	},

	address: {
		currentAddress: {
			street: "755 Ganaka Lane",
			city: "Mumbai",
			state: "Maharashtra",
			country: "India",
			pincode: "854399",
		},
		permanentAddress: {
			street: "87563 Panicker Point",
			city: "Nashik",
			state: "Maharashtra",
			country: "India",
			pincode: "281500",
		},
	},

	employment: {
		departmentId: "DEPT003",
		designationId: "DESG013",
		employeeType: "Contract",
		workMode: "Remote",
		workLocation: "Remote",
	},

	bankDetails: {
		bankName: "HDFC Bank",
		accountNumber: "XXXXXX2945",
		ifscCode: "SBIN0303669",
		branch: "Mumbai",
	},

	emergencyContact: {
		name: "Chandraketu Bharadwaj",
		relationship: "Sister",
		phone: "+919365857218",
	},
};


const mockHook = {
	employee,
	departments: [
		{
			departmentId: "DEPT003",
			name: "Finance",
		},
	],
	designations: [
		{
			designationId: "DESG013",
			name: "Accountant",
		},
	],

	loading: false,

	touched: {},

	errors: {},

	isFormValid: true,

	touchField: vi.fn(),

	updateRootField: vi.fn(),

	updateNestedField: vi.fn(),

	updateDeepField: vi.fn(),

	handleDepartmentChange: vi.fn(),

	handleDesignationChange: vi.fn(),

   validate: vi.fn(() => ({})),
};


describe("EmployeeCreate", () => {

	beforeEach(() => {
		vi.clearAllMocks();

		useEmployeeCreate.mockReturnValue(mockHook);

		buildEmployeeUpdatePayload.mockReturnValue({
			employeeId: "EMP101",
		});
	});


	it("shows loader while loading", () => {

		useEmployeeCreate.mockReturnValue({
			...mockHook,
			loading: true,
			employee: null,
		});


		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>
		);


		expect(
			screen.getByText(/loading employee/i)
		).toBeInTheDocument();

	});


	it("renders employee create form", () => {

		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>
		);


		expect(
			screen.getByText("Personal Information")
		).toBeInTheDocument();


		expect(
			screen.getByText("Address Information")
		).toBeInTheDocument();


		expect(
			screen.getByText("Employment Information")
		).toBeInTheDocument();


		expect(
			screen.getByText("Bank Details")
		).toBeInTheDocument();


		expect(
			screen.getByText("Emergency Contact")
		).toBeInTheDocument();

	});


	it("renders default employee values", () => {

		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>
		);


		expect(
			screen.getByDisplayValue("Aamod")
		).toBeInTheDocument();


		expect(
			screen.getByDisplayValue("Hardikar")
		).toBeInTheDocument();


		expect(
			screen.getByDisplayValue("amdhardikar@company.com")
		).toBeInTheDocument();

	});


	it("renders department and designation options", () => {

		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>
		);


		expect(
			screen.getByText("Finance")
		).toBeInTheDocument();


		expect(
			screen.getByText("Accountant")
		).toBeInTheDocument();

	});


	it("calls updateRootField when email changes", async () => {

		const user = userEvent.setup();


		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>
		);


		const email = screen.getByDisplayValue(
			"amdhardikar@company.com"
		);


		await user.clear(email);

		await user.type(
			email,
			"new@test.com"
		);


		expect(
			mockHook.updateRootField
		).toHaveBeenCalled();

	});


	it("calls updateNestedField when first name changes", async () => {

		const user = userEvent.setup();


		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>
		);


		const input =
			screen.getByDisplayValue("Aamod");


		await user.clear(input);

		await user.type(input,"John");


		expect(
			mockHook.updateNestedField
		).toHaveBeenCalledWith(
			"personalInfo",
			"firstName",
			expect.any(String)
		);

	});


	it("submits employee successfully", async () => {

		const user = userEvent.setup();


		employeeApi.createEmployee.mockResolvedValue({
			success:true,
		});


		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>
		);


		await user.click(
			screen.getByRole("button",{
				name:/save/i
			})
		);


		await waitFor(() => {

			expect(
				buildEmployeeUpdatePayload
			).toHaveBeenCalledWith(employee);


			expect(
				employeeApi.createEmployee
			).toHaveBeenCalled();


			expect(
				navigateMock
			).toHaveBeenCalledWith(
				"/employees/EMP101"
			);

		});

	});


	it("does not submit when validation fails", async () => {

		const user = userEvent.setup();


		mockHook.validate.mockReturnValue({
			email:"Required"
		});


		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>
		);


		await user.click(
			screen.getByRole("button",{
				name:/save/i
			})
		);


		expect(
			employeeApi.createEmployee
		).not.toHaveBeenCalled();


		expect(
			navigateMock
		).not.toHaveBeenCalled();

	});


	it("navigates back on cancel", async () => {

		const user = userEvent.setup();


		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>
		);


		await user.click(
			screen.getByRole("button",{
				name:/cancel/i
			})
		);


		expect(
			navigateMock
		).toHaveBeenCalledWith(-1);

	});

});