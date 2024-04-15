import { FC, useContext } from "react";
import { AuthContext } from "../contexts/Auth";
import { PrivateRoutes, PublicRoutes } from "../config/appEnums";
import { NavLink } from "react-router-dom";

interface NavProps {}

const Nav: FC<NavProps> = () => {
    const { isAuth, logout } = useContext(AuthContext);

    return (
        <>
            <NavLink to={PublicRoutes.BASE_PATH}>
                <p style={{ margin: 0 }}>home</p>
            </NavLink>
            {isAuth ? (
                <>
                    <NavLink to={`${PrivateRoutes.PRODUCT}`}>
                        <p style={{ margin: 0 }}>my products</p>
                    </NavLink>
                    <NavLink to={`${PrivateRoutes.PRODUCT}${PrivateRoutes.CREATE}`}>
                        <p style={{ margin: 0 }}>add product</p>
                    </NavLink>
                    <NavLink to={`${PrivateRoutes.MACHINE}`}>
                        <p style={{ margin: 0 }}>my machines</p>
                    </NavLink>
                    <NavLink to={`${PrivateRoutes.MACHINE}${PrivateRoutes.CREATE}`}>
                        <p style={{ margin: 0 }}>add machine</p>
                    </NavLink>
                    <NavLink to={PublicRoutes.BASE_PATH} onClick={logout}>
                        <p style={{ margin: 0 }}>logout</p>
                    </NavLink>
                </>
            ) : (
                <>
                    <NavLink to={PublicRoutes.LOGIN}>
                        <p style={{ margin: 0 }}>login</p>
                    </NavLink>
                    <NavLink to={PublicRoutes.REGISTER}>
                        <p style={{ margin: 0 }}>register</p>
                    </NavLink>
                </>
            )}
        </>
    );
};

export default Nav;
