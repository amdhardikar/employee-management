/**
 * @fileoverview Displays a centered, accessible loading indicator with configurable status text. The live status region informs assistive technology while data-dependent pages are waiting.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/PageLoader
 */
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

/**
 * Renders the page loader interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {*} props.text - The text value required by this operation.
 * @returns {JSX.Element} Rendered React user interface.
 */
const PageLoader = ({ text = "Loading..." }) => {
	return (
		<div className="p-10">
			<div
				role="status"
				aria-live="polite"
				className="flex min-h-75 flex-col items-center justify-center gap-4 text-center"
			>
				<Loader2 aria-hidden="true" className="h-10 w-10 animate-spin text-indigo-600" />

				<div>
					<h2 className="text-lg font-semibold text-slate-900">{text}</h2>

					<p className="mt-1 text-sm text-slate-500">Please wait while we fetch the data.</p>
				</div>
			</div>
		</div>
	);
};

PageLoader.propTypes = {
	text: PropTypes.string,
};

export default PageLoader;
