const API_URL = "http://localhost:5000/departments";

export const departmentApi = {
	getAll: async () => {
		const res = await fetch(API_URL, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			throw new Error("Failed to load departments");
		}

		return res.json();
	},

	getById: async (id) => {
		const res = await fetch(`${API_URL}?departmentId=${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			throw new Error("Failed to load department by id");
		}

		return res.json();
	},
	updateDepartment: async (departmentId, body) => {
		const res = await fetch(`${API_URL}/${departmentId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.error || "Failed to update department");
		}

		return res.json();
	},
};
