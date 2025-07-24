import { type ReactNode, useEffect, useRef } from "react";
import { BfDsButton } from "./BfDsButton.tsx";

export interface BfDsModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;

  /**
   * Callback when the modal should be closed
   */
  onClose: () => void;

  /**
   * The title displayed in the modal header
   */
  title?: string;

  /**
   * The modal content
   */
  children: ReactNode;

  /**
   * Custom footer content. If not provided, no footer is shown
   */
  footer?: ReactNode;

  /**
   * Size variant of the modal
   * @default "medium"
   */
  size?: "small" | "medium" | "large" | "fullscreen";

  /**
   * Whether clicking the backdrop closes the modal
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing Escape closes the modal
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Whether to show the close button in the header
   * @default true
   */
  showCloseButton?: boolean;
}

/**
 * Modal component for displaying content in an overlay
 *
 * @example
 * ```tsx
 * <BfDsModal
 *   isOpen={modalOpen}
 *   onClose={() => setModalOpen(false)}
 *   title="Create New Deck"
 *   footer={
 *     <>
 *       <BfDsButton variant="outline" onClick={() => setModalOpen(false)}>
 *         Cancel
 *       </BfDsButton>
 *       <BfDsButton variant="primary" onClick={handleSave}>
 *         Save
 *       </BfDsButton>
 *     </>
 *   }
 * >
 *   <p>Modal content goes here</p>
 * </BfDsModal>
 * ```
 */
export function BfDsModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "medium",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = "",
  showCloseButton = true,
}: BfDsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      // Restore focus to the previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalClasses = [
    "bfds-modal",
    `bfds-modal--${size}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className="bfds-modal-backdrop" onClick={handleBackdropClick}>
      <div
        className={modalClasses}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bfds-modal-title" : undefined}
      >
        {(title || showCloseButton) && (
          <div className="bfds-modal-header">
            {title && (
              <h2 id="bfds-modal-title" className="bfds-modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <BfDsButton
                variant="ghost"
                icon="cross"
                iconOnly
                onClick={onClose}
                aria-label="Close modal"
                className="bfds-modal-close"
              />
            )}
          </div>
        )}

        <div className="bfds-modal-body">
          {children}
        </div>

        {footer && (
          <div className="bfds-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
