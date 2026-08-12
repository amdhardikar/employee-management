/**
 * @fileoverview Displays a consistent no-data message when a successful request returns no records. Callers may customize the title and supporting text.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/EmptyState
 */
import { Info } from "lucide-react";
import PropTypes from "prop-types";

/**
 * Renders the empty state interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {string} props.title - Heading displayed to the user.
 * @param {string} props.message - Supporting message displayed to the user.
 * @returns {JSX.Element} Rendered React user interface.
 */
const EmptyState = ({ title = "No Data Found", message = "There is no data available to display." }) => {
	return (
		<div className="p-10">
			<div className="flex min-h-75 flex-col items-center justify-center gap-4 text-center">
				<Info aria-hidden="true" className="h-10 w-10 text-indigo-600" />
				<div>
					<h2 className="text-lg font-semibold text-slate-900">{title}</h2>

					<p className="mt-1 text-sm text-slate-500">{message}</p>
				</div>
			</div>
		</div>
	);
};

EmptyState.propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
};

export default EmptyState;
