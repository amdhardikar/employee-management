import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import EmployeeEdit from "../../../../src/components/employee/EmployeeEdit";

import useEmployeeEdit from "../../../../src/hooks/useEmployeeEdit";
import { employeeApi } from "../../../../src/api/employeeApi";
import { buildEmployeeUpdatePayload } from "../../../../src/utils/employeePayload";

vi.mock("../../../../src/hooks/useEmployeeEdit");

vi.mock("../../../../src/api/employeeApi", () => ({
	employeeApi: {
		updateEmployee: vi.fn(),
	},
}));

vi.mock("../../../../src/utils/employeePayload", () => ({
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

	it("wires every form control to its change and blur handler", () => {
		const updateRootField = vi.fn();
		const updateNestedField = vi.fn();
		const updateDeepField = vi.fn();
		const touchField = vi.fn();
		const { container } = setup({ updateRootField, updateNestedField, updateDeepField, touchField });

		container.querySelectorAll("input").forEach((input) => {
			fireEvent.change(input, { target: { value: input.type === "date" ? "2000-01-01" : "Updated" } });
			fireEvent.blur(input);
		});

		container.querySelectorAll("select").forEach((select) => {
			const option = [...select.options].find((item) => item.value) || select.options[0];
			fireEvent.change(select, { target: { value: option?.value || "" } });
			fireEvent.blur(select);
		});

		expect(updateNestedField).toHaveBeenCalled();
		expect(updateDeepField).toHaveBeenCalled();
		expect(touchField).toHaveBeenCalled();
	});

	it("sets the remote location when remote work mode is selected", () => {
		const updateNestedField = vi.fn();
		const { container } = setup({ updateNestedField });
		const workMode = [...container.querySelectorAll("select")].find((select) =>
			[...select.options].some((option) => option.value === "Remote"),
		);
		fireEvent.change(workMode, { target: { value: "Remote" } });
		expect(updateNestedField).toHaveBeenCalledWith("employment", "workLocation", "Remote");
	});

	it("handles an update request failure", async () => {
		employeeApi.updateEmployee.mockRejectedValueOnce(new Error("Update failed"));
		setup();
		fireEvent.click(screen.getByRole("button", { name: "Save" }));
		expect(await screen.findByRole("heading", { name: "Unable to update employee" })).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent("Update failed");
	});

	it("enables Save for valid loaded data and disables it when the form is invalid", () => {
		const view = setup();
		expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();

		useEmployeeEdit.mockReturnValue({
			employee: mockEmployee, departments: [], designations: [], loading: false,
			errors: { email: "Email is required" }, touched: {}, isFormValid: false,
			touchField: vi.fn(), updateRootField: vi.fn(), updateNestedField: vi.fn(), updateDeepField: vi.fn(),
			handleDepartmentChange: vi.fn(), handleDesignationChange: vi.fn(), validate: vi.fn(() => ({})),
		});
		view.rerender(
			<MemoryRouter initialEntries={["/employees/EMP101/edit"]}>
				<Routes><Route path="/employees/:id/edit" element={<EmployeeEdit />} /></Routes>
			</MemoryRouter>,
		);
		expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
	});

	it("shows required errors immediately for an unassigned employee", () => {
		setup({
			employee: {
				...mockEmployee,
				employment: {
					...mockEmployee.employment,
					departmentId: "",
					designationId: "",
				},
			},
			errors: {
				departmentId: "Department is required",
				designationId: "Designation is required",
			},
			isFormValid: false,
		});

		expect(screen.getByText("Department is required")).toBeInTheDocument();
		expect(screen.getByText("Designation is required")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
	});

	it("disables Save and Cancel while an update is in progress", async () => {
		employeeApi.updateEmployee.mockReturnValue(new Promise(() => {}));
		setup();
		fireEvent.click(screen.getByRole("button", { name: "Save" }));
		expect(await screen.findByRole("status")).toHaveTextContent("Updating employee record...");
		expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
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

	it("renders validation feedback for every touched form field", () => {
		const touched = new Proxy({}, { get: () => true });
		const errors = new Proxy({}, { get: (_target, field) => `${String(field)} is invalid` });
		setup({ touched, errors, isFormValid: false });

		expect(screen.getAllByText(/is invalid$/).length).toBeGreaterThan(20);
		expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
	});

	it("renders empty editable values using safe form fallbacks", () => {
		setup({
			employee: {
				...mockEmployee,
				personalInfo: { ...mockEmployee.personalInfo, gender: "" },
				address: {
					currentAddress: { street: "", city: "", state: "", country: "", pincode: "" },
					permanentAddress: { street: "", city: "", state: "", country: "", pincode: "" },
				},
				employment: {
					...mockEmployee.employment,
					employeeType: "",
					workMode: "Office",
					workLocation: "",
				},
				bankDetails: { bankName: "", accountNumber: "", ifscCode: "", branch: "" },
				emergencyContact: { name: "", relationship: "", phone: "" },
			},
		});

		expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
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
		expect(screen.getByRole("option", { name: "Kotak Mahindra Bank" })).toBeInTheDocument();
	});

	it("formats a complete Indian phone number", () => {
		const updateNestedField = vi.fn();
		setup({ updateNestedField });
		fireEvent.change(screen.getByDisplayValue("+918766999381"), {
			target: { value: "+919876543210" },
		});
		expect(updateNestedField).toHaveBeenCalledWith("personalInfo", "phone", "+91 9876543210");
	});

	it("formats alternate and emergency phone numbers", () => {
		const updateNestedField = vi.fn();
		setup({ updateNestedField });
		fireEvent.change(screen.getByDisplayValue("+917219352039"), { target: { value: "8765432109" } });
		fireEvent.change(screen.getByDisplayValue("+919365857218"), { target: { value: "+919123456789" } });
		expect(updateNestedField).toHaveBeenCalledWith("personalInfo", "alternatePhone", "+91 8765432109");
		expect(updateNestedField).toHaveBeenCalledWith("emergencyContact", "phone", "+91 9123456789");
	});

	it("clears dependent bank fields when the bank changes", () => {
		const updateNestedField = vi.fn();
		setup({ updateNestedField });
		fireEvent.change(screen.getByDisplayValue("HDFC Bank"), { target: { value: "Axis Bank" } });
		expect(updateNestedField).toHaveBeenCalledWith("bankDetails", "bankName", "Axis Bank");
		expect(updateNestedField).toHaveBeenCalledWith("bankDetails", "accountNumber", "");
		expect(updateNestedField).toHaveBeenCalledWith("bankDetails", "ifscCode", "");
		expect(updateNestedField).toHaveBeenCalledWith("bankDetails", "branch", "");
	});

	it("shows load errors and missing employees instead of an endless loader", () => {
		const view = setup({ error: new Error("Server unavailable") });
		expect(screen.getByText("Unable to load employee")).toBeInTheDocument();
		expect(screen.getByText(/Server unavailable/)).toBeInTheDocument();

		view.unmount();
		setup({ employee: null });
		expect(screen.getByText("Employee Not Found")).toBeInTheDocument();
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
		expect(screen.getByRole("alert")).toHaveTextContent("Please correct the highlighted form errors");
	});

	it("navigates back on cancel", () => {
		setup();

		fireEvent.click(screen.getByText("Cancel"));

		expect(screen.getByText("Personal Information")).toBeInTheDocument();
	});
});
