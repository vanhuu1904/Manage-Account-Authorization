import { Button, Modal } from "react-bootstrap";

const ModalDelete = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete User?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Woohoo, are you sure to delete this user: {props.dataModal.email} ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={props.confirmDeleteUser}>
            Cofirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDelete;
