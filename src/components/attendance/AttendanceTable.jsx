import PropTypes from "prop-types";
import { Eye } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../common/DataTable";

const AttendanceTable = ({ employees, onView }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Employee</TableHeader>
					<TableHeader className="text-left">Department</TableHeader>
					<TableHeader className="text-left">
						Attendance %
					</TableHeader>
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
								<img
									src={employee.personalInfo?.profileImage}
									alt={employee.fullName}
									className="h-10 w-10 rounded-full object-cover"
								/>

								<div>
									<p className="font-medium text-slate-900">
										{employee.fullName}
									</p>
									<span className="text-xs text-slate-500">
                              { employee.employeeCode}	 | {employee.employeeId} 
									</span>
								</div>
							</div>
						</TableCell>

						<TableCell>
							{employee.employment?.departmentName}
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
									{employee.attendance?.attendancePercentage}%
								</span>
							</div>
						</TableCell>

						<TableCell className="text-center">
							{employee.attendance?.totalPresentDays || 0}
						</TableCell>

						<TableCell className="text-center">
							{employee.attendance?.totalAbsentDays || 0}
						</TableCell>

						<TableCell className="text-center">
							{employee.attendance?.totalLeaveDays || 0}
						</TableCell>

						<TableCell className="text-center">
							{employee.attendance?.totalLateLeaveEquivalent || 0}
						</TableCell>

						<TableCell className="text-center">
							{employee.attendance?.lastUpdatedYear || 0}
						</TableCell>

						<TableCell>
							<div className="flex justify-center gap-2">
								<button
									onClick={() => onView(employee)}
									className="rounded-md border border-slate-200 p-2 hover:bg-slate-100"
								>
									<Eye size={16} />
								</button>

								{/* <button className="rounded-md bg-blue-600 p-2 text-white">
										<FileText size={16} />
									</button> */}
							</div>
						</TableCell>
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
