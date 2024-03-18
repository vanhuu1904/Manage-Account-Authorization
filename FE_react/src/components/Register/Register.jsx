import { useNavigate } from "react-router-dom";
import "./Register.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { register } from "../../services/userService";
const Register = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const defaulValueInput = {
    isValidEmail: true,
    isValidPhone: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
  };
  // useEffect(() => {
  //   axios.get("http://localhost:8000/api/v1/test-api").then((data) => {
  //     console.log("check data: ", data);
  //   });
  // }, []);
  const [objCheckInput, setObjCheckInput] = useState(defaulValueInput);
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const isValidInputs = () => {
    setObjCheckInput(defaulValueInput);
    if (!email) {
      toast.error("Email is required");
      setObjCheckInput({ ...defaulValueInput, isValidEmail: false });
      return false;
    }
    let regx = /\S+@\S+\.\S+/;
    if (!regx.test(email)) {
      toast.error("Please enter a valid email address");
      setObjCheckInput({ ...defaulValueInput, isValidEmail: false });
      return false;
    }
    if (!phone) {
      toast.error("Phone is required");
      setObjCheckInput({ ...defaulValueInput, isValidPhone: false });
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      setObjCheckInput({ ...defaulValueInput, isValidPassword: false });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Your password is not the same");
      setObjCheckInput({ ...defaulValueInput, isValidConfirmPassword: false });
      return false;
    }
    return true;
  };
  const handleRegister = async () => {
    let check = isValidInputs();
    let user = await register(email, username, phone, password);
    if (user.data && user.EC === 0) {
      toast.success(user.EM);
    } else {
      toast.error(user.EM);
    }
    // toast.success("wow so easy");
  };

  // useEffect(() => {
  //   axios.get("https://reqres.in/api/users?page=2").then((data) => {
  //     console.log(">>> check data axios: ", data.data);
  //   });
  // }, []);

  return (
    <div className="register-container">
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
            <div className="form-group">
              <label htmlFor="">Email:</label>
              <input
                className={
                  objCheckInput.isValidEmail
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="text"
                placeholder="Email address "
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Phone number:</label>
              <input
                className={
                  objCheckInput.isValidPhone
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Username:</label>
              <input
                className="form-control"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Password:</label>
              <input
                className={
                  objCheckInput.isValidPassword
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Re-enter password:</label>
              <input
                className={
                  objCheckInput.isValidConfirmPassword
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={() => handleRegister()}
            >
              Register
            </button>

            <hr />
            <div className="text-center">
              <button className="btn btn-success" onClick={() => handleLogin()}>
                Already've an account. Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
