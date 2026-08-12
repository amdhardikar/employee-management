/**
 * @fileoverview Runs the employee directory experience. It combines debounced Redux filters with server pagination, switches between desktop table and mobile cards, restores search focus, supports view/edit/delete navigation, and renders loading, error, and empty states.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/pages/Employees
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { employeeApi } from "../api/employeeApi.js";

import Filters from "../components/common/Filters";
import PageLoader from "../components/common/PageLoader";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import ErrorState from "../components/common/ErrorState";
import EmployeeTable from "../components/employee/EmployeeTable";
import EmployeeCard from "../components/employee/EmployeeCard";
import Popup from "../components/common/Popup";

import { setFilters } from "../store/filterSlice.js";

import useDebounce from "../hooks/useDebounce";
import useMediaQuery from "../hooks/useMediaQuery";
import useEmployeeListing from "../hooks/useEmployeeListing";
import useDepartments from "../hooks/useDepartments";
import useFilters from "../hooks/useFilters";

/**
 * Renders the employees interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const Employees = () => {
	const statusList = ["Active", "On Leave", "Resigned"];

	const tableRef = useRef(null);
	const searchRef = useRef(null);
	const restoreFocus = useRef(false);
	const dispatch = useDispatch();
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState(null);

	const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments();
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

	const onViewHandler = useCallback((employee) => {
		navigate(`/employees/${employee.employeeId}`);
	}, [navigate]);

	const onEditHandler = useCallback((employee) => {
		navigate(`/employees/edit/${employee.employeeId}`);
	}, [navigate]);

	const onDeleteHandler = useCallback(async (employee) => {
		try {
			setDeleteError(null);
			setDeleting(true);
			await employeeApi.removeEmployee(employee.id);
			window.location.reload();
		} catch (error) {
			setDeleteError(error);
		} finally {
			setDeleting(false);
		}
	}, []);

	const hasTableData = tableEmployees.length > 0;
	const hasCardData = cardEmployees.length > 0;
	const hasActiveData = isDesktop ? hasTableData : hasCardData;

	if (loading || departmentsLoading) {
		return <PageLoader text="Loading employees..." />;
	}

	if (error || departmentsError) {
		return (
			<ErrorState
				title="Unable to load employees"
				message={`Reason : ${error?.message || departmentsError?.message || "Something went wrong while loading employees"}`}
			/>
		);
	}

	return (
		<>
			<Popup
				saving={deleting}
				error={deleteError}
				progressTitle="Deleting"
				savingMessage="Deleting employee..."
				errorTitle="Unable to delete employee"
				onClose={() => setDeleteError(null)}
			/>
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
			{hasActiveData && (
				<div className="overflow-y-auto border-t border-slate-200 p-5">
					{isDesktop && hasTableData && (
						<div ref={tableRef}>
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

					{!isDesktop && hasCardData && (
						<div className="grid gap-4">
							{cardEmployees.map((employee) => (
								<EmployeeCard
									key={employee.id}
									employee={employee}
									onView={onViewHandler}
									onEdit={onEditHandler}
									onDelete={onDeleteHandler}
								/>
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
			)}
			{!hasActiveData && <EmptyState />}
		</>
	);
};

export default Employees;
