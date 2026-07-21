import PropTypes from "prop-types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardContent,
	CardItem,
} from "./common/InfoCard";
import { getAttendancePercentageColor } from "../utils/attendance.util";

const AttendanceMonthCard = ({ item }) => {
	const percentageColor = getAttendancePercentageColor(
		item.attendancePercentage,
	);

	return (
		<Card className="rounded-sm">
			<CardHeader className="items-center">
				<div>
					<CardTitle className="text-sm">{item.monthName}</CardTitle>

					<CardSubtitle>{item.year}</CardSubtitle>
				</div>

				<span
					className={`rounded-full px-2 py-1 text-xs font-medium ${percentageColor}`}
				>
					{item.attendancePercentage}%
				</span>
			</CardHeader>

			<CardContent className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
				<CardItem
					variant="horizontal"
					label="Working"
					value={item.workingDays}
				/>
				<CardItem
					variant="horizontal"
					label="Present"
					value={item.presentDays}
				/>
				<CardItem
					variant="horizontal"
					label="Absent"
					value={item.absentDays}
				/>
				<CardItem
					variant="horizontal"
					label="Leave"
					value={item.leaveDays}
				/>
				<CardItem
					variant="horizontal"
					label="Late"
					value={item.lateEntries}
				/>
				<CardItem
					variant="horizontal"
					label="Late Eq."
					value={item.lateLeaveEquivalent}
				/>
			</CardContent>
		</Card>
	);
};

AttendanceMonthCard.propTypes = {
	item: PropTypes.array.isRequired,
};

export default AttendanceMonthCard;
