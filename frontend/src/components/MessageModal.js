import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const MessageModal = ({ show, onClose, type, message, onConfirm, onCancel }) => {
  const modalConfig = {
    success: {
      title: 'Success!',
      color: '#155724',
      icon: '/checklist.png',
    },
    error: {
      title: 'Error!',
      color: '#721c24',
      icon: '/remove.png',
    },
    warning: {
      title: 'Warning!',
      color: '#856404',
      icon: '/warning.png', 
    },
  };

  const { title, color, icon } = modalConfig[type] || modalConfig.error;

  return (
    <Modal show={show} onHide={onClose} centered>
      <div className="custom-modal">
        <img
          src={icon}
          alt={`${type} Icon`}
          className="custom-modal-icon"
        />
        <h4
          className="custom-modal-title"
          style={{ color }}
        >
          {title}
        </h4>
        <p
          className="custom-modal-message"
          style={{ color }}
        >
          {message}
        </p>
        <div className="modal-buttons">
          {type === 'warning' ? (
            <>
              <Button
                variant="secondary"
                onClick={onCancel}
                className="custom-modal-button no-button"
              >
                No
              </Button>
              <Button
                variant="primary"
                onClick={onConfirm}
                className="custom-modal-button yes-button"
              >
                Yes
              </Button>
            </>
          ) : (
            <Button
              onClick={onClose}
              className="custom-modal-button"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MessageModal;
