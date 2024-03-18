require("dotenv").config();
import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { getGroupWithRoles } from "./JWTService";
import { createJWT } from "../middleware/JWTAction";
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};
const checkEmail = async (userEmail) => {
  let user = await db.User.findOne({ where: { email: userEmail } });
  if (user) {
    return true;
  }
  return false;
};

const checkPhone = async (userPhone) => {
  let user = await db.User.findOne({ where: { phone: userPhone } });
  if (user) {
    return true;
  }
  return false;
};

const registerNewUser = async (rawUserData) => {
  try {
    // check email/phonenumber are exist
    let isEmailExist = await checkEmail(rawUserData.email);
    if (isEmailExist)
      return {
        EM: "The email is already exist",
        EC: 1,
      };
    let isPhoneExist = await checkPhone(rawUserData.phone);
    if (isPhoneExist)
      return {
        EM: "The phone is already exist",
        EC: 1,
      };
    // hash user password
    let hashPassword = hashUserPassword(rawUserData.password);
    // create new user

    await db.User.create({
      email: rawUserData.email,
      username: rawUserData.username,
      password: hashPassword,
      phone: rawUserData.phone,
      groupId: 4,
    });
    return { EM: "A user is created successfully!", EC: 0 };
  } catch (error) {
    console.log(e);
    return {
      EM: "something wrongs in service...",
      EC: 1,
    };
  }
};

const checkPassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

const handleUserLogin = async (rawData) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [{ email: rawData.valueLogin }, { phone: rawData.valueLogin }],
      },
    });

    if (user) {
      let isCorrectPassword = checkPassword(rawData.password, user.password);
      if (isCorrectPassword === true) {
        // test roles:
        let groupWithRoles = await getGroupWithRoles(user);

        let payload = {
          email: user.email,
          username: user.username,
          groupWithRoles,
        };

        let token = createJWT(payload);

        return {
          EM: "ok!",
          EC: 0,
          DT: {
            access_token: token,
            groupWithRoles,
            email: user.email,
            username: user.username,
          },
        };
      }
    }
    return {
      EM: "Your email/phone number or password is incorrect!",
      EC: 1,
      DT: "",
    };
  } catch (error) {}
};
module.exports = {
  registerNewUser,
  handleUserLogin,
  hashUserPassword,
  checkEmail,
  checkPhone,
};
