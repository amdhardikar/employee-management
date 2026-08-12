/**
 * @fileoverview Loads and caches department reference data for filters and forms. It reuses Redux data when valid, can return either department names or full records, and exposes loading/error state while requests are active.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/hooks/useDepartments
 */
import { useEffect, useState } from "react";
import { departmentApi } from "../api/departmentApi";
import logger from "../logging/logger";
import { setDepartments } from "../store/departmentSlice";
import { useDispatch, useSelector } from "react-redux";

/**
 * Manages departments state and exposes values and callbacks to React consumers.
 * @param {*} namesOnly - The names only value required by this operation.
 * @returns {Object|*} Hook state, derived values, and/or callback functions.
 */
export default function useDepartments(namesOnly = true) {
	const dispatch = useDispatch();

	const departments = useSelector((state) => state.department.departments);
	const loaded = useSelector((state) => state.department.loaded);

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loaded) return;
		let active = true;
		async function load() {
			try {
				setLoading(true);
				setError(null);

				const data = await departmentApi.getAll();

				if (active) dispatch(setDepartments(data));
			} catch (error) {
				logger.error("Failed to load departments", error);
				if (active) setError({
					message: error.message || "Unable to load departments",
				});
			} finally {
				if (active) setLoading(false);
			}
		}

		load();
		return () => {
			active = false;
		};
	}, [loaded, dispatch]);

	const formattedDepartments = namesOnly ? departments.map((d) => d.name) : departments;

	return {
		departments: formattedDepartments,
		loading,
		error,
	};
}
