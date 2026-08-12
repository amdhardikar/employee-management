/**
 * @fileoverview Renders attendance table data in the desktop table presentation. It defines the domain-specific columns, formats status and values consistently, and invokes supplied view/edit/delete callbacks without owning navigation or server state.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/attendance/AttendanceTable
 */
import PropTypes from "prop-types";
import ProfileImage from "../common/ProfileImage";
import { Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/DataTable";

/**
 * Renders the attendance table interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object[]} props.employees - Employee records to display or summarize.
 * @param {Function} props.onView - Called with the selected record when the user requests details.
 * @returns {JSX.Element} Rendered React user interface.
 */
const AttendanceTable = ({ employees, onView }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Employee</TableHeader>
					<TableHeader className="text-left">Designation</TableHeader>
					<TableHeader className="text-left">Attendance %</TableHeader>
					<TableHeader className="text-center">Present</TableHeader>
					<TableHeader className="text-center">Absent</TableHeader>
					<TableHeader className="text-left">Leave</TableHeader>
					<TableHeader className="text-center">Late</TableHeader>
					<TableHeader className="text-center">Year</TableHeader>
					<TableHeader className="text-center">Actions</TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{employees?.map((employee) => (
					<TableRow key={employee.employeeId}>
						<TableCell>
							<div className="flex items-center gap-3">
								<ProfileImage
									src={employee.personalInfo?.profileImage}
									name={employee.fullName}
									className="h-10 w-10 rounded-full object-cover"
								/>

								<div>
									<p className="font-medium text-slate-900">{employee.fullName}</p>
									<span className="text-xs text-slate-500">
										{employee.employeeCode} | {employee.employeeId}
									</span>
								</div>
							</div>
						</TableCell>

						<TableCell>
							<p className="font-medium text-slate-900">
								{employee.employment?.designation || "Not Assigned"}
							</p>

							<p className="text-xs text-slate-500">
								{employee.employment?.departmentName || "Not Assigned"}
							</p>
						</TableCell>

						<TableCell>
							<div className="flex items-center gap-2">
								<div className="h-2 w-20 rounded-full bg-slate-200 lg:w-24">
									<div
										className="h-2 rounded-full bg-green-500"
										style={{
											width: `${employee.attendance?.attendancePercentage || 0}%`,
										}}
									/>
								</div>

								<span className="text-sm font-medium">
									{employee.attendance?.attendancePercentage || 0}%
								</span>
							</div>
						</TableCell>

						<TableCell className="text-center">{employee.attendance?.totalPresentDays || 0}</TableCell>

						<TableCell className="text-center">{employee.attendance?.totalAbsentDays || 0}</TableCell>

						<TableCell className="text-center">{employee.attendance?.totalLeaveDays || 0}</TableCell>

						<TableCell className="text-center">
							{employee.attendance?.totalLateLeaveEquivalent || 0}
						</TableCell>

						<TableCell className="text-center">{employee.attendance?.lastUpdatedYear || 0}</TableCell>

						{employee.attendance?.attendancePercentage > 0 && (
							<TableCell>
								<div className="flex justify-center gap-2">
									<button
										onClick={() => onView(employee)}
										className="rounded-md border border-blue-200 p-2 text-blue-700 transition-colors hover:bg-blue-50"
									>
										<Eye size={16} />
									</button>
								</div>
							</TableCell>
						)}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

AttendanceTable.propTypes = {
	employees: PropTypes.array.isRequired,
	onView: PropTypes.func.isRequired,
};

export default AttendanceTable;
