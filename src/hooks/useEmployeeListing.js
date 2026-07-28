import { useEffect, useState } from "react";

export default function useEmployeeListing({
	fetchEmployees,
	isDesktop,
	tablePage,
	cardPage,
	pageSize,
}) {
	const [tableEmployees, setTableEmployees] = useState([]);
	const [cardEmployees, setCardEmployees] = useState([]);

	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);

	const [pagination, setPagination] = useState({
		totalPages: 1,
		totalItems: 0,
	});

	useEffect(() => {
		async function loadData() {
			try {
				if (isDesktop) {
					setLoading(true);
				} else {
					setLoading(cardPage === 1);
					setLoadingMore(cardPage > 1);
				}

				const page = isDesktop ? tablePage : 1;

				const limit = isDesktop ? pageSize : cardPage * pageSize;

				const result = await fetchEmployees(page, limit);

				if (isDesktop) {
					setTableEmployees(result.data);
				} else {
					setCardEmployees(result.data);
				}

				setPagination({
					totalPages: result.pages,
					totalItems: result.items,
				});
			} finally {
				setLoading(false);
				setLoadingMore(false);
			}
		}

		loadData();
	}, [fetchEmployees, isDesktop, tablePage, cardPage, pageSize]);

	return {
		tableEmployees,
		cardEmployees,
		loading,
		loadingMore,
		pagination,
	};
}
