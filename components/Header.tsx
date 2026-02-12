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
        "border-border bg-background/85 backdrop-blur-md shadow-[0_10px_30px_-25px_rgba(0,0,0,0.35)]":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between md:px-4 px-2">
        <a
          className="rounded-full p-2 hover:bg-muted/60 dark:hover:bg-muted/50 transition-colors"
          href="/"
        >
          <Logo />
        </a>
        <div className="flex items-center gap-2">
          <Link href="/about" className="hidden md:block decoration-0">
            <Button size="lg" variant="ghost" className="font-medium">
		  <HugeiconsIcon icon={Info} />
              About
            </Button>
          </Link>
          <a
            href="https://github.com/taqui-786/inkash"
            className="decoration-0"
          >
            <Button size="lg" variant="ghost" className="font-medium">
              <HugeiconsIcon icon={Github} />
              Github
            </Button>
          </a>
          
            <Button size="lg" className="shadow-sm" onClick={()=> {
              window.location.assign("/");
            }}>
              <HugeiconsIcon icon={Plus} />
              Create New{" "}
            </Button>
         
        </div>
      </nav>
    </header>
  );
}
export default Header;
