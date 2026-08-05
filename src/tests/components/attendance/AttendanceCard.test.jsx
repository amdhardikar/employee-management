import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AttendanceCard from "../../../components/attendance/AttendanceCard";

describe("AttendanceCard", () => {
	const employee = {
		employeeId: "EMP001",
		employeeCode: "E001",
		fullName: "John Doe",
		personalInfo: {
			profileImage: "/profile.jpg",
		},
		employment: {
			departmentName: "Engineering",
		},
		attendance: {
			attendancePercentage: 95,
			totalPresentDays: 21,
			totalAbsentDays: 1,
			totalLeaveDays: 0,
			totalLateLeaveEquivalent: 2,
		},
	};

	it("renders employee information", () => {
		render(<AttendanceCard employee={employee} onView={vi.fn()} />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("E001 | EMP001")).toBeInTheDocument();
		expect(screen.getByText("Engineering")).toBeInTheDocument();
	});

	it("renders attendance percentage", () => {
		render(<AttendanceCard employee={employee} onView={vi.fn()} />);

		expect(screen.getByText("95%")).toBeInTheDocument();
	});

	it("renders attendance statistics", () => {
		render(<AttendanceCard employee={employee} onView={vi.fn()} />);

		expect(screen.getByText("Present")).toBeInTheDocument();
		expect(screen.getByText("Absent")).toBeInTheDocument();
		expect(screen.getByText("Leave")).toBeInTheDocument();
		expect(screen.getByText("Late")).toBeInTheDocument();

		expect(screen.getByText("21")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getAllByText("0").length).toBeGreaterThan(0);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("calls onView when action button is clicked", async () => {
		const user = userEvent.setup();
		const onView = vi.fn();

		render(<AttendanceCard employee={employee} onView={onView} />);

		await user.click(screen.getByRole("button"));

		expect(onView).toHaveBeenCalledTimes(1);
		expect(onView).toHaveBeenCalledWith(employee);
	});

	it("renders employee image", () => {
		render(<AttendanceCard employee={employee} onView={vi.fn()} />);

		const image = screen.getByRole("img", {
			name: "John Doe",
		});

		expect(image).toHaveAttribute("src", "/profile.jpg");
	});

	it("sets progress bar width from attendance percentage", () => {
		const { container } = render(<AttendanceCard employee={employee} onView={vi.fn()} />);

		const progress = container.querySelector('div[style*="width: 95%"]');

		expect(progress).toBeInTheDocument();
	});

	it("falls back to zero values when attendance is missing", () => {
		const employeeWithoutAttendance = {
			...employee,
			attendance: undefined,
		};

		render(<AttendanceCard employee={employeeWithoutAttendance} onView={vi.fn()} />);

		expect(screen.getByText("0%")).toBeInTheDocument();

		// Present, Absent, Leave, Late
		expect(screen.getAllByText("0")).toHaveLength(4);
	});
});
