"use client";

import { useCoverLetterGenerator } from "@/app/hooks/useCoverLetterGenerator";
import {
  CoverLetterLength,
  CoverLetterTone,
  coverLetterLengths,
  coverLetterTones,
} from "@/util/schemas/coverLetter.schema";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import clsx from "clsx";
import { useState } from "react";
import CopyButton from "../CopyButton";
import SegmentedControl from "../SegmentedControl";
import Toast from "../Toast";

interface Props {
  processId: string;
}

const toneLabels: Record<CoverLetterTone, string> = {
  professional: "Professional",
  warm: "Warm",
  confident: "Confident",
  concise: "Concise",
};

const lengthLabels: Record<CoverLetterLength, string> = {
  short: "Short",
  standard: "Standard",
  detailed: "Detailed",
};

const CoverLetterGenerator = ({ processId }: Props) => {
  const [tone, setTone] = useState<CoverLetterTone>("professional");
  const [length, setLength] = useState<CoverLetterLength>("standard");
  const [isEditing, setIsEditing] = useState(false);

  const {
    letters,
    selectedId,
    text,
    isStreaming,
    generateError,
    isSaving,
    saveError,
    justSaved,
    limitReached,
    textareaRef,
    selectLetter,
    editText,
    generate,
    saveEdits,
  } = useCoverLetterGenerator(processId);

  const [prevSelectedId, setPrevSelectedId] = useState(selectedId);
  if (selectedId !== prevSelectedId) {
    setPrevSelectedId(selectedId);
    setIsEditing(false);
  }

  const [prevJustSaved, setPrevJustSaved] = useState(justSaved);
  if (justSaved !== prevJustSaved) {
    setPrevJustSaved(justSaved);
    if (justSaved) setIsEditing(false);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="w-full lg:w-70 lg:shrink-0 border border-border rounded-lg bg-surface p-5 space-y-4">
        {letters.length > 0 && (
          <div>
            <p className="text-xs uppercase text-gray-500 mb-2">
              Saved letters
            </p>
            <div className="flex flex-wrap gap-2">
              {letters.map((letter, index) => (
                <button
                  key={letter.id}
                  type="button"
                  onClick={() => {
                    selectLetter(letter);
                    setTone(letter.tone);
                    setLength(letter.length);
                  }}
                  className={clsx(
                    "px-3 py-1.5 rounded-2xl text-xs border transition cursor-pointer",
                    selectedId === letter.id
                      ? "border-accent text-accent bg-accent/10"
                      : "border-border text-text hover:bg-border/40",
                  )}
                >
                  Letter {index + 1} · {toneLabels[letter.tone]}
                </button>
              ))}
            </div>
          </div>
        )}

        <SegmentedControl
          label="Tone"
          value={tone}
          options={coverLetterTones}
          optionLabels={toneLabels}
          onChange={setTone}
          disabled={isStreaming}
        />

        <SegmentedControl
          label="Length"
          value={length}
          options={coverLetterLengths}
          optionLabels={lengthLabels}
          onChange={setLength}
          disabled={isStreaming}
        />

        <div className="border-t border-border pt-4 space-y-2">
          <button
            onClick={() => generate(tone, length)}
            disabled={isStreaming || limitReached}
            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AutoAwesomeIcon sx={{ fontSize: 16 }} />
            {isStreaming
              ? "Writing…"
              : limitReached
                ? "Limit reached"
                : letters.length
                  ? "Regenerate letter"
                  : "Generate letter"}
          </button>
        </div>

        {generateError && (
          <p className="text-danger-100 text-xs">{generateError}</p>
        )}
      </div>

      <div className="flex-1 min-w-0 w-full border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3 bg-surface border-b border-border">
          <div className="flex items-center gap-2 text-sm text-text">
            <DescriptionOutlinedIcon sx={{ fontSize: 16 }} />
            Cover letter · {toneLabels[tone]}
          </div>
          {text && !isStreaming && (
            <div className="flex items-center gap-2">
              <CopyButton text={text} />
            </div>
          )}
        </div>

        <div className="p-5">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => editText(e.target.value)}
            readOnly={isStreaming || !isEditing}
            placeholder="Your tailored cover letter will appear here."
            rows={1}
            className="w-full bg-transparent min-h-32 text-sm text-white resize-none overflow-hidden focus-visible:outline-none"
          />
        </div>

        {text && !isStreaming ? (
          <div className="flex items-center justify-between gap-3 px-5 py-3 bg-surface border-t border-border">
            {saveError ? (
              <p className="text-danger-100 text-xs">{saveError}</p>
            ) : (
              <span />
            )}
            {isEditing ? (
              <button
                onClick={saveEdits}
                disabled={isSaving}
                className="btn-outline py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving…" : "Save changes"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title="Edit letter"
                className="shrink-0 text-white hover:text-white transition-colors cursor-pointer select-none"
              >
                <span className="text-white flex items-center gap-2 border border-border p-2 rounded-lg text-xs hover:bg-border/40 transition">
                  <EditOutlinedIcon sx={{ fontSize: 12 }} />
                  Edit
                </span>
              </button>
            )}
          </div>
        ) : (
          !text && <div className="h-5 bg-surface border-t border-border" />
        )}
      </div>

      <Toast show={justSaved} message="Changes saved" />
    </div>
  );
};

export default CoverLetterGenerator;
