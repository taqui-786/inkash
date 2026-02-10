"use client";

import { useState, useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { editorTheme } from "./theme";
import { editorNodes } from "./nodes";
import ToolbarPlugin from "./plugins/toolbar-plugin";
import MarkdownPlugin from "./plugins/markdown-plugin";
import CodeHighlightPlugin from "./plugins/code-highlight-plugin";
import LinkPlugin from "./plugins/link-plugin";
import ListPlugin from "./plugins/list-plugin";
import EditableStatePlugin from "./plugins/editable-state-plugin";
import OnChangeWrapper from "./plugins/on-change-plugin";

import { $getRoot, type EditorState } from "lexical";
import { Button } from "../ui/button";
import {
  EditIcon,
  NoteEditIcon,
  ShareIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface LexicalEditorProps {
  onChange?: (editorState: EditorState, markdown: string) => void;
  initialValue?: string;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calculateReadingTime(wordCount: number): string {
  const wpm = 200;
  const minutes = Math.ceil(wordCount / wpm);
  if (wordCount === 0) return "0 min read";
  return `~${minutes} min read`;
}

export default function LexicalEditor({
  onChange,
  initialValue,
}: LexicalEditorProps) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [wordCount, setWordCount] = useState(0);

  const isEditing = mode === "edit";

  const initialConfig = {
    namespace: "LexicalMarkdownEditor",
    theme: editorTheme,
    nodes: editorNodes,
    editable: false,
    onError: (error: Error) => {
      console.error("Lexical Error:", error);
    },
  };

  const handleEditorChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      const words = text.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    });
  }, []);

  const toggleMode = () => {
    setMode((prev) => (prev === "preview" ? "edit" : "preview"));
  };

  return (
    <div className="notebook-page">
      {/* Header */}
      <header className="flex items-center justify-between md:px-8 px-4 pt-6 pb-4 border-b">
        <span className="notebook-date text-xs sm:text-sm">
          {formatDate(new Date())}
        </span>

        <Button
          variant={"secondary"}
          size={"lg"}
          onClick={toggleMode}
          aria-label={isEditing ? "Switch to Preview" : "Switch to Edit"}
        >
          {isEditing ? (
            <HugeiconsIcon icon={ViewIcon} />
          ) : (
            <HugeiconsIcon icon={NoteEditIcon} />
          )}
            {isEditing ? "Preview" : "Edit"}
        </Button>
      </header>

      {/* Editor */}
      <LexicalComposer initialConfig={initialConfig}>
        <div className="notebook-editor-wrapper">
          {/* Toolbar - only render when editing */}
          {isEditing && (
            <div className="notebook-toolbar-container notebook-toolbar-visible">
              <ToolbarPlugin />
            </div>
          )}

          {/* Content Area */}
          <div className="lexical-editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="lexical-editor-input focus:outline-none min-h-[420px] md:px-8 px-4 py-6 outline-none text-foreground resize-none overflow-auto leading-relaxed font-medium" />
              }
              placeholder={
                <div className="lexical-editor-placeholder">
                  {isEditing
                    ? "Start writing your thoughts..."
                    : "Click Edit to start writing..."}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {isEditing && <AutoFocusPlugin />}
            <MarkdownPlugin />
            <CodeHighlightPlugin />
            <LinkPlugin />
            <ListPlugin />
            <EditableStatePlugin editable={isEditing} />
            <OnChangePlugin onChange={handleEditorChange} />
            {onChange && <OnChangeWrapper onChange={onChange} />}
          </div>
        </div>
      </LexicalComposer>

      {/* Footer */}
      <footer className="flex items-center justify-between md:px-8 px-4 py-4 border-t">
        <span className="  text-muted-foreground/70 font-medium tracking-wide text-xs sm:text-sm">
          {calculateReadingTime(wordCount)}
        </span>
        <Button
          size="lg"
          onClick={() => {}}
          aria-label="Share"
        >
          <HugeiconsIcon icon={ShareIcon} />
         Share
        </Button>
      </footer>
    </div>
  );
}
