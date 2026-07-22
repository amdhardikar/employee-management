import { useContext } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { user, loading } = useContext(AuthContext);
	const location = useLocation();

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-slate-50">
				<div className="w-10 h-10 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (allowedRoles && !allowedRoles.includes(user.role)) {
		return <Navigate to="/unauthorized" replace />;
	}

	return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node,
	allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
