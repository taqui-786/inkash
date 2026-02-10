"use client";

import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";

interface InitialContentPluginProps {
  initialMarkdown?: string;
}

export default function InitialContentPlugin({
  initialMarkdown,
}: InitialContentPluginProps) {
  const [editor] = useLexicalComposerContext();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!initialMarkdown || hasHydrated.current) return;
    hasHydrated.current = true;

    editor.update(() => {
      $convertFromMarkdownString(initialMarkdown, TRANSFORMERS);
    });
  }, [editor, initialMarkdown]);

  return null;
}
