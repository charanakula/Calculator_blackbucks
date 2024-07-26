import React from 'react';
import '../styles/modal.css';

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>×</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
