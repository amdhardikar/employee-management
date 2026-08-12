import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DepartmentCreate from "../../../../src/components/department/DepartmentCreate";
import { departmentApi } from "../../../../src/api/departmentApi";
import { addDepartment } from "../../../../src/store/departmentSlice";

const navigateMock = vi.fn();
const dispatchMock = vi.fn();

vi.mock("react-router-dom", () => ({
	useNavigate: () => navigateMock,
}));

vi.mock("react-redux", () => ({
	useDispatch: () => dispatchMock,
}));

vi.mock("../../../../src/api/departmentApi", () => ({
	departmentApi: {
		createDepartment: vi.fn(),
	},
}));

vi.mock("../../../../src/store/departmentSlice", () => ({
	addDepartment: vi.fn((department) => ({
		type: "departments/addDepartment",
		payload: department,
	})),
}));

describe("DepartmentCreate", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the create form", () => {
		render(<DepartmentCreate />);

		expect(screen.getByText("Create Department")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter department name")).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/enter skill/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/enter designation/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Create" })).toBeEnabled();
	});

	it("shows validation errors when submitting an empty form", async () => {
		render(<DepartmentCreate />);

		const form = screen.getByRole("button", { name: "Create" }).closest("form");
		fireEvent.submit(form);

		expect(screen.getByText("Department name is required")).toBeInTheDocument();
		expect(screen.getByText("At least one skill is required")).toBeInTheDocument();
		expect(screen.getByText("At least one designation is required")).toBeInTheDocument();
	});

	it("adds and removes skills", async () => {
		const user = userEvent.setup();

		render(<DepartmentCreate />);

		const input = screen.getByPlaceholderText(/enter skill/i);
		await user.type(input, "React");
		await user.click(screen.getAllByRole("button", { name: "Add" })[0]);

		expect(screen.getByText("React")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "×" }));
		expect(screen.queryByText("React")).not.toBeInTheDocument();
	});

	it("adds a designation with Enter", async () => {
		const user = userEvent.setup();

		render(<DepartmentCreate />);

		const input = screen.getByPlaceholderText(/enter designation/i);
		await user.type(input, "Developer");
		await user.keyboard("{Enter}");

		expect(screen.getByText("Developer")).toBeInTheDocument();
	});

	it("does not add duplicate tags", async () => {
		const user = userEvent.setup();

		render(<DepartmentCreate />);

		const input = screen.getByPlaceholderText(/enter skill/i);

		await user.type(input, "React");
		await user.click(screen.getAllByRole("button", { name: "Add" })[0]);

		await user.type(input, "React");
		await user.click(screen.getAllByRole("button", { name: "Add" })[0]);

		expect(screen.getAllByText("React")).toHaveLength(1);
	});

	it("creates a department successfully", async () => {
		const user = userEvent.setup();

		departmentApi.createDepartment.mockResolvedValue({
			department: {
				departmentId: "D001",
				name: "Engineering",
				skills: ["React"],
				designations: ["Developer"],
			},
		});

		render(<DepartmentCreate />);

		await user.type(screen.getByPlaceholderText("Enter department name"), "Engineering");

		const skillInput = screen.getByPlaceholderText(/enter skill/i);
		await user.type(skillInput, "React");
		await user.click(screen.getAllByRole("button", { name: "Add" })[0]);

		const designationInput = screen.getByPlaceholderText(/enter designation/i);
		await user.type(designationInput, "Developer");
		await user.click(screen.getAllByRole("button", { name: "Add" })[1]);

		await user.click(screen.getByRole("button", { name: "Create" }));

		await waitFor(() => {
			expect(departmentApi.createDepartment).toHaveBeenCalledWith({
				name: "Engineering",
				skills: ["React"],
				designations: ["Developer"],
			});
		});

		expect(addDepartment).toHaveBeenCalled();
		expect(dispatchMock).toHaveBeenCalled();
		expect(navigateMock).toHaveBeenCalledWith("/departments");
	});

	it("shows server error when creation fails", async () => {
		const user = userEvent.setup();

		departmentApi.createDepartment.mockRejectedValue(new Error("Server unavailable"));

		render(<DepartmentCreate />);

		await user.type(screen.getByPlaceholderText("Enter department name"), "Engineering");

		await user.type(screen.getByPlaceholderText(/enter skill/i), "React");
		await user.click(screen.getAllByRole("button", { name: "Add" })[0]);

		await user.type(screen.getByPlaceholderText(/enter designation/i), "Developer");
		await user.click(screen.getAllByRole("button", { name: "Add" })[1]);

		await user.click(screen.getByRole("button", { name: "Create" }));

		expect(await screen.findByRole("heading", { name: "Unable to create department" })).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent("Server unavailable");
	});

	it("navigates back when cancel is clicked", async () => {
		const user = userEvent.setup();

		render(<DepartmentCreate />);

		await user.click(screen.getByRole("button", { name: "Cancel" }));

		expect(navigateMock).toHaveBeenCalledWith(-1);
	});

	it("validates touched and empty fields during interaction", async () => {
		const user = userEvent.setup();
		render(<DepartmentCreate />);
		const name = screen.getByPlaceholderText("Enter department name");
		await user.click(name);
		await user.tab();
		await user.type(name, "A");
		await user.clear(name);
		expect(screen.getByText("Department name is required")).toBeInTheDocument();

		const skill = screen.getByPlaceholderText(/enter skill/i);
		await user.click(skill);
		await user.tab();
		expect(screen.getByText("At least one skill is required")).toBeInTheDocument();
		await user.type(skill, "R");
		await user.clear(skill);

		const designation = screen.getByPlaceholderText(/enter designation/i);
		await user.click(designation);
		await user.tab();
		expect(screen.getByText("At least one designation is required")).toBeInTheDocument();
	});

	it("removes the last designation and restores its validation error", async () => {
		const user = userEvent.setup();
		render(<DepartmentCreate />);
		const input = screen.getByPlaceholderText(/enter designation/i);
		await user.type(input, "Developer");
		await user.keyboard("{Enter}");
		await user.click(screen.getByRole("button", { name: "×" }));
		expect(screen.queryByText("Developer")).not.toBeInTheDocument();
		expect(screen.getByText("At least one designation is required")).toBeInTheDocument();
	});
});
