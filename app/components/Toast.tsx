"use client";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { createPortal } from "react-dom";

interface Props {
  show: boolean;
  message: string;
}

const Toast = ({ show, message }: Props) => {
  if (!show) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-2 border border-border bg-surface text-white text-sm rounded-lg px-4 py-3 shadow-2xl">
        <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} className="text-success" />
        {message}
      </div>
    </div>,
    document.body,
  );
};

export default Toast;
