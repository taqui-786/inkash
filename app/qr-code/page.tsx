import { Suspense } from "react";
import QrCodeClient from "./QrCodeClient";

export default function QrCodePage() {
  return (
    <div className="flex-1 w-full flex items-center justify-center px-4 py-2">
      <Suspense fallback={

        <div className="flex-1 w-full px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            QR Code
          </p>
          <h1 className="mt-2 text-lg font-semibold font-display">
            Loading...
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we generate your QR code.
          </p>
        </div>
      </div>
      }>
        <QrCodeClient />
      </Suspense>
    </div>
  );
}
