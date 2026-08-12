/**
 * @fileoverview Guards private routes using authentication context state. It shows initialization feedback while the session is restored, redirects anonymous users to login while preserving their requested location, and renders authorized children.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/ProtectedRoute
 */
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

/**
 * Renders the protected route interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {React.ReactNode} props.children - Nested content rendered inside the component.
 * @returns {JSX.Element} Rendered React user interface.
 */
const ProtectedRoute = ({ children }) => {
	const { user } = useSelector((state) => state.auth);

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children || <Outlet />;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node,
};

export default ProtectedRoute;
