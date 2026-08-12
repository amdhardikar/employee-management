import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import PayrollCard from "../../../../src/components/payroll/PayrollCard";

const employee = {
	id: "1",
	employeeId: "EMP001",
	employeeCode: "E001",
	fullName: "John Doe",

	personalInfo: {
		profileImage: "profile.jpg",
	},

	employment: {
		departmentName: "Engineering",
		designation: "Software Engineer",
	},

	salary: {
		employeeCTC: 1200000,
		monthlyGross: 100000,
		netSalary: 85000,
		professionalTax: 15000,
	},
};

describe("PayrollCard", () => {
	it("renders employee payroll information", () => {
		render(<PayrollCard employee={employee} onView={vi.fn()} />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("E001 | EMP001")).toBeInTheDocument();
		expect(screen.getByText("Software Engineer | Engineering")).toBeInTheDocument();
		expect(screen.getByText("₹12,00,000")).toBeInTheDocument();
		expect(screen.getByText("₹85,000")).toBeInTheDocument();
		expect(screen.getByText("₹1,00,000")).toBeInTheDocument();
		expect(screen.getByText("₹15,000")).toBeInTheDocument();
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
			salary: {
				netSalary: 50000,
				monthlyGross: 60000,
				professionalTax: 10000,
			},
		};

		render(<PayrollCard employee={incompleteEmployee} onView={vi.fn()} />);

		expect(screen.getByText("₹50,000")).toBeInTheDocument();
		expect(screen.getByText("₹60,000")).toBeInTheDocument();
		expect(screen.getByText("₹10,000")).toBeInTheDocument();
		expect(screen.getByText("Not Assigned | Not Assigned")).toBeInTheDocument();

		const image = screen.getByRole("img");
		expect(image.getAttribute("src")).toMatch(/^data:image\/svg\+xml/);
		expect(image).toHaveAttribute("alt", "—");
	});

	it("handles missing salary details", () => {
		render(<PayrollCard employee={{ ...employee, salary: null }} onView={vi.fn()} />);
		expect(screen.getAllByText("—").length).toBeGreaterThan(0);
	});
});
