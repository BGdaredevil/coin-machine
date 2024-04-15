import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ThemeContextProvider from "./contexts/ThemeToggle.tsx";
import "./index.css";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeContextProvider>
                <App />
            </ThemeContextProvider>
        </StyledEngineProvider>
    </React.StrictMode>
);
