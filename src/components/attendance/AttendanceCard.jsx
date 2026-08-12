/**
 * @fileoverview Renders one attendance record in the responsive card presentation. It highlights the most important summary fields and status and delegates navigation or actions through its callback properties.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/attendance/AttendanceCard
 */
import PropTypes from "prop-types";
import { memo } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardContent,
	CardGrid,
	CardItem,
	CardAction,
	CardFooter,
} from "../common/InfoCard";
import { Eye } from "lucide-react";
import { display } from "../../utils/formatter";
import ProfileImage from "../common/ProfileImage";

/**
 * Renders the attendance card interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object} props.employee - Employee domain record used by the component or operation.
 * @param {Function} props.onView - Called with the selected record when the user requests details.
 * @returns {JSX.Element} Rendered React user interface.
 */
const AttendanceCard = ({ employee, onView }) => {
	const attendancePercentage = employee.attendance?.attendancePercentage || 0;

	return (
		<Card className="rounded-sm">
			<CardHeader className="items-center gap-3">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<ProfileImage
						src={employee.personalInfo?.profileImage}
						name={display(employee.fullName)}
						className="h-12 w-12 rounded-full object-cover"
					/>

					<div className="min-w-0 flex-1">
						<CardTitle className="truncate text-sm">
							{display(employee.fullName)}
						</CardTitle>

						<CardSubtitle className="mt-1">
							{display(employee.employeeCode)} | {display(employee.employeeId)}
						</CardSubtitle>

						<CardSubtitle className="mt-1">
							{display(employee.employment?.departmentName)}
						</CardSubtitle>
					</div>
				</div>

			</CardHeader>

			<CardContent>
				{/* Attendance Progress */}
				<div>
					<div className="mb-2 flex items-center justify-between">
						<span className="text-xs text-slate-500">
							Attendance
						</span>

						<span className="text-sm font-medium">
							{attendancePercentage}%
						</span>
					</div>

					<div className="h-2 rounded-full bg-slate-200">
						<div
							className="h-2 rounded-full bg-green-500"
							style={{
								width: `${attendancePercentage}%`,
							}}
						/>
					</div>
				</div>

				{/* Attendance Stats */}
				<CardGrid columns="grid-cols-4" className="mt-4 text-center">
					<CardItem
						label="Present"
						value={employee.attendance?.totalPresentDays || 0}
					/>
					<CardItem
						label="Absent"
						value={employee.attendance?.totalAbsentDays || 0}
					/>
					<CardItem
						label="Leave"
						value={employee.attendance?.totalLeaveDays || 0}
					/>
					<CardItem
						label="Late"
						value={
							employee.attendance?.totalLateLeaveEquivalent || 0
						}
					/>
				</CardGrid>
			</CardContent>
			<CardFooter className="border-t border-slate-100 pt-3">
				<CardAction ariaLabel="View attendance" onClick={() => onView(employee)} className="flex w-full items-center justify-center gap-2 border-blue-200 px-3 text-xs font-medium text-blue-700 hover:bg-blue-50">
					<Eye className="h-4 w-4" /> View details
				</CardAction>
			</CardFooter>
		</Card>
	);
};

AttendanceCard.propTypes = {
	employee: PropTypes.object.isRequired,
	onView: PropTypes.func.isRequired,
};

export default memo(AttendanceCard);
