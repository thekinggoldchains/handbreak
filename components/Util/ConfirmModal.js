import { forwardRef, useImperativeHandle, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmModal = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState()


  useImperativeHandle(ref, () => ({
    open: () => handleShow(),
    close: () => handleClose(),
    setarData: (value) => setData(value),
    getData: () => getData()
}));

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const confirm = () => {
    props.onConfirm();
    handleClose();
  }
  const getData = () => {
    return data;
  }

  return (
      <Modal show={show} centered onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center d-flex flex-column lh-1'>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Não
          </Button>
          <Button variant="primary" onClick={() => confirm()}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
  );
})

export default ConfirmModal;