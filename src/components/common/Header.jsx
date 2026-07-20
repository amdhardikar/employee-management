import Breadcrumb from "./Breadcrumb";

const Header = ({ actions = [] }) => {
	return (
		<div className=" bg-white px-5 py-5">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="space-y-3">
					<Breadcrumb />
				</div>

				{actions.length > 0 && (
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						{" "}
						{actions.map((action, index) => (
							<button
								key={index}
								type="button"
								onClick={action.onClick}
								className="inline-flex items-center justify-center gap-2 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
							>
								{" "}
								{action.icon} {action.label}{" "}
							</button>
						))}{" "}
					</div>
				)}
			</div>
		</div>
	);
};

export default Header;
