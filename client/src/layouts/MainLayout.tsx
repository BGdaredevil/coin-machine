import { FC, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../config/appEnums";
import { AuthContext } from "../contexts/Auth";
import { ToastContainer } from "react-toastify";

interface MainLayoutProps {}

const MainLayout: FC<MainLayoutProps> = () => {
    const { isAuth, logout } = useContext(AuthContext);

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
                <ToastContainer />

                <NavLink to={PublicRoutes.BASE_PATH}>
                    <p style={{ margin: 0 }}>home</p>
                </NavLink>
                {isAuth ? (
                    <>
                        <NavLink to={PrivateRoutes.ADMIN}>
                            <p style={{ margin: 0 }}>admin</p>
                        </NavLink>
                        <NavLink to={`${PrivateRoutes.ADMIN}${PrivateRoutes.PRODUCT}`}>
                            <p style={{ margin: 0 }}>my products</p>
                        </NavLink>
                        <NavLink to={`${PrivateRoutes.ADMIN}${PrivateRoutes.PRODUCT}${PrivateRoutes.CREATE}`}>
                            <p style={{ margin: 0 }}>add product</p>
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
            </div>
            <Outlet />
        </div>
    );
};

export default MainLayout;
