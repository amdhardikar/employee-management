const EmptyState = ({
	title = "No Data Found",
	message = "There is no data available to display.",
}) => {
	return (
		<div className="p-10">
			<div className="flex min-h-75 flex-col items-center justify-center text-center">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">
						{title}
					</h2>

					<p className="mt-1 text-sm text-slate-500">{message}</p>
				</div>
			</div>
		</div>
	);
};

export default EmptyState;
