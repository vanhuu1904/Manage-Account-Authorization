import React, { useEffect } from "react";
import { useState } from "react";
import { getUserAccount } from "../services/userService";
import { useLocation } from "react-router-dom";
const UserContext = React.createContext({ name: "", auth: false });
const UserProvider = ({ children }) => {
  const userDefault = {
    isAuthenticated: false,
    isLoading: true,
    token: "",
    account: {},
  };
  const [user, setUser] = useState({
    isAuthenticated: false,
    isLoading: true,
    token: "",
    account: {},
  });

  //   Login updates the user data with a name parameter
  const loginContext = (userData) => {
    setUser({ ...userData, isLoading: false });
  };

  //   Logout updates the user data to default
  const logoutContext = () => {
    setUser({ ...userDefault, isLoading: false });
  };

  const fetchUser = async () => {
    let res = await getUserAccount();
    if (res && res.EC === 0) {
      let groupWithRoles = res.DT.groupWithRoles;
      let email = res.DT.email;
      let username = res.DT.username;
      let token = res.DT.access_token;

      let data = {
        isAuthenticated: true,
        token,
        account: { groupWithRoles, email, username },
        isLoading: false,
      };
      setUser(data);
    } else {
      setUser({ ...userDefault, isLoading: false });
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UserContext.Provider value={{ user, loginContext, logoutContext }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserProvider, UserContext };
