import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "lexical",
    "@lexical/react",
    "@lexical/rich-text",
    "@lexical/list",
    "@lexical/link",
    "@lexical/code",
    "@lexical/markdown",
    "@lexical/selection",
    "@lexical/utils",
  ],
};

export default nextConfig;
