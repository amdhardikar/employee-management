const API_URL = "http://localhost:5000/payrolls";

export const payrollApi = {
	getByEmployeeId: async (employeeId) => {
		const res = await fetch(`${API_URL}?employeeId=${employeeId}`);

		if (!res.ok) {
			throw new Error("Failed to load employee payroll");
		}

		return res.json();
	},
};
