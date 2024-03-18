import e from "express";
import db from "../models/index";
import {
  checkEmail,
  checkPhone,
  hashUserPassword,
} from "./loginRegisterService";
const getAllUsers = async () => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "username", "email", "phone", "sex"],
      include: { model: db.Group, attributes: ["name", "description"] },
    });
    console.log(">>>> check data user:", users);
    if (users) {
      return {
        EM: "get data success",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "get data success",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};
const getUserWithPaginate = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;

    const { count, rows } = await db.User.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "username", "email", "phone", "sex", "address"],
      include: { model: db.Group, attributes: ["name", "description", "id"] },
      order: [["id", "desc"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPage: totalPages,
      users: rows,
    };
    console.log(">>>check data: ", data);
    return {
      EM: "fetch users with paginate",
      EC: 0,
      DT: data,
    };
  } catch (error) {}
};

const createNewUser = async (data) => {
  try {
    // check email/phonenumber are exist
    let isEmailExist = await checkEmail(data.email);
    if (isEmailExist)
      return {
        EM: "The email is already exist",
        EC: 1,
        DT: "email",
      };
    let isPhoneExist = await checkPhone(data.phone);
    if (isPhoneExist)
      return {
        EM: "The phone is already exist",
        EC: 1,
        DT: "phone",
      };
    // hash user password
    let hashPassword = hashUserPassword(data.password);
    // create new user
    await db.User.create({ ...data, password: hashPassword });
    return { EM: "A user is created successfully!", EC: 0, DT: [] };
  } catch (error) {
    console.log(e);
    return {
      EM: "something wrongs in service...",
      EC: 1,
      DT: [],
    };
  }
};

const updateUser = async (data) => {
  try {
    console.log(">>>check data: ", data);
    if (!data.groupId)
      return {
        EM: "Error with empty groupId",
        EC: 1,
        DT: "group",
      };
    let user = await db.User.findOne({
      where: { id: data.id },
    });
    if (user) {
      // update
      await user.update({
        username: data.username,
        address: data.address,
        sex: data.sex,
        groupId: data.groupId,
      });
      return {
        EM: "Update user succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      // not found user
      return {
        EM: "User not found",
        EC: 2,
        DT: "",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "something wroung with service",
      EC: 1,
      DT: "",
    };
  }
};

const deleteUser = async (id) => {
  try {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (user) {
      await user.destroy();
      return {
        EM: "delete user succeeds",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "not found user",
        EC: 2,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "error from service",
      EC: 1,
      DT: [],
    };
  }
};
module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUserWithPaginate,
};
