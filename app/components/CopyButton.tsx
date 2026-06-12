"use client";

import { useState } from "react";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

interface Props {
  text: string;
}

const CopyButton = ({ text }: Props) => {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 order-2 mt-0.5 text-text hover:text-white transition-colors cursor-pointer justify-items-end select-none"
      title="Copy to clipboard"
    >
      {copied ? (
        <span className="text-white flex items-center gap-2 border border-border p-2 rounded-lg text-xs w-21 bg-success">
          <DoneOutlinedIcon sx={{ fontSize: 12 }} />
          Copied
        </span>
      ) : (
        <span className="text-white flex items-center gap-2 border border-border p-2 rounded-lg text-xs w-21 justify-center">
          <ContentCopyOutlinedIcon sx={{ fontSize: 12 }} />
          Copy
        </span>
      )}
    </button>
  );
};

export default CopyButton;
