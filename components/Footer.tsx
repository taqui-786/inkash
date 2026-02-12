import { Heart } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

function Footer() {
  return (
    <div className="w-full border-t border-border/70 bg-background/70 backdrop-blur">
      <div className="max-w-6xl mx-auto w-full h-16 flex flex-col md:flex-row items-center md:justify-between justify-center gap-2 px-4 text-xs sm:text-sm">
        <p className="text-muted-foreground">
          (c) 2026 Inkash. All rights reserved.
        </p>
        <p className="text-muted-foreground inline-flex items-center gap-1">
          Made with{" "}
          <HugeiconsIcon
            icon={Heart}
            className="size-4 fill-red-500/80 animate-pulse"
          />{" "}
          by{" "}
          <a
            href="https://taqui.vercel.app"
            className="text-foreground hover:underline underline-offset-4"
          >
            Taqui
          </a>
        </p>
      </div>
    </div>
  );
}

export default Footer;
