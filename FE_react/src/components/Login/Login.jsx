import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { loginUser } from "../../services/userService";
import { UserContext } from "../../context/UserContext";
const Login = () => {
  const { loginContext } = useContext(UserContext);

  const navigate = useNavigate();

  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");
  const defaultObjectValueInput = {
    isValidValueLogin: true,
    isValidPassword: true,
  };
  const [objValueInput, setObjValueInput] = useState(defaultObjectValueInput);
  const handleCreateNewAccount = () => {
    navigate("/register");
  };

  const handleLogin = async () => {
    setObjValueInput(defaultObjectValueInput);
    if (!valueLogin) {
      toast.error("Please enter your email address or phone number");
      setObjValueInput({
        ...defaultObjectValueInput,
        isValidValueLogin: false,
      });
      return;
    }
    if (!password) {
      setObjValueInput({
        ...defaultObjectValueInput,
        isValidPassword: false,
      });
      toast.error("Please enter your password");
      return;
    }

    let res = await loginUser(valueLogin, password);
    console.log(">>> check data: ", res);
    if (res && +res.EC === 0) {
      let groupWithRoles = res.DT.groupWithRoles;
      let email = res.DT.email;
      let username = res.DT.username;
      let token = res.DT.access_token;
      let data = {
        isAuthenticated: true,
        token: token,
        account: { groupWithRoles, email, username },
      };
      localStorage.setItem("jwt", token);
      loginContext(data);
      toast.success("Đăng nhập thành công!");
      navigate("/users");
    } else {
      toast.error(res.EM);
    }
  };
  const handlePressEnter = (e) => {
    if (+e.charCode === 13 && e.code === "Enter") {
      handleLogin();
    }
    console.log(">>>check event: ", e);
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="row px-3 px-sm-0">
          <div className="content-left col-12 d-none col-sm-7  d-sm-block ">
            <div className="brand">văn hữu</div>
            <div className="detail">
              Văn Hữu helps you connect and share with the people in your life.
            </div>
          </div>
          <div className="content-right col-sm-5 col-12 d-flex flex-column gap-3 py-3">
            <div className="brand d-block d-sm-none">văn hữu</div>
            <input
              className={
                objValueInput.isValidValueLogin
                  ? "form-control"
                  : "form-control is-invalid"
              }
              type="text"
              value={valueLogin}
              onChange={(e) => setValueLogin(e.target.value)}
              placeholder="Email address or phone number"
            />
            <input
              className={
                objValueInput.isValidPassword
                  ? "form-control"
                  : "form-control is-invalid"
              }
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onKeyPress={(e) => handlePressEnter(e)}
            />
            <button className="btn btn-primary" onClick={() => handleLogin()}>
              Login
            </button>
            <span className="text-center">
              <a className="forgot-password" href="#">
                Forgot your password?
              </a>{" "}
            </span>
            <hr />
            <div className="text-center">
              <button
                className="btn btn-success"
                onClick={() => handleCreateNewAccount()}
              >
                Create new account
              </button>
            </div>
            <div className="mt-3">
              <Link to="/">
                <span>Return to HomePage</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
