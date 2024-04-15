import { Theme, createTheme } from "@mui/material";
import { FC, PropsWithChildren, createContext, useMemo, useState } from "react";
import themeConfig from "../config/MUITheme";

enum Modes {
    LIGHT = "light",
    DARK = "dark",
}
interface IThemeContext {
    theme: Theme;
    toggleMode: () => void;
}

const toggleObject = {
    [Modes.DARK]: Modes.LIGHT,
    [Modes.LIGHT]: Modes.DARK,
};

export const ThemeContext = createContext<IThemeContext>({
    theme: createTheme(themeConfig),
    toggleMode: () => {},
});

const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => createTheme(themeConfig));

    const themeContextValue = useMemo(
        () => ({
            theme: theme,
            toggleMode: () => {
                setTheme(
                    createTheme({
                        ...themeConfig,
                        palette: { ...themeConfig.palette, mode: toggleObject[theme.palette!.mode!] },
                    })
                );
            },
        }),
        [theme]
    );

    return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeContextProvider;
