/**
 * @fileoverview Displays a consistent, accessible failure message for page-level request or processing errors. Callers may provide a domain-specific title and explanation.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/ErrorState
 */
import PropTypes from "prop-types";
import { Bug } from "lucide-react";

/**
 * Renders the error state interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {string} props.title - Heading displayed to the user.
 * @param {string} props.message - Supporting message displayed to the user.
 * @returns {JSX.Element} Rendered React user interface.
 */
const ErrorState = ({
	title = "Something went wrong",
	message = "Unable to load data. Please try again.",
	onRetry = () => window.location.reload(),
}) => {
	return (
		<div className="p-10">
			<div className="flex min-h-75 flex-col items-center justify-center gap-4 text-center">
				<Bug aria-hidden="true" className="h-10 w-10 text-red-600" />

				<div>
					<h2 className="text-lg font-semibold text-slate-900">{title}</h2>

					<p className="mt-1 text-sm text-slate-500">{message}</p>
				</div>

				<button
					type="button"
					onClick={onRetry}
					className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:outline-none"
				>
					Try again
				</button>
			</div>
		</div>
	);
};

ErrorState.propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
	onRetry: PropTypes.func,
};

export default ErrorState;
