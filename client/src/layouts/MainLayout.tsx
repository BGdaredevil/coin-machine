import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Nav from "./Nav";

interface MainLayoutProps {}

const MainLayout: FC<MainLayoutProps> = () => {
    return (
        <div style={{ border: "1px solid red", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                <ToastContainer />
                <Nav />
            </div>
            <Outlet />
        </div>
    );
};

export default MainLayout;
