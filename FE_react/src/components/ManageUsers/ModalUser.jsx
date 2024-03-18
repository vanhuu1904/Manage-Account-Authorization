import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  createNewUser,
  fetchGroup,
  updateCurrentUser,
} from "../../services/userService";
import { toast } from "react-toastify";
import _ from "lodash";
const ModalUser = (props) => {
  const { action, dataModalUser } = props;
  const defaultUserData = {
    email: "",
    phone: "",
    username: "",
    password: "",
    address: "",
    sex: "",
    groupId: "",
  };
  const validInputsDefault = {
    email: true,
    phone: true,
    username: true,
    password: true,
    address: true,
    sex: true,
    groupId: true,
  };
  const [userGroups, setUserGroups] = useState([]);
  const [userData, setUserData] = useState(defaultUserData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);
  useEffect(() => {
    getGroups();
  }, []);
  useEffect(() => {
    if (action === "UPDATE") {
      console.log(">>>>check data update: ", dataModalUser);
      setUserData({
        ...dataModalUser,
        groupId: dataModalUser.Group ? dataModalUser.Group.id : "",
      });
      console.log(">>>check user update: ", {
        ...dataModalUser,
        groupId: dataModalUser.Group ? dataModalUser.Group.id : "",
      });
      console.log(">>>>check data update group: ", userData);
    }
  }, [dataModalUser]);

  useEffect(() => {
    if (action === "CREATE") {
      if (userGroups && userGroups.length > 0) {
        setUserData({ ...userData, groupId: userGroups[0].id });
      }
    }
  }, [action]);
  const getGroups = async () => {
    let res = await fetchGroup();
    if (res && res.EC === 0) {
      setUserGroups(res.DT);
      if (res.DT && res.DT.length > 0) {
        let group = res.DT;
        setUserData({ ...userData, groupId: group[0].id });
      }
    } else {
      toast.error(res.EM);
    }
  };
  const handleOnChangeInput = (value, name) => {
    let _userData = _.cloneDeep(userData);
    _userData[name] = value;
    setUserData(_userData);
  };

  const CheckValidInput = () => {
    if (action === "UPDATE") return true;
    setValidInputs(validInputsDefault);
    let arr = ["email", "phone", "password", "groupId"];
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!userData[arr[i]]) {
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[arr[i]] = false;
        setValidInputs(_validInputs);

        toast.error(`Empty input ${arr[i]}`);
        check = false;
        break;
      }
    }
    return check;
  };
  const handleConfirmUser = async () => {
    let check = CheckValidInput();
    console.log(">>>check userdata: ", userData);
    if (check) {
      let res =
        action === "CREATE"
          ? await createNewUser(userData)
          : await updateCurrentUser(userData);
      console.log(">>>check user data: ", userData);
      console.log(">>>check res: ", res);
      if (res && res.EC === 0) {
        toast.success(res.EM);
        props.onHide();
        setUserData({
          ...defaultUserData,
          groupId: userGroups && userGroups.length > 0 ? userGroups[0].id : "",
        });
      } else {
        toast.error(res.EM);
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[res.DT] = false;
        setValidInputs(_validInputs);
      }
    }
  };

  const handleClostmodalUser = () => {
    props.onHide();
    setUserData(defaultUserData);
    setValidInputs(validInputs);
  };

  return (
    <>
      <Modal
        size="lg"
        show={props.show}
        className="modal-user"
        onHide={handleClostmodalUser}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {props.action === "CREATE" ? "Create new user" : "Edit a user"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 form-group">
              <label htmlFor="">
                Email address (<span className="red">*</span>)
              </label>
              <input
                disabled={action === "CREATE" ? false : true}
                className={
                  validInputs.email ? "form-control" : "form-control is-invalid"
                }
                value={userData.email}
                onChange={(e) => handleOnChangeInput(e.target.value, "email")}
                type="email"
              />
            </div>
            <div className="col-12 col-sm-6 form-group">
              <label htmlFor="">
                Phone number: (<span className="red">*</span>)
              </label>
              <input
                disabled={action === "CREATE" ? false : true}
                className={
                  validInputs.phone ? "form-control" : "form-control is-invalid"
                }
                value={userData.phone}
                onChange={(e) => handleOnChangeInput(e.target.value, "phone")}
                type="text"
              />
            </div>
            <div className="col-12 col-sm-6 form-group">
              <label htmlFor="">Username:</label>
              <input
                className={
                  validInputs.username
                    ? "form-control"
                    : "form-control is-invalid"
                }
                value={userData.username}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "username")
                }
                type="text"
              />
            </div>
            <div className="col-12 col-sm-6 form-group">
              {action === "CREATE" && (
                <>
                  <label htmlFor="">
                    Password: (<span className="red">*</span>)
                  </label>
                  <input
                    className="form-control"
                    value={userData.password}
                    onChange={(e) =>
                      handleOnChangeInput(e.target.value, "password")
                    }
                    type="password"
                  />
                </>
              )}
            </div>
            <div className="col-12 form-group">
              <label htmlFor="">Address:</label>
              <input
                className="form-control"
                value={userData.address}
                onChange={(e) => handleOnChangeInput(e.target.value, "address")}
                type="email"
              />
            </div>
            <div className="col-12 col-sm-6 form-group">
              <label htmlFor="">Gender:</label>
              <select
                className="form-select"
                onChange={(e) => handleOnChangeInput(e.target.value, "sex")}
                value={userData.sex}
              >
                <option selected value="Male">
                  Male
                </option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-12 col-sm-6 form-group">
              <label htmlFor="">Group:</label>
              <select
                className="form-select"
                onChange={(e) => handleOnChangeInput(e.target.value, "groupId")}
                value={userData.groupId}
              >
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClostmodalUser()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleConfirmUser()}>
            {action === "CREATE" ? "Save" : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalUser;
