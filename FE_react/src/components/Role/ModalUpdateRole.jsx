import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { updateRole } from "../../services/roleService";
import { toast } from "react-toastify";
const ModalUpdateRole = (props) => {
  const { show, setShow, dataModalUpdate, fetchRoles } = props;
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    setUrl(dataModalUpdate.url);
    setDescription(dataModalUpdate.description);
  }, [dataModalUpdate]);

  const handleClose = () => {
    setShow(false);
  };

  const confirmUpdateRole = async () => {
    let data = {
      id: dataModalUpdate.id,
      url,
      description,
    };
    let res = await updateRole(data);
    if (res && res.EC === 0) {
      toast.success(res.EM);
      await fetchRoles();
      setShow(false);
    } else {
      toast.error(res.EM);
    }
    console.log(">>>check res: ", res);
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Role?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12 form-group">
              <label htmlFor="">URL:</label>
              <input
                type="text"
                className="form-control"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
            </div>
            <div className="col-12 form-group">
              <label htmlFor="">Description:</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={confirmUpdateRole}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalUpdateRole;
