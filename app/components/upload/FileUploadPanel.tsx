import clsx from "clsx";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { UploadType } from "@/util/schemas/upload.schema";
import { useFileUpload } from "../../hooks/useFileUpload";
import { formatFileSize } from "@/util/formatFileSize";
import UploadHeader from "./UploadHeader";
import Icon from "../Icon";

interface Props {
  register: UseFormRegister<UploadType>;
  setValue: UseFormSetValue<UploadType>;
}

const FileUploadPanel = ({ register, setValue }: Props) => {
  const {
    selectedFile,
    isDragging,
    setIsDragging,
    onDrop,
    clearFile,
    selectFile,
  } = useFileUpload(setValue);

  return (
    <div className="flex flex-col border-border border rounded-lg p-4 gap-4 min-h-110 lg:h-110 min-w-0 w-full">
      <UploadHeader
        icon={<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />}
        index={1}
        title="Upload your resume"
      />
      <label
        htmlFor="file"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={clsx(
          "border rounded-lg flex flex-col justify-center gap-2 overflow-hidden min-w-0 transition-colors",
          isDragging ? "border-accent bg-accent/10" : "border-border",
          selectedFile ? "py-2 px-4 bg-surface" : "flex-1 items-center",
        )}
      >
        {selectedFile ? (
          <SelectedFileDisplay file={selectedFile} onClear={clearFile} />
        ) : (
          <DropZonePlaceholder />
        )}
        <input
          {...register("file")}
          id="file"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            register("file").onChange(e);
            const file = e.target.files?.[0];
            if (file) selectFile(file);
          }}
        />
      </label>
      <div className="flex gap-2 bg-surface rounded-lg p-3">
        <VerifiedUserOutlinedIcon
          sx={{ fontSize: 16 }}
          className="shrink-0 mt-0.5"
        />
        <p className="text-xs font-light">
          We extract text only to compare against the job description. Your file
          is discarded when you close the tab.
        </p>
      </div>
    </div>
  );
};

const SelectedFileDisplay = ({
  file,
  onClear,
}: {
  file: File;
  onClear: () => void;
}) => (
  <div className="flex items-center gap-2 justify-between">
    <div className="flex items-center gap-3">
      <Icon
        icon={<TaskOutlinedIcon sx={{ fontSize: 32 }} />}
        className="size-12 rounded-xl text-success bg-success/10!"
      />
      <div className="flex flex-col">
        <span className="text-sm text-white font-semibold">{file.name}</span>
        <span className="text-xs text-gray-400 flex items-center gap-2">
          {formatFileSize(file.size)}
          <span className="text-success flex items-center">
            <CheckOutlinedIcon sx={{ fontSize: 12 }} className="mr-1" />
            Ready
          </span>
        </span>
      </div>
    </div>
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClear();
      }}
      className="hover:text-danger-100 transition cursor-pointer"
    >
      <ClearOutlinedIcon sx={{ fontSize: 16 }} />
    </button>
  </div>
);

const DropZonePlaceholder = () => (
  <div className="cursor-pointer flex flex-col items-center gap-2">
    <Icon
      icon={<FileUploadOutlinedIcon sx={{ fontSize: 32 }} />}
      className="size-12 rounded-xl"
    />
    <div className="flex flex-col items-center">
      <span className="text-base text-white font-semibold">
        Drag & drop your resume
      </span>
      <span className="text-sm">
        or <span className="text-accent font-medium">browse files</span> to
        choose
      </span>
    </div>
    <div className="text-[10px] flex items-center gap-1 text-gray-400">
      <InsertDriveFileOutlinedIcon sx={{ fontSize: 12 }} />
      PDF only - max 5 MB
    </div>
  </div>
);

export default FileUploadPanel;
