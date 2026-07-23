import React, { useEffect, useRef } from 'react';

type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus cancel by default to prevent accidental deletion
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="dialog-title" 
        aria-describedby="dialog-desc"
        className="bg-surface border border-hairline p-6 rounded-md shadow-raised w-full max-w-sm animate-fadeUp"
      >
        <h2 id="dialog-title" className="text-body font-semibold text-ink mb-2">
          {title}
        </h2>
        <p id="dialog-desc" className="text-body-sm text-ink-muted mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 rounded-md font-semibold text-body-sm text-ink hover:bg-paper focus-ring transition-colors border border-hairline"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md font-semibold text-body-sm bg-brick text-surface hover:bg-brick/90 focus-ring transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
