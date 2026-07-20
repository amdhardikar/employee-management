import { Search, Filter } from "lucide-react";

const Filters = ({
	search,
	department = [],
	status = [],
	departments = [],
	statusList = [],
	showSearch = true,
	showDepartment = true,
	showStatus = true,
	showYear = false,
	showMonth = false,
	years = [],
	year = "",
	months = [],
	month = "",
	onSearchChange,
	onDepartmentChange,
	onStatusChange,
	onYearChange,
	onMonthChange,
}) => {
	return (
		<div className=" bg-white p-4">
			<div className="flex flex-col gap-3 md:flex-row">
				{showSearch && (
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

						<input
							type="text"
							placeholder="Search employees. . ."
							value={search}
							onChange={onSearchChange}
							className="h-11 w-full rounded-sm border border-slate-200 pl-10 pr-4"
						/>
					</div>
				)}

				{showDepartment && (
					<select
						value={department}
						onChange={onDepartmentChange}
						className="h-11 w-full md:w-50 rounded-sm border border-slate-200 px-3"
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
						className="h-11 w-full md:w-37.5 rounded-sm border border-slate-200 px-3"
					>
						<option value="all">All Status</option>

						{statusList.map((item) => (
							<option key={item} value={item}>
								{item}
							</option>
						))}
					</select>
				)}

				{showYear && (
					<select
						value={year}
						onChange={onYearChange}
						className="h-11 w-full md:w-37.5 rounded-sm border border-slate-200 px-3"
					>
						<option value="all">All Years</option>

						{years.map((yearValue) => (
							<option key={yearValue} value={yearValue}>
								{yearValue}
							</option>
						))}
					</select>
				)}

				{showMonth && (
					<select
						value={month}
						onChange={onMonthChange}
						className="h-11 w-full md:w-37.5 rounded-sm border border-slate-200 px-3"
					>
						<option value="all">All Months</option>

						{months.map((month) => (
							<option key={month.value} value={month.value}>
								{month.label}
							</option>
						))}
					</select>
				)}
			</div>
		</div>
	);
};

export default Filters;
