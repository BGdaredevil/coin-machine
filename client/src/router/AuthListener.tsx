import { FC, PropsWithChildren, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import cookies from "../utils/cookies";

const parseJwt = (token?: string) => {
    if (!token) {
        return null;
    }

    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

const AuthListener: FC<PropsWithChildren> = ({ children }) => {
    const location = useLocation();
    const { isAuth, logout } = useContext(AuthContext);

    useEffect(() => {
        const AUTH_COOKIE_TOKEN_KEY = "my-token";

        const token = parseJwt(cookies.get(AUTH_COOKIE_TOKEN_KEY));

        if (token?.exp * 1000 >= Date.now()) {
            return;
        }

        if (!isAuth) {
            return;
        }

        logout();
    }, [location, isAuth, logout]);

    return children;
};

export default AuthListener;
