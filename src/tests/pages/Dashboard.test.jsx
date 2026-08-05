import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import Dashboard from "../../pages/Dashboard";

import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../store/dashboardSlice";

vi.mock("react-redux", () => ({
	useDispatch: vi.fn(),
	useSelector: vi.fn(),
}));

vi.mock("../../store/dashboardSlice", () => ({
	fetchDashboard: vi.fn(() => ({
		type: "dashboard/fetchDashboard",
	})),
}));

vi.mock("../../../components/common/PageLoader", () => ({
	default: ({ text }) => <div data-testid="loader">{text}</div>,
}));

describe("Dashboard", () => {
	const dispatchMock = vi.fn();

	const dashboardMock = {
		stats: {
			totalEmployees: 120,
			activeEmployees: 100,
			totalDepartments: 8,
			avgAttendance: 92.5,
			monthlyPayroll: 500000,
			avgRating: 4.5,
		},

		recentEmployees: [
			{
				id: "EMP001",
				personalInfo: {
					fullName: "Aamod Hardikar",
				},
				employment: {
					designation: "Accountant",
					status: "Active",
				},
			},
		],

		departmentStats: [
			{
				name: "Finance",
				count: 20,
			},
			{
				name: "HR",
				count: 10,
			},
		],

		maxDeptCount: 20,

		employeeStatus: {
			active: 100,
			onLeave: 10,
			resigned: 5,
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();

		useDispatch.mockReturnValue(dispatchMock);
	});

	it("shows loader while loading", () => {
		vi.mocked(useSelector).mockReturnValue({
			data: null,
			loading: true,
		});

		render(<Dashboard />);

		expect(screen.getByRole("status")).toHaveTextContent("Loading dashboard...");
	});

	it("renders attendance summary", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		const section = screen.getByText("Attendance Summary").closest("div.rounded-xl");

		expect(section).toHaveTextContent("92.5");
	});

	it("renders employee status", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		const section = screen.getByText("Employee Status").closest("div.rounded-xl");

		expect(section).toHaveTextContent("100");
		expect(section).toHaveTextContent("10");
		expect(section).toHaveTextContent("5");
	});

	it("dispatches fetchDashboard on mount", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		expect(fetchDashboard).toHaveBeenCalledTimes(1);

		expect(dispatchMock).toHaveBeenCalledWith({
			type: "dashboard/fetchDashboard",
		});
	});

	it("renders dashboard heading", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		expect(screen.getByText("Dashboard")).toBeInTheDocument();

		expect(screen.getByText("Employee Management System Overview")).toBeInTheDocument();
	});

	it("renders employee statistics", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		expect(screen.getByText("Total Employees")).toBeInTheDocument();

		expect(screen.getByText("120")).toBeInTheDocument();

		expect(screen.getByText("Active Employees")).toBeInTheDocument();

		expect(screen.getByText("Departments")).toBeInTheDocument();
	});

	it("renders recent employees", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		expect(screen.getByText("Recent Employees")).toBeInTheDocument();

		expect(screen.getByText("Aamod Hardikar")).toBeInTheDocument();

		expect(screen.getByText("Accountant")).toBeInTheDocument();
	});

	it("renders department overview", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		expect(screen.getByText("Department Overview")).toBeInTheDocument();

		expect(screen.getByText("Finance")).toBeInTheDocument();

		expect(screen.getByText("20")).toBeInTheDocument();
	});

	it("renders attendance summary", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		expect(screen.getByText("Attendance Summary")).toBeInTheDocument();

		expect(screen.getAllByText(/92\.5/).length).toBeGreaterThan(0);
	});

	it("renders employee status", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		expect(screen.getByText("Employee Status")).toBeInTheDocument();
		const statusSection = screen.getByText("Employee Status").closest("div.rounded-xl");

		expect(statusSection).toHaveTextContent("100");
		expect(statusSection).toHaveTextContent("10");
		expect(statusSection).toHaveTextContent("5");
	});

	it("renders payroll and performance", () => {
		useSelector.mockReturnValue({
			data: dashboardMock,
			loading: false,
		});

		render(<Dashboard />);

		expect(screen.getByText("Monthly Payroll")).toBeInTheDocument();

		expect(screen.getByText(/₹5,00,000/)).toBeInTheDocument();

		expect(screen.getByText("Average Performance Rating")).toBeInTheDocument();

		expect(screen.getByText("4.5")).toBeInTheDocument();
	});
});
