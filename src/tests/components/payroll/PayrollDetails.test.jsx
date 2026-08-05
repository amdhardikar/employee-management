import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import PayrollDetails from "../../../components/payroll/PayrollDetails";
import { payrollApi } from "../../../api/payrollApi";

vi.mock("../../../api/payrollApi", () => ({
	payrollApi: {
		getByEmployeeId: vi.fn(),
	},
}));

vi.mock("../../../components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../../components/common/NotFound", () => ({
	default: ({ title, message }) => (
		<div>
			<h1>{title}</h1>
			<p>{message}</p>
		</div>
	),
}));

vi.mock("../../../components/payroll/PayrollDetailsTable", () => ({
	default: ({ payroll }) => <div data-testid="payroll-table">Table rows: {payroll.length}</div>,
}));

vi.mock("../../../components/payroll/PayrollDetailCard", () => ({
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
	});
});
