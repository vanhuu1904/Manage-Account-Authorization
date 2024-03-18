import bcrypt from "bcrypt";
import db from "../models";
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const createNewUser = async (email, password, username) => {
  let hashPass = hashPassword(password);
  try {
    await db.User.create({
      username: username,
      password: hashPass,
      email: email,
    });
  } catch (error) {}
};
const getUserById = async (id) => {
  let user = {};
  user = await db.User.findOne({
    where: { id: id },
  });
  return user.get({ plain: true });
};

const getUserList = async () => {
  let newuser = await db.User.findOne({
    where: { id: 1 },
    attributes: ["id", "username", "email"],
    include: { model: db.Group, attributes: ["name", "description"] },
    raw: true,
    nest: true,
  });
  let roles = await db.Group.findOne({
    where: { id: 1 },
    include: { model: db.Role },
    raw: true,
    nest: true,
  });
  console.log(">>> check new role: ", roles);
  console.log(">>> check newUser: ", newuser);
  let users = [];
  try {
    users = await db.User.findAll();
  } catch (error) {
    console.log(error);
  }
  return users;
};
const updateUserInfo = async (email, username, id) => {
  await db.User.update({ email: email, username: username }),
    {
      where: {
        id: id,
      },
    };
};

const deleteUser = async (id) => {
  await db.User.destroy({
    where: { id: id },
  });
};

module.exports = {
  hashPassword,
  createNewUser,
  getUserList,
  getUserById,
  updateUserInfo,
  deleteUser,
};
