import { NavLink, useLocation, matchPath } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { appRoutes } from "../../router";

const Breadcrumb = () => {
	const location = useLocation();

	const currentRoute = appRoutes.find((route) =>
		matchPath(route.path, location.pathname),
	);

	if (!currentRoute) return null;

	const breadcrumbs = [];

	if (currentRoute.parent) {
		const parentRoute = appRoutes.find(
			(route) => route.path === currentRoute.parent,
		);

		if (parentRoute) {
			breadcrumbs.push({
				label: parentRoute.breadcrumb,
				path: parentRoute.path,
			});
		}
	}

	breadcrumbs.push({
		label: currentRoute.breadcrumb,
		path: currentRoute.path,
	});

	return (
		<nav aria-label="Breadcrumb">
			<ol className="flex items-center gap-2 text-sm text-slate-500">
				<li>
					<NavLink
						to="/dashboard"
						className="flex items-center hover:text-slate-900"
					>
						<Home size={18} />
					</NavLink>
				</li>

				{breadcrumbs.map((item, index) => {
					const isLast = index === breadcrumbs.length - 1;

					return (
						<li key={item.label} className="flex items-center gap-2">
							<ChevronRight size={18} />

							{isLast ? (
								<span className="font-medium text-[18px] text-slate-900">
									{item.label}
								</span>
							) : (
								<NavLink
									to={item.path}
									className="text-[18px] hover:text-slate-900"
								>
									{item.label}
								</NavLink>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default Breadcrumb;
