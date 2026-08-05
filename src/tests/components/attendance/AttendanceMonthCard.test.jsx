import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AttendanceMonthCard from "../../../components/attendance/AttendanceMonthCard";

vi.mock("../../../utils/attendance.util", () => ({
	getAttendancePercentageColor: vi.fn(() => "text-green-600"),
}));

describe("AttendanceMonthCard", () => {
	const mockAttendance = {
		monthName: "January",
		year: 2026,
		attendancePercentage: 95,
		workingDays: 22,
		presentDays: 21,
		absentDays: 1,
		leaveDays: 0,
		lateEntries: 2,
		lateLeaveEquivalent: 0.5,
	};

	it("renders month and year", () => {
		render(<AttendanceMonthCard item={mockAttendance} />);

		expect(screen.getByText("January")).toBeInTheDocument();
		expect(screen.getByText("2026")).toBeInTheDocument();
	});

	it("renders attendance percentage", () => {
		render(<AttendanceMonthCard item={mockAttendance} />);

		expect(screen.getByText("95%")).toBeInTheDocument();
	});

	it("renders attendance statistics", () => {
		render(<AttendanceMonthCard item={mockAttendance} />);

		expect(screen.getByText("22")).toBeInTheDocument();
		expect(screen.getByText("21")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText("0")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
		expect(screen.getByText("0.5")).toBeInTheDocument();
	});

	it("renders all card labels", () => {
		render(<AttendanceMonthCard item={mockAttendance} />);

		expect(screen.getByText("Working")).toBeInTheDocument();
		expect(screen.getByText("Present")).toBeInTheDocument();
		expect(screen.getByText("Absent")).toBeInTheDocument();
		expect(screen.getByText("Leave")).toBeInTheDocument();
		expect(screen.getByText("Late")).toBeInTheDocument();
		expect(screen.getByText("Late Eq.")).toBeInTheDocument();
	});

	it("applies attendance percentage color class", () => {
		render(<AttendanceMonthCard item={mockAttendance} />);

		const percentage = screen.getByText("95%");

		expect(percentage).toHaveClass("text-green-600");
	});

	it("calls getAttendancePercentageColor with percentage value", async () => {
		const { getAttendancePercentageColor } = await import("../../../utils/attendance.util");

		render(<AttendanceMonthCard item={mockAttendance} />);

		expect(getAttendancePercentageColor).toHaveBeenCalledWith(95);
	});
});
