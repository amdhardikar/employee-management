import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import PayrollCard from "../../../components/payroll/PayrollCard";

const employee = {
	id: "1",

	personalInfo: {
		profileImage: "profile.jpg",
		fullName: "John Doe",
	},

	employment: {
		departmentName: "Engineering",
	},

	recentPayslip: {
		netSalary: 85000,
		grossSalary: 100000,
		deductions: 15000,
		month: "January",
	},
};

describe("PayrollCard", () => {
	it("renders employee payroll information", () => {
		render(<PayrollCard employee={employee} onView={vi.fn()} />);

		expect(screen.getByText("Engineering")).toBeInTheDocument();
		expect(screen.getByText("January")).toBeInTheDocument();
		expect(screen.getByText(`₹${employee.recentPayslip.netSalary.toLocaleString()}`)).toBeInTheDocument();
		expect(screen.getByText(`₹${employee.recentPayslip.grossSalary.toLocaleString()}`)).toBeInTheDocument();
		expect(screen.getByText(`₹${employee.recentPayslip.deductions.toLocaleString()}`)).toBeInTheDocument();
	});

	it("renders profile image correctly", () => {
		render(<PayrollCard employee={employee} onView={vi.fn()} />);

		const image = screen.getByRole("img");

		expect(image).toHaveAttribute("src", "profile.jpg");
		expect(image).toHaveAttribute("alt", "John Doe");
	});

	it("calls onView when action button is clicked", () => {
		const handleView = vi.fn();

		render(<PayrollCard employee={employee} onView={handleView} />);

		fireEvent.click(screen.getByRole("button"));

		expect(handleView).toHaveBeenCalledTimes(1);
		expect(handleView).toHaveBeenCalledWith(employee);
	});

	it("handles missing optional employee details", () => {
		const incompleteEmployee = {
			recentPayslip: {
				netSalary: 50000,
				grossSalary: 60000,
				deductions: 10000,
				month: "February",
			},
		};

		render(<PayrollCard employee={incompleteEmployee} onView={vi.fn()} />);

		expect(screen.getByText("₹50,000")).toBeInTheDocument();
		expect(screen.getByText("February")).toBeInTheDocument();

		const image = screen.getByRole("img");
		expect(image).not.toHaveAttribute("src");
		expect(image).not.toHaveAttribute("alt");
	});
});
