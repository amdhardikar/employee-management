import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PayrollDetailCard from "../../../../src/components/payroll/PayrollDetailCard";

const createPayroll = (overrides = {}) => ({
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
	...overrides,
});

describe("PayrollDetailCard", () => {
	it("renders payroll information correctly", () => {
		render(<PayrollDetailCard item={createPayroll()} />);

		expect(screen.getByText("January")).toBeInTheDocument();
		expect(screen.getByText("2025")).toBeInTheDocument();

		expect(screen.getByText("PAY-001")).toBeInTheDocument();

		expect(screen.getByText("₹1,00,000")).toBeInTheDocument();
		expect(screen.getByText("₹15,000")).toBeInTheDocument();
		expect(screen.getByText("₹85,000")).toBeInTheDocument();

		expect(screen.getByText("Paid")).toBeInTheDocument();

		expect(screen.getByText("01-31-2025")).toBeInTheDocument();
	});

	it("uses 0 deductions when deductions object is missing", () => {
		render(
			<PayrollDetailCard
				item={createPayroll({
					deductions: undefined,
				})}
			/>,
		);

		expect(screen.getByText("₹0")).toBeInTheDocument();
	});

	it("applies the status text", () => {
		render(
			<PayrollDetailCard
				item={createPayroll({
					status: "Pending",
				})}
			/>,
		);

		const badge = screen.getByText("Pending");

		expect(badge).toBeInTheDocument();
		expect(badge.className).toContain("rounded-full");
	});
});
