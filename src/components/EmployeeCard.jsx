import {
	Eye,
	Pencil,
	Building2,
	Briefcase,
	MapPin,
	Mail,
	Phone,
} from "lucide-react";

import { STATUS_COLORS } from "../constants/EMSconstants";

const EmployeeCard = ({ employee, onView, onEdit }) => {
	return (
		<div
			key={employee.id}
			className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
		>
			{/* Employee Header */}
			<div className="flex items-start gap-4">
				<img
					src={employee.personalInfo?.profileImage}
					alt={employee.personalInfo?.fullName}
					className="h-16 w-16 rounded-full border object-cover"
				/>

				<div className="min-w-0 flex-1">
					<h3 className="truncate text-lg font-semibold text-slate-900">
						{employee.personalInfo?.fullName}
					</h3>

					<p className="text-sm text-slate-500">{employee.employeeCode}</p>

					<span
						className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
							STATUS_COLORS[employee.employment?.status] ||
							"bg-slate-100 text-slate-700"
						}`}
					>
						{employee.employment?.status}
					</span>
				</div>
			</div>

			{/* Details */}
			<div className="mt-5 space-y-3 text-sm">
				<div className="flex items-center gap-2 text-slate-600">
					<Briefcase className="h-4 w-4" />
					{employee.employment?.designation}
				</div>

				<div className="flex items-center gap-2 text-slate-600">
					<Building2 className="h-4 w-4" />
					{employee.employment?.departmentName}
				</div>

				<div className="flex items-center gap-2 text-slate-600">
					<MapPin className="h-4 w-4" />
					{employee.employment?.workLocation}
				</div>

				<div className="flex items-center gap-2 text-slate-600 truncate">
					<Mail className="h-4 w-4 shrink-0" />
					{employee.personalInfo?.email}
				</div>

				<div className="flex items-center gap-2 text-slate-600">
					<Phone className="h-4 w-4" />
					{employee.personalInfo?.phone}
				</div>
			</div>

			{/* Stats */}
			<div className="mt-5 grid grid-cols-2 gap-3">
				<div className="rounded-xl bg-slate-50 p-3">
					<p className="text-xs text-slate-500">Attendance</p>
					<p className="font-semibold text-slate-900">
						{employee.attendance?.attendancePercentage || 0}%
					</p>
				</div>

				<div className="rounded-xl bg-slate-50 p-3">
					<p className="text-xs text-slate-500">Rating</p>
					<p className="font-semibold text-slate-900">
						⭐ {employee.performance?.currentRating || 0}
					</p>
				</div>
			</div>

			{/* Actions */}
			<div className="mt-5 flex gap-2">
				<button
					onClick={onView}
					className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
				>
					<Eye className="h-4 w-4" />
					View
				</button>

				<button
					onClick={onEdit}
					className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					<Pencil className="h-4 w-4" />
					Edit
				</button>
			</div>
		</div>
	);
};

export default EmployeeCard;


/* need to remove */