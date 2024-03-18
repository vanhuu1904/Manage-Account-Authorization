import loginRegisterService from "../service/loginRegisterService";
const testApi = (req, res) => {
  return res.status(200).json({
    data: "testapt",
    message: "ok",
  });
};

const handleRegister = async (req, res) => {
  try {
    console.log(">>>check data: ", req.body);
    // req.body: email, phone, username, password
    if (!req.body.email || !req.body.phone || !req.body.password) {
      return res.status(200).json({
        EM: "Missing required parameters",
        EC: "1", // error code
        DT: "",
      });
    }
    // service create user
    let data = await loginRegisterService.registerNewUser(req.body);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC, // error code
      DT: "",
    });
  } catch (e) {
    console.log(">>>check error: ", e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
const handleLogin = async (req, res) => {
  console.log(">>>check data: ", req.body);
  try {
    let data = await loginRegisterService.handleUserLogin(req.body);

    if (data && data.DT.access_token) {
      // set cookies
      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }

    return res.status(200).json({
      EM: data?.EM,
      EC: data?.EC,
      DT: data?.DT,
    });
  } catch (error) {
    console.log(">>>check error: ", error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const handleLogout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      EM: "clear cookies done!",
      EC: 0,
      DT: "",
    });
  } catch (error) {
    console.log(">>>check error: ", error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
module.exports = {
  handleRegister,
  testApi,
  handleLogin,
  handleLogout,
};
