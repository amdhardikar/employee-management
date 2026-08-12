/**
 * @fileoverview Exports small semantic table primitives with shared EMS styling. The wrappers standardize table, head, body, row, header, and cell markup while forwarding content and supported layout properties.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/DataTable
 */
import PropTypes from "prop-types";

/**
 * Renders the table interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const Table = ({ children }) => (
	<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
		<table className="min-w-full divide-y divide-slate-200">{children}</table>
	</div>
);

/**
 * Renders the table head interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const TableHead = ({ children }) => <thead className="bg-slate-50">{children}</thead>;

/**
 * Renders the table body interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const TableBody = ({ children }) => <tbody className="divide-y divide-slate-200">{children}</tbody>;

/**
 * Renders the table row interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const TableRow = ({ children, className = "" }) => (
	<tr className={`transition-colors hover:bg-slate-50 ${className}`}>{children}</tr>
);

/**
 * Renders the table header interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const TableHeader = ({ children, className = "" }) => (
	<th
		className={`px-4 py-3 text-[11px] font-semibold tracking-wider text-slate-900 uppercase md:text-xs ${className}`}
	>
		{children}
	</th>
);

/**
 * Renders the table cell interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {*} props.colSpan - The col span value required by this operation.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const TableCell = ({ colSpan, children, className = "" }) => (
	<td colSpan={colSpan} className={`px-3 py-3 text-xs text-slate-700 lg:px-4 lg:text-sm ${className}`}>
		{children}
	</td>
);

Table.propTypes = {
	children: PropTypes.node,
};

TableHead.propTypes = {
	children: PropTypes.node,
};

TableBody.propTypes = {
	children: PropTypes.node,
};

TableRow.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};

TableHeader.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};

TableCell.propTypes = {
	colSpan: PropTypes.number,
	children: PropTypes.node,
	className: PropTypes.string,
};
