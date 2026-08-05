import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PayrollStatCard from "../../../components/payroll/PayrollStatCard";

describe("PayrollStatCard", () => {
	it("renders title", () => {
		render(<PayrollStatCard title="Total Employees" value={100} />);

		expect(screen.getByText("Total Employees")).toBeInTheDocument();
	});

	it("renders numeric value", () => {
		render(<PayrollStatCard title="Monthly Payroll" value={50000} />);

		expect(screen.getByText("50000")).toBeInTheDocument();
	});

	it("renders string value", () => {
		render(<PayrollStatCard title="Payroll Status" value="Processed" />);

		expect(screen.getByText("Processed")).toBeInTheDocument();
	});

	it("renders title and value together", () => {
		render(<PayrollStatCard title="Net Salary" value="₹40,000" />);

		expect(screen.getByText("Net Salary")).toBeInTheDocument();
		expect(screen.getByText("₹40,000")).toBeInTheDocument();
	});

	it("renders without crashing when value is zero", () => {
		render(<PayrollStatCard title="Pending Payroll" value={0} />);

		expect(screen.getByText("0")).toBeInTheDocument();
	});
});
