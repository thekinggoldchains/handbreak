import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    handleClose()
  }
  const getData = () => {
    return data;
  }

  return (
    <Modal show={show} centered size='lg' onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      {props.children}
    </Modal>
  );
})

export default ConfirmModal;