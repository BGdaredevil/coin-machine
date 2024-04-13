import { FC, PropsWithChildren, createContext, useEffect, useMemo, useState } from "react";
import { IUserDto } from "../utils/commonTypes";
import { getUserData, loginUser, registerUser, serverLogout } from "../services/authService";
import { toastError } from "../utils/toast";
import cookies from "../utils/cookies";
import { isCancelledErrorProcessor } from "../services/apiService";

interface IUser {
    id: string;
    email: string;
}

interface IAuthContext {
    user: IUser | null;
    login: (data: Omit<IUserDto, "repeatPassword">) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: IUserDto) => Promise<void>;
    isAuth: boolean;
}

const AUTH_COOKIE_KEY = "my-id";

export const AuthContext = createContext<IAuthContext>({
    user: null,
    login: () => Promise.resolve(undefined),
    logout: () => Promise.resolve(undefined),
    register: () => Promise.resolve(undefined),
    isAuth: false,
});

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);

    const register = async (data: IUserDto): Promise<void> => {
        try {
            const response = await registerUser(data);

            setUser({ id: response.id, email: response.email });
            cookies.set(AUTH_COOKIE_KEY, response.id);
        } catch (err: any) {
            console.log(err);

            toastError("Sorry something went wrong");
        }
    };

    const login = async (data: Omit<IUserDto, "repeatPassword">): Promise<void> => {
        try {
            const response = await loginUser(data);

            setUser({ id: response.id, email: response.email });
            cookies.set(AUTH_COOKIE_KEY, response.id);
        } catch (err: any) {
            console.log(err);

            toastError("Sorry something went wrong");
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await serverLogout();

            setUser(null);
            cookies.remove(AUTH_COOKIE_KEY);
        } catch (err: any) {
            console.log(err);
            toastError("Sorry something went wrong");
        }
    };

    const authContextValue = useMemo(
        () => ({
            user,
            login,
            logout,
            register,
            isAuth: Boolean(user),
        }),
        [user]
    );

    useEffect(() => {
        const personId = cookies.get(AUTH_COOKIE_KEY);

        if (personId) {
            const controller = new AbortController();
            getUserData(personId, { signal: controller.signal })
                .then((personData) =>
                    setUser({
                        id: personData.id,
                        email: personData.email,
                    })
                )
                .catch(isCancelledErrorProcessor)
                .catch(() => {
                    setUser(null);
                    cookies.remove(AUTH_COOKIE_KEY);
                });

            return () => controller.abort();
        }
    }, []);

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
