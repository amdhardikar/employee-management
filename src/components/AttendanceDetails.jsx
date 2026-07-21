import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	CalendarDays,
	CheckCircle2,
	XCircle,
	Clock3,
	TrendingUp,
} from "lucide-react";

import {
	loadAttendanceDetails,
	loadEmployeeDetails,
} from "../utils/attendanceDetails.util";

import StatCard from "./StatCard";
import AttendanceDetailsTable from "./AttendanceDetailsTable";
import EmptyState from "./common/EmptyState";
import PageLoader from "./common/PageLoader";
import AttendanceMonthCard from "./AttendanceMonthCard";
import { useAttendanceSummary } from "../hooks/useAttendanceSummary";
import NotFound from "./common/NotFound";

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

	const summary = useAttendanceSummary(attendance);

	if (loading) {
		return <PageLoader text="Loading employees attendance..." />;
	}

   if (attendance.length == 0) {
      return (
			<NotFound
				title="Attendance details Not Found"
				message={`No employee exists with ID "${id}".`}
			/>
		);
	}

	return (
		<>
			<div className="bg-white px-6 py-3 shadow-sm">
				<div className="grid grid-cols-1  md:grid-cols-2">
					{/* Employee Details */}

					<div className="rounded-sm bg-white px-4 md:px-6">
						<div className="flex items-center gap-4">
							<img
								src={employee?.personalInfo?.profileImage}
								alt={employee?.personalInfo?.fullName}
								className="h-16 w-16 shrink-0 rounded-full object-cover md:h-20 md:w-20"
							/>

							<div className="min-w-0 flex-1">
								<h2 className="text-lg font-semibold text-slate-900 md:text-xl">
									{employee?.personalInfo?.fullName}
								</h2>

								<div className="mt-2 space-y-1 text-sm text-slate-600">
									<span>{employee?.employment?.departmentName}</span> |{" "}
									<span>{employee?.employment?.designation}</span>
									<p className="break-all">
										{employee?.personalInfo?.email}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="hidden md:flex md:flex-wrap md:items-center md:justify-end md:divide-x md:divide-slate-200">
						<StatCard
							label="Attendance"
							value={`${summary.avgAttendance}%`}
						/>
						<StatCard label="Working" value={summary.totalWorkingDays} />
						<StatCard label="Present" value={summary.totalPresentDays} />
						<StatCard label="Absent" value={summary.totalAbsentDays} />
						<StatCard label="Late" value={summary.totalLateEntries} />
					</div>

					<div className="mt-4 grid grid-cols-3 gap-3 md:hidden">
						<StatCard
							label="Attendance"
							value={`${summary.avgAttendance}%`}
							icon={<TrendingUp className="h-4 w-4 text-green-600" />}
						/>

						<StatCard
							label="Working"
							value={summary.totalWorkingDays}
							icon={<CalendarDays className="h-4 w-4 text-blue-600" />}
						/>

						<StatCard
							label="Present"
							value={summary.totalPresentDays}
							icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
						/>

						<StatCard
							label="Absent"
							value={summary.totalAbsentDays}
							icon={<XCircle className="h-4 w-4 text-red-600" />}
						/>

						<StatCard
							label="Late"
							value={summary.totalLateEntries}
							icon={<Clock3 className="h-4 w-4 text-amber-600" />}
						/>
					</div>
				</div>
			</div>

			<div className="p-5 overflow-y-auto border-t border-slate-200">
				{/* Monthly Attendance Table */}
				{attendance.length > 0 ? (
					<>
						<div className="hidden md:block">
							<AttendanceDetailsTable attendance={attendance} />
						</div>

						<div className="grid gap-4 md:hidden">
							{attendance.map(
								(item) => (
									(<AttendanceMonthCard key={item.id} item={item} />)
								),
							)}
						</div>
					</>
				) : (
					<EmptyState />
				)}
			</div>
		</>
	);
};


export default AttendanceDetailsPage;
