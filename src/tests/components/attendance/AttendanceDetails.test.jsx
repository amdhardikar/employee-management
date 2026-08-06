import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AttendanceDetails from "../../../components/attendance/AttendanceDetails";

import { attendanceApi } from "../../../api/attendanceApi";
import { employeeApi } from "../../../api/employeeApi";

vi.mock("react-router-dom", () => ({
	useParams: () => ({ id: "1" }),
}));

vi.mock("../../../api/attendanceApi", () => ({
	attendanceApi: {
		getByEmployeeId: vi.fn(),
	},
}));

vi.mock("../../../api/employeeApi", () => ({
	employeeApi: {
		getById: vi.fn(),
	},
}));

vi.mock("../../../utils/attendanceDetails.util", () => ({
	getAttendanceSummary: vi.fn(() => ({
		avgAttendance: 95,
		totalWorkingDays: 22,
		totalPresentDays: 21,
		totalAbsentDays: 1,
		totalLateEntries: 2,
	})),
}));

vi.mock("../../../components/attendance/AttendanceDetailsTable", () => ({
	default: () => <div>AttendanceDetailsTable</div>,
}));

vi.mock("../../../components/attendance/AttendanceMonthCard", () => ({
	default: () => <div>AttendanceMonthCard</div>,
}));

vi.mock("../../../components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../../components/common/NotFound", () => ({
	default: ({ title }) => <div>{title}</div>,
}));

vi.mock("../../../components/common/EmptyState", () => ({
	default: () => <div>Empty State</div>,
}));

vi.mock("../../../components/common/StatCard", () => ({
	default: ({ label, value }) => (
		<div>
			{label}: {value}
		</div>
	),
}));

describe("AttendanceDetails", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const attendance = [
		{
			id: 1,
			monthName: "January",
			attendancePercentage: 95,
		},
	];

	const employee = {
		fullName: "John Doe",
		email: "john@example.com",
		personalInfo: {
			profileImage: "/profile.png",
		},
		employment: {
			departmentName: "Engineering",
			designation: "Developer",
		},
	};

	it("shows loader initially", () => {
		attendanceApi.getByEmployeeId.mockReturnValue(new Promise(() => {}));

		employeeApi.getById.mockReturnValue(new Promise(() => {}));

		render(<AttendanceDetails />);

		expect(screen.getByText("Loading employee attendance...")).toBeInTheDocument();
	});

	it("renders employee details after loading", async () => {
		attendanceApi.getByEmployeeId.mockResolvedValue(attendance);

		employeeApi.getById.mockResolvedValue(employee);

		render(<AttendanceDetails />);

		await waitFor(() => expect(screen.getByText("John Doe")).toBeInTheDocument());
		expect(screen.getByText("john@example.com")).toBeInTheDocument();
		expect(screen.getByText(/Engineering/i)).toBeInTheDocument();
	});

	it("renders attendance table", async () => {
		attendanceApi.getByEmployeeId.mockResolvedValue(attendance);

		employeeApi.getById.mockResolvedValue(employee);

		render(<AttendanceDetails />);

		await waitFor(() => expect(screen.getByText("AttendanceDetailsTable")).toBeInTheDocument());
	});

	it("renders stat cards", async () => {
		attendanceApi.getByEmployeeId.mockResolvedValue(attendance);

		employeeApi.getById.mockResolvedValue(employee);

		render(<AttendanceDetails />);

		await waitFor(() => expect(screen.getAllByText("Attendance: 95%")).toHaveLength(2));
		expect(screen.getAllByText("Working: 22")).toHaveLength(2);
		expect(screen.getAllByText("Present: 21")).toHaveLength(2);
		expect(screen.getAllByText("Absent: 1")).toHaveLength(2);
		expect(screen.getAllByText("Late: 2")).toHaveLength(2);
	});

	it("renders NotFound when no attendance exists", async () => {
		attendanceApi.getByEmployeeId.mockResolvedValue([]);

		employeeApi.getById.mockResolvedValue([]);

		render(<AttendanceDetails />);

		await waitFor(() => expect(screen.getByText("Attendance details Not Found")).toBeInTheDocument());
	});

	it("calls both APIs with employee id", async () => {
		attendanceApi.getByEmployeeId.mockResolvedValue(attendance);

		employeeApi.getById.mockResolvedValue(employee);

		render(<AttendanceDetails />);

		await waitFor(() => expect(attendanceApi.getByEmployeeId).toHaveBeenCalled());
		expect(attendanceApi.getByEmployeeId).toHaveBeenCalledWith("1");
		expect(employeeApi.getById).toHaveBeenCalledWith("1");
	});

	it("logs an error when API request fails", async () => {
		const error = new Error("Failed to fetch");

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		attendanceApi.getByEmployeeId.mockRejectedValue(error);
		employeeApi.getById.mockResolvedValue([]);

		render(<AttendanceDetails />);

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(error);
		});

		consoleSpy.mockRestore();
	});
});
