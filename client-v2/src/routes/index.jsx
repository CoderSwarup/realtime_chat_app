import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import AuthLayout from "../layouts/Auth";
// config
import LoadingScreen from "../components/LoadingScreen";
import { DEFAULT_PATH } from "../config";
import Profile from "../pages/dashboard/Profile";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

const GeneralApp = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp"))
);
const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));

const Login = Loadable(lazy(() => import("../pages/Auth/Login")));

const GroupsPage = Loadable(lazy(() => import("../pages/dashboard/Groups")));

const CallPage = Loadable(lazy(() => import("../pages/dashboard/CallPage")));

const Page404 = Loadable(lazy(() => import("../pages/Page404")));
export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Login /> },
      ],
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <GeneralApp /> },
        { path: "settings", element: <Settings /> },
        { path: "group", element: <GroupsPage /> },
        { path: "call", element: <CallPage /> },
        { path: "profile", element: <Profile /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
