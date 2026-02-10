"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface EditableStatePluginProps {
  editable: boolean;
}

export default function EditableStatePlugin({
  editable,
}: EditableStatePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);

  return null;
}
