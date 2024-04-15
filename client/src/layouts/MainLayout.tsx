import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Nav from "./Nav";
import { Box } from "@mui/material";

const MainLayout: FC = () => {
    return (
        <Box style={{ border: "1px solid red", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                <ToastContainer />
                <Nav />
            </Box>
            <Outlet />
        </Box>
    );
};

export default MainLayout;
