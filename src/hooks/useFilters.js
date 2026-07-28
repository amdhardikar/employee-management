import { useDispatch } from "react-redux";
import { setFilters } from "../store/filterSlice";

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
