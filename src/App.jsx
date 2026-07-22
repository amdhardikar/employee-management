import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";

import EmployeeDetails from "./components/EmployeeDetails";
import AttendanceDetails from "./components/AttendanceDetails";
import DepartmentDetails from "./components/DepartmentDetails";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layout/mainLayout";
import EmployeeLayout from "./layout/employeeLayout";
import DepartmentLayout from "./layout/departmentLayout";
import AttendanceLayout from "./layout/attendanceLayout";
import PayslipLayout from "./layout/payslipLayout";

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
						<Route
							path="/employees/:id"
							element={<EmployeeDetails />}
						/>
						{/* <Route path="/employee/edit/:id" element={<EmployeeEdit />} /> */}
						{/* <Route path="/employee/new" element={<EmployeeNew />} /> */}
					</Route>

					<Route element={<DepartmentLayout />}>
						<Route path="/departments" element={<Departments />} />
						<Route
							path="/departments/:id"
							element={<DepartmentDetails />}
						/>
					</Route>
					<Route element={<AttendanceLayout />}>
						<Route path="/attendance" element={<Attendance />} />
						<Route
							path="/attendance/:id"
							element={<AttendanceDetails />}
						/>
					</Route>
					<Route element={<PayslipLayout />}>
						<Route path="/payroll" element={<Payroll />} />
					</Route>
				</Route>

				<Route
					path="*"
					element={<Navigate to="/dashboard" replace />}
				/>
			</Routes>
		</>
	);
}

export default App;
