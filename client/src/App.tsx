import { ReactNode, useContext } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CssBaseline, ThemeProvider } from "@mui/material";
import router from "./router/AppRouter";
import AuthContextProvider from "./contexts/Auth";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import { ThemeContext } from "./contexts/ThemeToggle";
import "react-toastify/dist/ReactToastify.css";

function App(): ReactNode {
    const { theme } = useContext(ThemeContext);

    return (
        <ThemeProvider theme={theme}>
            <ErrorBoundary>
                <AuthContextProvider>
                    <CssBaseline enableColorScheme />
                    <ToastContainer />
                    <RouterProvider router={router} fallbackElement={<div>pesho fell over... todo some screen goes here</div>} />
                </AuthContextProvider>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
