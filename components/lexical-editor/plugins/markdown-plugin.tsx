"use client";

import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

export default function MarkdownPlugin() {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
}
