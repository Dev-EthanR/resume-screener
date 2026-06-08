import { UploadType } from "@/util/schemas/upload.schema";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

export function useFileUpload(setValue: UseFormSetValue<UploadType>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(file: File) {
    setSelectedFile(file);
    setValue("file", file, { shouldValidate: true });
  }

  function clearFile() {
    setSelectedFile(null);
    setValue("file", null, { shouldValidate: true });
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.length) selectFile(files[0]);
  }

  return {
    selectedFile,
    isDragging,
    setIsDragging,
    onDrop,
    clearFile,
    selectFile,
  };
}
