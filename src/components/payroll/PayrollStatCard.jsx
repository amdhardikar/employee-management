import PropTypes from "prop-types";

const PayrollStatCard = ({ title, value }) => {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-slate-500">{title}</p>

					<h3 className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">{value}</h3>
				</div>
			</div>
		</div>
	);
};

PayrollStatCard.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PayrollStatCard;
