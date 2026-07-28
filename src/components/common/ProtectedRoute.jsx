import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
	const { user } = useSelector((state) => state.auth);

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children || <Outlet />;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node,
	allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
