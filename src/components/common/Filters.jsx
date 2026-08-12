/**
 * @fileoverview Renders the reusable list toolbar. Feature flags control search, department, and status inputs; controlled callbacks pass changes to the owning page, and the optional New button navigates to employee creation.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/Filters
 */
import { Search } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

/**
 * Renders the filters interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.RefObject} props.searchRef - Reference to the search input, used for focus restoration.
 * @param {string} props.search - Current controlled search text.
 * @param {Object|string} props.department - Selected department value or department record.
 * @param {string} props.status - Current controlled status filter.
 * @param {Array} props.departments - Available department values shown by the control.
 * @param {string[]} props.statusList - Status options available in the selector.
 * @param {boolean} props.showSearch - Whether the search input is rendered.
 * @param {boolean} props.showDepartment - Whether the department selector is rendered.
 * @param {boolean} props.showStatus - Whether the status selector is rendered.
 * @param {Function} props.onSearchChange - Handles changes to the search input.
 * @param {Function} props.onDepartmentChange - Handles changes to the department selector.
 * @param {Function} props.onStatusChange - Handles changes to the status selector.
 * @param {Function} props.onSearchFocus - Handles focus entering the search field.
 * @param {Function} props.onSearchBlur - Handles focus leaving the search field.
 * @param {boolean} props.newButton - Whether the create-record button is rendered.
 * @param {string} props.searchPlaceholder - Context-specific search guidance.
 * @param {string} props.newButtonLabel - Text displayed by the create-record button.
 * @param {Function} props.onNew - Optional create action; defaults to employee creation navigation.
 * @returns {JSX.Element} Rendered React user interface.
 */
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
	newButton = false,
	searchPlaceholder = "Search employees. . .",
	onNew,
}) => {
	const navigate = useNavigate();

	return (
		<div className="border-slate-200 bg-white px-3 py-3 sm:px-4">
			<div className="grid grid-cols-2 gap-3 md:flex md:items-center">
				{showSearch && (
					<div className="relative col-span-2 min-w-0 md:flex-1">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

						<input
							ref={searchRef}
							type="text"
							placeholder={searchPlaceholder}
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
						className={`h-11 w-full min-w-0 rounded-sm border border-slate-200 bg-white px-3 text-sm ${!showStatus ? "col-span-2" : ""} md:w-52`}
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
						className={`h-11 w-full min-w-0 rounded-sm border border-slate-200 bg-white px-3 text-sm ${!showDepartment ? "col-span-2" : ""} md:w-52`}
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
						className="col-span-2 h-11 w-full rounded-sm bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
						onClick={() => (onNew ? onNew() : navigate("/employees/new"))}
					>
						Add
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
	searchPlaceholder: PropTypes.string,
	newButtonLabel: PropTypes.string,
	onNew: PropTypes.func,
};

export default Filters;
