import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EmployeeCreate from "../../../../src/components/employee/EmployeeCreate";

import useEmployeeCreate from "../../../../src/hooks/useEmployeeCreate";
import { employeeApi } from "../../../../src/api/employeeApi";
import { buildEmployeeUpdatePayload } from "../../../../src/utils/employeePayload";

import { MemoryRouter } from "react-router-dom";

vi.mock("../../../../src/hooks/useEmployeeCreate");

vi.mock("../../../../src/api/employeeApi", () => ({
	employeeApi: {
		createEmployee: vi.fn(),
	},
}));

vi.mock("../../../../src/utils/employeePayload", () => ({
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

	it("wires every form control to its change and blur handler", () => {
		const { container } = render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		container.querySelectorAll("input").forEach((input) => {
			fireEvent.change(input, { target: { value: input.type === "date" ? "2000-01-01" : "Updated" } });
			fireEvent.blur(input);
		});

		container.querySelectorAll("select").forEach((select) => {
			const option = [...select.options].find((item) => item.value) || select.options[0];
			fireEvent.change(select, { target: { value: option?.value || "" } });
			fireEvent.blur(select);
		});

		expect(mockHook.updateNestedField).toHaveBeenCalled();
		expect(mockHook.updateDeepField).toHaveBeenCalled();
		expect(mockHook.touchField).toHaveBeenCalled();
	});

	it("sets the remote location when remote work mode is selected", () => {
		const { container } = render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);
		const workMode = [...container.querySelectorAll("select")].find((select) =>
			[...select.options].some((option) => option.value === "Remote"),
		);
		fireEvent.change(workMode, { target: { value: "Remote" } });
		expect(mockHook.updateNestedField).toHaveBeenCalledWith("employment", "workLocation", "Remote");
	});

	it("handles a create request failure", async () => {
		employeeApi.createEmployee.mockRejectedValueOnce(new Error("Create failed"));
		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Save" }));
		expect(await screen.findByRole("heading", { name: "Unable to create employee" })).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent("Create failed");
		await userEvent.click(screen.getByRole("button", { name: "Close" }));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("shows blocking progress feedback while the employee is being saved", async () => {
		employeeApi.createEmployee.mockReturnValue(new Promise(() => {}));
		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Save" }));
		expect(await screen.findByRole("status")).toHaveTextContent("Creating employee record...");
		expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
	});

	it("keeps Save disabled until the create form is valid", () => {
		useEmployeeCreate.mockReturnValue({ ...mockHook, isFormValid: false });
		const { rerender } = render(
			<MemoryRouter><EmployeeCreate /></MemoryRouter>,
		);
		expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

		useEmployeeCreate.mockReturnValue({ ...mockHook, isFormValid: true });
		rerender(<MemoryRouter><EmployeeCreate /></MemoryRouter>);
		expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
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
			</MemoryRouter>,
		);

		expect(screen.getByText(/loading employee/i)).toBeInTheDocument();
	});

	it("renders employee create form", () => {
		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		expect(screen.getByText("Personal Information")).toBeInTheDocument();

		expect(screen.getByText("Address Information")).toBeInTheDocument();

		expect(screen.getByText("Employment Information")).toBeInTheDocument();

		expect(screen.getByText("Bank Details")).toBeInTheDocument();

		expect(screen.getByText("Emergency Contact")).toBeInTheDocument();
	});

	it("renders validation feedback for every touched form field", () => {
		const touched = new Proxy({}, { get: () => true });
		const errors = new Proxy({}, { get: (_target, field) => `${String(field)} is invalid` });
		useEmployeeCreate.mockReturnValue({
			...mockHook,
			touched,
			errors,
			isFormValid: false,
		});

		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		expect(screen.getAllByText(/is invalid$/).length).toBeGreaterThan(20);
		expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
	});

	it("renders default employee values", () => {
		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		expect(screen.getByDisplayValue("Aamod")).toBeInTheDocument();

		expect(screen.getByDisplayValue("Hardikar")).toBeInTheDocument();

		expect(screen.getByDisplayValue("amdhardikar@company.com")).toBeInTheDocument();
	});

	it("renders department and designation options", () => {
		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		expect(screen.getByText("Finance")).toBeInTheDocument();

		expect(screen.getByText("Accountant")).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Kotak Mahindra Bank" })).toBeInTheDocument();
	});

	it("formats a complete Indian phone number", () => {
		render(<MemoryRouter><EmployeeCreate /></MemoryRouter>);
		fireEvent.change(screen.getByDisplayValue("+918766999381"), {
			target: { value: "9876543210" },
		});
		expect(mockHook.updateNestedField).toHaveBeenCalledWith(
			"personalInfo",
			"phone",
			"+91 9876543210",
		);
	});

	it("formats alternate and emergency phone numbers", () => {
		render(<MemoryRouter><EmployeeCreate /></MemoryRouter>);
		fireEvent.change(screen.getByDisplayValue("+917219352039"), { target: { value: "8765432109" } });
		fireEvent.change(screen.getByDisplayValue("+919365857218"), { target: { value: "+919123456789" } });
		expect(mockHook.updateNestedField).toHaveBeenCalledWith(
			"personalInfo", "alternatePhone", "+91 8765432109",
		);
		expect(mockHook.updateNestedField).toHaveBeenCalledWith(
			"emergencyContact", "phone", "+91 9123456789",
		);
	});

	it("clears dependent bank fields when the bank changes", () => {
		render(<MemoryRouter><EmployeeCreate /></MemoryRouter>);
		fireEvent.change(screen.getByDisplayValue("HDFC Bank"), { target: { value: "Axis Bank" } });
		expect(mockHook.updateNestedField).toHaveBeenCalledWith("bankDetails", "bankName", "Axis Bank");
		expect(mockHook.updateNestedField).toHaveBeenCalledWith("bankDetails", "accountNumber", "");
		expect(mockHook.updateNestedField).toHaveBeenCalledWith("bankDetails", "ifscCode", "");
		expect(mockHook.updateNestedField).toHaveBeenCalledWith("bankDetails", "branch", "");
	});

	it("shows a reference-data load error instead of an endless loader", () => {
		useEmployeeCreate.mockReturnValue({ ...mockHook, error: new Error("Server unavailable") });
		render(<MemoryRouter><EmployeeCreate /></MemoryRouter>);
		expect(screen.getByText("Unable to load employee form")).toBeInTheDocument();
		expect(screen.getByText(/Server unavailable/)).toBeInTheDocument();
	});

	it("calls updateRootField when email changes", async () => {
		const user = userEvent.setup();

		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		const email = screen.getByDisplayValue("amdhardikar@company.com");

		await user.clear(email);

		await user.type(email, "new@test.com");

		expect(mockHook.updateRootField).toHaveBeenCalled();
	});

	it("calls updateNestedField when first name changes", async () => {
		const user = userEvent.setup();

		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		const input = screen.getByDisplayValue("Aamod");

		await user.clear(input);

		await user.type(input, "John");

		expect(mockHook.updateNestedField).toHaveBeenCalledWith("personalInfo", "firstName", expect.any(String));
	});

	it("submits employee successfully", async () => {
		const user = userEvent.setup();

		employeeApi.createEmployee.mockResolvedValue({
			success: true,
		});

		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		await user.click(
			screen.getByRole("button", {
				name: /save/i,
			}),
		);

		await waitFor(() => {
			expect(buildEmployeeUpdatePayload).toHaveBeenCalledWith(employee);

			expect(employeeApi.createEmployee).toHaveBeenCalled();

			expect(navigateMock).toHaveBeenCalledWith("/employees/EMP101");
		});
	});

	it("does not submit when validation fails", async () => {
		const user = userEvent.setup();

		mockHook.validate.mockReturnValue({
			email: "Required",
		});

		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		await user.click(
			screen.getByRole("button", {
				name: /save/i,
			}),
		);

		expect(employeeApi.createEmployee).not.toHaveBeenCalled();

		expect(navigateMock).not.toHaveBeenCalled();
		expect(screen.getByRole("alert")).toHaveTextContent("Please correct the highlighted form errors");
	});

	it("navigates back on cancel", async () => {
		const user = userEvent.setup();

		render(
			<MemoryRouter>
				<EmployeeCreate />
			</MemoryRouter>,
		);

		await user.click(
			screen.getByRole("button", {
				name: /cancel/i,
			}),
		);

		expect(navigateMock).toHaveBeenCalledWith(-1);
	});
});
