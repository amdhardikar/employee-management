import { Save, Trash, X } from "lucide-react";
import PropTypes from "prop-types";
import { STATUS_COLORS } from "../../constants/EMSconstants";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../common/DataTable";
import { NavLink } from "react-router-dom";

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
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Employee Code</TableHeader>
					<TableHeader className="text-left">Name</TableHeader>
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
						className={row.error || row.designationError || row.loading ? "align-top" : "align-middle"}
					>
						<TableCell colSpan={2}>
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
								{row.loading && <p className="mt-2 text-sm text-blue-500">Saving employee...</p>}
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
															e.target.value === "" ? "Designation is required" : "",
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
									className="rounded-md border border-slate-200 p-2 hover:cursor-pointer hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
									className="rounded-md border border-slate-200 p-2 hover:cursor-pointer hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
							<NavLink to={`/employees/${employee.employeeId}`}>{employee.employeeId}</NavLink>
						</TableCell>
						<TableCell>{employee.fullName}</TableCell>
						<TableCell>{employee.employment.designation}</TableCell>
						<TableCell>{employee.employment.employeeType}</TableCell>
						<TableCell>{employee.employment.workLocation}</TableCell>
						<TableCell>{employee.employment.manager?.name}</TableCell>
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
								className="rounded-md border border-slate-200 p-2 hover:cursor-pointer hover:bg-red-100 hover:text-red-700"
							>
								<Trash className="h-4 w-4" />
							</button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
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
