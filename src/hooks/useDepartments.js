import { useEffect, useState } from "react";
import { departmentApi } from "../api/departmentApi";
import { setDepartments } from "../store/departmentSlice";
import { useDispatch, useSelector } from "react-redux";

export default function useDepartments(namesOnly = true) {
	const dispatch = useDispatch();

	const departments = useSelector((state) => state.department.departments);
	const loaded = useSelector((state) => state.department.loaded);

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loaded) return;
      async function load() {
         console.log(loaded)
			try {
				setLoading(true);
				setError(null);

				const data = await departmentApi.getAll();

				dispatch(setDepartments(data));
			} catch (error) {
				console.error("Failed to load departments", error);
				setError({
					message: error.message || "Unable to load departments",
				});
			} finally {
				setLoading(false);
			}
		}

		load();
	}, [loaded, dispatch]);

	const formattedDepartments = namesOnly ? departments.map((d) => d.name) : departments;

	return {
		departments: formattedDepartments,
		loading,
		error,
	};
}
