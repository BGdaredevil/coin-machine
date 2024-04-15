import { FC, useContext } from "react";
import { AuthContext } from "../contexts/Auth";
import { PrivateRoutes, PublicRoutes } from "../config/appEnums";
import { NavLink } from "react-router-dom";
import { Typography } from "@mui/material";

const Nav: FC = () => {
    const { isAuth, logout } = useContext(AuthContext);

    return (
        <>
            <NavLink to={PublicRoutes.BASE_PATH}>
                <Typography variant="body1">home</Typography>
            </NavLink>
            {isAuth ? (
                <>
                    <NavLink to={`${PrivateRoutes.PRODUCT}`}>
                        <Typography variant="body1">my products</Typography>
                    </NavLink>
                    <NavLink to={`${PrivateRoutes.PRODUCT}${PrivateRoutes.CREATE}`}>
                        <Typography variant="body1">add product</Typography>
                    </NavLink>
                    <NavLink to={`${PrivateRoutes.MACHINE}`}>
                        <Typography variant="body1">my machines</Typography>
                    </NavLink>
                    <NavLink to={`${PrivateRoutes.MACHINE}${PrivateRoutes.CREATE}`}>
                        <Typography variant="body1">add machine</Typography>
                    </NavLink>
                    <NavLink to={PublicRoutes.BASE_PATH} onClick={logout}>
                        <Typography variant="body1">logout</Typography>
                    </NavLink>
                </>
            ) : (
                <>
                    <NavLink to={PublicRoutes.LOGIN}>
                        <Typography variant="body1">login</Typography>
                    </NavLink>
                    <NavLink to={PublicRoutes.REGISTER}>
                        <Typography variant="body1">register</Typography>
                    </NavLink>
                </>
            )}
        </>
    );
};

export default Nav;
