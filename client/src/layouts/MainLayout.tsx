import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Nav from "./Nav";
import { Box } from "@mui/material";

const MainLayout: FC = () => {
    return (
        <>
            <Nav />
            <Box style={{ border: "1px solid red", maxWidth: "1200px", margin: "0 auto" }}>
                <ToastContainer />
                <Box padding="20px">
                    <Outlet />
                </Box>
            </Box>
        </>
    );
};

export default MainLayout;
