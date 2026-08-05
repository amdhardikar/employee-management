import PropTypes from "prop-types";

export const Card = ({ children, className = "" }) => (
	<div
		className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${className}`}
	>
		{children}
	</div>
);

export const CardHeader = ({ children, className = "" }) => (
	<div className={`flex items-start justify-between ${className}`}>
		{children}
	</div>
);

export const CardTitle = ({ children, className = "" }) => (
	<h3 className={`font-semibold text-slate-700 ${className}`}>{children}</h3>
);

export const CardSubtitle = ({ children, className = "" }) => (
	<p className={`text-xs text-slate-500 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = "" }) => (
	<div className={`mt-4 ${className}`}>{children}</div>
);

export const CardGrid = ({
	children,
	className = "",
	columns = "grid-cols-2",
}) => (
	<div className={`grid ${columns} gap-3 text-sm ${className}`}>
		{children}
	</div>
);

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
				<span className={`text-slate-500 ${labelClassName}`}>
					{label}
				</span>
				<span className={`text-right font-medium ${valueClassName}`}>
					{value ?? children}
				</span>
			</div>
		);
	}
	return (
		<div className={className}>
			{label ? (
				<>
					<p className={`text-slate-500 ${labelClassName}`}>
						{label}
					</p>
					<div className={`font-medium ${valueClassName}`}>
						{value}
					</div>
				</>
			) : (
				children
			)}
		</div>
	);
};

export const CardFooter = ({ children, className = "" }) => (
	<div className={`mt-4 ${className}`}>{children}</div>
);

export const CardAction = ({ children, onClick, className = "" }) => (
	<button
		onClick={onClick}
		className={`rounded-md border border-slate-200 p-2 transition-colors hover:bg-slate-50 ${className}`}
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
};
