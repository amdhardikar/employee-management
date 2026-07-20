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
		path: "/employee/:id",
		breadcrumb: "Employee Details",
		parent: "/employees",
	},
	{
		path: "/departments",
		breadcrumb: "Departments",
	},
	{
		path: "/department/:id",
		breadcrumb: "Departments Details",
		parent: "/departments",
	},
	{
		path: "/attendance",
		breadcrumb: "Attendance",
	},
	{
		path: "/attendance/:id",
		breadcrumb: "Attendance Details",
		parent: "/attendance",
	},
	{
		path: "/payroll",
		breadcrumb: "Payroll",
	},
];
