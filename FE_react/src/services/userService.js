import axios from "../utils/axios-customize";

const register = (email, username, phone, password) => {
  return axios.post("/register", { email, username, phone, password });
};

const loginUser = (valueLogin, password) => {
  return axios.post("/login", { valueLogin, password });
};

const fetchAllUser = (page, limit) => {
  return axios.get(`/user/read?page=${page}&limit=${limit}`);
};

const deleteUser = (user) => {
  return axios.delete(`/user/delete`, { data: { id: user.id } });
};

const fetchGroup = () => {
  return axios.get("/group/read");
};

const createNewUser = (userData) => {
  return axios.post("/user/create", { ...userData });
};

const updateCurrentUser = (userData) => {
  return axios.put("/user/update", { ...userData });
};

const getUserAccount = () => {
  return axios.get("/account");
};

const logoutUser = () => {
  return axios.post("/logout");
};

export {
  register,
  loginUser,
  fetchAllUser,
  deleteUser,
  fetchGroup,
  createNewUser,
  updateCurrentUser,
  getUserAccount,
  logoutUser,
};
