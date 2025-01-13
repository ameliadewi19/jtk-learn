import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorModal = ({ show, onClose, message }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <div className="error-modal">
        <img
          src="/remove.png"
          alt="Error Icon"
          className="error-modal-icon"
        />
        <h4 className="error-modal-title">Error!</h4>
        <p className="error-modal-message">{message}
        </p>
        <Button
          onClick={onClose}
          className="error-modal-button"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
