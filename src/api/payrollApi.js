const API_URL = "http://localhost:5000/payrolls";

export const payrollApi = {
	getAll: async () => {
		const res = await fetch(`${API_URL}`);
		return res.json();
	},

	getByEmployeeId: async (employeeId) => {
		const res = await fetch(
			`${API_URL}?employeeId=${employeeId}`,
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
