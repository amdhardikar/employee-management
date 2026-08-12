/**
 * @fileoverview Exports the route metadata used by navigation and breadcrumbs. Each entry maps a URL pattern to a human-readable label; dynamic employee, department, attendance, and payroll identifiers are represented as parameterized routes.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/router
 */
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
		path: "/departments/new",
      breadcrumb: "New",
      parent: "/departments"
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
