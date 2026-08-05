const API_URL = "http://localhost:5000/monthlyAttendance";

export const attendanceApi = {
	getByEmployeeId: async (employeeId) => {
		const res = await fetch(
			`${API_URL}?employeeId=${employeeId}&_sort=createdAt&_order=desc`,
		);

		if (!res.ok) {
			throw new Error("Failed to load employee attendance");
		}

		return res.json();
	},
};
