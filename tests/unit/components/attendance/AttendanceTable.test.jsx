import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AttendanceTable from "../../../../src/components/attendance/AttendanceTable";

describe("AttendanceTable", () => {
	const employees = [
		{
			employeeId: "EMP001",
			employeeCode: "E001",
			fullName: "John Doe",
			personalInfo: {
				profileImage: "/john.jpg",
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
				lastUpdatedYear: 2025,
			},
		},
		{
			employeeId: "EMP002",
			employeeCode: "E002",
			fullName: "Jane Smith",
			personalInfo: {
				profileImage: "/jane.jpg",
			},
			employment: {
				departmentName: "HR",
			},
			attendance: {
				attendancePercentage: 90,
				totalPresentDays: 20,
				totalAbsentDays: 2,
				totalLeaveDays: 1,
				totalLateLeaveEquivalent: 3,
				lastUpdatedYear: 2025,
			},
		},
	];

	it("renders all table headers", () => {
		render(<AttendanceTable employees={employees} onView={vi.fn()} />);

		expect(screen.getByText("Employee")).toBeInTheDocument();
		expect(screen.getByText("Designation")).toBeInTheDocument();
		expect(screen.getByText("Attendance %")).toBeInTheDocument();
		expect(screen.getByText("Present")).toBeInTheDocument();
		expect(screen.getByText("Absent")).toBeInTheDocument();
		expect(screen.getByText("Leave")).toBeInTheDocument();
		expect(screen.getByText("Late")).toBeInTheDocument();
		expect(screen.getByText("Year")).toBeInTheDocument();
		expect(screen.getByText("Actions")).toBeInTheDocument();
	});

	it("renders employee information", () => {
		render(<AttendanceTable employees={employees} onView={vi.fn()} />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();

		expect(screen.getByText("E001 | EMP001")).toBeInTheDocument();

		expect(screen.getByText("E002 | EMP002")).toBeInTheDocument();

		expect(screen.getByText("Engineering")).toBeInTheDocument();

		expect(screen.getByText("HR")).toBeInTheDocument();
	});

	it("renders attendance values", () => {
		render(<AttendanceTable employees={employees} onView={vi.fn()} />);

		expect(screen.getAllByText("95%")).toHaveLength(1);
		expect(screen.getAllByText("90%")).toHaveLength(1);
		expect(screen.getAllByText("21")).toHaveLength(1);
		expect(screen.getAllByText("20")).toHaveLength(1);
		expect(screen.getAllByText("2025")).toHaveLength(2);
	});

	it("renders employee images", () => {
		render(<AttendanceTable employees={employees} onView={vi.fn()} />);

		expect(screen.getByRole("img", { name: "John Doe" })).toHaveAttribute("src", "/john.jpg");
		expect(screen.getByRole("img", { name: "Jane Smith" })).toHaveAttribute("src", "/jane.jpg");
	});

	it("calls onView when action button is clicked", async () => {
		const user = userEvent.setup();
		const onView = vi.fn();

		render(<AttendanceTable employees={employees} onView={onView} />);

		const buttons = screen.getAllByRole("button");

		await user.click(buttons[0]);

		expect(onView).toHaveBeenCalledTimes(1);
		expect(onView).toHaveBeenCalledWith(employees[0]);
	});

	it("renders progress bars with correct widths", () => {
		const { container } = render(<AttendanceTable employees={employees} onView={vi.fn()} />);

		expect(container.querySelector('div[style*="width: 95%"]')).toBeInTheDocument();

		expect(container.querySelector('div[style*="width: 90%"]')).toBeInTheDocument();
	});

	it("renders empty table when employees array is empty", () => {
		const { container } = render(<AttendanceTable employees={[]} onView={vi.fn()} />);

		expect(container.querySelectorAll("tbody tr")).toHaveLength(0);
	});

	it("falls back to zero values when attendance is missing", () => {
		const employeeWithoutAttendance = [
			{
				...employees[0],
				attendance: undefined,
			},
		];

		render(<AttendanceTable employees={employeeWithoutAttendance} onView={vi.fn()} />);

		expect(screen.getByText("0%")).toBeInTheDocument();
		expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(5);
	});

	it("renders assignment fallbacks when employment is missing", () => {
		render(<AttendanceTable employees={[{ ...employees[0], employment: null }]} onView={vi.fn()} />);
		expect(screen.getAllByText("Not Assigned")).toHaveLength(2);
	});
});
