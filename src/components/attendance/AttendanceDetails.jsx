/**
 * @fileoverview Loads and presents the attendance details selected by the current route. It coordinates API state, formatted summary information, detailed records, and loading, failure, or missing-data states.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/attendance/AttendanceDetails
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, XCircle, Clock3, TrendingUp } from "lucide-react";

import AttendanceDetailsTable from "./AttendanceDetailsTable";
import AttendanceMonthCard from "./AttendanceMonthCard";

import StatCard from "../common/StatCard";
import EmptyState from "../common/EmptyState";
import PageLoader from "../common/PageLoader";
import NotFound from "../common/NotFound";
import ErrorState from "../common/ErrorState";

import { attendanceApi } from "../../api/attendanceApi";
import { employeeApi } from "../../api/employeeApi";
import { getAttendanceSummary } from "../../utils/attendanceDetails.util";
import { display } from "../../utils/formatter";
import ProfileImage from "../common/ProfileImage";

/**
 * Renders the attendance details page interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const AttendanceDetailsPage = () => {
	const { id } = useParams();
	const [attendance, setAttendance] = useState([]);
	const [employee, setEmployee] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAttendance = async () => {
			try {
				setError(null);
				const attendanceData = await attendanceApi.getByEmployeeId(id);
				const employeeData = await employeeApi.getById(id);

				setAttendance(attendanceData);
				setEmployee(employeeData);
			} catch (error) {
				setError(error);
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

	if (error) {
		return (
			<ErrorState
				title="Unable to load attendance details"
				message={`Reason : ${error.message || "Something went wrong"}`}
			/>
		);
	}

	if (attendance.length == 0) {
		return <NotFound title="Attendance details Not Found" message={`No employee exists with ID "${id}".`} />;
	}

	return (
		<>
			<div className="bg-white px-4 py-3 md:px-6">
				<div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
					<div className="flex min-w-0 flex-row items-center gap-3 overflow-hidden md:gap-4">
						<ProfileImage
							src={employee?.personalInfo?.profileImage}
							name={display(employee?.fullName)}
							eager
							className="h-16 w-16 shrink-0 rounded-full object-cover md:h-20 md:w-20"
						/>

						<div className="min-w-0 flex-1 space-y-1">
							<h2 className="text-lg font-semibold text-slate-900 lg:text-xl">
								{display(employee?.fullName)}
							</h2>

							<div className="space-y-1 text-sm text-slate-600 md:mt-2">
								<p>
									<span>{display(employee?.employment?.departmentName)}</span> |{" "}
									<span>{display(employee?.employment?.designation)}</span>
								</p>
								<p className="wrap-break-words wrap-anywhere">
									<span>{display(employee?.employeeCode)}</span> |{" "}
									<span>{display(employee?.employeeId)}</span>
								</p>
							</div>
						</div>
					</div>

					<div className="hidden lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:divide-x lg:divide-slate-200">
						<StatCard label="Attendance" value={`${summary.avgAttendance}%`} />
						<StatCard label="Working" value={summary.totalWorkingDays} />
						<StatCard label="Present" value={summary.totalPresentDays} />
						<StatCard label="Absent" value={summary.totalAbsentDays} />
						<StatCard label="Late" value={summary.totalLateEntries} />
					</div>

					<div className="mt-4 grid grid-cols-6 gap-3 py-3 lg:hidden">
						<StatCard
							label="Attendance"
							value={`${summary.avgAttendance}%`}
							icon={<TrendingUp className="h-4 w-4 text-green-600" />}
							className="col-span-2"
						/>

						<StatCard
							label="Working"
							value={summary.totalWorkingDays}
							icon={<CalendarDays className="h-4 w-4 text-blue-600" />}
							className="col-span-2"
						/>

						<StatCard
							label="Present"
							value={summary.totalPresentDays}
							icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
							className="col-span-2"
						/>

						<StatCard
							label="Absent"
							value={summary.totalAbsentDays}
							icon={<XCircle className="h-4 w-4 text-red-600" />}
							className="col-span-3"
						/>

						<StatCard
							label="Late"
							value={summary.totalLateEntries}
							icon={<Clock3 className="h-4 w-4 text-amber-600" />}
							className="col-span-3"
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
