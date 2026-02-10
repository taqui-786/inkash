"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/app/hooks/use-scroll";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github, Info, Plus } from "@hugeicons/core-free-icons";
import Link from "next/link";

function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between md:px-4 px-2">
        <a
          className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
          href="#"
        >
          <Logo />
        </a>
        <div className=" items-center gap-2 flex">
          <Link href="/about" className="hidden md:block decoration-0">
            <Button size="lg" variant="ghost">
		  <HugeiconsIcon icon={Info} />
              About
            </Button>
          </Link>
          <a
            href="https://github.com/taqui-786/inkash"
            className="decoration-0"
          >
            <Button size="lg" variant="ghost">
              <HugeiconsIcon icon={Github} />
              Github
            </Button>
          </a>
          <Link href="/">
            <Button size="lg">
              <HugeiconsIcon icon={Plus} />
              Create New{" "}
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
export default Header;
