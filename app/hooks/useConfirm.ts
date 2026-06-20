import { useEffect, useState } from "react";

export function useConfirm(isPending = false) {
  const [confirming, setConfirming] = useState(false);

  const requestConfirm = () => setConfirming(true);
  const cancelConfirm = () => setConfirming(false);

  useEffect(() => {
    if (!confirming) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) cancelConfirm();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirming, isPending]);

  return { confirming, requestConfirm, cancelConfirm };
}
