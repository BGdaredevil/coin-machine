import { FC, useContext, useRef, useState } from "react";
import { AuthContext } from "../contexts/Auth";
import { PrivateRoutes, PublicRoutes } from "../config/appEnums";
import { AppBar, Button, Container, IconButton, Link, Menu, MenuItem, Toolbar, Typography, styled, useMediaQuery } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";

import { ThemeContext } from "../contexts/ThemeToggle";
import { NavLink, useNavigate } from "react-router-dom";

const guestRoutes = [
    { to: PublicRoutes.LOGIN, name: "login" },
    { to: PublicRoutes.REGISTER, name: "register" },
];
const userRoutes = [
    { name: "my products", to: `${PrivateRoutes.PRODUCT}` },
    { name: "add product", to: `${PrivateRoutes.PRODUCT}${PrivateRoutes.CREATE}` },
    { name: "my machines", to: `${PrivateRoutes.MACHINE}` },
    { name: "add machine", to: `${PrivateRoutes.MACHINE}${PrivateRoutes.CREATE}` },
    { name: "logout", to: PublicRoutes.BASE_PATH },
];

const Nav: FC = () => {
    const smallScreen = useMediaQuery("(max-width:740px)");
    const navigate = useNavigate();

    const { theme, toggleMode } = useContext(ThemeContext);
    const { isAuth, logout } = useContext(AuthContext);

    const menuAnchor = useRef<HTMLButtonElement>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const closeMenu = (route: string) => {
        setOpenMenu(false);
        navigate(route);
    };

    const menuLogout = () => {
        closeMenu(PublicRoutes.BASE_PATH);
        logout();
    };

    return (
        <AppBar position="static" color="secondary">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    {smallScreen && (
                        <IconButton
                            ref={menuAnchor}
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={() => setOpenMenu(true)}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    {smallScreen ? (
                        <Menu anchorEl={menuAnchor.current} open={openMenu} onClose={() => setOpenMenu(false)}>
                            <MenuItem color="inherit" onClick={() => closeMenu(PublicRoutes.BASE_PATH)}>
                                <Typography style={{ color: "inherit", marginRight: "10px" }} textTransform="uppercase" variant="body1">
                                    home
                                </Typography>
                            </MenuItem>
                            {isAuth
                                ? userRoutes.map((e) => (
                                      <MenuItem
                                          key={e.name + e.to}
                                          color="inherit"
                                          href={e.to}
                                          onClick={e.name === "logout" ? menuLogout : () => closeMenu(e.to)}
                                      >
                                          <NavLink style={{ textDecoration: "none", color: "inherit", marginRight: "10px" }} to={e.to}>
                                              <Typography textTransform="uppercase" variant="body1">
                                                  {e.name}
                                              </Typography>
                                          </NavLink>
                                      </MenuItem>
                                  ))
                                : guestRoutes.map((e) => (
                                      <MenuItem key={e.name + e.to} color="inherit" onClick={() => closeMenu(e.to)}>
                                          <NavLink style={{ textDecoration: "none", color: "inherit", marginRight: "10px" }} to={e.to}>
                                              <Typography textTransform="uppercase" variant="body1">
                                                  {e.name}
                                              </Typography>
                                          </NavLink>
                                      </MenuItem>
                                  ))}
                        </Menu>
                    ) : (
                        <>
                            <NavLink style={{ textDecoration: "none", color: "inherit", marginRight: "10px" }} to={PublicRoutes.BASE_PATH}>
                                <Typography color="inherit" textTransform="uppercase" variant="body2">
                                    home
                                </Typography>
                            </NavLink>
                            {isAuth
                                ? userRoutes.map((e) => (
                                      <NavLink
                                          key={e.name + e.to}
                                          style={{ textDecoration: "none", color: "inherit", marginRight: "10px" }}
                                          to={e.to}
                                          onClick={e.name === "logout" ? logout : undefined}
                                      >
                                          <Typography color="inherit" textTransform="uppercase" variant="body2">
                                              {e.name}
                                          </Typography>
                                      </NavLink>
                                  ))
                                : guestRoutes.map((e) => (
                                      <NavLink
                                          key={e.name + e.to}
                                          style={{ textDecoration: "none", color: "inherit", marginRight: "10px" }}
                                          to={e.to}
                                      >
                                          <Typography color="inherit" textTransform="uppercase" variant="body2">
                                              {e.name}
                                          </Typography>
                                      </NavLink>
                                  ))}
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
