import { useNavigate } from "react-router-dom";

const NotFound = ({
	title = "Record Not Found",
	message = "The requested record could not be found.",
}) => {
	const navigate = useNavigate();

	return (
		<div className=" p-10">
			<div className="flex min-h-75 flex-col items-center justify-center gap-4 text-center">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">
						{title}
					</h2>

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

export default NotFound;
