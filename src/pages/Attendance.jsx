import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { employeeApi } from "../api/employeeApi";

import Filters from "../components/common/Filters";
import PageLoader from "../components/common/PageLoader";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import AttendanceTable from "../components/attendance/AttendanceTable";
import AttendanceCard from "../components/attendance/AttendanceCard";
import { setFilters } from "../store/filterSlice";

import useDebounce from "../hooks/useDebounce";
import useMediaQuery from "../hooks/useMediaQuery";
import useEmployeeListing from "../hooks/useEmployeeListing";
import useDepartments from "../hooks/useDepartments";
import useFilters from "../hooks/useFilters";
import ErrorState from "../components/common/ErrorState";

const Attendance = () => {
	const tableRef = useRef(null);
	const searchRef = useRef(null);
	const restoreFocus = useRef(false);
	const dispatch = useDispatch();

	const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments();
	const query = useSelector((state) => state.filters.attendance);
	const navigate = useNavigate();
	const debouncedSearch = useDebounce(query.search, 500);
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const fetchEmployees = useCallback(
		async (page, pageSize) => {
			return employeeApi.getEmployees({
				page,
				pageSize,
				search: debouncedSearch,
				department: query.department,
			});
		},
		[debouncedSearch, query.department],
	);

	const { tableEmployees, cardEmployees, loading, loadingMore, pagination, error } = useEmployeeListing({
		fetchEmployees,
		isDesktop,
		tablePage: query.tablePage,
		cardPage: query.cardPage,
		pageSize: query.pageSize,
	});

	useEffect(() => {
		if (!loading && restoreFocus.current) {
			searchRef.current?.focus();
		}
	}, [loading]);

	const { onSearchChangeHandler, onDepartmentChangeHandler, onPageChangeHandler, onPageSizeChangeHandler } =
		useFilters({
			module: "attendance",
			tableRef,
		});

	const onViewHandler = (employee) => {
		navigate(`/attendance/${employee.employeeId}`);
	};

	const hasTableData = tableEmployees.length > 0;
	const hasCardData = cardEmployees.length > 0;

	if (loading || departmentsLoading) {
		return <PageLoader text="Loading attendance..." />;
	}

	if (error || departmentsError) {
		return (
			<ErrorState
				title="Unable to load attendance"
				message={`Reason : ${error?.message || departmentsError?.message || "Something went wrong while loading attendance"}`}
			/>
		);
	}

	return (
		<>
			<div className="sticky top-0 z-10 bg-slate-50 shadow-sm">
				<Filters
					searchRef={searchRef}
					search={query.search}
					department={query.department}
					departments={departments}
					showSearch
					showDepartment
					showStatus={false}
					onSearchChange={onSearchChangeHandler}
					onDepartmentChange={onDepartmentChangeHandler}
					onSearchFocus={() => (restoreFocus.current = true)}
					onSearchBlur={() => (restoreFocus.current = false)}
				/>
			</div>
			<div className="overflow-y-auto border-t border-slate-200 p-5">
				{hasTableData && (
					<div className="hidden lg:block">
						<AttendanceTable employees={tableEmployees} onView={onViewHandler} />
						<Pagination
							currentPage={query.tablePage}
							totalPages={pagination.totalPages}
							totalItems={pagination.totalItems}
							pageSize={query.pageSize}
							onPageSizeChange={onPageSizeChangeHandler}
							onPageChange={onPageChangeHandler}
						/>
					</div>
				)}
				{hasCardData && (
					<div className="grid gap-4 lg:hidden">
						{cardEmployees.map((employee) => (
							<AttendanceCard key={employee.employeeId} employee={employee} onView={onViewHandler} />
						))}
						{query.cardPage < pagination.totalPages && (
							<div className="flex justify-center">
								<button
									className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
									disabled={loadingMore}
									onClick={() =>
										dispatch(
											setFilters({
												module: "attendance",
												cardPage: query.cardPage + 1,
											}),
										)
									}
								>
									{loadingMore ? "Loading..." : "Load More"}
								</button>
							</div>
						)}
					</div>
				)}

				{!hasTableData && !hasCardData && <EmptyState />}
			</div>
		</>
	);
};
export default Attendance;
