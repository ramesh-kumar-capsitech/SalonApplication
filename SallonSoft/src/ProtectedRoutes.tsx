import React from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "./redux/hooks";

const ProtectedRoutes = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const token = useAppSelector(
        (state) => state.auth.token
    );

    console.log("TOKEN:", token);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoutes; 