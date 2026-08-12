/**
 * @fileoverview Renders one attendance month record in the responsive card presentation. It highlights the most important summary fields and status and delegates navigation or actions through its callback properties.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/attendance/AttendanceMonthCard
 */
import PropTypes from "prop-types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardContent,
	CardItem,
} from "../common/InfoCard";
import { getAttendancePercentageColor } from "../../utils/attendance.util";
import { display } from "../../utils/formatter";

/**
 * Renders the attendance month card interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object} props.item - Domain record rendered by this card.
 * @returns {JSX.Element} Rendered React user interface.
 */
const AttendanceMonthCard = ({ item }) => {
	const percentageColor = getAttendancePercentageColor(
		item.attendancePercentage,
	);

	return (
		<Card className="rounded-sm">
			<CardHeader className="items-center">
				<div>
					<CardTitle className="text-sm">{display(item.monthName)}</CardTitle>

					<CardSubtitle>{display(item.year)}</CardSubtitle>
				</div>

				<span
					className={`rounded-full px-2 py-1 text-xs font-medium ${percentageColor}`}
				>
					{item.attendancePercentage}%
				</span>
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-x-10 gap-y-2 text-sm md:grid-cols-2">
				<CardItem
					variant="horizontal"
					label="Working"
					value={display(item.workingDays)}
				/>
				<CardItem
					variant="horizontal"
					label="Present"
					value={display(item.presentDays)}
				/>
				<CardItem
					variant="horizontal"
					label="Absent"
					value={display(item.absentDays)}
				/>
				<CardItem
					variant="horizontal"
					label="Leave"
					value={display(item.leaveDays)}
				/>
				<CardItem
					variant="horizontal"
					label="Late"
					value={display(item.lateEntries)}
				/>
				<CardItem
					variant="horizontal"
					label="Late Eq."
					value={display(item.lateLeaveEquivalent)}
				/>
			</CardContent>
		</Card>
	);
};

AttendanceMonthCard.propTypes = {
	item: PropTypes.array.isRequired,
};

export default AttendanceMonthCard;
