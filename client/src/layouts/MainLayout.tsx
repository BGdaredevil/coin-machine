import { FC } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../config/appEnums";
import { serverLogout } from "../services/authService";

interface MainLayoutProps {}

const MainLayout: FC<MainLayoutProps> = () => {
    return (
        <div
            style={{
                border: "1px solid red",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "20px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "20px",
                }}
            >
                <NavLink to={PublicRoutes.BASE_PATH}>
                    <p style={{ margin: 0 }}>home</p>
                </NavLink>
                <NavLink to={PublicRoutes.LOGIN}>
                    <p style={{ margin: 0 }}>login</p>
                </NavLink>
                <NavLink to={PublicRoutes.REGISTER}>
                    <p style={{ margin: 0 }}>register</p>
                </NavLink>
                <NavLink to={PrivateRoutes.ADMIN}>
                    <p style={{ margin: 0 }}>admin</p>
                </NavLink>
                <NavLink to={PublicRoutes.BASE_PATH} onClick={serverLogout}>
                    <p style={{ margin: 0 }}>logout</p>
                </NavLink>
            </div>
            <Outlet />
        </div>
    );
};

export default MainLayout;
