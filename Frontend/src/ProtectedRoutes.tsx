import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";

const ProtectedRoutes = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const auth = useAppSelector(
        (state) => state.auth
    );

    console.log(auth);

    if (
        auth.isAuthenticated === false ||
        !auth.token
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoutes;