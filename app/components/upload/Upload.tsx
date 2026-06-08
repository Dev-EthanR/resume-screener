"use client";
import { uploadSchema, UploadType } from "@/util/schemas/upload.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FileUploadPanel from "./FileUploadPanel";
import JobDescriptionPanel from "./JobDescriptionPanel";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

const Upload = () => {
  const { register, handleSubmit, watch, setValue } = useForm<UploadType>({
    resolver: zodResolver(uploadSchema),
  });
  const currentCharacter = (watch("description") ?? "").length;

  function onSubmit() {}

  return (
    <form
      className="grid lg:grid-cols-2 gap-6 w-full min-w-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FileUploadPanel register={register} setValue={setValue} />
      <JobDescriptionPanel
        register={register}
        currentCharacter={currentCharacter}
      />
      <div className="lg:col-span-2 flex justify-end">
        <button className="btn-primary font-medium">
          <BoltOutlinedIcon fontSize="small" /> Analyze
        </button>
      </div>
    </form>
  );
};

export default Upload;
