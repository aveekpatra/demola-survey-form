import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Specify the correct workspace root for output file tracing
  // This prevents Next.js from incorrectly detecting parent lockfiles
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
