import { Navigate, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const PrivateRoute = (props) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log(">>>check context user: ", user);
  }, []);
  return (
    <>
      {user && user.isAuthenticated ? (
        <>{props.children}</>
      ) : (
        <Navigate to={"/login"} replace />
      )}
    </>
  );
};
export default PrivateRoute;
