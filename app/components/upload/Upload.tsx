"use client";
import { uploadSchema, UploadType } from "@/util/schemas/upload.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import FileUploadPanel from "./FileUploadPanel";
import JobDescriptionPanel from "./JobDescriptionPanel";

const Upload = () => {
  const router = useRouter();
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

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: UploadType) => {
      const fd = new FormData();
      fd.append("file", data.file);
      fd.append("description", data.description);
      fd.append("company", data.company);
      fd.append("position", data.position);

      const res = await axios.post<{ id: string }>("/api/process", fd);
      return res.data;
    },
    onSuccess: ({ id }) => {
      const navigate = () => router.push(`/upload/results/${id}?step=2`);
      if (
        typeof document !== "undefined" &&
        "startViewTransition" in document
      ) {
        (
          document as Document & {
            startViewTransition: (cb: () => void) => void;
          }
        ).startViewTransition(() => flushSync(navigate));
      } else {
        navigate();
      }
    },
  });

  function onSubmit(data: UploadType) {
    mutate(data);
  }

  return (
    <form
      className="grid lg:grid-cols-2 gap-6 w-full min-w-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FileUploadPanel register={register} setValue={setValue} error={errors} />
      <JobDescriptionPanel
        register={register}
        currentCharacter={currentCharacter}
        error={errors}
      />

      {error && <p className="text-danger-500 text-sm mt-2">{error.message}</p>}
      <div className="lg:col-span-2 flex justify-end">
        <button
          className="btn-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isPending}
        >
          <BoltOutlinedIcon fontSize="small" />
          {isPending ? "Uploading..." : "Analyze"}
        </button>
      </div>
    </form>
  );
};

export default Upload;
