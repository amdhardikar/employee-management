/**
 * @fileoverview Creates the application route tree. It keeps the login route public, wraps business routes in the authentication guard and shared MainLayout, and connects employee, department, attendance, payroll, dashboard, and fallback screens.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/App
 */
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PageLoader from "./components/common/PageLoader";

import MainLayout from "./layout/mainLayout";
import EmployeeLayout from "./layout/employeeLayout";
import DepartmentLayout from "./layout/departmentLayout";
import AttendanceLayout from "./layout/attendanceLayout";
import PayslipLayout from "./layout/payslipLayout";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Employees = lazy(() => import("./pages/Employees"));
const Departments = lazy(() => import("./pages/Departments"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Payroll = lazy(() => import("./pages/Payroll"));
const EmployeeDetails = lazy(() => import("./components/employee/EmployeeDetails"));
const EmployeeCreate = lazy(() => import("./components/employee/EmployeeCreate"));
const EmployeeEdit = lazy(() => import("./components/employee/EmployeeEdit"));
const DepartmentDetails = lazy(() => import("./components/department/DepartmentDetails"));
const DepartmentCreate = lazy(() => import("./components/department/DepartmentCreate"));
const DepartmentEdit = lazy(() => import("./components/department/DepartmentEdit"));
const AttendanceDetails = lazy(() => import("./components/attendance/AttendanceDetails"));
const PayrollDetails = lazy(() => import("./components/payroll/PayrollDetails"));

function App() {
	return (
		<Suspense fallback={<PageLoader text="Loading page..." />}>
			<Routes>
				<Route path="/login" element={<Login />} />

				<Route
					element={
						<ProtectedRoute>
							<MainLayout />
						</ProtectedRoute>
					}
				>
					<Route path="/dashboard" element={<Dashboard />} />

					<Route element={<EmployeeLayout />}>
						<Route path="/employees" element={<Employees />} />
						<Route path="/employees/new" element={<EmployeeCreate />} />
						<Route path="/employees/:id" element={<EmployeeDetails />} />
						<Route path="/employees/edit/:id" element={<EmployeeEdit />} />
					</Route>

					<Route element={<DepartmentLayout />}>
						<Route path="/departments" element={<Departments />} />
						<Route path="/departments/new" element={<DepartmentCreate />} />
						<Route path="/departments/:id" element={<DepartmentDetails />} />
						<Route path="/departments/edit/:id" element={<DepartmentEdit />} />
					</Route>
					<Route element={<AttendanceLayout />}>
						<Route path="/attendance" element={<Attendance />} />
						<Route path="/attendance/:id" element={<AttendanceDetails />} />
					</Route>
					<Route element={<PayslipLayout />}>
						<Route path="/payroll" element={<Payroll />} />
						<Route path="/payroll/:id" element={<PayrollDetails />} />
					</Route>
				</Route>

				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Routes>
		</Suspense>
	);
}

export default App;
