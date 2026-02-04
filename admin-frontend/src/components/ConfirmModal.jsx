import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' | 'warning' | 'info'
}) => {
  const typeStyles = {
    danger: {
      bg: 'bg-danger-100',
      icon: 'text-danger-600',
      button: 'btn-danger',
    },
    warning: {
      bg: 'bg-warning-100',
      icon: 'text-warning-600',
      button: 'bg-warning-500 text-white hover:bg-warning-600',
    },
    info: {
      bg: 'bg-primary-100',
      icon: 'text-primary-600',
      button: 'btn-primary',
    },
  };

  const style = typeStyles[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${style.bg} mb-4`}>
          <AlertTriangle className={`w-8 h-8 ${style.icon}`} />
        </div>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn btn-secondary">
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className={`btn ${style.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
