import db from "../models/index";
const createNewRoles = async (roles) => {
  try {
    let currentRoles = await db.Role.findAll({
      attributes: ["url", "description"],
      raw: true,
    });
    const persists = roles.filter(
      ({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url1 === url2)
    );
    if (persists.length === 0) {
      return {
        EM: "Nothing to create...",
        EC: 0,
        DT: [],
      };
    } else {
      await db.Role.bulkCreate(persists);
      return {
        EM: `Create roles succeeds ${persists.length} roles ...`,
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.log(e);
    return {
      EM: "something wrongs in service...",
      EC: 1,
      DT: [],
    };
  }
};

const getAllRoles = async () => {
  try {
    let data = await db.Role.findAll({
      order: [["id", "desc"]],
    });
    return {
      EM: `Get all Roles succeeds...`,
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrongs in service...",
      EC: 1,
      DT: [],
    };
  }
};
const deleteRole = async (id) => {
  try {
    let role = await db.Role.findOne({
      where: { id: id },
    });
    if (role) {
      await role.destroy();
      return {
        EM: "delete role succeeds",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "not found role",
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

const updateRole = async (data) => {
  console.log(">>>check data: ", data);
  try {
    let role = await db.Role.findOne({
      where: { id: data.id },
    });
    if (role) {
      // update
      await role.update({
        url: data.url,
        description: data.description,
      });
      return {
        EM: "Update role succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      // not found role
      return {
        EM: "Role not found",
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

const getRolesByGroup = async (id) => {
  try {
    if (!id) {
      return {
        EM: "Not found any roles",
        EC: 0,
        DT: [],
      };
    }
    let roles = await db.Group.findOne({
      where: { id: id },
      attributes: ["id", "name", "description"],
      include: [
        {
          model: db.Role,
          attributes: ["id", "url", "description"],
          through: { attributes: [] },
        },
      ],
    });
    console.log(">>>checkn role: ", roles);
    return {
      EM: "Get roles by group succeeds",
      EC: 0,
      DT: roles,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wroung with service",
      EC: 1,
      DT: "",
    };
  }
};

const assignRoleToGroup = async (data) => {
  try {
    console.log(">>>check data: ", data);
    await db.Group_Role.destroy({
      where: {
        groupId: +data.groupId,
      },
    });
    await db.Group_Role.bulkCreate(data.groupRoles);
    return {
      EM: "Get roles by group succeeds",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wroung with service",
      EC: 1,
      DT: "",
    };
  }
};

module.exports = {
  createNewRoles,
  getAllRoles,
  deleteRole,
  updateRole,
  getRolesByGroup,
  assignRoleToGroup,
};
