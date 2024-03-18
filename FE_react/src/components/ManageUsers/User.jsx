import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, fetchAllUser } from "../../services/userService";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import ModalDelete from "./ModalDeleteUser";
import ModalUser from "./ModalUser";
import { CiCirclePlus } from "react-icons/ci";
import { HiRefresh } from "react-icons/hi";
import { FaPencilAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
const User = (prop) => {
  const [listUsers, setListUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  // Modal Delete
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataModal, setDataModal] = useState({});
  // Modal update
  const [isShowModalUser, setIsShowModalUser] = useState(false);
  const [actionModalUser, setActionModalUser] = useState("CREAT");
  const [dataModalUser, setDataModalUser] = useState({});

  useEffect(() => {
    fetchUser();
  }, [currentPage, currentLimit]);
  const fetchUser = async () => {
    let res = await fetchAllUser(currentPage, currentLimit);
    console.log(">>>check data: ", res);
    if (res && res.EC === 0) {
      setTotalPages(res.DT.totalPage);
      setListUsers(res.DT.users);
    }
  };
  const handlePageChange = (event) => {
    console.log(event);
    setCurrentPage(+event.selected + 1);
    // TODO Only change displayed selected page
    // when its content is loaded in useEffect.
  };
  const handleDeleteUser = (user) => {
    setDataModal(user);
    setIsShowModalDelete(true);
  };
  const handleClose = () => {
    setIsShowModalDelete(false);
  };
  const confirmDeleteUser = async () => {
    let res = await deleteUser(dataModal);
    console.log(">>> check res: ", res);
    if (res && res.EC === 0) {
      toast.success(res.EM);
      await fetchUser();
      setIsShowModalDelete(false);
    } else {
      toast.error(res.EM);
    }
  };
  const onHideModalUser = async () => {
    setIsShowModalUser(false);
    setDataModalUser({});
    await fetchUser();
  };

  const handleEditUser = (user) => {
    setIsShowModalUser(true);
    setDataModalUser(user);
    setActionModalUser("UPDATE");
  };

  const handleRefresh = async () => {
    await fetchUser();
  };
  return (
    <>
      <div className="container">
        <div className="manage-users-container">
          <div className="user-header">
            <div className="title mt-3">
              <h3>Manage Users</h3>
            </div>
            <div className="actions my-3">
              <button
                className="btn btn-success mx-2"
                onClick={() => handleRefresh()}
              >
                <HiRefresh /> Refresh
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsShowModalUser(true);
                  setActionModalUser("CREATE");
                }}
              >
                <CiCirclePlus
                  style={{ marginRight: "5px" }}
                  color="white"
                  size={"20px"}
                />
                Add new user
              </button>
            </div>
          </div>
          <div className="user-body">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Id</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Group</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listUsers && listUsers.length > 0 ? (
                  <>
                    {listUsers.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>
                            {(currentPage - 1) * currentLimit + index + 1}
                          </td>
                          <td>{item.id}</td>
                          <td>{item.email}</td>
                          <td>{item.username}</td>
                          <td>{item.Group ? item.Group.name : ""}</td>
                          <td>
                            <button
                              className="btn btn-warning"
                              onClick={() => handleEditUser(item)}
                            >
                              <FaPencilAlt title="Edit" />
                            </button>
                            <button
                              className="btn btn-danger mx-2"
                              onClick={() => handleDeleteUser(item)}
                            >
                              <FaTrash title="Delete" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <span>not found users</span>
                )}
              </tbody>
            </table>
          </div>
          <div className="user-footer">
            {totalPages > 0 && (
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                pageCount={totalPages}
                marginPagesDisplayed={3}
                pageRangeDisplayed={4}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                activeClassName="active"
                forcePage={3}
              />
            )}
          </div>
        </div>
      </div>
      <ModalDelete
        show={isShowModalDelete}
        handleClose={handleClose}
        confirmDeleteUser={confirmDeleteUser}
        dataModal={dataModal}
      />
      <ModalUser
        title="Create A New User"
        onHide={onHideModalUser}
        show={isShowModalUser}
        action={actionModalUser}
        dataModalUser={dataModalUser}
      />
    </>
  );
};
export default User;
