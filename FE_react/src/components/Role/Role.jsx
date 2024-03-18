import "./Role.scss";
import { IoAddCircle } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { createRoles } from "../../services/roleService";
import TableRole from "./TableRole";
const Role = () => {
  const dataChildDefault = { url: "", description: "", isValidUrl: true };

  const [listChilds, setListChilds] = useState({
    child1: dataChildDefault,
  });

  const childRef = useRef();
  const handleOnChangeInput = (name, value, key) => {
    let _listChilds = _.cloneDeep(listChilds);
    _listChilds[key][name] = value;
    if (value !== "") {
      _listChilds[key].isValidUrl = true;
    }
    setListChilds(_listChilds);
  };

  const handleAddNewInput = () => {
    let _listChilds = _.cloneDeep(listChilds);
    _listChilds[`child-${uuidv4()}`] = dataChildDefault;
    setListChilds(_listChilds);
  };
  const handleRemoveInput = (key) => {
    let _listChilds = _.cloneDeep(listChilds);
    delete _listChilds[key];
    setListChilds(_listChilds);
  };

  const buildDataToPersist = () => {
    let _listChilds = _.cloneDeep(listChilds);
    let result = [];
    Object.entries(_listChilds).map(([key, child], index) => {
      result.push({
        url: child.url,
        description: child.description,
      });
    });
    return result;
  };

  const handleSave = async () => {
    let check = true;
    let invalidObj = {};
    Object.entries(listChilds).find(([key, child], index) => {
      if (child && !child.url) {
        invalidObj[key] = child;
      }
    });
    if (Object.entries(invalidObj).length > 0) {
      // error
      let _listChilds = _.cloneDeep(listChilds);
      Object.entries(invalidObj).map(([key, child]) => {
        _listChilds[key].isValidUrl = false;
      });
      setListChilds(_listChilds);
      toast.error("url cannot be empty");
      return;
    } else {
      // call api
      let data = buildDataToPersist();
      let res = await createRoles(data);
      if (res && res.EC === 0) {
        toast.success(res.EM);
        setListChilds({ child1: dataChildDefault });
        childRef.current.fetchListRolesAgain();
        console.log(">>>check list child: ", listChilds);
      } else {
        toast.error(res.EM);
      }
    }
  };

  return (
    <div className="role-container">
      <div className="container">
        <div className="title-role mt-3">
          <h4>Add a new role...</h4>
          <div className=" role-parents">
            {Object.entries(listChilds).map(([key, child]) => {
              return (
                <div className="role-child row" key={`child-${key}`}>
                  <div className="col-5 form-group">
                    <label htmlFor="">URL:</label>
                    <input
                      type="text"
                      className={
                        child.isValidUrl
                          ? "form-control"
                          : "form-control is-invalid"
                      }
                      value={child.url}
                      onChange={(e) => {
                        handleOnChangeInput("url", e.target.value, key);
                      }}
                    />
                  </div>
                  <div className="col-5 form-group">
                    <label htmlFor="">Description:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={child.description}
                      onChange={(e) => {
                        handleOnChangeInput("description", e.target.value, key);
                      }}
                    />
                  </div>
                  <div className="col-2 mt-4">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAddNewInput()}
                    >
                      <IoAddCircle fontSize={"25px"} color="#07bc0c" />
                    </span>
                    {listChilds && Object.keys(listChilds).length > 1 && (
                      <span
                        className="mx-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveInput(key)}
                      >
                        <FaTrashAlt fontSize={"25px"} color="#e74c3c" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <div>
              <button
                className="btn btn-warning mt-2"
                onClick={() => handleSave()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="mt-3">
          <h4>List Current Roles:</h4>
          <TableRole ref={childRef} />
        </div>
      </div>
    </div>
  );
};
export default Role;
