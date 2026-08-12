/**
 * @fileoverview Exports composable card primitives used by detail screens. The module standardizes card containers, headings, responsive grids, labeled values, footers, and actions while allowing callers to supply content and styling extensions.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/InfoCard
 */
import PropTypes from "prop-types";

/**
 * Renders the card interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const Card = ({ children, className = "" }) => (
	<div className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${className}`}>{children}</div>
);

/**
 * Renders the card header interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const CardHeader = ({ children, className = "" }) => (
	<div className={`flex items-start justify-between ${className}`}>{children}</div>
);

/**
 * Renders the card title interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const CardTitle = ({ children, className = "" }) => (
	<h3 className={`font-semibold text-slate-700 ${className}`}>{children}</h3>
);

/**
 * Renders the card subtitle interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const CardSubtitle = ({ children, className = "" }) => (
	<p className={`text-xs text-slate-500 ${className}`}>{children}</p>
);

/**
 * Renders the card content interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const CardContent = ({ children, className = "" }) => <div className={`mt-4 ${className}`}>{children}</div>;

/**
 * Renders the card grid interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @param {*} props.columns - The columns value required by this operation.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const CardGrid = ({ children, className = "", columns = "grid-cols-2" }) => (
	<div className={`grid ${columns} gap-3 text-sm ${className}`}>{children}</div>
);

/**
 * Renders the card item interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.label - Human-readable field or metric label.
 * @param {*} props.value - Value to render, format, debounce, or edit.
 * @param {*} props.variant - The variant value required by this operation.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @param {*} props.labelClassName - The label class name value required by this operation.
 * @param {*} props.valueClassName - The value class name value required by this operation.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const CardItem = ({
	children,
	label,
	value,
	variant = "default",
	className = "",
	labelClassName = "",
	valueClassName = "",
}) => {
	if (variant === "horizontal") {
		return (
			<div className={`flex justify-between gap-3 ${className}`}>
				<span className={`text-slate-500 ${labelClassName}`}>{label}</span>
				<span className={`text-right font-medium ${valueClassName}`}>{value ?? children}</span>
			</div>
		);
	}
	return (
		<div className={className}>
			{label ? (
				<>
					<p className={`text-slate-500 ${labelClassName}`}>{label}</p>
					<div className={`font-medium ${valueClassName}`}>{value}</div>
				</>
			) : (
				children
			)}
		</div>
	);
};

/**
 * Renders the card footer interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const CardFooter = ({ children, className = "" }) => <div className={`mt-4 ${className}`}>{children}</div>;

/**
 * Renders the card action interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @param {Function} props.onClick - Called when the user activates the control.
 * @param {string} props.className - Optional CSS classes appended to the component defaults.
 * @param {string} props.ariaLabel - Accessible name describing the icon-only action.
 * @returns {JSX.Element} Rendered React user interface.
 */
export const CardAction = ({ children, onClick, className = "", ariaLabel }) => (
	<button
		type="button"
		onClick={onClick}
		aria-label={ariaLabel}
		title={ariaLabel}
		className={`cursor-pointer rounded-md border border-current/25 p-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed ${className}`}
	>
		{children}
	</button>
);

const commonProps = {
	children: PropTypes.node,
	className: PropTypes.string,
};

Card.propTypes = commonProps;
CardHeader.propTypes = commonProps;
CardTitle.propTypes = commonProps;
CardSubtitle.propTypes = commonProps;
CardContent.propTypes = commonProps;
CardFooter.propTypes = commonProps;

CardGrid.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	columns: PropTypes.string,
};

CardItem.propTypes = {
	children: PropTypes.node,
	label: PropTypes.node,
	value: PropTypes.node,
	variant: PropTypes.oneOf(["default", "horizontal"]),
	className: PropTypes.string,
	labelClassName: PropTypes.string,
	valueClassName: PropTypes.string,
};

CardAction.propTypes = {
	children: PropTypes.node,
	onClick: PropTypes.func,
	className: PropTypes.string,
	ariaLabel: PropTypes.string,
};
