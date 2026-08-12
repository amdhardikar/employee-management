import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { designationApi } from "../api/designationApi";
import { setDesignations } from "../store/designationSlice";

export default function useDesignations(departmentId = "") {
	const dispatch = useDispatch();
	const designations = useSelector((state) => state.designation.designations);
	const loaded = useSelector((state) => state.designation.loaded);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (loaded) return;
		let active = true;

		async function load() {
			try {
				setLoading(true);
				setError(null);
				const data = await designationApi.getAll();
				if (active) dispatch(setDesignations(data));
			} catch (loadError) {
				if (active) setError(loadError);
			} finally {
				if (active) setLoading(false);
			}
		}

		load();
		return () => {
			active = false;
		};
	}, [dispatch, loaded]);

	const filteredDesignations = useMemo(
		() => designations.filter((designation) => designation.departmentId === departmentId),
		[departmentId, designations],
	);

	return { designations: filteredDesignations, loading, error };
}
