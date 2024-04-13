enum Routes {
    BASE_PATH = "/",
    LOGIN = "/login",
    REGISTER = "/register",
    ADMIN = "/admin",
    PRODUCT = "/product",
    MACHINE = "/machine",
    CREATE = "/create",
    EDIT = "/edit/:id",
    ID = "/:id",
}

export enum PublicRoutes {
    BASE_PATH = Routes.BASE_PATH,
    LOGIN = Routes.LOGIN,
    REGISTER = Routes.REGISTER,
}

export enum PrivateRoutes {
    ADMIN = Routes.ADMIN,
    PRODUCT = Routes.PRODUCT,
    MACHINE = Routes.MACHINE,
    CREATE = Routes.CREATE,
    EDIT = Routes.EDIT,
}
