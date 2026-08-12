/**
 * @fileoverview Renders department edit table data in the desktop table presentation. It defines the domain-specific columns, formats status and values consistently, and invokes supplied view/edit/delete callbacks without owning navigation or server state.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/department/DepartmentEditTable
 */
import { Save, Trash, X } from "lucide-react";
import PropTypes from "prop-types";
import { STATUS_COLORS } from "../../constants/EMSconstants";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../common/DataTable";
import { NavLink } from "react-router-dom";
import { display } from "../../utils/formatter";

/**
 * Renders the department edit table interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {*} props.designations - The designations value required by this operation.
 * @param {Object[]} props.employees - Employee records to display or summarize.
 * @param {*} props.newRows - The new rows value required by this operation.
 * @param {Function} props.setNewRows - The set new rows value required by this operation.
 * @param {Function} props.onSaveEmployee - The on save employee value required by this operation.
 * @param {Function} props.onRemoveEmployee - The on remove employee value required by this operation.
 * @param {Function} props.onCancelRow - The on cancel row value required by this operation.
 * @returns {JSX.Element} Rendered React user interface.
 */
const DepartmentEditTable = ({
	designations,
	employees,
	newRows,
	setNewRows,
	onSaveEmployee,
	onRemoveEmployee,
	onCancelRow,
}) => {
	return (
		<>
			<div className="space-y-4 lg:hidden">
				{newRows.map((row) => (
					<section key={row.id} className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 shadow-sm">
						<h3 className="mb-4 font-semibold text-slate-900">Add employee</h3>
						<div className="space-y-4">
							<label className="block">
								<span className="mb-1.5 block text-sm font-medium text-slate-700">Employee code</span>
								<input
									value={row.employeeId}
									className={`h-11 w-full rounded-sm border bg-white px-3 text-sm outline-none ${row.error ? "border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
									onChange={(event) =>
										setNewRows((currentRows) =>
											currentRows.map((currentRow) =>
												currentRow.id === row.id
													? {
															...currentRow,
															employeeId: event.target.value.toUpperCase(),
															error: "",
														}
													: currentRow,
											),
										)
									}
									placeholder="EMP001"
								/>
								{row.error && <span className="mt-1 block text-sm text-red-600">{row.error}</span>}
							</label>

							<label className="block">
								<span className="mb-1.5 block text-sm font-medium text-slate-700">Designation</span>
								<select
									value={row.designationId}
									className={`h-11 w-full rounded-sm border bg-white px-3 text-sm outline-none ${row.designationError ? "border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
									onChange={(event) =>
										setNewRows((currentRows) =>
											currentRows.map((currentRow) =>
												currentRow.id === row.id
													? {
															...currentRow,
															designationId: event.target.value,
															designationError: event.target.value
																? ""
																: "Designation is required",
														}
													: currentRow,
											),
										)
									}
								>
									<option value="">Select Designation</option>
									{designations.map((designation) => (
										<option key={designation.id} value={designation.designationId}>
											{designation.name}
										</option>
									))}
								</select>
								{row.designationError && (
									<span className="mt-1 block text-sm text-red-600">{row.designationError}</span>
								)}
							</label>

							{row.loading && <p className="text-sm text-blue-700">Saving employee...</p>}
							<div className="grid grid-cols-2 gap-3">
								<button
									type="button"
									onClick={() => onCancelRow(row.id)}
									disabled={row.loading}
									className="rounded-sm border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={() => onSaveEmployee(row)}
									disabled={row.loading || !row.employeeId || !row.designationId}
									className="rounded-sm bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
								>
									{row.loading ? "Saving..." : "Save"}
								</button>
							</div>
						</div>
					</section>
				))}

				{employees.map((employee) => (
					<section key={employee.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0">
								<NavLink
									className="font-semibold text-blue-700 hover:underline"
									to={`/employees/${employee.employeeId}`}
								>
									{display(employee.fullName)}
								</NavLink>
								<p className="mt-1 text-xs text-slate-500">{display(employee.employeeId)} | {display(employee.employeeCode)}</p>
							</div>
							<span
								className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[employee.employment?.status] || "bg-slate-100 text-slate-700"}`}
							>
								{employee.employment?.status}
							</span>
						</div>
						<dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-sm md:grid-cols-2">
							<div className="flex justify-between gap-3">
								<dt className="text-slate-500">Designation</dt>
								<dd className="text-right font-medium break-words text-slate-800">
									{display(employee.employment?.designation)}
								</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt className="text-slate-500">Type</dt>
								<dd className="text-right font-medium text-slate-800">
									{display(employee.employment?.employeeType)}
								</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt className="text-slate-500">Location</dt>
								<dd className="text-right font-medium break-words text-slate-800">
									{display(employee.employment?.workLocation)}
								</dd>
							</div>
							<div className="flex justify-between gap-3">
								<dt className="text-slate-500">Manager</dt>
								<dd className="text-right font-medium break-words text-slate-800">
									{display(employee.employment?.manager?.name)}
								</dd>
							</div>
						</dl>
						<button
							type="button"
							onClick={() => onRemoveEmployee(employee)}
							className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm border border-red-200 px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
						>
							<Trash className="h-4 w-4" />
							Remove employee
						</button>
					</section>
				))}
			</div>

			<div className="hidden overflow-x-auto lg:block">
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader className="text-left">Employee</TableHeader>
							<TableHeader className="text-left">Designation</TableHeader>
							<TableHeader className="text-left">Type</TableHeader>
							<TableHeader className="text-left">Location</TableHeader>
							<TableHeader className="text-left">Manager</TableHeader>
							<TableHeader className="text-left">Status</TableHeader>
							<TableHeader className="text-center">Action</TableHeader>
						</TableRow>
					</TableHead>

					<TableBody>
						{newRows.map((row) => (
							<TableRow
								key={row.id}
								className={
									row.error || row.designationError || row.loading ? "align-top" : "align-middle"
								}
							>
								<TableCell>
									<input
										value={row.employeeId}
										className={`h-10 w-full rounded-sm border px-3 text-sm outline-none ${
											row.error
												? "border-red-500 focus:ring-4 focus:ring-red-100"
												: "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
										}`}
										onChange={(e) => {
											setNewRows((prev) =>
												prev.map((r) =>
													r.id === row.id
														? {
																...r,
																employeeId: e.target.value.toUpperCase(),
																error: "",
															}
														: r,
												),
											);
										}}
										placeholder="EMP001"
									/>
									<div>
										{row.error && <p className="mt-2 text-sm text-red-500">{row.error}</p>}
										{row.loading && (
											<p className="mt-2 text-sm text-blue-500">Saving employee...</p>
										)}
									</div>
								</TableCell>
								<TableCell colSpan={2}>
									<select
										value={row.designationId}
										className={`h-10 w-full rounded-sm border px-3 text-sm outline-none ${
											row.designationError
												? "border-red-500 focus:ring-4 focus:ring-red-100"
												: "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
										}`}
										onChange={(e) =>
											setNewRows((prev) =>
												prev.map((r) =>
													r.id === row.id
														? {
																...r,
																designationId: e.target.value,
																designationError:
																	e.target.value === ""
																		? "Designation is required"
																		: "",
															}
														: r,
												),
											)
										}
									>
										<option value="">Select Designation</option>
										{designations.map((d) => (
											<option key={d.id} value={d.designationId}>
												{d.name}
											</option>
										))}
									</select>
									<div>
										{row.designationError && (
											<p className="mt-1 text-sm text-red-500">{row.designationError}</p>
										)}
									</div>
								</TableCell>
								<TableCell colSpan={3} />
								<TableCell className="text-center">
									<div className="flex justify-center gap-2">
										<button
											onClick={() => onSaveEmployee(row)}
											disabled={row.loading || !row.employeeId || !row.designationId}
											className="rounded-md border border-blue-200 p-2 text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
										>
											{row.loading ? (
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
											) : (
												<Save className="h-4 w-4" />
											)}
										</button>
										<button
											onClick={() => onCancelRow(row.id)}
											disabled={row.loading}
											className="rounded-md border border-red-200 p-2 text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								</TableCell>
							</TableRow>
						))}
						{employees.map((employee) => (
							<TableRow key={employee.id}>
								<TableCell>
									<NavLink className="cursor-pointer font-medium text-blue-700 hover:underline" to={`/employees/${employee.employeeId}`}>
										{display(employee.fullName)}
									</NavLink>
									<p className="mt-1 text-xs text-slate-500">{display(employee.employeeId)} | {display(employee.employeeCode)}</p>
								</TableCell>
								<TableCell>{display(employee.employment?.designation)}</TableCell>
								<TableCell>{display(employee.employment?.employeeType)}</TableCell>
								<TableCell>{display(employee.employment?.workLocation)}</TableCell>
								<TableCell>{display(employee.employment?.manager?.name)}</TableCell>
								<TableCell>
									<span
										className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
											STATUS_COLORS[employee.employment?.status] || "bg-slate-100 text-slate-700"
										}`}
									>
										{employee.employment?.status}
									</span>
								</TableCell>
								<TableCell className="text-center">
									<button
										onClick={() => onRemoveEmployee(employee)}
									className="rounded-md border border-red-200 p-2 text-red-700 transition-colors hover:bg-red-50"
									>
										<Trash className="h-4 w-4" />
									</button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
};

DepartmentEditTable.propTypes = {
	designations: PropTypes.array.isRequired,
	employees: PropTypes.array.isRequired,
	newRows: PropTypes.array.isRequired,
	setNewRows: PropTypes.func.isRequired,
	onSaveEmployee: PropTypes.func.isRequired,
	onRemoveEmployee: PropTypes.func.isRequired,
	onCancelRow: PropTypes.func.isRequired,
};

export default DepartmentEditTable;
