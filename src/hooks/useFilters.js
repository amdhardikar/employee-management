/**
 * @fileoverview Converts search, department, status, page, and page-size UI events into Redux filter updates for a selected module. Filter changes reset both pagination modes, and table-page changes scroll the table back into view.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/hooks/useFilters
 */
import { useDispatch } from "react-redux";
import { setFilters } from "../store/filterSlice";

/**
 * Manages filters state and exposes values and callbacks to React consumers.
 * @param {Object} props - Component or hook input properties.
 * @param {string} props.module - Redux filter namespace to update.
 * @param {React.RefObject} props.tableRef - Reference scrolled into view after a desktop page change.
 * @returns {Object|*} Hook state, derived values, and/or callback functions.
 */
export default function useFilters({ module, tableRef }) {
	const dispatch = useDispatch();

	const updateQuery = (updates, resetPage = true) => {
		dispatch(
			setFilters({
				module,
				...updates,
				...(resetPage && {
					tablePage: 1,
					cardPage: 1,
				}),
			}),
		);
	};

	const onSearchChangeHandler = (e) => {
		updateQuery({
			search: e.target.value,
		});
	};

	const onDepartmentChangeHandler = (e) => {
		updateQuery({
			department: e.target.value,
		});
	};

	const onStatusChangeHandler = (e) => {
		updateQuery({
			status: e.target.value,
		});
	};

	const onPageChangeHandler = (page) => {
		tableRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});

		dispatch(
			setFilters({
				module,
				tablePage: page,
			}),
		);
	};

	const onPageSizeChangeHandler = (e) => {
		tableRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});

		updateQuery({
			pageSize: Number(e.target.value),
		});
	};

	return {
		updateQuery,
		onSearchChangeHandler,
		onDepartmentChangeHandler,
		onStatusChangeHandler,
		onPageChangeHandler,
		onPageSizeChangeHandler,
	};
}
