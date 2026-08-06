import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";

import EmployeeDetails from "./components/employee/EmployeeDetails";
import AttendanceDetails from "./components/attendance/AttendanceDetails";
import DepartmentDetails from "./components/department/DepartmentDetails";
import PayrollDetails from "./components/payroll/PayrollDetails";
import ProtectedRoute from "./components/common/ProtectedRoute";

import MainLayout from "./layout/mainLayout";
import EmployeeLayout from "./layout/employeeLayout";
import DepartmentLayout from "./layout/departmentLayout";
import AttendanceLayout from "./layout/attendanceLayout";
import PayslipLayout from "./layout/payslipLayout";
import EmployeeCreate from "./components/employee/EmployeeCreate";
import EmployeeEdit from "./components/employee/EmployeeEdit";
import DepartmentEdit from "./components/department/DepartmentEdit";
import DepartmentCreate from "./components/department/DepartmentCreate";

function App() {
	return (
		<>
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
		</>
	);
}

export default App;
