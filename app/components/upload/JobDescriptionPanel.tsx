import {
  DESCRIPTION_MAX_LENGTH,
  UploadType,
} from "@/util/schemas/upload.schema";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import clsx from "clsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import UploadHeader from "./UploadHeader";

interface Props {
  register: UseFormRegister<UploadType>;
  currentCharacter: number;
  error: FieldErrors;
}

const JobDescriptionPanel = ({ register, currentCharacter, error }: Props) => {
  return (
    <div className="flex flex-col bg-background border-border border rounded-lg p-4 gap-3 min-h-110 lg:h-110 min-w-0 w-full">
      <UploadHeader
        icon={<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />}
        index={2}
        title="Add the job you're targeting"
      />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center  justify-between">
            <label htmlFor="company" className="text-sm font-medium">
              Company
            </label>
            {error.company?.message && (
              <p className="text-danger-500 text-xs">
                {error.company.message as string}
              </p>
            )}
          </div>
          <input
            id="company"
            className="outline-0 p-2 text-sm text-white border border-border rounded-md bg-surface focus-within:ring-1 focus-within:ring-accent focus-within:border-accent"
            maxLength={50}
            autoComplete="off"
            {...register("company")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center  justify-between">
            <label htmlFor="position" className="text-sm font-medium">
              Position
            </label>
            {error.position?.message && (
              <p className="text-danger-500 text-xs">
                {error.position.message as string}
              </p>
            )}
          </div>
          <input
            id="company"
            className="outline-0 p-2 text-sm text-white border border-border rounded-md bg-surface focus-within:ring-1 focus-within:ring-accent focus-within:border-accent"
            maxLength={50}
            autoComplete="off"
            {...register("position")}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="text-sm font-medium">
            Job description
          </label>
          <div
            className={clsx(
              "font-jetbrains text-xs tracking-wider space-x-1",
              currentCharacter >= DESCRIPTION_MAX_LENGTH
                ? "text-danger-100"
                : "text-gray-500",
            )}
          >
            <span>{currentCharacter}</span>
            <span>/</span>
            <span>{DESCRIPTION_MAX_LENGTH}</span>
          </div>
        </div>
        {error.description?.message && (
          <p className="text-danger-500 text-xs">
            {error.description.message as string}
          </p>
        )}
      </div>
      <div className="flex-1 border border-border rounded-lg bg-surface overflow-hidden min-w-0 focus-within:ring-1 focus-within:ring-accent focus-within:border-accent">
        <textarea
          id="description"
          className="w-full h-full resize-none outline-none p-2 bg-transparent text-sm text-white scrollbar-hide"
          maxLength={DESCRIPTION_MAX_LENGTH}
          {...register("description")}
        />
      </div>
    </div>
  );
};

export default JobDescriptionPanel;
