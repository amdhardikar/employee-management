/**
 * @fileoverview Presents consistent feedback for create, update, and other save operations. The
 * dialog blocks duplicate interaction while a mutation is running, announces progress to assistive
 * technology, and converts either Error objects or plain messages into a dismissible save failure.
 * It renders nothing while the operation is idle, allowing forms to keep a single component mounted
 * throughout the complete mutation lifecycle.
 *
 * @module src/components/common/Popup
 */
import PropTypes from "prop-types";
import { AlertCircle, LoaderCircle, X } from "lucide-react";

/**
 * Renders modal feedback for an in-progress or failed save operation.
 * @param {Object} props - Save feedback configuration.
 * @param {boolean} [props.saving=false] - Whether a save request is currently in progress.
 * @param {Error|string|null} [props.error=null] - Failure returned by validation or the save request.
 * @param {string} [props.savingMessage="Saving changes..."] - Progress text shown during the request.
 * @param {string} [props.errorTitle="Unable to save changes"] - Heading shown when the request fails.
 * @param {Function} [props.onClose] - Clears the error and closes the failure dialog.
 * @returns {JSX.Element|null} A modal status dialog, or nothing when no feedback is required.
 */
const Popup = ({
	saving = false,
	error = null,
	savingMessage = "Saving changes...",
	progressTitle = "Saving",
	errorTitle = "Unable to save changes",
	onClose = () => {},
}) => {
	if (!saving && !error) return null;

	const errorMessage = typeof error === "string" ? error : error?.message;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="save-status-title"
			aria-describedby="save-status-message"
		>
			<div className="relative w-full max-w-md rounded-lg bg-white p-6 text-center shadow-2xl">
				{saving ? (
					<>
						<LoaderCircle className="mx-auto h-10 w-10 animate-spin text-blue-600" aria-hidden="true" />
						<h2 id="save-status-title" className="mt-4 text-lg font-semibold text-slate-900">
							{progressTitle}
						</h2>
						<p
							id="save-status-message"
							className="mt-2 text-sm text-slate-600"
							role="status"
							aria-live="polite"
						>
							{savingMessage}
						</p>
					</>
				) : (
					<>
						<button
							type="button"
							onClick={onClose}
							className="absolute top-3 right-3 rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
							aria-label="Close error message"
						>
							<X className="h-5 w-5" aria-hidden="true" />
						</button>
						<AlertCircle className="mx-auto h-10 w-10 text-red-600" aria-hidden="true" />
						<h2 id="save-status-title" className="mt-4 text-lg font-semibold text-slate-900">
							{errorTitle}
						</h2>
						<p id="save-status-message" className="mt-2 text-sm text-slate-600" role="alert">
							{errorMessage || "An unexpected error occurred. Please try again."}
						</p>
						<button
							type="button"
							onClick={onClose}
							className="mt-5 rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
						>
							Close
						</button>
					</>
				)}
			</div>
		</div>
	);
};

Popup.propTypes = {
	saving: PropTypes.bool,
	error: PropTypes.oneOfType([PropTypes.instanceOf(Error), PropTypes.string]),
	savingMessage: PropTypes.string,
	progressTitle: PropTypes.string,
	errorTitle: PropTypes.string,
	onClose: PropTypes.func,
};

export default Popup;
