import userService from "../service/userService.js";

const handleHelloWord = (req, res) => {
  return res.render("home.ejs");
};

const handleUser = (req, res) => {
  return res.render("user.ejs");
};

const handleCreateNewUser = (req, res) => {
  const { email, password, username } = req.body;
  userService.createNewUser(email, password, username);
  console.log(">>> check user: ", email, password, username);
  // console.log(">>> check req.body: ", req.body);
  return res.send("tao thanh cong");
};

const handleUserPage = async (req, res) => {
  // model => get data from database
  // cookies that have not been signed
  console.log("Cookies: ", req.cookies);

  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);

  let userList = await userService.getUserList();
  console.log("userList: ", userList);
  return res.render("user.ejs");
};

module.exports = {
  handleHelloWord,
  handleUser,
  handleCreateNewUser,
  handleUserPage,
};
