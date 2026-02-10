"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { LexicalEditor } from "./lexical-editor";
import {
  deflateEncode,
  deflateTryDecode,
  createDeflateContent,
  type DeflateContentObjectType,
} from "@/lib/deflate";

const DEBOUNCE_MS = 300;

function MainClient() {
  const [initialMarkdown, setInitialMarkdown] = useState<string | undefined>(
    undefined,
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<DeflateContentObjectType | null>(null);

  useEffect(() => {
    async function hydrateFromHash() {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const decoded = await deflateTryDecode(hash);
        if (decoded) {
          contentRef.current = decoded;
          setInitialMarkdown(decoded.content);
        }
      }
      setIsHydrated(true);
    }
    hydrateFromHash();
  }, []);

  const handleChange = useCallback(
    (_editorState: unknown, markdown: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        const obj = createDeflateContent(markdown, {
          title: contentRef.current?.title,
          createdAt: contentRef.current?.createdAt,
          updatedAt: Date.now(),
          meta: contentRef.current?.meta,
        });

        contentRef.current = obj;
        const encoded = await deflateEncode(obj);
        window.history.replaceState(null, "", `#${encoded}`);
      }, DEBOUNCE_MS);
    },
    [],
  );

  if (!isHydrated) return null;

  return (
    <div className="max-w-5xl mx-auto w-full">
      <LexicalEditor onChange={handleChange} initialValue={initialMarkdown} />
    </div>
  );
}

export default MainClient;
