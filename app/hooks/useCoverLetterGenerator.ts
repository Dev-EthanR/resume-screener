import { getErrorMessage } from "@/lib/getErrorMessage";
import {
  CoverLetterLength,
  CoverLetterTone,
  MAX_COVER_LETTERS,
  parseStreamResult,
} from "@/util/schemas/coverLetter.schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useReducer, useRef } from "react";

export interface SavedCoverLetter {
  id: string;
  tone: CoverLetterTone;
  length: CoverLetterLength;
  content: string;
  createdAt: string;
}

interface State {
  selectedId: string | null;
  text: string;
  isStreaming: boolean;
  generateError: string | null;
  isSaving: boolean;
  saveError: string | null;
  justSaved: boolean;
}

const initialState: State = {
  selectedId: null,
  text: "",
  isStreaming: false,
  generateError: null,
  isSaving: false,
  saveError: null,
  justSaved: false,
};

type Action =
  | { type: "GENERATE_START" }
  | { type: "STREAM_CHUNK"; chunk: string }
  | { type: "GENERATE_SUCCESS"; letterId: string; text: string }
  | { type: "GENERATE_ERROR"; error: string; text: string }
  | { type: "SELECT_LETTER"; letter: SavedCoverLetter }
  | { type: "EDIT_TEXT"; text: string }
  | { type: "SAVE_START" }
  | { type: "SAVE_SUCCESS" }
  | { type: "SAVE_ERROR"; error: string }
  | { type: "CLEAR_JUST_SAVED" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "GENERATE_START":
      return {
        ...state,
        isStreaming: true,
        selectedId: null,
        text: "",
        generateError: null,
        saveError: null,
        justSaved: false,
      };
    case "STREAM_CHUNK":
      return { ...state, text: state.text + action.chunk };
    case "GENERATE_SUCCESS":
      return {
        ...state,
        isStreaming: false,
        selectedId: action.letterId,
        text: action.text,
      };
    case "GENERATE_ERROR":
      return {
        ...state,
        isStreaming: false,
        generateError: action.error,
        text: action.text,
      };
    case "SELECT_LETTER":
      return {
        ...state,
        selectedId: action.letter.id,
        text: action.letter.content,
        isStreaming: false,
        generateError: null,
        saveError: null,
        justSaved: false,
      };
    case "EDIT_TEXT":
      return { ...state, text: action.text, justSaved: false };
    case "SAVE_START":
      return { ...state, isSaving: true, saveError: null };
    case "SAVE_SUCCESS":
      return { ...state, isSaving: false, justSaved: true };
    case "SAVE_ERROR":
      return { ...state, isSaving: false, saveError: action.error };
    case "CLEAR_JUST_SAVED":
      return { ...state, justSaved: false };
    default:
      return state;
  }
}

async function fetchCoverLetters(
  processId: string,
): Promise<SavedCoverLetter[]> {
  const res = await axios.get(`/api/process/${processId}/cover-letter`);
  return res.data;
}

export function useCoverLetterGenerator(processId: string) {
  const queryClient = useQueryClient();
  const { data: letters = [] } = useQuery({
    queryKey: ["cover-letters", processId],
    queryFn: () => fetchCoverLetters(processId),
  });

  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const justSavedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (justSavedTimeoutRef.current) {
        clearTimeout(justSavedTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    if (state.isStreaming) {
      el.scrollTop = el.scrollHeight;
    }
  }, [state.text, state.isStreaming]);

  const selectedLetter = letters.find(
    (letter) => letter.id === state.selectedId,
  );
  const isDirty = !!selectedLetter && state.text !== selectedLetter.content;
  const remaining = MAX_COVER_LETTERS - letters.length;
  const limitReached = remaining <= 0;

  function selectLetter(letter: SavedCoverLetter) {
    abortRef.current?.abort();
    dispatch({ type: "SELECT_LETTER", letter });
  }

  function editText(text: string) {
    dispatch({ type: "EDIT_TEXT", text });
  }

  async function generate(tone: CoverLetterTone, length: CoverLetterLength) {
    if (limitReached || state.isStreaming) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    dispatch({ type: "GENERATE_START" });

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
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        dispatch({ type: "STREAM_CHUNK", chunk });
      }

      const { text, letterId, streamError } = parseStreamResult(accumulated);

      if (streamError || !letterId) {
        dispatch({
          type: "GENERATE_ERROR",
          error:
            "Something went wrong while writing your cover letter. Please try again.",
          text,
        });
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["cover-letters", processId],
      });
      dispatch({ type: "GENERATE_SUCCESS", letterId, text });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      dispatch({
        type: "GENERATE_ERROR",
        error: getErrorMessage(err, "Something went wrong. Please try again."),
        text: "",
      });
    }
  }

  async function saveEdits() {
    if (!state.selectedId || state.isSaving) return;

    dispatch({ type: "SAVE_START" });
    try {
      const res = await axios.patch(
        `/api/process/${processId}/cover-letter/${state.selectedId}`,
        { content: state.text },
      );
      queryClient.setQueryData<SavedCoverLetter[]>(
        ["cover-letters", processId],
        (old) =>
          old?.map((letter) =>
            letter.id === state.selectedId ? res.data : letter,
          ) ?? old,
      );
      dispatch({ type: "SAVE_SUCCESS" });
      if (justSavedTimeoutRef.current) {
        clearTimeout(justSavedTimeoutRef.current);
      }
      justSavedTimeoutRef.current = setTimeout(() => {
        dispatch({ type: "CLEAR_JUST_SAVED" });
        justSavedTimeoutRef.current = null;
      }, 2000);
    } catch (err) {
      dispatch({
        type: "SAVE_ERROR",
        error: getErrorMessage(err, "Couldn't save your changes."),
      });
    }
  }

  return {
    letters,
    ...state,
    selectedLetter,
    isDirty,
    remaining,
    limitReached,
    textareaRef,
    selectLetter,
    editText,
    generate,
    saveEdits,
  };
}
