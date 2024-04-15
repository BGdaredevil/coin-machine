import { FC, useContext } from "react";
import { AuthContext } from "../contexts/Auth";
import { PrivateRoutes, PublicRoutes } from "../config/appEnums";
import { AppBar, Button, Container, IconButton, Toolbar, Typography, styled, useMediaQuery } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";

import { ThemeContext } from "../contexts/ThemeToggle";

const StyledNavBtn = styled(Button)(() => ({
    marginRight: "10px",
    "@media(max-width: 800px)": {
        marginRight: "0px",
    },
}));

const Nav: FC = () => {
    const { theme, toggleMode } = useContext(ThemeContext);
    const { isAuth, logout } = useContext(AuthContext);
    const smallScreen = useMediaQuery("(max-width:740px)");

    return (
        <AppBar position="static" color="secondary">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        // onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>

                    <StyledNavBtn variant="text" color="inherit" href={PublicRoutes.BASE_PATH}>
                        <Typography variant="body2">home</Typography>
                    </StyledNavBtn>
                    {isAuth ? (
                        <>
                            <StyledNavBtn variant="text" color="inherit" href={`${PrivateRoutes.PRODUCT}`}>
                                <Typography variant="body2">my products</Typography>
                            </StyledNavBtn>
                            <StyledNavBtn variant="text" color="inherit" href={`${PrivateRoutes.PRODUCT}${PrivateRoutes.CREATE}`}>
                                <Typography variant="body2">add product</Typography>
                            </StyledNavBtn>
                            <StyledNavBtn variant="text" color="inherit" href={`${PrivateRoutes.MACHINE}`}>
                                <Typography variant="body2">my machines</Typography>
                            </StyledNavBtn>
                            <StyledNavBtn variant="text" color="inherit" href={`${PrivateRoutes.MACHINE}${PrivateRoutes.CREATE}`}>
                                <Typography variant="body2">add machine</Typography>
                            </StyledNavBtn>
                            <StyledNavBtn variant="text" color="inherit" href={PublicRoutes.BASE_PATH} onClick={logout}>
                                <Typography variant="body2">logout</Typography>
                            </StyledNavBtn>
                        </>
                    ) : (
                        <>
                            <StyledNavBtn variant="text" color="inherit" href={PublicRoutes.LOGIN}>
                                <Typography variant="body2">login</Typography>
                            </StyledNavBtn>
                            <StyledNavBtn variant="text" color="inherit" href={PublicRoutes.REGISTER}>
                                <Typography variant="body2">register</Typography>
                            </StyledNavBtn>
                        </>
                    )}
                    <IconButton onClick={toggleMode} sx={{ marginLeft: "auto" }}>
                        {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Nav;
