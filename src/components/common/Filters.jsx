import { Search } from "lucide-react";
import PropTypes from "prop-types";

const Filters = ({
	search,
	department,
	status,
	departments = [],
	statusList = [],
	showSearch = true,
	showDepartment = true,
	showStatus = true,
	onSearchChange,
	onDepartmentChange,
	onStatusChange,
}) => {

	return (
		<div className="border-slate-200 bg-white px-4 py-3">
			{/* <div className="grid grid-cols-2 gap-3 md:flex md:flex-row"> */}
			<div className="grid grid-cols-2 gap-3 md:flex md:items-center">
				{showSearch && (
					<div className="relative col-span-2 md:flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

						<input
							type="text"
							placeholder="Search employees. . ."
							value={search}
							onChange={onSearchChange}
							className="h-11 w-full rounded-sm border border-slate-200 bg-white  pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
						/>
					</div>
				)}

				{showDepartment && (
					<select
						value={department}
						onChange={onDepartmentChange}
						className={`h-11 rounded-sm border border-slate-200 bg-white px-3 text-sm w-full ${!showStatus ? "col-span-2" : ""} md:w-52`}
					>
						<option value="all">All Departments</option>

						{departments.map((dept) => (
							<option key={dept} value={dept}>
								{dept}
							</option>
						))}
					</select>
				)}

				{showStatus && (
					<select
						value={status}
						onChange={onStatusChange}
						className={`h-11 rounded-sm border border-slate-200 bg-white px-3 text-sm w-full ${!showDepartment ? "col-span-2" : ""} md:w-52`}
					>
						<option value="all">All Status</option>

						{statusList.map((item) => (
							<option key={item} value={item}>
								{item}
							</option>
						))}
					</select>
				)}
			</div>
		</div>
	);
};

Filters.propTypes = {
	search: PropTypes.string,
	department: PropTypes.string,
	status: PropTypes.string,
	departments: PropTypes.array,
	statusList: PropTypes.array,
	showSearch: PropTypes.bool,
	showDepartment: PropTypes.bool,
	showStatus: PropTypes.bool,
	onSearchChange: PropTypes.func,
	onDepartmentChange: PropTypes.func,
	onStatusChange: PropTypes.func,
};

export default Filters;
