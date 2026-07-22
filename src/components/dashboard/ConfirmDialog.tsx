"use client";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-org-surface rounded-org-card shadow-org-card w-full max-w-sm p-6 text-center">
        <div className="w-11 h-11 rounded-full bg-org-danger-bg text-org-danger flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={20} />
        </div>
        <h2 className="text-org-md font-org-semibold text-org-text-primary mb-1.5">{title}</h2>
        <p className="text-org-sm text-org-text-secondary mb-6">{message}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-primary hover:bg-org-surface-alt transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-org-sm bg-org-danger text-white text-org-sm font-org-semibold hover:opacity-90 transition-opacity"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
