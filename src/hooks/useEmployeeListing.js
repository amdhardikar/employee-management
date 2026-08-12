/**
 * @fileoverview Coordinates responsive employee list loading. Desktop requests one paginated table page while mobile expands the requested limit for load-more behavior; the hook keeps separate result collections and exposes loading, loading-more, pagination, and request-error state.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/hooks/useEmployeeListing
 */
import { useEffect, useState } from "react";

/**
 * Manages employee listing state and exposes values and callbacks to React consumers.
 * @param {Object} props - Component or hook input properties.
 * @param {Function} props.fetchEmployees - Async loader receiving a page and page size and returning paginated employees.
 * @param {boolean} props.isDesktop - Whether desktop table pagination is currently active.
 * @param {number} props.tablePage - Current one-based desktop page.
 * @param {number} props.cardPage - Current mobile load-more page multiplier.
 * @param {number} props.pageSize - Number of records requested per page.
 * @returns {Object|*} Hook state, derived values, and/or callback functions.
 */
export default function useEmployeeListing({ fetchEmployees, isDesktop, tablePage, cardPage, pageSize }) {
	const [tableEmployees, setTableEmployees] = useState([]);
	const [cardEmployees, setCardEmployees] = useState([]);

	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState(null);

	const [pagination, setPagination] = useState({
		totalPages: 1,
		totalItems: 0,
	});

	useEffect(() => {
		let active = true;

		async function loadData() {
			setError(null);
			try {
				if (!active) return;

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
			} catch (err) {
				if (active) setError(err);
			} finally {
				if (active) {
					setLoading(false);
					setLoadingMore(false);
				}
			}
		}

		loadData();
		return () => {
			active = false;
		};
	}, [fetchEmployees, isDesktop, tablePage, cardPage, pageSize]);

	return {
		tableEmployees,
		cardEmployees,
		loading,
		loadingMore,
		pagination,
		error,
	};
}
