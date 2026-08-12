/**
 * @fileoverview Displays a reusable record-not-found state and a navigation action back to the previous screen. Title and explanatory text can be specialized by details pages.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/NotFound
 */
import { TriangleAlert } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

/**
 * Renders the not found interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {string} props.title - Heading displayed to the user.
 * @param {string} props.message - Supporting message displayed to the user.
 * @returns {JSX.Element} Rendered React user interface.
 */
const NotFound = ({ title = "Record Not Found", message = "The requested record could not be found." }) => {
	const navigate = useNavigate();

	return (
		<div className="p-10">
			<div className="flex min-h-75 flex-col items-center justify-center gap-4 text-center">
				<TriangleAlert aria-hidden="true" className="h-10 w-10 text-amber-600" />

				<div>
					<h2 className="text-lg font-semibold text-slate-900">{title}</h2>

					<p className="mt-1 text-sm text-slate-500">{message}</p>
				</div>

				<button
					onClick={() => navigate(-1)}
					className="rounded-sm bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
				>
					Go Back
				</button>
			</div>
		</div>
	);
};

NotFound.propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
};

export default NotFound;
