import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, XCircle, Clock3, TrendingUp } from "lucide-react";

import AttendanceDetailsTable from "./AttendanceDetailsTable";
import AttendanceMonthCard from "./AttendanceMonthCard";

import StatCard from "../common/StatCard";
import EmptyState from "../common/EmptyState";
import PageLoader from "../common/PageLoader";
import NotFound from "../common/NotFound";

import { attendanceApi } from "../../api/attendanceApi";
import { employeeApi } from "../../api/employeeApi";
import { getAttendanceSummary } from "../../utils/attendanceDetails.util";

const AttendanceDetailsPage = () => {
	const { id } = useParams();
	const [attendance, setAttendance] = useState([]);
	const [employee, setEmployee] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAttendance = async () => {
			try {
				const attendanceData = await attendanceApi.getByEmployeeId(id);
				const employeeData = await employeeApi.getById(id);

				setAttendance(attendanceData);
				setEmployee(employeeData[0]);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchAttendance();
	}, [id]);

	const summary = getAttendanceSummary(attendance);

	if (loading) {
		return <PageLoader text="Loading employee attendance..." />;
	}

	if (attendance.length == 0) {
		return <NotFound title="Attendance details Not Found" message={`No employee exists with ID "${id}".`} />;
	}

	return (
		<>
			<div className="bg-white px-6">
				<div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
					{/* Employee Details */}

					<div className="rounded-sm bg-white px-4 py-3 lg:px-6">
						<div className="flex items-center gap-4">
							<img
								src={employee?.personalInfo?.profileImage}
								alt={employee?.fullName}
								className="h-16 w-16 shrink-0 rounded-full object-cover md:h-20 md:w-20"
							/>

							<div className="min-w-0 flex-1">
								<h2 className="text-lg font-semibold text-slate-900 lg:text-xl">
									{employee?.fullName}
								</h2>

								<div className="mt-2 space-y-1 text-sm text-slate-600">
									<span>{employee?.employment?.departmentName}</span> |{" "}
									<span>{employee?.employment?.designation}</span>
									<p className="break-all">{employee?.email}</p>
								</div>
							</div>
						</div>
					</div>

					<div className="hidden py-3 lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:divide-x lg:divide-slate-200">
						<StatCard label="Attendance" value={`${summary.avgAttendance}%`} />
						<StatCard label="Working" value={summary.totalWorkingDays} />
						<StatCard label="Present" value={summary.totalPresentDays} />
						<StatCard label="Absent" value={summary.totalAbsentDays} />
						<StatCard label="Late" value={summary.totalLateEntries} />
					</div>

					<div className="mt-0 grid grid-cols-3 gap-3 py-3 lg:hidden">
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

			<div className="overflow-y-auto border-t border-slate-200 p-5">
				<div className="hidden lg:block">
					<AttendanceDetailsTable attendance={attendance} />
				</div>

				<div className="grid gap-4 lg:hidden">
					{attendance.map((item) => (
						<AttendanceMonthCard key={item.id} item={item} />
					))}
				</div>
			</div>
		</>
	);
};

export default AttendanceDetailsPage;
