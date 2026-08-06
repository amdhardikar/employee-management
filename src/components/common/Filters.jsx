import { Search } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Filters = ({
	searchRef,
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
	onSearchFocus,
	onSearchBlur,
	newButton,
}) => {
	const navigate = useNavigate();

	return (
		<div className="border-slate-200 bg-white px-4 py-3">
			<div className="grid grid-cols-3 gap-3 md:flex md:items-center">
				{showSearch && (
					<div className="relative col-span-2 md:flex-1">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

						<input
							ref={searchRef}
							type="text"
							placeholder="Search employees. . ."
							value={search}
							onChange={onSearchChange}
							onFocus={onSearchFocus}
							onBlur={onSearchBlur}
							className="h-11 w-full rounded-sm border border-slate-200 bg-white pr-4 pl-10 text-sm transition outline-none focus:border-slate-400"
						/>
					</div>
				)}

				{showDepartment && (
					<select
						value={department}
						onChange={onDepartmentChange}
						aria-label="Department"
						className={`h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm ${!showStatus ? "col-span-2" : ""} md:w-52`}
					>
						<option value="all">All Departments</option>

						{departments.map((dept) => (
							<option key={dept} value={dept}>
								{dept}
							</option>
						))}
						<option value="unassigned">Unassigned</option>
					</select>
				)}

				{showStatus && (
					<select
						value={status}
						onChange={onStatusChange}
						aria-label="Status"
						className={`h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm ${!showDepartment ? "col-span-2" : ""} md:w-52`}
					>
						<option value="all">All Status</option>

						{statusList.map((item) => (
							<option key={item} value={item}>
								{item}
							</option>
						))}
					</select>
				)}
				{newButton && (
					<button
						type="button"
						className="h-11 rounded-sm bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						onClick={() => navigate("/employees/new")}
					>
						New
					</button>
				)}
			</div>
		</div>
	);
};

Filters.propTypes = {
	searchRef: PropTypes.object,
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
	onSearchFocus: PropTypes.func,
	onSearchBlur: PropTypes.func,
	newButton: PropTypes.bool,
};

export default Filters;
