"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowHorizontalIcon,
  CheckListIcon,
  CodeSimpleIcon,
  LeftToRightListNumberIcon,
  ParagraphBulletsPoint02Icon,
  Redo03Icon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  Undo03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  // unused blockType warning resolved by removing setBlockType state if unused, but formatBlock uses it?
  // Original file had blockType state but didn't use it except for updates. The formatBlock uses args.
  // Actually, formatBlock uses the argument passed to it. The state updateToolbar set format states.
  // I'll keep the state as is to avoid breaking anything implicit, though blockType state seems unused in render.

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
    );
  }, [editor, updateToolbar]);

  const formatText = (
    format: "bold" | "italic" | "underline" | "strikethrough" | "code",
  ) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatBlock = (type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (type === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (type === "h1" || type === "h2" || type === "h3") {
          $setBlocksType(selection, () =>
            $createHeadingNode(type as HeadingTagType),
          );
        } else if (type === "quote") {
          $setBlocksType(selection, () => $createQuoteNode());
        } else if (type === "code") {
          $setBlocksType(selection, () => $createCodeNode());
        }
      }
    });
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-0.5 sm:gap-1 border-b border-border bg-muted/30 p-1.5 sm:p-2 rounded-t-lg min-w-max">
        {/* Text Format */}
        <div className="flex gap-0.5 sm:gap-1 border-r border-border pr-1.5 sm:pr-2">
          <Button
            variant={isBold ? "default" : "ghost"}
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() => formatText("bold")}
            aria-label="Bold"
          >
            <HugeiconsIcon icon={TextBoldIcon} />
          </Button>
          <Button
            variant={isItalic ? "default" : "ghost"}
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() => formatText("italic")}
            aria-label="Italic"
          >
            <HugeiconsIcon icon={TextItalicIcon} />
          </Button>
          <Button
            variant={isUnderline ? "default" : "ghost"}
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() => formatText("underline")}
            aria-label="Underline"
          >
            <HugeiconsIcon icon={TextUnderlineIcon} />
          </Button>
          <Button
            variant={isStrikethrough ? "default" : "ghost"}
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() => formatText("strikethrough")}
            aria-label="Strikethrough"
          >
            <HugeiconsIcon icon={TextStrikethroughIcon} />
          </Button>
          <Button
            variant={isCode ? "default" : "ghost"}
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() => formatText("code")}
            aria-label="Code"
          >
            <HugeiconsIcon icon={CodeSimpleIcon} />
          </Button>
        </div>

        {/* Block Type */}
        <div className="flex gap-0.5 sm:gap-1 px-1 sm:px-2">
          <select
            onChange={(e) => formatBlock(e.target.value)}
            className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-transparent hover:bg-accent text-xs sm:text-sm text-foreground font-normal min-w-[80px] sm:min-w-[100px]"
            aria-label="Block Type"
          >
            <option value="paragraph">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="quote">Quote</option>
            <option value="code">Code Block</option>
          </select>
        </div>

        {/* Lists */}
        <div className="flex gap-0.5 sm:gap-1 border-x border-border px-1.5 sm:pr-2">
          <Button
            variant="ghost"
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() =>
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            }
            aria-label="Bullet List"
          >
            <HugeiconsIcon icon={ParagraphBulletsPoint02Icon} />
          </Button>
          <Button
            variant="ghost"
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() =>
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            }
            aria-label="Numbered List"
          >
            <HugeiconsIcon icon={LeftToRightListNumberIcon} />
          </Button>
          <Button
            variant="ghost"
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() =>
              editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
            }
            aria-label="Check List"
          >
            <HugeiconsIcon icon={CheckListIcon} />
          </Button>
        </div>

        {/* Insert */}
        <div className="flex gap-0.5 sm:gap-1 border-r border-border pr-1.5 sm:pr-2">
          <Button
            variant="ghost"
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() =>
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
            }
            aria-label="Horizontal Rule"
          >
            <HugeiconsIcon icon={ArrowHorizontalIcon} />
          </Button>
        </div>

        {/* History */}
        <div className="flex gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
            aria-label="Undo"
          >
            <HugeiconsIcon icon={Undo03Icon} />
          </Button>
          <Button
            variant="ghost"
            size="icon-lg"
            className="sm:h-9 sm:w-9"
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
            aria-label="Redo"
          >
            <HugeiconsIcon icon={Redo03Icon} />
          </Button>
        </div>
      </div>
    </div>
  );
}
