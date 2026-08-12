/**
 * @fileoverview Displays one dashboard metric with its label and icon in a consistent summary-card layout.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/StatCard
 */
import PropTypes from "prop-types";

/**
 * Renders the stat card interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {string} props.label - Human-readable field or metric label.
 * @param {*} props.value - Value to render, format, debounce, or edit.
 * @param {*} props.icon - The icon value required by this operation.
 * @returns {JSX.Element} Rendered React user interface.
 */
const StatCard = ({ label, value, icon, className = "" }) => {
	return icon ? (
		<div className={`mobile-stats flex min-w-0 items-center justify-center gap-2 rounded-md bg-slate-50 py-2 ${className}`}>
			{icon}
			<span className="sr-only">{label}</span>
			<span className="wrap-break-words text-sm font-medium text-slate-900">{value}</span>
		</div>
	) : (
		<div className={`desktop-stats min-w-0 px-6 py-4 ${className}`}>
			<div className="text-sm text-slate-500">{label}</div>
			<div className="font-semibold text-2xl">{value}</div>
		</div>
	);
};

StatCard.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	icon: PropTypes.node,
	className: PropTypes.string,
};

export default StatCard;
