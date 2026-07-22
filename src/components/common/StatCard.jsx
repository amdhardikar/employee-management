import PropTypes from "prop-types";

const StatCard = ({ label, value, icon }) => {
	return (
		<>
         {icon &&
            <div className="mobile-stats flex items-center justify-center gap-1 rounded-md bg-slate-50 py-2">
               {icon}
               <span className="text-sm font-medium text-slate-900">
                  {value}
               </span>
            </div>
         }
         <div className={`desktop-stats px-6 py-4 ${icon ? "hidden" : "block"}`}>
				<div className="text-sm text-slate-500">{label}</div>
				<div className="text-2xl font-semibold">{value}</div>
			</div>
		</>
	);
};

StatCard.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	icon: PropTypes.node,
};

export default StatCard;
