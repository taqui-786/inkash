"use client";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { EditorState } from "lexical";
import { useCallback } from "react";

interface OnChangeWrapperProps {
  onChange?: (editorState: EditorState, markdown: string) => void;
}

export default function OnChangeWrapper({ onChange }: OnChangeWrapperProps) {
  const handleChange = useCallback(
    (editorState: EditorState) => {
      if (onChange) {
        editorState.read(() => {
          const markdown = $convertToMarkdownString(TRANSFORMERS);
          console.log('inside', markdown);
          
          onChange(editorState, markdown);
        });
      }
    },
    [onChange],
  );

  return <OnChangePlugin onChange={handleChange} />;
}
