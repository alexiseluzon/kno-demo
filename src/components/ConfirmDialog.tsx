"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open, title, message, confirmLabel = "Confirm", loading, onConfirm, onCancel,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dlg-title"
        aria-describedby="dlg-msg"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="dlg-title" className="text-lg font-semibold">{title}</h2>
        <p id="dlg-msg" className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            title="Cancel"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            title={confirmLabel}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {loading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}