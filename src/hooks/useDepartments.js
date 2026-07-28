import { useEffect, useState } from "react";
import { departmentApi } from "../api/departmentApi";

export default function useDepartments() {
	const [departments, setDepartments] = useState([]);

	useEffect(() => {
		async function load() {
			const data = await departmentApi.getAll();

			setDepartments(data.map((d) => d.name));
		}

		load();
	}, []);

	return departments;
}
