import { Button, Modal } from "react-bootstrap";

const ModalDeleteRole = (props) => {
  const { show, setShow } = props;
  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Role?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Woohoo, are you sure to delete url: {props.dataModalDelete.url} ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.confirmDeleteRole();
              handleClose();
            }}
          >
            Cofirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDeleteRole;
