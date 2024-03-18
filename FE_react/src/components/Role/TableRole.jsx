import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { deleteRole, fetchAllRoles } from "../../services/roleService";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import ModalDelete from "../ManageUsers/ModalDeleteUser";
import ModalDeleteRole from "./ModalDeleteRole";
import ModalUpdateRole from "./ModalUpdateRole";
const TableRole = forwardRef((props, ref) => {
  const [listRoles, setListRoles] = useState({});

  // Modal Delete
  const [isShowModalDeleteRole, setIsShowModalDeleteRole] = useState(false);
  const [dataModalDelete, setDataModalDelete] = useState({});

  // Modal Update
  const [isShowModalUpdateRole, setIsShowModalUpdateRole] = useState(false);
  const [dataModalUpdate, setDataModalUpdate] = useState({});
  useEffect(() => {
    fetchRoles();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchListRolesAgain() {
      fetchRoles();
    },
  }));
  const fetchRoles = async () => {
    let res = await fetchAllRoles();
    if (res && res.EC === 0) {
      setListRoles(res.DT);
    }
    console.log(">>>check res: ", res);
  };
  const handleDeleteRole = async (role) => {
    setIsShowModalDeleteRole(true);
    setDataModalDelete(role);
  };
  const confirmDeleteRole = async () => {
    let res = await deleteRole(dataModalDelete);
    if (res && res.EC === 0) {
      toast.success(res.EM);
      await fetchRoles();
    } else {
      toast.error(res.EM);
    }
    console.log(">>>check res: ", res);
  };

  const handleUpdateRole = (role) => {
    setIsShowModalUpdateRole(true);
    setDataModalUpdate(role);
  };

  const confirmUpdateRole = async () => {};
  return (
    <>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>No</th>
            <th>Url</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listRoles && listRoles.length > 0 ? (
            <>
              {listRoles.map((item, index) => {
                return (
                  <tr key={`row-${index}`}>
                    <td>{item.id}</td>
                    <td>{item.url}</td>
                    <td>{item.description}</td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleUpdateRole(item)}
                      >
                        <FaPencilAlt title="Edit" />
                      </button>
                      <button
                        className="btn btn-danger mx-2"
                        onClick={() => handleDeleteRole(item)}
                      >
                        <FaTrash title="Delete" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <tr>
              <td colSpan={4}>not found roles</td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalDeleteRole
        show={isShowModalDeleteRole}
        setShow={setIsShowModalDeleteRole}
        confirmDeleteRole={confirmDeleteRole}
        dataModalDelete={dataModalDelete}
      />
      <ModalUpdateRole
        show={isShowModalUpdateRole}
        setShow={setIsShowModalUpdateRole}
        confirmUpdateRole={confirmUpdateRole}
        dataModalUpdate={dataModalUpdate}
        fetchRoles={fetchRoles}
      />
    </>
  );
});
export default TableRole;
