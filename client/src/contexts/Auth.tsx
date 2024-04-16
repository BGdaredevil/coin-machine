import { FC, PropsWithChildren, createContext, useEffect, useMemo, useState } from "react";
import { IUserDto } from "../utils/commonTypes";
import { getUserData, loginUser, registerUser, serverLogout } from "../services/authService";
import cookies from "../utils/cookies";
import { isCancelledErrorProcessor } from "../services/apiService";
import { AUTH_COOKIE_KEY, AUTH_COOKIE_TOKEN_KEY } from "../config/appConstants";

interface IUser {
    id: string;
    email: string;
}

interface IAuthContext {
    user: IUser | null;
    login: (data: Omit<IUserDto, "repeatPassword">) => Promise<{ success: boolean }>;
    logout: () => Promise<{ success: boolean }>;
    register: (data: IUserDto) => Promise<{ success: boolean }>;
    isAuth: boolean;
}

export const AuthContext = createContext<IAuthContext>({
    user: null,
    login: () => Promise.resolve({ success: false }),
    logout: () => Promise.resolve({ success: false }),
    register: () => Promise.resolve({ success: false }),
    isAuth: false,
});

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);

    const register = async (data: IUserDto): Promise<{ success: boolean }> => {
        const response = await registerUser(data);

        setUser({ id: response.id, email: response.email });
        cookies.set(AUTH_COOKIE_KEY, response.id);
        cookies.set(AUTH_COOKIE_TOKEN_KEY, response.token);

        return { success: true };
    };

    const login = async (data: Omit<IUserDto, "repeatPassword">): Promise<{ success: boolean }> => {
        const response = await loginUser(data);

        setUser({ id: response.id, email: response.email });
        cookies.set(AUTH_COOKIE_KEY, response.id);
        cookies.set(AUTH_COOKIE_TOKEN_KEY, response.token);

        return { success: true };
    };

    const logout = async (): Promise<{ success: boolean }> => {
        try {
            await serverLogout();

            setUser(null);
            cookies.remove(AUTH_COOKIE_KEY);
            cookies.remove(AUTH_COOKIE_TOKEN_KEY);

            return { success: true };
        } catch (err: any) {
            setUser(null);
            cookies.remove(AUTH_COOKIE_KEY);
            cookies.remove(AUTH_COOKIE_TOKEN_KEY);

            return { success: false };
        }
    };

    const authContextValue = useMemo(
        () => ({
            user,
            login,
            logout,
            register,
            isAuth: Boolean(user) || !!cookies.get(AUTH_COOKIE_KEY),
        }),
        [user]
    );

    useEffect(() => {
        const personId = cookies.get(AUTH_COOKIE_KEY);

        if (personId) {
            const controller = new AbortController();
            getUserData(personId, { signal: controller.signal })
                .then((personData) => setUser({ id: personData.id, email: personData.email }))
                .catch(isCancelledErrorProcessor)
                .catch(() => {
                    setUser(null);
                    cookies.remove(AUTH_COOKIE_KEY);
                    cookies.remove(AUTH_COOKIE_TOKEN_KEY);
                });

            return () => controller.abort();
        }

        setUser(null);
    }, []);

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
