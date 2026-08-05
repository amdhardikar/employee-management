const API_URL = "http://localhost:5000/designations";

export const designationApi = {
	getByDepartment: async (departmentId) => {
		const res = await fetch(`${API_URL}?departmentId=${departmentId}`);

		if (!res.ok) throw new Error("Failed to load designations");

		return res.json();
	},
};
