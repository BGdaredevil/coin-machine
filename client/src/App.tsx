import { ReactNode, useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, createTheme } from "@mui/material";

import router from "./router/AppRouter";
import themeConfig from "./config/MUITheme";
import AuthContextProvider from "./contexts/Auth";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";

function App(): ReactNode {
    const theme = useMemo(() => {
        return createTheme(themeConfig);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <ErrorBoundary>
                <AuthContextProvider>
                    <ToastContainer />
                    <RouterProvider router={router} fallbackElement={<div>pesho fell over... todo some screen goes here</div>} />
                </AuthContextProvider>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
