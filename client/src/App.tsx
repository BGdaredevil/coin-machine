import { ReactNode } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material";
import router from "./router/AppRouter";
import theme from "./config/MUITheme";
import "./App.css";

function App(): ReactNode {
    return (
        <>
            <ThemeProvider theme={theme}>
                {/* error boundary */}
                <ToastContainer />
                <RouterProvider router={router} fallbackElement={<div>pesho fell over... todo some screen goes here</div>} />
            </ThemeProvider>
        </>
    );
}

export default App;
