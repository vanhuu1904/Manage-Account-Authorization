import db from "../models/index";
const getGroups = async () => {
  try {
    let data = await db.Group.findAll({
      order: [["name", "asc"]],
    });
    return {
      EM: "get group success",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "error from service",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = { getGroups };
