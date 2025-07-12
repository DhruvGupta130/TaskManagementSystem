import React from 'react';
import { Navigate } from 'react-router-dom';
import {useSelector} from "react-redux";

const PrivateRoute = ({ children, allowedRoles }) => {
    const { token, userRole } = useSelector(state => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute;