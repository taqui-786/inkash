import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  LinkSquare02Icon,
  ShareIcon,
  UserLock02Icon,
  WifiOffIcon,
  QrCodeIcon,
  Download01Icon,
  Moon01Icon,
} from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Inkash - the privacy-first markdown editor that stores your content in the URL. No accounts, no cloud storage, instant sharing.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 w-full">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Inkash
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">
            Ink + Hash = Your Content in the URL
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-foreground/80 leading-relaxed">
              A beautifully simple web app that lets you create{" "}
              <span className="font-semibold text-primary">
                Markdown documents
              </span>{" "}
              or{" "}
              <span className="font-semibold text-blue-500">
                Canvas drawings
              </span>{" "}
              — and stores everything directly in the URL.
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-16 border border-border">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            What is Inkash?
          </h2>
          <p className="text-lg text-foreground/90 leading-relaxed mb-6 text-center max-w-3xl mx-auto">
            No sign-ups. No cloud storage. No cookies.{" "}
            <span className="font-semibold text-primary">
              Your content is the link.
            </span>
          </p>
          <div className="space-y-4 text-center text-muted-foreground">
            <p className="text-base">Write a quick note. Sketch an idea.</p>
            <p className="text-base">Copy the URL. Share it anywhere.</p>
            <p className="text-2xl font-bold text-foreground">Done.</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            ✨ Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* High Level Markdown Editor */}
            <FeatureCard
              icon={CheckmarkCircle01Icon}
              title="High Level Markdown Editor"
              description="Professional markdown editing with real-time preview and formatting tools"
            />

            {/* URL Storage */}
            <FeatureCard
              icon={LinkSquare02Icon}
              title="URL Storage"
              description="Your entire document is compressed and encoded into the URL hash. The link IS your file"
            />

            {/* Instant Sharing */}
            <FeatureCard
              icon={ShareIcon}
              title="Instant Sharing"
              description="No uploading. No waiting. Just copy the URL and send it — the recipient sees exactly what you created"
            />

            {/* Zero Accounts */}
            <FeatureCard
              icon={UserLock02Icon}
              title="Zero Accounts"
              description="No login. No email. No tracking. Completely anonymous and private"
            />

            {/* Offline Ready */}
            <FeatureCard
              icon={WifiOffIcon}
              title="Offline Ready"
              description="Works without internet once loaded. Your browser caches everything"
            />

            {/* QR Code Sharing */}
            <FeatureCard
              icon={QrCodeIcon}
              title="QR Code Sharing"
              description="Generate a QR code for any document — perfect for sharing on mobile or presentations"
            />

            {/* Export Options */}
            <FeatureCard
              icon={Download01Icon}
              title="Export Options"
              description="Download your work as HTML, TXT (Markdown) or PNG, SVG (Canvas)"
            />

            {/* Dark Mode */}
            <FeatureCard
              icon={Moon01Icon}
              title="Dark Mode"
              description="Automatic system theme detection with beautiful light and dark modes"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-linear-to-br from-primary/10 to-blue-500/10 rounded-2xl p-8 md:p-12 border border-primary/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Creating?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            No installation required. Just start writing or drawing. Your
            content lives in the URL, forever yours.
          </p>
          <Link href="/">
            <Button size="lg" className="text-lg px-8">
              Start Creating Now
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Made with ❤️ by{" "}
            <a
              href="https://taqui.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline font-medium"
            >
              Taqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <HugeiconsIcon icon={icon} className="size-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
