import { ReactNode } from 'react';

interface ModalProps {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  className?: string;
}

export const Modal = ({
  children,
  isOpen,
  toggle,
  className = '',
}: ModalProps) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
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
      data-testid="modal-overlay"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex bg-white w-[70%] h-[70%] p-4 rounded-2xl flex-wrap items-center justify-evenly flex-col ${className}`}
        data-testid="modal-content"
      >
        {children}
      </div>
    </div>
  );
};