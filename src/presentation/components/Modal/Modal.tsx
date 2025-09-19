 import React, { ReactNode } from 'react';

interface ModalProps {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  className?: string;
  showCloseButton?: boolean;
}

export const Modal = ({
  children,
  isOpen,
  toggle,
  className = '',
  showCloseButton = true,
}: ModalProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      toggle();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen bg-black bg-opacity-70 flex justify-center items-center"
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
        className={`relative flex bg-white w-[70%] h-[70%] p-4 rounded-2xl flex-wrap items-center justify-evenly flex-col ${className}`}
        data-testid="modal-content"
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Close modal"
            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            data-testid="modal-close-button"
          >
            ✕
          </button>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
