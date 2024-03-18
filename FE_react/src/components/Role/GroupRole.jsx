import { useEffect, useState } from "react";
import { fetchGroup } from "../../services/userService";
import {
  assignRolesToGroup,
  fetchAllRoles,
  fetchRolesByGroup,
} from "../../services/roleService";
import _ from "lodash";
import { toast } from "react-toastify";

const GroupRole = () => {
  const [listRoles, setListRoles] = useState({});
  const [userGroups, setUserGroups] = useState([]);
  const [selectGroup, setSelectGroup] = useState("");
  const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);

  useEffect(() => {
    getGroups();
    fetchRoles();
  }, []);
  const getGroups = async () => {
    let res = await fetchGroup();
    if (res && res.EC === 0) {
      setUserGroups(res.DT);
    } else {
      toast.error(res.EM);
    }
  };
  const fetchRoles = async () => {
    let res = await fetchAllRoles();
    if (res && res.EC === 0) {
      setListRoles(res.DT);
    }
    console.log(">>>check res: ", res);
  };

  const handleOnChangeGroup = async (value) => {
    setSelectGroup(value);
    if (value) {
      let data = await fetchRolesByGroup(value);
      if (data && data.EC === 0) {
        let result = buildDataRolesByGroup(data.DT.Roles, listRoles);
        console.log(">>>result: ", result);
        setAssignRolesByGroup(result);
      }
    }
  };
  const buildDataRolesByGroup = (groupRoles, allRoles) => {
    let result = [];
    if (allRoles && allRoles.length > 0) {
      allRoles.map((role) => {
        let object = {};
        object.url = role.url;
        object.id = role.id;
        object.description = role.description;
        object.isAssigned = false;
        if (groupRoles && groupRoles.length > 0) {
          object.isAssigned = groupRoles.some(
            (item) => item.url === object.url
          );
        }
        result.push(object);
      });
    }
    return result;
  };
  const handleSelectRole = (value) => {
    const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
    let foundIndex = _assignRolesByGroup.findIndex(
      (item) => +item.id === +value
    );
    console.log(">>check found: ", foundIndex);
    if (foundIndex > -1) {
      _assignRolesByGroup[foundIndex].isAssigned =
        !_assignRolesByGroup[foundIndex].isAssigned;
      setAssignRolesByGroup(_assignRolesByGroup);
    }
  };
  const buildDataToSave = () => {
    // data = {groupId: 4, groupRoles: [{}, {}, {}, {}]}
    let result = {};
    const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
    result.groupId = +selectGroup;
    let groupRolesFilter = _assignRolesByGroup.filter(
      (item) => item.isAssigned === true
    );
    let finalGroupRoles = groupRolesFilter.map((item) => {
      let data = { groupId: +selectGroup, roleId: +item.id };
      return data;
    });
    result.groupRoles = finalGroupRoles;
    return result;
  };
  const handleSave = async () => {
    let data = buildDataToSave();
    console.log(">>>check data truoc khi call api: ", data);
    let res = await assignRolesToGroup(data);
    if (res && res.EC === 0) {
      toast.success(res.EM);
    } else {
      toast.error(res.EM);
    }
    console.log(">>check data: ", data);
  };
  return (
    <div className="group-role-container">
      <div className="container">
        <div className="container mt-3">
          <h3>Group role:</h3>
          <div className="assign-group-role">
            <label htmlFor="">Select Group:</label>
            <select
              className="form-select"
              onChange={(event) => handleOnChangeGroup(event.target.value)}
            >
              <option value="">Please select your group </option>
              {userGroups &&
                userGroups.map((item, index) => {
                  return (
                    <option key={`group-${index}`} value={item.id}>
                      {" "}
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <hr />
          {selectGroup && (
            <div className="roles">
              <h5>Assign Role</h5>
              {assignRolesByGroup &&
                assignRolesByGroup.length > 0 &&
                assignRolesByGroup.map((item, index) => {
                  return (
                    <>
                      <div className="form-check" key={``}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={item.id}
                          checked={item.isAssigned}
                          id={`key-${item.id}`}
                          onChange={(e) => handleSelectRole(e.target.value)}
                        />
                        <label htmlFor={`key-${item.id}`}>{item.url}</label>
                      </div>
                    </>
                  );
                })}
              <div className="mt-2">
                <button
                  className="btn btn-warning"
                  onClick={() => handleSave()}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default GroupRole;
