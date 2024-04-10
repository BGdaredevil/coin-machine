enum Routes {
    BASE_PATH = "/",
    LOGIN = "/login",
    REGISTER = "/register",
    ADMIN = "/admin",
}

export enum PublicRoutes {
    BASE_PATH = Routes.BASE_PATH,
    LOGIN = Routes.LOGIN,
    REGISTER = Routes.REGISTER,
}

export enum PrivateRoutes {
    ADMIN = Routes.ADMIN,
}
