import clsx from "clsx";
import { JSX } from "react";
import Icon from "../Icon";

type Characters = Required<{
  characterLimit: number;
  currentCharacter: number;
}>;

interface Props {
  icon: JSX.Element;
  index: number;
  title: string;
  characters?: Characters;
}

const UploadHeader = ({ icon, index, title, characters }: Props) => {
  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        <Icon icon={icon} />
        <div>
          <p className="uppercase text-xs tracking-wide font-medium text-gray-500">
            step {index}
          </p>
          <div className="text-white font-semibold">{title}</div>
        </div>
      </div>
      {characters && (
        <div
          className={clsx(
            "font-jetbrains text-xs tracking-wider space-x-1",
            characters.currentCharacter >= characters.characterLimit
              ? "text-danger-100"
              : "text-gray-500",
          )}
        >
          <span>{characters.currentCharacter}</span>
          <span>/</span>
          <span>{characters.characterLimit}</span>
        </div>
      )}
    </div>
  );
};

export default UploadHeader;
