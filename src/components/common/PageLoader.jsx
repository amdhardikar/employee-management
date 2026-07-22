import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const PageLoader = ({ text = "Loading..." }) => {
	return (
		<div className="p-10">
			<div className="flex min-h-75 flex-col items-center justify-center gap-4 text-center">
				<Loader2 className="h-10 w-10 animate-spin text-indigo-600" />

				<div>
					<h2 className="text-lg font-semibold text-slate-900">
						{text}
					</h2>

					<p className="mt-1 text-sm text-slate-500">
						Please wait while we fetch the data.
					</p>
				</div>
			</div>
		</div>
	);
};

PageLoader.propTypes = {
	text: PropTypes.string,
};

export default PageLoader;
