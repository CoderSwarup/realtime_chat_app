import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import ChatPage from "./pages/ChatPage";
import PageNotFound from "./pages/PageNotFound";
import { GetUserDeatils } from "./Store/Actions/UserActions";
import Loading from "./Components/Loading";
function App() {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const distaptch = useDispatch();
  useEffect(() => {
    distaptch(GetUserDeatils());
  }, []);

  return (
    <>
      <BrowserRouter>
        {loading && <Loading></Loading>}
        <Routes>
          {isAuthenticated ? (
            <Route exact path="/" element={<ChatPage />} />
          ) : (
            <>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
            </>
          )}

          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            {/* <Route exact path="/" element={<ChatPage />} /> */}
          </Route>

          <Route exact path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
