import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import PayrollDetails from "../../../../src/components/payroll/PayrollDetails";
import { payrollApi } from "../../../../src/api/payrollApi";
import { employeeApi } from "../../../../src/api/employeeApi";

vi.mock("../../../../src/api/payrollApi", () => ({
	payrollApi: {
		getByEmployeeId: vi.fn(),
	},
}));

vi.mock("../../../../src/api/employeeApi", () => ({
	employeeApi: { getById: vi.fn() },
}));

vi.mock("../../../../src/components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../../../src/components/common/NotFound", () => ({
	default: ({ title, message }) => (
		<div>
			<h1>{title}</h1>
			<p>{message}</p>
		</div>
	),
}));

vi.mock("../../../../src/components/payroll/PayrollDetailsTable", () => ({
	default: ({ payroll }) => <div data-testid="payroll-table">Table rows: {payroll.length}</div>,
}));

vi.mock("../../../../src/components/payroll/PayrollDetailCard", () => ({
	default: ({ item }) => <div data-testid="payroll-card">{item.payrollId}</div>,
}));

const payrollData = [
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
];

const employeeData = {
	fullName: "Aarav Sharma",
	employeeCode: "EMS-2026-101",
	employeeId: "EMP101",
	personalInfo: { profileImage: "aarav.jpg" },
	employment: { departmentName: "Finance", designation: "Accountant" },
};

const renderComponent = () => {
	return render(
		<MemoryRouter initialEntries={["/payroll/101"]}>
			<Routes>
				<Route path="/payroll/:id" element={<PayrollDetails />} />
			</Routes>
		</MemoryRouter>,
	);
};

describe("PayrollDetails", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		employeeApi.getById.mockResolvedValue(employeeData);
	});

	it("shows loader while payroll data is loading", () => {
		payrollApi.getByEmployeeId.mockReturnValue(new Promise(() => {}));

		renderComponent();

		expect(screen.getByText("Loading payroll details...")).toBeInTheDocument();
	});

	it("loads payroll data and renders payroll table/cards", async () => {
		payrollApi.getByEmployeeId.mockResolvedValue(payrollData);

		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId("payroll-table")).toBeInTheDocument();
		});

		expect(screen.getByText("Table rows: 1")).toBeInTheDocument();

		expect(screen.getByTestId("payroll-card")).toBeInTheDocument();

		expect(screen.getByText("PAY-001")).toBeInTheDocument();
		expect(screen.getByText("Aarav Sharma")).toBeInTheDocument();
		expect(screen.getByText("Finance")).toBeInTheDocument();
		expect(screen.getByText("Accountant")).toBeInTheDocument();
		expect(screen.getByText("EMS-2026-101").parentElement).toHaveTextContent("EMS-2026-101 | EMP101");
		expect(screen.getAllByText("Payrolls").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Gross").length).toBeGreaterThan(0);
		expect(screen.getAllByText("₹1,00,000").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Deductions").length).toBeGreaterThan(0);
		expect(screen.getAllByText("₹15,000").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Net Salary").length).toBeGreaterThan(0);
		expect(screen.getAllByText("₹85,000").length).toBeGreaterThan(0);
		expect(employeeApi.getById).toHaveBeenCalledWith("101");
	});

	it("aggregates summary values across payroll history", async () => {
		payrollApi.getByEmployeeId.mockResolvedValue([
			...payrollData,
			{
				...payrollData[0], id: "2", payrollId: "PAY-002",
				grossSalary: 90000, netSalary: 80000,
				deductions: { totalDeductions: 10000 },
			},
		]);
		renderComponent();
		expect((await screen.findAllByText("₹1,90,000")).length).toBeGreaterThan(0);
		expect(screen.getAllByText("₹25,000").length).toBeGreaterThan(0);
		expect(screen.getAllByText("₹1,65,000").length).toBeGreaterThan(0);
	});

	it("shows not found when payroll is empty", async () => {
		payrollApi.getByEmployeeId.mockResolvedValue([]);

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("Payroll Not Found")).toBeInTheDocument();
		});

		expect(screen.getByText('No payroll records exist for employee "101".')).toBeInTheDocument();
	});

	it("stops loading when API throws error", async () => {
		payrollApi.getByEmployeeId.mockRejectedValue(new Error("API failed"));

		renderComponent();

		await waitFor(() => {
			expect(screen.queryByText("Loading payroll details...")).not.toBeInTheDocument();
		});
		expect(screen.getByText("Unable to load payroll details")).toBeInTheDocument();
		expect(screen.getByText("Reason : API failed")).toBeInTheDocument();
	});

	it("uses zero totals for missing payroll amounts", async () => {
		payrollApi.getByEmployeeId.mockResolvedValue([{ ...payrollData[0], grossSalary: null, netSalary: null, deductions: null }]);
		renderComponent();
		expect((await screen.findAllByText("₹0")).length).toBeGreaterThanOrEqual(3);
	});

	it("shows fallback text when a request error has no message", async () => {
		payrollApi.getByEmployeeId.mockRejectedValue({});
		renderComponent();
		expect(await screen.findByText("Reason : Something went wrong")).toBeInTheDocument();
	});
});
