import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AttendanceDetails from "../../../../src/components/attendance/AttendanceDetails";

import { attendanceApi } from "../../../../src/api/attendanceApi";
import { employeeApi } from "../../../../src/api/employeeApi";

vi.mock("react-router-dom", () => ({
	useParams: () => ({ id: "1" }),
}));

vi.mock("../../../../src/api/attendanceApi", () => ({
	attendanceApi: {
		getByEmployeeId: vi.fn(),
	},
}));

vi.mock("../../../../src/api/employeeApi", () => ({
	employeeApi: {
		getById: vi.fn(),
	},
}));

vi.mock("../../../../src/utils/attendanceDetails.util", () => ({
	getAttendanceSummary: vi.fn(() => ({
		avgAttendance: 95,
		totalWorkingDays: 22,
		totalPresentDays: 21,
		totalAbsentDays: 1,
		totalLateEntries: 2,
	})),
}));

vi.mock("../../../../src/components/attendance/AttendanceDetailsTable", () => ({
	default: () => <div>AttendanceDetailsTable</div>,
}));

vi.mock("../../../../src/components/attendance/AttendanceMonthCard", () => ({
	default: () => <div>AttendanceMonthCard</div>,
}));

vi.mock("../../../../src/components/common/PageLoader", () => ({
	default: ({ text }) => <div>{text}</div>,
}));

vi.mock("../../../../src/components/common/NotFound", () => ({
	default: ({ title }) => <div>{title}</div>,
}));

vi.mock("../../../../src/components/common/EmptyState", () => ({
	default: () => <div>Empty State</div>,
}));

vi.mock("../../../../src/components/common/StatCard", () => ({
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
		employeeCode: "EMS-2026-001",
		employeeId: "EMP001",
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
		expect(screen.getByText("EMS-2026-001").parentElement).toHaveTextContent("EMS-2026-001 | EMP001");
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

	it("shows a graceful error when API request fails", async () => {
		const error = new Error("Failed to fetch");

		attendanceApi.getByEmployeeId.mockRejectedValue(error);
		employeeApi.getById.mockResolvedValue([]);

		render(<AttendanceDetails />);

		expect(await screen.findByText("Unable to load attendance details")).toBeInTheDocument();
		expect(screen.getByText("Reason : Failed to fetch")).toBeInTheDocument();
	});

	it("uses fallback text when the request error has no message", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		attendanceApi.getByEmployeeId.mockRejectedValue({});
		employeeApi.getById.mockResolvedValue([]);
		render(<AttendanceDetails />);
		expect(await screen.findByText("Reason : Something went wrong")).toBeInTheDocument();
		consoleSpy.mockRestore();
	});
});
