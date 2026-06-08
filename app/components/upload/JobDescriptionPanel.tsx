import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { UseFormRegister } from "react-hook-form";
import {
  DESCRIPTION_MAX_LENGTH,
  UploadType,
} from "@/util/schemas/upload.schema";
import UploadHeader from "./UploadHeader";

interface Props {
  register: UseFormRegister<UploadType>;
  currentCharacter: number;
}

const JobDescriptionPanel = ({ register, currentCharacter }: Props) => {
  return (
    <div className="flex flex-col bg-background border-border border rounded-lg p-4 gap-4 min-h-110 lg:h-110 min-w-0 w-full">
      <UploadHeader
        icon={<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />}
        index={2}
        title="Paste job description"
        characters={{
          characterLimit: DESCRIPTION_MAX_LENGTH,
          currentCharacter,
        }}
      />
      <div className="flex-1 border border-border rounded-lg bg-surface overflow-hidden min-w-0 focus-within:ring-1 focus-within:ring-accent focus-within:border-accent">
        <textarea
          className="w-full h-full resize-none outline-none p-2 bg-transparent text-sm text-white scrollbar-hide"
          maxLength={DESCRIPTION_MAX_LENGTH}
          {...register("description")}
        />
      </div>
    </div>
  );
};

export default JobDescriptionPanel;
