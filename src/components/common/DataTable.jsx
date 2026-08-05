import PropTypes from "prop-types";

export const Table = ({ children }) => (
	<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
		<table className="min-w-full divide-y divide-slate-200">{children}</table>
	</div>
);

export const TableHead = ({ children }) => <thead className="bg-slate-50">{children}</thead>;

export const TableBody = ({ children }) => <tbody className="divide-y divide-slate-200">{children}</tbody>;

export const TableRow = ({ children, className = "" }) => (
	<tr className={`transition-colors hover:bg-slate-50 ${className}`}>{children}</tr>
);

export const TableHeader = ({ children, className = "" }) => (
	<th
		className={`px-4 py-3 text-[11px] font-semibold tracking-wider text-slate-900 uppercase md:text-xs ${className}`}
	>
		{children}
	</th>
);

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
	children: PropTypes.node,
	className: PropTypes.string,
};
