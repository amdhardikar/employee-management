import { Eye } from "lucide-react";
import PropTypes from "prop-types";
import { STATUS_COLORS } from "../../constants/EMSconstants";
import {
	Table,
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from "../common/DataTable";
import { getAttendancePercentageColor } from "../../utils/attendance.util";

const AttendanceDetailsTable = ({ attendance }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Month</TableHeader>
					<TableHeader className="text-center">Year</TableHeader>
					<TableHeader className="text-center">Working</TableHeader>
					<TableHeader className="text-center">Present</TableHeader>
					<TableHeader className="text-center">Absent</TableHeader>
					<TableHeader className="text-center">Leave</TableHeader>
					<TableHeader className="text-center">
						Late Entries
					</TableHeader>
					<TableHeader className="text-center">
						Late Leave Eq.
					</TableHeader>
					<TableHeader className="text-center">
						Attendance %
					</TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{attendance.map((item) => (
					<TableRow key={item.id}>
						<TableCell className="text-left font-medium">
							{item.monthName}
						</TableCell>

						<TableCell className="text-center">
							{item.year}
						</TableCell>

						<TableCell className="text-center">
							{item.workingDays}
						</TableCell>

						<TableCell className="text-center">
							{item.presentDays}
						</TableCell>

						<TableCell className="text-center">
							{item.absentDays}
						</TableCell>

						<TableCell className="text-center">
							{item.leaveDays}
						</TableCell>

						<TableCell className="text-center">
							{item.lateEntries}
						</TableCell>

						<TableCell className="text-center">
							{item.lateLeaveEquivalent}
						</TableCell>

						<TableCell className="text-center">
							<span
								className={`rounded-full px-3 py-1 text-sm font-medium ${getAttendancePercentageColor(
									item.attendancePercentage,
								)}`}
							>
								{item.attendancePercentage}%
							</span>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

AttendanceDetailsTable.propTypes = {
	attendance: PropTypes.array.isRequired,
};

export default AttendanceDetailsTable;
