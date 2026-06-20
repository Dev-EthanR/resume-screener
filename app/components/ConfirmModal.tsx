"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useConfirm } from "@/app/hooks/useConfirm";

interface Props {
  trigger: (requestConfirm: () => void) => ReactNode;
  title: string;
  description: ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  pendingLabel?: string;
  danger?: boolean;
  isPending?: boolean;
}

const ConfirmModal = ({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  pendingLabel = "Working…",
  danger = false,
  isPending = false,
}: Props) => {
  const { confirming, requestConfirm, cancelConfirm } = useConfirm(isPending);

  return (
    <>
      {trigger(requestConfirm)}

      {confirming &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => !isPending && cancelConfirm()}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-surface border border-border rounded-lg p-6 shadow-2xl"
            >
              <p id="confirm-modal-title" className="text-white font-medium">
                {title}
              </p>
              <p className="text-xs mt-1.5">{description}</p>

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={onConfirm}
                  disabled={isPending}
                  className={clsx(
                    "btn py-2 disabled:opacity-50",
                    danger && "bg-danger-500 hover:bg-danger-100 text-white",
                  )}
                >
                  {isPending ? pendingLabel : confirmLabel}
                </button>
                <button
                  onClick={cancelConfirm}
                  disabled={isPending}
                  className="btn-outline py-2 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ConfirmModal;
