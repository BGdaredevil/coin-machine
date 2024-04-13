import { FC, useContext } from "react";
import { AuthContext } from "../contexts/Auth";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../config/appEnums";

const PrivateRoute: FC = () => {
    const { isAuth } = useContext(AuthContext);

    if (!isAuth) {
        return <Navigate to={PublicRoutes.LOGIN} />;
    }

    return <Outlet />;
};

export default PrivateRoute;
