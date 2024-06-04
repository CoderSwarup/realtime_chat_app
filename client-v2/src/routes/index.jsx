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
const GroupsPage = Loadable(
  lazy(() => import("../pages/dashboard/GroupGeneralApp"))
);
const CallPage = Loadable(lazy(() => import("../pages/dashboard/CallPage")));

// Auth
const Login = Loadable(lazy(() => import("../pages/Auth/Login")));
const ForgotPassword = Loadable(
  lazy(() => import("../pages/Auth/ForgotPassword"))
);
const NewPassword = Loadable(lazy(() => import("../pages/Auth/NewPassword")));
const RegisterPage = Loadable(lazy(() => import("../pages/Auth/Register")));
const VerifyPage = Loadable(lazy(() => import("../pages/Auth/VerifyOTP")));

const Page404 = Loadable(lazy(() => import("../pages/Page404")));

// story Page
const StoryPage = Loadable(lazy(() => import("../pages/dashboard/StoryPage")));

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <RegisterPage /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "new-password", element: <NewPassword /> },
        { path: "verify", element: <VerifyPage /> },
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
        { path: "story", element: <StoryPage /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
