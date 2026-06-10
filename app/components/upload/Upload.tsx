"use client";
import { uploadSchema, UploadType } from "@/util/schemas/upload.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FileUploadPanel from "./FileUploadPanel";
import JobDescriptionPanel from "./JobDescriptionPanel";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

const Upload = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UploadType>({
    resolver: zodResolver(uploadSchema),
  });
  const currentCharacter = (watch("description") ?? "").length;

  function onSubmit() {}

  return (
    <form
      className="grid lg:grid-cols-2 gap-6 w-full min-w-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <FileUploadPanel register={register} setValue={setValue} />
        {errors.file?.message && (
          <p className="text-danger-500 text-sm mt-2">
            {errors.file.message as string}
          </p>
        )}
      </div>
      <div>
        <JobDescriptionPanel
          register={register}
          currentCharacter={currentCharacter}
        />
        {errors.description?.message && (
          <p className="text-danger-500 text-sm mt-2">
            {errors.description.message}
          </p>
        )}
      </div>
      <div className="lg:col-span-2 flex justify-end">
        <button className="btn-primary font-medium" type="submit">
          <BoltOutlinedIcon fontSize="small" /> Analyze
        </button>
      </div>
    </form>
  );
};

export default Upload;
