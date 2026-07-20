import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Filters from "./common/Filters";
import {
	loadAttendanceDetails,
	loadEmployeeDetails,
} from "../utils/attendanceDetails.util";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./common/DataTable";

const AttendanceDetailsPage = () => {
	const { id } = useParams();
	const [attendance, setAttendance] = useState([]);
	const [employee, setEmployee] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAttendance = async () => {
			try {
				const attendanceData = await loadAttendanceDetails(id);
            const employeeData = await loadEmployeeDetails(id);
            
				setAttendance(attendanceData);
				setEmployee(employeeData[0]);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchAttendance();
	}, []);

	if (loading) {
		return <div className="p-6">Loading attendance details...</div>;
	}

	const totalWorkingDays = attendance.reduce(
		(sum, item) => sum + item.workingDays,
		0,
	);

	const totalPresentDays = attendance.reduce(
		(sum, item) => sum + item.presentDays,
		0,
	);

	const totalAbsentDays = attendance.reduce(
		(sum, item) => sum + item.absentDays + item.leaveDays,
		0,
	);

	const totalLateEntries = attendance.reduce(
		(sum, item) => sum + item.lateLeaveEquivalent,
		0,
	);

	const avgAttendance =
		attendance.length > 0
			? (
					attendance.reduce(
						(sum, item) => sum + item.attendancePercentage,
						0,
					) / attendance.length
				).toFixed(1)
			: 0;

	return (
		<>
			<div className="bg-white p-6">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					{/* Employee Details */}

					<div className="space-y-3">
						<h2 className="text-xl font-semibold text-slate-900">
							{employee?.personalInfo?.fullName}
						</h2>
						<p className="text-slate-500">{employee?.employeeCode}</p>
						<div>{employee?.employment?.departmentName}</div>
						<div>{employee?.employment?.designation}</div>
						<div>{employee?.employment?.location}</div>
						<div>{employee?.personalInfo?.email}</div>
					</div>

					{/* Attendance Summary */}

					<div className="space-y-3">
						<div>
							<span className="font-medium">Average Attendance:</span>{" "}
							{avgAttendance}%
						</div>
						<div>
							<span className="font-medium">Working Days:</span>{" "}
							{totalWorkingDays}
						</div>
						<div>
							<span className="font-medium">Present Days:</span>{" "}
							{totalPresentDays}
						</div>
						<div>
							<span className="font-medium">Absent Days:</span>{" "}
							{totalAbsentDays}
						</div>
						<div>
							<span className="font-medium">Late Entries:</span>{" "}
							{totalLateEntries}
						</div>
					</div>
				</div>
			</div>

			<div className="p-5 overflow-y-auto border-t border-slate-200">
				{/* Monthly Attendance Table */}
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader className="text-left ">Month</TableHeader>
							<TableHeader className="text-center ">Year</TableHeader>
							<TableHeader className="text-center ">Working</TableHeader>
							<TableHeader className="text-center ">Present</TableHeader>
							<TableHeader className="text-center ">Absent</TableHeader>
							<TableHeader className="text-center ">Leave</TableHeader>
							<TableHeader className="text-center ">
								Late Entries
							</TableHeader>
							<TableHeader className="text-center ">
								Late Leave Eq.
							</TableHeader>
							<TableHeader className="text-center ">
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
										className={`rounded-full px-3 py-1 text-sm font-medium ${
											item.attendancePercentage >= 95
												? "bg-green-100 text-green-700"
												: item.attendancePercentage >= 85
													? "bg-yellow-100 text-yellow-700"
													: "bg-red-100 text-red-700"
										}`}
									>
										{item.attendancePercentage}%
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
};

export default AttendanceDetailsPage;
