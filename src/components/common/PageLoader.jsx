import { Loader2 } from "lucide-react";

const PageLoader = ({ text = "Loading..." }) => {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
			<Loader2 className="h-10 w-10 animate-spin text-blue-600" />

			<div className="space-y-1 text-center">
				<p className="font-medium text-slate-900">{text}</p>
				<p className="text-sm text-slate-500">
					Please wait while we fetch the data.
				</p>
			</div>
		</div>
	);
};

export default PageLoader;
