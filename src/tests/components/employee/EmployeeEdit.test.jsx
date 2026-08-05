import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import EmployeeEdit from "../../../components/employee/EmployeeEdit";

import useEmployeeEdit from "../../../hooks/useEmployeeEdit";
import { employeeApi } from "../../../api/employeeApi";
import { buildEmployeeUpdatePayload } from "../../../utils/employeePayload";

vi.mock("../../../hooks/useEmployeeEdit");

vi.mock("../../../api/employeeApi", () => ({
	employeeApi: {
		updateEmployee: vi.fn(),
	},
}));

vi.mock("../../../utils/employeePayload", () => ({
	buildEmployeeUpdatePayload: vi.fn(),
}));

const mockEmployee = {
	id: "e53a7bcc-e9f3-4e47-b575-8269006472ec",
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

const setup = (overrides = {}) => {
	useEmployeeEdit.mockReturnValue({
		employee: mockEmployee,
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
		errors: {},
		touched: {},
		isFormValid: true,
		touchField: vi.fn(),
		updateRootField: vi.fn(),
		updateNestedField: vi.fn(),
		updateDeepField: vi.fn(),
		handleDepartmentChange: vi.fn(),
		handleDesignationChange: vi.fn(),
		validate: vi.fn(() => ({})),
		...overrides,
	});

	return render(
		<MemoryRouter initialEntries={["/employees/EMP101/edit"]}>
			<Routes>
				<Route path="/employees/:id/edit" element={<EmployeeEdit />} />
			</Routes>
		</MemoryRouter>,
	);
};

describe("EmployeeEdit", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows loader while loading", () => {
		setup({
			loading: true,
		});

		expect(screen.getByText("Loading employee...")).toBeInTheDocument();
	});

	it("renders employee edit form", () => {
		setup();

		expect(screen.getByText("Personal Information")).toBeInTheDocument();

		expect(screen.getByText("Employment Information")).toBeInTheDocument();
	});

	it("renders existing employee values", () => {
		setup();

		expect(screen.getByDisplayValue("Aamod")).toBeInTheDocument();

		expect(screen.getByDisplayValue("amdhardikar@company.com")).toBeInTheDocument();

		expect(screen.getByDisplayValue("HDFC Bank")).toBeInTheDocument();
	});

	it("renders department options", () => {
		setup();

		expect(screen.getByText("Finance")).toBeInTheDocument();

		expect(screen.getByText("Accountant")).toBeInTheDocument();
	});

	it("calls updateRootField when email changes", () => {
		const updateRootField = vi.fn();

		setup({
			updateRootField,
		});

		fireEvent.change(screen.getByDisplayValue("amdhardikar@company.com"), {
			target: {
				value: "new@mail.com",
			},
		});

		expect(updateRootField).toHaveBeenCalledWith("email", "new@mail.com");
	});

	it("calls updateNestedField when first name changes", () => {
		const updateNestedField = vi.fn();

		setup({
			updateNestedField,
		});

		fireEvent.change(screen.getByDisplayValue("Aamod"), {
			target: {
				value: "Rahul",
			},
		});

		expect(updateNestedField).toHaveBeenCalledWith("personalInfo", "firstName", "Rahul");
	});

	it("updates employee successfully", async () => {
		const payload = {
			employeeId: "EMP101",
			email: "updated@test.com",
		};

		buildEmployeeUpdatePayload.mockReturnValue(payload);

		employeeApi.updateEmployee.mockResolvedValue({
			success: true,
		});

		setup();

		fireEvent.click(screen.getByText("Save"));

		await waitFor(() => {
			expect(buildEmployeeUpdatePayload).toHaveBeenCalledTimes(1);
			expect(employeeApi.updateEmployee).toHaveBeenCalledWith(mockEmployee.id, payload);
		});
	});

	it("does not submit when validation fails", async () => {
		const validate = vi.fn(() => ({
			email: "Invalid email",
		}));

		setup({
			validate,
		});

		fireEvent.click(screen.getByText("Save"));

		await waitFor(() => {
			expect(employeeApi.updateEmployee).not.toHaveBeenCalled();
		});
	});

	it("navigates back on cancel", () => {
		setup();

		fireEvent.click(screen.getByText("Cancel"));

		expect(screen.getByText("Personal Information")).toBeInTheDocument();
	});
});
