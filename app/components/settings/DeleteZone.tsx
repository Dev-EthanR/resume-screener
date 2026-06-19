"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useState } from "react";

const DeleteZone = () => {
  const [confirming, setConfirming] = useState(false);

  const { mutate: deleteAccount, isPending } = useMutation({
    mutationFn: () => axios.delete("/api/settings"),
    onSuccess: () => signOut({ callbackUrl: "/auth/signin" }),
  });

  const handleDelete = () => deleteAccount();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm text-white font-medium">Delete Account</p>
        <p className="text-xs mt-0.5">
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>
      </div>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="btn-outline border-danger-500 text-danger-100 hover:bg-danger-500/10 self-start py-2"
        >
          Delete Account
        </button>
      ) : (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-white">Are you sure?</span>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="btn-outline border-danger-500 text-danger-100 hover:bg-danger-500/10 py-2 disabled:opacity-50"
          >
            {isPending ? "Deleting…" : "Yes, delete my account"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="btn-outline py-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteZone;
