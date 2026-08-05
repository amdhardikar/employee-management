import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { employeeApi } from "../api/employeeApi.js";

import Filters from "../components/common/Filters";
import PageLoader from "../components/common/PageLoader";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import EmployeeTable from "../components/employee/EmployeeTable";
import EmployeeCard from "../components/employee/EmployeeCard";

import { setFilters } from "../store/filterSlice.js";

import useDebounce from "../hooks/useDebounce";
import useMediaQuery from "../hooks/useMediaQuery";
import useEmployeeListing from "../hooks/useEmployeeListing";
import useDepartments from "../hooks/useDepartments";
import useFilters from "../hooks/useFilters";

const Employees = () => {
	const statusList = ["Active", "On Leave", "Resigned"];

	const tableRef = useRef(null);
	const searchRef = useRef(null);
	const restoreFocus = useRef(false);
	const dispatch = useDispatch();

	const departments = useDepartments();
	const query = useSelector((state) => state.filters.employee);
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
				status: query.status,
			});
		},
		[debouncedSearch, query.department, query.status],
	);

	const { tableEmployees, cardEmployees, loading, loadingMore, pagination } = useEmployeeListing({
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

	const {
		onSearchChangeHandler,
		onDepartmentChangeHandler,
		onStatusChangeHandler,
		onPageChangeHandler,
		onPageSizeChangeHandler,
	} = useFilters({
		module: "employee",
		tableRef,
	});

	const onViewHandler = (employee) => {
		navigate(`/employees/${employee.employeeId}`);
	};

	const onEditHandler = (employee) => {
		navigate(`/employees/edit/${employee.employeeId}`);
	};

	const onDeleteHandler = async (employee) => {
		await employeeApi.removeEmployee(employee.id);
		window.location.reload();
	};

	const hasTableData = tableEmployees.length > 0;
	const hasCardData = cardEmployees.length > 0;

	if (loading) {
		return (
			<>
				<div className="sticky top-0 z-10 bg-white shadow-sm">
					<Filters
						searchRef={searchRef}
						search={query.search}
						department={query.department}
						status={query.status}
						statusList={statusList}
						departments={departments}
						showSearch
						showDepartment
						showStatus
						onSearchChange={onSearchChangeHandler}
						onDepartmentChange={onDepartmentChangeHandler}
						onStatusChange={onStatusChangeHandler}
						onSearchFocus={() => (restoreFocus.current = true)}
						onSearchBlur={() => (restoreFocus.current = false)}
						newButton={true}
					/>
				</div>

				<PageLoader text="Loading employees..." />
			</>
		);
	}

	return (
		<>
			<div className="sticky top-0 z-10 bg-white shadow-sm">
				<Filters
					searchRef={searchRef}
					search={query.search}
					department={query.department}
					status={query.status}
					statusList={statusList}
					departments={departments}
					showSearch
					showDepartment
					showStatus
					onSearchChange={onSearchChangeHandler}
					onDepartmentChange={onDepartmentChangeHandler}
					onStatusChange={onStatusChangeHandler}
					onSearchFocus={() => (restoreFocus.current = true)}
					onSearchBlur={() => (restoreFocus.current = false)}
					newButton={true}
				/>
			</div>

			<div className="overflow-y-auto border-t border-slate-200 p-5">
				{hasTableData && (
					<div className="hidden lg:block" ref={tableRef}>
						<EmployeeTable
							employees={tableEmployees}
							onView={onViewHandler}
							onEdit={onEditHandler}
							onDelete={onDeleteHandler}
						/>

						<Pagination
							currentPage={query.tablePage}
							totalPages={pagination.totalPages}
							totalItems={pagination.totalItems}
							pageSize={query.pageSize}
							onPageChange={onPageChangeHandler}
							onPageSizeChange={onPageSizeChangeHandler}
						/>
					</div>
				)}

				{hasCardData && (
					<div className="grid gap-4 lg:hidden">
						{cardEmployees.map((employee) => (
							<EmployeeCard key={employee.id} employee={employee} onView={onViewHandler} />
						))}

						{query.cardPage < pagination.totalPages && (
							<div className="flex justify-center">
								<button
									className="w-full px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
									disabled={loadingMore}
									onClick={() =>
										dispatch(
											setFilters({
												module: "employee",
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
			</div>
			{!hasTableData && !hasCardData && <EmptyState />}
		</>
	);
};

export default Employees;
