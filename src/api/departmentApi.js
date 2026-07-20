const API_URL = "http://localhost:5000/departments";

export const departmentApi = {
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
		const res = await fetch(`${API_URL}?departmentId=${id}`);
		return res.json();
	},
};
