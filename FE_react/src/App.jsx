import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/Login/Login";
import "./App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./components/Register/Register";
import User from "./components/ManageUsers/User";
import { useContext } from "react";
import _ from "lodash";
import PrivateRoute from "./routes/PrivateRoute";
import { UserContext } from "./context/UserContext";
import LoadingRoute from "./routes/LoadingRoute";
import NavHeader from "./components/Navigation/NavHeader";
import Role from "./components/Role/Role";
import Project from "./components/Project/Project";
import Home from "./components/Home/Home";
import GroupRole from "./components/Role/GroupRole";
const Layout = () => {
  return (
    <div className="layout-app">
      <Outlet />
      {/* <Footer />    */}
    </div>
  );
};

const App = () => {
  const { user } = useContext(UserContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // <LoadingRoute>
        <NavHeader />
        // </LoadingRoute>
      ),
      errorElement: <div>404 not found</div>,
      children: [
        {
          path: "home",
          index: true,
          element: <Home />,
        },
        {
          path: "group-role",
          element: <GroupRole />,
        },

        {
          path: "projects",
          element: (
            <PrivateRoute>
              <Project />
            </PrivateRoute>
          ),
        },
        {
          path: "roles",
          element: (
            // <PrivateRoute>
            <Role />
            // </PrivateRoute>
          ),
        },
        {
          path: "/users",
          element: (
            <LoadingRoute>
              <PrivateRoute>
                <User />
              </PrivateRoute>
            </LoadingRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
