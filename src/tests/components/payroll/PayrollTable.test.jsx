import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import PayrollTable from "../../../components/payroll/PayrollTable";

const payrolls = [
	{
		id: "1",

		employeeId: "EMP001",
		employeeCode: "E001",

		fullName: "John Doe",

		personalInfo: {
			fullName: "John Doe",
			profileImage: "john.jpg",
		},

		employment: {
			departmentName: "Engineering",
			designation: "Frontend Developer",
		},

		salary: {
			employeeCTC: 1200000,
			monthlyGross: 100000,
			netSalary: 85000,
			pf: 5000,
			professionalTax: 2000,
		},

		recentPayslip: {
			grossSalary: 100000,
			deductions: 15000,
			netSalary: 85000,
			month: "January",
			year: 2025,
			status: "Paid",
		},
	},
];

describe("PayrollTable", () => {
	it("renders payroll table headers", () => {
		render(<PayrollTable payrolls={payrolls} onView={vi.fn()} />);

		expect(screen.getByText("Employee")).toBeInTheDocument();
		expect(screen.getByText("Department")).toBeInTheDocument();
		expect(screen.getByText("CTC")).toBeInTheDocument();
		expect(screen.getByText("Monthly Gross")).toBeInTheDocument();
		expect(screen.getByText("Net Salary")).toBeInTheDocument();
		expect(screen.getByText("Deduction")).toBeInTheDocument();
	});

	it("renders employee payroll information", () => {
		render(<PayrollTable payrolls={payrolls} onView={vi.fn()} />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("E001 | EMP001")).toBeInTheDocument();
		expect(screen.getByText("Engineering")).toBeInTheDocument();
		expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
		expect(screen.getByText(`₹${(1200000).toLocaleString()}`)).toBeInTheDocument();
		expect(screen.getByText(`₹${(100000).toLocaleString()}`)).toBeInTheDocument();
		expect(screen.getByText(`₹${(85000).toLocaleString()}`)).toBeInTheDocument();
		expect(screen.getByText("₹5000")).toBeInTheDocument();
		expect(screen.getByText("₹2000")).toBeInTheDocument();
	});

	it("renders employee image", () => {
		render(<PayrollTable payrolls={payrolls} onView={vi.fn()} />);

		const image = screen.getByRole("img");

		expect(image).toHaveAttribute("src", "john.jpg");
		expect(image).toHaveAttribute("alt", "John Doe");
	});

	it("calls onView when view button is clicked", () => {
		const handleView = vi.fn();

		render(<PayrollTable payrolls={payrolls} onView={handleView} />);

		fireEvent.click(screen.getByRole("button"));

		expect(handleView).toHaveBeenCalledTimes(1);
		expect(handleView).toHaveBeenCalledWith(payrolls[0]);
	});

	it("renders empty table body when payroll list is empty", () => {
		render(<PayrollTable payrolls={[]} onView={vi.fn()} />);

		expect(screen.getAllByRole("row")).toHaveLength(1);
	});
});
