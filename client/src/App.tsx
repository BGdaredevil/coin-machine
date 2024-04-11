import { ReactNode, useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, createTheme } from "@mui/material";
import router from "./router/AppRouter";
import themeConfig from "./config/MUITheme";
import "./App.css";

function App(): ReactNode {
    const theme = useMemo(() => {
        return createTheme(themeConfig);
    }, []);

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
