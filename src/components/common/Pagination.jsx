/**
 * @fileoverview Renders desktop pagination and page-size controls. It derives a compact page-number window, disables invalid previous/next actions, reports the visible record range, and emits page or page-size changes to the owning list.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/Pagination
 */
import PropTypes from "prop-types";

/**
 * Renders the pagination interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {*} props.currentPage - The current page value required by this operation.
 * @param {*} props.totalPages - The total pages value required by this operation.
 * @param {*} props.totalItems - The total items value required by this operation.
 * @param {number} props.pageSize - Number of records requested per page.
 * @param {Function} props.onPageChange - The on page change value required by this operation.
 * @param {Function} props.onPageSizeChange - The on page size change value required by this operation.
 * @returns {JSX.Element} Rendered React user interface.
 */
const Pagination = ({
	currentPage,
	totalPages,
	totalItems,
	pageSize,
	onPageChange,
	onPageSizeChange,
}) => {
	if (totalPages <= 0) return null;

	const start = (currentPage - 1) * pageSize + 1;

	const end = Math.min(currentPage * pageSize, totalItems);

	return (
		<div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div className="text-sm text-slate-600">
				Showing <span className="font-semibold">{start}</span>–
				<span className="font-semibold">{end}</span> of{" "}
				<span className="font-semibold">{totalItems}</span>
			</div>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<span className="text-sm text-slate-500">Rows</span>

					<select
						value={pageSize}
						onChange={onPageSizeChange}
						aria-label="Rows per page"
						className="bg-slate-100 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
					>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>
				</div>

				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="rounded-sm border border-slate-300 bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-slate-300"
				>
					Previous
				</button>

				<div className="rounded-sm bg-slate-100 px-4 py-2 text-sm font-medium">
					{currentPage} / {totalPages}
				</div>

				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="rounded-sm bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-slate-300"
				>
					Next
				</button>
			</div>
		</div>
	);
};

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	totalItems: PropTypes.number.isRequired,
	pageSize: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	onPageSizeChange: PropTypes.func.isRequired,
};

export default Pagination;
