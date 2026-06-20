"use client";

import { useState } from "react";
import clsx from "clsx";
import { useCoverLetterGenerator } from "@/app/hooks/useCoverLetterGenerator";
import {
  CoverLetterLength,
  CoverLetterTone,
  MAX_COVER_LETTERS,
  coverLetterLengths,
  coverLetterTones,
} from "@/util/schemas/coverLetter.schema";
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

  const {
    letters,
    selectedId,
    text,
    isStreaming,
    generateError,
    isSaving,
    saveError,
    justSaved,
    isDirty,
    limitReached,
    textareaRef,
    selectLetter,
    editText,
    generate,
    saveEdits,
  } = useCoverLetterGenerator(processId);

  return (
    <div className="border border-border rounded-lg p-6 bg-surface space-y-5">
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
                  "px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer",
                  selectedId === letter.id
                    ? "bg-accent border-accent text-white"
                    : "border-border text-text hover:bg-border/40",
                )}
              >
                Letter {index + 1} · {toneLabels[letter.tone]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
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
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => editText(e.target.value)}
        readOnly={isStreaming}
        placeholder="Your tailored cover letter will appear here."
        className="w-full border border-border rounded-lg p-4 bg-background min-h-64 max-h-[32rem] text-sm text-white resize-y focus-visible:outline-1 outline-accent"
      />

      {generateError && <p className="text-danger-100 text-xs">{generateError}</p>}
      {saveError && <p className="text-danger-100 text-xs">{saveError}</p>}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => generate(tone, length)}
          disabled={isStreaming || limitReached}
          className="btn-primary py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStreaming
            ? "Writing…"
            : limitReached
              ? "Limit reached"
              : letters.length
                ? "Generate another"
                : "Generate"}
        </button>
        {isDirty && !isStreaming && (
          <button
            onClick={saveEdits}
            disabled={isSaving}
            className="btn-outline py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        )}
        {text && !isStreaming && <CopyButton text={text} />}
        <p className="text-xs text-gray-500">
          {letters.length} of {MAX_COVER_LETTERS} generated
        </p>
      </div>

      <Toast show={justSaved} message="Changes saved" />
    </div>
  );
};

export default CoverLetterGenerator;
