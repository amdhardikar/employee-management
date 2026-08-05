import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PayrollDetailsTable from "../../../components/payroll/PayrollDetailsTable";

const payroll = [
	{
		id: "1",
		payrollId: "PAY-001",
		monthName: "January",
		year: 2025,
		grossSalary: 100000,
		netSalary: 85000,
		paymentDate: "2025-01-31",
		status: "Paid",
		deductions: {
			totalDeductions: 15000,
		},
	},
	{
		id: "2",
		payrollId: "PAY-002",
		monthName: "February",
		year: 2025,
		grossSalary: 90000,
		netSalary: 90000,
		paymentDate: "2025-02-28",
		status: "Pending",
		deductions: undefined,
	},
];

describe("PayrollDetailsTable", () => {
	it("renders all table headers", () => {
		render(<PayrollDetailsTable payroll={payroll} />);

		expect(screen.getByText("Payroll ID")).toBeInTheDocument();
		expect(screen.getByText("Month")).toBeInTheDocument();
		expect(screen.getByText("Year")).toBeInTheDocument();
		expect(screen.getByText("Gross Salary")).toBeInTheDocument();
		expect(screen.getByText("Total Deductions")).toBeInTheDocument();
		expect(screen.getByText("Net Salary")).toBeInTheDocument();
		expect(screen.getByText("Payment Date")).toBeInTheDocument();
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("renders payroll rows with formatted values", () => {
		render(<PayrollDetailsTable payroll={payroll} />);

		expect(screen.getByText("PAY-001")).toBeInTheDocument();
		expect(screen.getByText("PAY-002")).toBeInTheDocument();
		expect(screen.getByText("January")).toBeInTheDocument();
		expect(screen.getByText("February")).toBeInTheDocument();
		expect(screen.getByText("₹1,00,000")).toBeInTheDocument();
		expect(screen.getAllByText("₹90,000")).toHaveLength(2);
		expect(screen.getByText("₹15,000")).toBeInTheDocument();
		expect(screen.getByText("₹0")).toBeInTheDocument();
		expect(screen.getByText("₹85,000")).toBeInTheDocument();
		expect(screen.getByText(new Date("2025-01-31").toLocaleDateString("en-IN"))).toBeInTheDocument();
		expect(screen.getByText(new Date("2025-02-28").toLocaleDateString("en-IN"))).toBeInTheDocument();
	});

	it("renders payroll statuses", () => {
		render(<PayrollDetailsTable payroll={payroll} />);

		expect(screen.getByText("Paid")).toBeInTheDocument();
		expect(screen.getByText("Pending")).toBeInTheDocument();

		expect(screen.getByText("Paid").className).toContain("rounded-full");
		expect(screen.getByText("Pending").className).toContain("rounded-full");
	});

	it("renders no data rows when payroll is empty", () => {
		render(<PayrollDetailsTable payroll={[]} />);

		expect(screen.getAllByRole("row")).toHaveLength(1);
	});
});
