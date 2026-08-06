import PropTypes from "prop-types";
import { Bug } from "lucide-react";

const ErrorState = ({ title = "Something went wrong", message = "Unable to load data. Please try again." }) => {
	return (
		<div className="p-10">
			<div className="flex min-h-75 flex-col items-center justify-center gap-4 text-center">
				<Bug aria-hidden="true" className="h-10 w-10 text-red-600" />

				<div>
					<h2 className="text-lg font-semibold text-slate-900">{title}</h2>

					<p className="mt-1 text-sm text-slate-500">{message}</p>
				</div>
			</div>
		</div>
	);
};

ErrorState.propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
};

export default ErrorState;
