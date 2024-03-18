import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Rings } from "react-loader-spinner";

const LoadingRoute = (props) => {
  const { user } = useContext(UserContext);

  return (
    <>
      {user && user.isLoading ? (
        <>
          <div className="loading-container">
            <Rings
              height="100"
              width="100"
              color="#1877f2"
              ariaLabel="loading"
            />
            <div>Loading data...</div>
          </div>
        </>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};
export default LoadingRoute;
