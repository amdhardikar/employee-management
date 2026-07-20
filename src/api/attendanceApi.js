const API_URL = "http://localhost:5000/monthlyAttendance";

export const attendanceApi = {
	getAll: async (filter) => {
		if (filter) {
			const res = await fetch(`${API_URL}?${filter}`);
			return res.json();
		} else {
			const res = await fetch(`${API_URL}`);
			return res.json();
		}
	},

	getByEmployeeId: async (employeeId) => {
		const res = await fetch(
			`${API_URL}?employeeId=${employeeId}&_sort=-createdAt`,
		);
		return res.json();
	},

	getLatestByEmployeeId: async (employeeId) => {
		const res = await fetch(
			`${API_URL}?employeeId=${employeeId}&_sort=-date`,
		);
		const data = await res.json();
		return data[0];
	},
};
