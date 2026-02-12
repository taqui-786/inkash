'use client'

import {  useEffect, useMemo, useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

function QrCodeClient() {
      const [hash] = useQueryState("hash", parseAsString.withDefault(""));
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = useMemo(() => {
    if (!origin || !hash) return "";
    return `${origin}/#${hash}`;
  }, [origin, hash]);

  if (!hash) {
    return (
 
      <div className="flex-1 w-full px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            QR Code
          </p>
          <h1 className="mt-2 text-lg font-semibold font-display">
            No hash provided
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Return to the editor to generate a shareable link first.
          </p>
          <Button className="mt-4" size="sm" asChild>
            <Link href="/">Back to editor</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full md:max-w-2xl md:rounded-2xl md:border bg-card md:p-6 p-4 md:shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Scan to Open
            </p>
            <h1 className="mt-1 text-lg font-semibold font-display">
              Inkash Share
            </h1>
          </div>
          {shareUrl && (
            <Button size="sm" variant="secondary" asChild>
              <Link href={shareUrl}>Open Link</Link>
            </Button>
          )}
        </div>
        <div className="mt-4 rounded-2xl border bg-background p-4">
          <div className="aspect-square w-full">
            {shareUrl && (
              <QRCode
                value={shareUrl}
                size={512}
                bgColor="#ffffff"
                fgColor="#111111"
                style={{ height: "100%", width: "100%" }}
              />
            )}
          </div>
        </div>
        {shareUrl && (
          <p className="mt-4 break-all text-xs text-muted-foreground line-clamp-1">
            {shareUrl}
          </p>
        )}
      </div>
  )
}

export default QrCodeClient