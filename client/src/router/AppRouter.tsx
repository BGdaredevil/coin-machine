import { Outlet, Route, createBrowserRouter, createRoutesFromChildren } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../config/appEnums";

const router = createBrowserRouter(
    createRoutesFromChildren(
        <Route
            path={PublicRoutes.BASE_PATH}
            element={
                <>
                    main
                    <Outlet />
                </>
            }
        >
            <Route index element={<div>pesho home // outlet comes here ... i.e. this is the layout</div>} />
            <Route path={PublicRoutes.LOGIN} element={<div>pesho home</div>} />
            <Route path={PublicRoutes.REGISTER} element={<div>pesho home REGISTER</div>} />
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
                            <div>pesho home index // outlet comes here ... i.e. this is the layout</div>
                        </>
                    }
                />
                <Route path={"pesho"} element={<div>pesho home</div>} />
                <Route path={"pesho2"} element={<div>pesho home2</div>} />
            </Route>
        </Route>
    )
);
// debug
router.subscribe((state) => console.log("new state", state, JSON.stringify(state.location)));

export default router;
