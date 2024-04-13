import { Route, createBrowserRouter, createRoutesFromChildren } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../config/appEnums";
import MainLayout from "../layouts/MainLayout";
import Register from "../views/auth/register/Register";
import Login from "../views/auth/login/Login";
import CreateProduct from "../views/product/create/CreateProduct";

const router = createBrowserRouter(
    createRoutesFromChildren(
        <Route path={PublicRoutes.BASE_PATH} element={<MainLayout />}>
            <Route index element={<div>pesho home // outlet comes here ... i.e. this is the layout</div>} />
            <Route path={PublicRoutes.LOGIN} element={<Login />} />
            <Route path={PublicRoutes.REGISTER} element={<Register />} />
            <Route
                path={PrivateRoutes.ADMIN}
                // element={
                //     <>
                //         <div>layout</div>
                //         <Outlet />
                //     </>
                // }
            >
                <Route
                    index
                    element={
                        <>
                            <div>personal products catalog</div>
                        </>
                    }
                />
                <Route path={`${PrivateRoutes.ADMIN}${PrivateRoutes.PRODUCT}`}>
                    <Route index element={<div>list personal products</div>} />
                    <Route path={`${PrivateRoutes.ADMIN}${PrivateRoutes.PRODUCT}${PrivateRoutes.EDIT}`} element={<div>edit product</div>} />
                    <Route path={`${PrivateRoutes.ADMIN}${PrivateRoutes.PRODUCT}${PrivateRoutes.CREATE}`} element={<CreateProduct />} />
                </Route>
                <Route path={"pesho"} element={<div>pesho home</div>} />
                <Route path={"pesho2"} element={<div>pesho home2</div>} />
            </Route>
        </Route>
    )
);
// debug
router.subscribe((state) => console.log("new state", state, JSON.stringify(state.location)));

export default router;
