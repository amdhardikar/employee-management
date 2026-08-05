export const appRoutes = [
	{
		path: "/dashboard",
		breadcrumb: "Dashboard",
	},
	{
		path: "/employees",
		breadcrumb: "Employees",
	},
	{
		path: "/employees/new",
		breadcrumb: "New",
		parent: "/employees",
	},
	{
		path: "/employees/:id",
		breadcrumb: "Details",
		parent: "/employees",
	},
	{
		path: "/employees/edit/:id",
		breadcrumb: "Edit",
		parent: "/employees",
	},
	{
		path: "/departments",
		breadcrumb: "Departments",
	},
	{
		path: "/departments/:id",
		breadcrumb: "Details",
		parent: "/departments",
	},
	{
		path: "/departments/edit/:id",
		breadcrumb: "Edit",
		parent: "/departments",
	},
	{
		path: "/attendance",
		breadcrumb: "Attendance",
	},
	{
		path: "/attendance/:id",
		breadcrumb: "Details",
		parent: "/attendance",
	},
	{
		path: "/payroll",
		breadcrumb: "Payroll",
	},
	{
		path: "/payroll/:id",
		breadcrumb: "Details",
		parent: "/payroll",
	},
];
