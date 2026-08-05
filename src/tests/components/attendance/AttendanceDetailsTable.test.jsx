import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AttendanceDetailsTable from "../../../components/attendance/AttendanceDetailsTable";

vi.mock("../../../utils/attendance.util", () => ({
	getAttendancePercentageColor: vi.fn(() => "text-green-600"),
}));

describe("AttendanceDetailsTable", () => {
	beforeEach(async () => {
		const { getAttendancePercentageColor } = await import("../../../utils/attendance.util");

		vi.clearAllMocks();

		getAttendancePercentageColor.mockReturnValue("text-green-600");
	});

	const mockAttendance = [
		{
			id: 1,
			monthName: "January",
			year: 2026,
			workingDays: 22,
			presentDays: 21,
			absentDays: 1,
			leaveDays: 0,
			lateEntries: 2,
			lateLeaveEquivalent: 0.5,
			attendancePercentage: 95,
		},
		{
			id: 2,
			monthName: "February",
			year: 2026,
			workingDays: 20,
			presentDays: 18,
			absentDays: 2,
			leaveDays: 1,
			lateEntries: 3,
			lateLeaveEquivalent: 1,
			attendancePercentage: 90,
		},
	];

	it("renders all table headers", () => {
		render(<AttendanceDetailsTable attendance={mockAttendance} />);

		expect(screen.getByText("Month")).toBeInTheDocument();
		expect(screen.getByText("Year")).toBeInTheDocument();
		expect(screen.getByText("Working")).toBeInTheDocument();
		expect(screen.getByText("Present")).toBeInTheDocument();
		expect(screen.getByText("Absent")).toBeInTheDocument();
		expect(screen.getByText("Leave")).toBeInTheDocument();
		expect(screen.getByText("Late Entries")).toBeInTheDocument();
		expect(screen.getByText("Late Leave Eq.")).toBeInTheDocument();
		expect(screen.getByText("Attendance %")).toBeInTheDocument();
	});

	it("renders attendance records", () => {
		render(<AttendanceDetailsTable attendance={mockAttendance} />);

		expect(screen.getByText("January")).toBeInTheDocument();
		expect(screen.getByText("February")).toBeInTheDocument();

		expect(screen.getByText("95%")).toBeInTheDocument();
		expect(screen.getByText("90%")).toBeInTheDocument();
	});

	it("renders attendance values correctly", () => {
		render(<AttendanceDetailsTable attendance={mockAttendance} />);

		expect(screen.getByText("22")).toBeInTheDocument();
		expect(screen.getByText("21")).toBeInTheDocument();

		expect(screen.getAllByText("1").length).toBeGreaterThan(0);
		expect(screen.getAllByText("0").length).toBeGreaterThan(0);

		expect(screen.getByText("20")).toBeInTheDocument();
		expect(screen.getByText("18")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("renders empty table body when attendance is empty", () => {
		const { container } = render(<AttendanceDetailsTable attendance={[]} />);

		const rows = container.querySelectorAll("tbody tr");

		expect(rows).toHaveLength(0);
	});

	it("applies attendance percentage color class", () => {
		render(<AttendanceDetailsTable attendance={mockAttendance} />);

		const percentageBadge = screen.getByText("95%");

		expect(percentageBadge).toHaveClass("text-green-600");
	});

	it("calls getAttendancePercentageColor for each attendance item", async () => {
		const { getAttendancePercentageColor } = await import("../../../utils/attendance.util");

		render(<AttendanceDetailsTable attendance={mockAttendance} />);

		expect(getAttendancePercentageColor).toHaveBeenCalledTimes(2);

		expect(getAttendancePercentageColor).toHaveBeenCalledWith(95);
		expect(getAttendancePercentageColor).toHaveBeenCalledWith(90);
	});
});
