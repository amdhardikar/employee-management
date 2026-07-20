export const Table = ({ children }) => (
	<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
		<table className="min-w-full divide-y divide-slate-200">{children}</table>
	</div>
);

export const TableHead = ({ children }) => (
	<thead className="bg-slate-50">{children}</thead>
);

export const TableBody = ({ children }) => (
	<tbody className="divide-y divide-slate-200">{children}</tbody>
);

export const TableRow = ({ children, className = "" }) => (
	<tr className={`hover:bg-slate-50 transition-colors ${className}`}>
		{children}
	</tr>
);

export const TableHeader = ({ children, className = "" }) => (
	<th
		className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-900 ${className}`}
	>
		{children}
	</th>
);

export const TableCell = ({ children, className = "" }) => (
	<td className={`px-4 py-3 text-base text-slate-700 ${className}`}>
		{children}
	</td>
);
