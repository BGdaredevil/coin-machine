import { Route, createBrowserRouter, createRoutesFromChildren } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../config/appEnums";
import MainLayout from "../layouts/MainLayout";
import Register from "../views/auth/register/Register";
import Login from "../views/auth/login/Login";
import CreateProduct from "../views/product/create/CreateProduct";
import PersonalProductsCatalog from "../views/product/catalog/PersonalProductsCatalog";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AuthListener from "./AuthListener";
import MachineHome from "../views/home/MachineHome";
import CreateMachine from "../views/machine/create/CreateMachine";
import MyMachines from "../views/machine/myMachines/MyMachines";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import { Box } from "@mui/material";

const router = createBrowserRouter(
    createRoutesFromChildren(
        <Route
            path={PublicRoutes.BASE_PATH}
            element={
                <Box sx={{ bgcolor: "background.default", height: "100vh", overflow: "auto", scrollbarWidth: "thin" }}>
                    <ErrorBoundary>
                        <AuthListener>
                            <MainLayout />
                        </AuthListener>
                    </ErrorBoundary>
                </Box>
            }
        >
            <Route index element={<MachineHome />} />
            <Route path="" element={<PublicRoute />}>
                <Route path={PublicRoutes.LOGIN} element={<Login />} />
                <Route path={PublicRoutes.REGISTER} element={<Register />} />
            </Route>
            <Route path="" element={<PrivateRoute />}>
                <Route path={`${PrivateRoutes.PRODUCT}`}>
                    <Route index element={<PersonalProductsCatalog />} />
                    <Route path={`${PrivateRoutes.PRODUCT}${PrivateRoutes.CREATE}`} element={<CreateProduct />} />
                </Route>
                <Route path={`${PrivateRoutes.MACHINE}`}>
                    <Route index element={<MyMachines />} />
                    <Route path={`${PrivateRoutes.MACHINE}${PrivateRoutes.CREATE}`} element={<CreateMachine />} />
                </Route>
            </Route>
        </Route>
    )
);
// debug
// router.subscribe((state) => console.log("new state", state, JSON.stringify(state.location)));

export default router;
