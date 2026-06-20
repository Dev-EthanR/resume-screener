"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CopyButton from "../CopyButton";
import {
  CoverLetterLength,
  CoverLetterTone,
  coverLetterLengths,
  coverLetterTones,
} from "@/util/schemas/coverLetter.schema";

interface Props {
  processId: string;
}

interface SavedCoverLetter {
  id: string;
  tone: CoverLetterTone;
  length: CoverLetterLength;
  content: string;
  createdAt: string;
}

const MAX_COVER_LETTERS = 3;

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

async function fetchCoverLetters(
  processId: string,
): Promise<SavedCoverLetter[]> {
  const res = await axios.get(`/api/process/${processId}/cover-letter`);
  return res.data;
}

const CoverLetterGenerator = ({ processId }: Props) => {
  const queryClient = useQueryClient();
  const { data: letters = [] } = useQuery({
    queryKey: ["cover-letters", processId],
    queryFn: () => fetchCoverLetters(processId),
  });

  const [tone, setTone] = useState<CoverLetterTone>("professional");
  const [length, setLength] = useState<CoverLetterLength>("standard");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = MAX_COVER_LETTERS - letters.length;
  const limitReached = remaining <= 0;
  const selectedLetter = letters.find((letter) => letter.id === selectedId);
  const isDirty = !!selectedLetter && text !== selectedLetter.content;

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (isStreaming && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text, isStreaming]);

  function selectLetter(letter: SavedCoverLetter) {
    abortRef.current?.abort();
    setIsStreaming(false);
    setError(null);
    setSaveError(null);
    setJustSaved(false);
    setSelectedId(letter.id);
    setText(letter.content);
    setTone(letter.tone);
    setLength(letter.length);
  }

  async function saveEdits() {
    if (!selectedId || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await axios.patch(
        `/api/process/${processId}/cover-letter/${selectedId}`,
        { content: text },
      );
      queryClient.setQueryData<SavedCoverLetter[]>(
        ["cover-letters", processId],
        (old) =>
          old?.map((letter) =>
            letter.id === selectedId ? res.data : letter,
          ) ?? old,
      );
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      setSaveError(
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? "Couldn't save your changes."
          : "Couldn't save your changes.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function generate() {
    if (limitReached || isStreaming) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setSaveError(null);
    setJustSaved(false);
    setSelectedId(null);
    setText("");
    setIsStreaming(true);

    try {
      const res = await fetch(`/api/process/${processId}/cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone, length }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.error ?? "Something went wrong. Please try again.",
        );
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((prev) => prev + decoder.decode(value, { stream: true }));
      }
      await queryClient.invalidateQueries({
        queryKey: ["cover-letters", processId],
      });
      const updated = queryClient.getQueryData<SavedCoverLetter[]>([
        "cover-letters",
        processId,
      ]);
      const newest = updated?.[updated.length - 1];
      if (newest) setSelectedId(newest.id);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsStreaming(false);
    }
  }

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
                onClick={() => selectLetter(letter)}
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
        <div>
          <p className="text-xs uppercase text-gray-500 mb-2">Tone</p>
          <div className="flex flex-wrap gap-2">
            {coverLetterTones.map((value) => (
              <button
                key={value}
                type="button"
                disabled={isStreaming}
                onClick={() => setTone(value)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                  tone === value
                    ? "bg-accent border-accent text-white"
                    : "border-border text-text hover:bg-border/40",
                )}
              >
                {toneLabels[value]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-500 mb-2">Length</p>
          <div className="flex flex-wrap gap-2">
            {coverLetterLengths.map((value) => (
              <button
                key={value}
                type="button"
                disabled={isStreaming}
                onClick={() => setLength(value)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                  length === value
                    ? "bg-accent border-accent text-white"
                    : "border-border text-text hover:bg-border/40",
                )}
              >
                {lengthLabels[value]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setJustSaved(false);
        }}
        readOnly={isStreaming}
        placeholder="Your tailored cover letter will appear here."
        className="w-full border border-border rounded-lg p-4 bg-background min-h-64 max-h-[32rem] text-sm text-white resize-y focus-visible:outline-1 outline-accent"
      />

      {error && <p className="text-danger-100 text-xs">{error}</p>}
      {saveError && <p className="text-danger-100 text-xs">{saveError}</p>}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={generate}
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
        {justSaved && !isDirty && (
          <span className="text-success text-xs">Changes saved</span>
        )}
        {text && !isStreaming && <CopyButton text={text} />}
        <p className="text-xs text-gray-500">
          {letters.length} of {MAX_COVER_LETTERS} generated
        </p>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
