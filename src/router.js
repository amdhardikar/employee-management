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
		path: "/employees/:id",
		breadcrumb: "Employee Details",
		parent: "/employees",
	},
	{
		path: "/departments",
		breadcrumb: "Departments",
	},
	{
		path: "/departments/:id",
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
	{
		path: "/payroll/:id",
      breadcrumb: "Payroll Details",
      parent: "/payroll"
	},
];
