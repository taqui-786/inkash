"use client";

import { useState, useCallback, useEffect } from "react";
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
import InitialContentPlugin from "./plugins/initial-content-plugin";

import { $getRoot, type EditorState } from "lexical";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import {
  CopyIcon,
  NoteEditIcon,
  ShareIcon,
  Tick,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState("");
  const [shareHash, setShareHash] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [markdownContent, setMarkdownContent] = useState(initialValue ?? "");
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

  const refreshShareData = useCallback(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "");
    const baseUrl = `${window.location.origin}/`;
    const url = hash ? `${baseUrl}#${hash}` : baseUrl;
    setShareHash(hash);
    setShareUrl(url);
    setCopyStatus("idle");
  }, []);

  const handleCopyShareUrl = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("copied");
    } catch (error) {
      console.error("Failed to copy share URL", error);
      setCopyStatus("failed");
    }
  }, [shareUrl]);

  const handleGenerateQr = useCallback(() => {
    if (!shareHash) return;
    router.push(`/qr-code?hash=${encodeURIComponent(shareHash)}`);
  }, [router, shareHash]);

  const handleDownloadMarkdown = useCallback(() => {
    if (typeof window === "undefined") return;
    const content = markdownContent ?? "";
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[T:]/g, "-");
    anchor.href = url;
    anchor.download = `inkash-${timestamp}.md`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }, [markdownContent]);

  useEffect(() => {
    if (copyStatus !== "copied") return;
    const timeoutId = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copyStatus]);

  useEffect(() => {
    if (initialValue === undefined) return;
    setMarkdownContent(initialValue);
  }, [initialValue]);

  const toggleMode = () => {
    setMode((prev) => (prev === "preview" ? "edit" : "preview"));
  };


  return (
    <div className="notebook-page w-full max-w-5xl mx-auto rounded-2xl overflow-hidden">
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
                <ContentEditable className="lexical-editor-input focus:outline-none min-h-[420px] md:px-8 px-4 py-6 outline-none text-foreground resize-none overflow-auto leading-relaxed font-normal font-mono" />
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
            <OnChangeWrapper
              onChange={(editorState, markdown) => {
                setMarkdownContent(markdown);
                onChange?.(editorState, markdown);
              }}
            />
            <InitialContentPlugin initialMarkdown={initialValue} />
          </div>
        </div>
      </LexicalComposer>

      {/* Footer */}
      <footer className="flex items-center justify-between md:px-8 px-4 py-4 border-t">
        <span className="  text-muted-foreground/70 font-medium tracking-wide text-xs sm:text-sm">
          {calculateReadingTime(wordCount)}
        </span>
        <AlertDialog onOpenChange={(open) => open && refreshShareData()}>
          <AlertDialogTrigger asChild>
            <Button size="lg" aria-label="Share">
              <HugeiconsIcon icon={ShareIcon} />
              Share
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[min(92vw,540px)] max-w-md gap-4">
            <AlertDialogHeader className="gap-2 text-left sm:text-left sm:place-items-start">
              <AlertDialogTitle>Share this link</AlertDialogTitle>
              <AlertDialogDescription>
                Copy the full URL with your hash, or generate a QR code.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Share URL
                </span>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    value={shareUrl}
                    readOnly
                    placeholder="Generate your link by typing..."
                    aria-label="Share URL"
                  />
                  <Button
                    size="icon-lg"
                    variant="secondary"
                    onClick={handleCopyShareUrl}
                    disabled={!shareUrl}
                  >
                    {copyStatus === "copied"
                      ? <HugeiconsIcon icon={Tick} />
                      : copyStatus === "failed"
                        ? <HugeiconsIcon icon={CopyIcon} />
                        : <HugeiconsIcon icon={CopyIcon} />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <span>Need a QR code?</span>
                <Button
                  size="sm"
                  onClick={handleGenerateQr}
                  disabled={!shareHash}
                >
                  Generate QR
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                <span>Export your markdown</span>
                <Button
                  size="sm"
                  onClick={handleDownloadMarkdown}
                  disabled={!markdownContent.trim()}
                >
                  Download .md
                </Button>
              </div>
              {!shareHash && (
                <p className="text-xs text-muted-foreground">
                  Start typing to generate a shareable hash link.
                </p>
              )}
            </div>
            <AlertDialogFooter className="sm:justify-end">
              <AlertDialogCancel size="sm">Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </footer>
    </div>
  );
}
