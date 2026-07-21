import PropTypes from "prop-types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardContent,
	CardGrid,
	CardItem,
	CardAction,
} from "./common/InfoCard";
import { Eye } from "lucide-react";

const AttendanceCard = ({ employee, onView }) => {
	const attendancePercentage = employee.attendance?.attendancePercentage || 0;

	return (
		<Card className="rounded-sm">
			<CardHeader className="items-center gap-3">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<img
						src={employee.personalInfo?.profileImage}
						alt={employee.personalInfo?.fullName}
						className="h-12 w-12 rounded-full object-cover"
					/>

					<div className="min-w-0 flex-1">
						<CardTitle className="truncate text-sm">
							{employee.personalInfo?.fullName}
						</CardTitle>

						<CardSubtitle>{employee.employeeId}</CardSubtitle>

						<CardSubtitle className="mt-1">
							{employee.employment?.departmentName}
						</CardSubtitle>
					</div>
				</div>

				<CardAction onClick={() => onView(employee)}>
					<Eye className="h-4 w-4" />
				</CardAction>
			</CardHeader>

			<CardContent>
				{/* Attendance Progress */}
				<div>
					<div className="mb-2 flex items-center justify-between">
						<span className="text-xs text-slate-500">Attendance</span>

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
				<CardGrid columns="grid-cols-4"  className="mt-4 text-center">
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
						value={employee.attendance?.totalLateLeaveEquivalent || 0}
					/>
				</CardGrid>
			</CardContent>
		</Card>
	);
};

AttendanceCard.propTypes = {
	employee: PropTypes.object.isRequired,
	onView: PropTypes.func.isRequired,
};

export default AttendanceCard;
