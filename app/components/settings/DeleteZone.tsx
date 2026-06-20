"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { signOut } from "next-auth/react";
import ConfirmModal from "@/app/components/ConfirmModal";

const DeleteZone = () => {
  const { mutate: deleteAccount, isPending } = useMutation({
    mutationFn: () => axios.delete("/api/settings"),
    onSuccess: () => signOut({ callbackUrl: "/auth/signin" }),
  });

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm text-white font-medium">Delete Account</p>
        <p className="text-xs mt-0.5">
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>
      </div>

      <ConfirmModal
        trigger={(requestConfirm) => (
          <button
            onClick={requestConfirm}
            className="btn bg-danger-500 text-white hover:bg-danger-100 self-start py-2"
          >
            Delete my account
          </button>
        )}
        title="Delete your account?"
        description="This will permanently delete your account and all associated data. This action cannot be undone."
        confirmLabel="Delete account"
        pendingLabel="Deleting…"
        danger
        isPending={isPending}
        onConfirm={() => deleteAccount()}
      />
    </div>
  );
};

export default DeleteZone;
