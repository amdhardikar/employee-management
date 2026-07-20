const API_URL = "http://localhost:5000/employees";

export const employeeApi = {
	getManagers: async () => {
		const res = await fetch(`${API_URL}/?employment.manager.id=null`);
		const employees = await res.json();
		const managers = employees.map((emp) => ({
			id: emp.id,
			name: emp.personalInfo.fullName,
		}));

		return managers;
	},

	getAll: async (filter) => {
		if (filter) {
			const res = await fetch(`${API_URL}?${filter}`);
			return res.json();
		} else {
			const res = await fetch(`${API_URL}`);
			return res.json();
		}
	},

	getById: async (id) => {
		const res = await fetch(`${API_URL}?employeeId=${id}`);
		return res.json();
	},

	getByDepartment: async (id) => {
		const res = await fetch(`${API_URL}?employment.departmentId=${id}`);
		return res.json();
	},

	getByEmailAndEmployeeCode: async (email, code) => {
		const res = await fetch(
			`${API_URL}?personalInfo.email=${email}&employeeCode=${code}`,
		);
		return res;
	},
};
