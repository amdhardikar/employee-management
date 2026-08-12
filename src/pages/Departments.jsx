/**
 * @fileoverview Runs the department directory experience. It loads department and employee data, applies shared filters and responsive pagination, derives department summaries, and provides view/edit/delete/create navigation with loading, error, and empty states.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/pages/Departments
 */
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { employeeApi } from "../api/employeeApi";

import DepartmentTable from "../components/department/DepartmentTable";
import DepartmentCard from "../components/department/DepartmentCard";
import PageLoader from "../components/common/PageLoader";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Filters from "../components/common/Filters";
import Pagination from "../components/common/Pagination";
import Popup from "../components/common/Popup";
import { departmentApi } from "../api/departmentApi";
import useMediaQuery from "../hooks/useMediaQuery";
import useDebounce from "../hooks/useDebounce";
import useEmployeeListing from "../hooks/useEmployeeListing";
import useFilters from "../hooks/useFilters";
import { setFilters } from "../store/filterSlice";

/**
 * Renders the departments interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const Departments = () => {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState(null);
	const tableRef = useRef(null);
	const searchRef = useRef(null);
	const restoreFocus = useRef(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const query = useSelector((state) => state.filters.department);
	const debouncedSearch = useDebounce(query.search, 500);
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const fetchDepartments = useCallback(
		(page, pageSize) =>
			departmentApi.getDepartments({
				page,
				pageSize,
				search: debouncedSearch,
				sort: query.sort,
				order: query.order,
			}),
		[debouncedSearch, query.order, query.sort],
	);

	const {
		tableEmployees: tableDepartments,
		cardEmployees: cardDepartments,
		loading: departmentsLoading,
		loadingMore,
		pagination,
		error: departmentsError,
	} = useEmployeeListing({
		fetchEmployees: fetchDepartments,
		isDesktop,
		tablePage: query.tablePage,
		cardPage: query.cardPage,
		pageSize: query.pageSize,
	});

	const { onSearchChangeHandler, onPageChangeHandler, onPageSizeChangeHandler } = useFilters({
		module: "department",
		tableRef,
	});

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);

				const employeesData = await employeeApi.getAll();

				setEmployees(employeesData);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	useEffect(() => {
		if (!departmentsLoading && restoreFocus.current) searchRef.current?.focus();
	}, [departmentsLoading]);

	const handleViewDepartment = (department) => {
		navigate(`/departments/${department.departmentId}`);
	};

	const handleEditDepartment = (department) => {
		navigate(`/departments/edit/${department.departmentId}`);
	};

	const handleDeleteDepartment = async (department) => {
		try {
			setDeleteError(null);
			setDeleting(true);
			await departmentApi.removeDepartment(department.departmentId);
			window.location.reload();
		} catch (error) {
			setDeleteError(error);
		} finally {
			setDeleting(false);
		}
	};

	const handleNewDepartment = () => {
		navigate(`/departments/new`);
	};

	if (loading || departmentsLoading) {
		return <PageLoader text="Loading departments..." />;
	}

	if (error || departmentsError) {
		return (
			<ErrorState
				title="Unable to load depatments"
				message={`Reason : ${error?.message || departmentsError?.message || "Something went wrong while loading departments"}`}
			/>
		);
	}

	return (
		<>
			<Popup
				saving={deleting}
				error={deleteError}
				progressTitle="Deleting"
				savingMessage="Deleting department..."
				errorTitle="Unable to delete department"
				onClose={() => setDeleteError(null)}
			/>
			<div className="sticky top-0 z-10 bg-white shadow-sm">
				<Filters
					searchRef={searchRef}
					search={query.search}
					showSearch
					showDepartment={false}
					showStatus={false}
					onSearchChange={onSearchChangeHandler}
					onSearchFocus={() => (restoreFocus.current = true)}
					onSearchBlur={() => (restoreFocus.current = false)}
					searchPlaceholder="Search departments. . ."
					newButton={true}
					onNew={handleNewDepartment}
				/>
			</div>
			<div className="overflow-y-auto border-t border-slate-200 p-5">
				{(isDesktop ? tableDepartments : cardDepartments).length > 0 ? (
					<>
						{isDesktop ? (
						<div ref={tableRef}>
							<DepartmentTable
								departments={tableDepartments}
								employees={employees}
								onView={handleViewDepartment}
								onEdit={handleEditDepartment}
								onDelete={handleDeleteDepartment}
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
						) : (
						<div className="grid gap-4">
							{cardDepartments.map((department) => (
								<DepartmentCard
									key={department.departmentId}
									department={department}
									employees={employees}
									onView={handleViewDepartment}
									onEdit={handleEditDepartment}
									onDelete={handleDeleteDepartment}
								/>
							))}
							{query.cardPage < pagination.totalPages && (
								<button
									className="w-full px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
									disabled={loadingMore}
									onClick={() => dispatch(setFilters({ module: "department", cardPage: query.cardPage + 1 }))}
								>
									{loadingMore ? "Loading..." : "Load More"}
								</button>
							)}
						</div>
						)}
					</>
				) : (
					<EmptyState />
				)}
			</div>
		</>
	);
};

export default Departments;
