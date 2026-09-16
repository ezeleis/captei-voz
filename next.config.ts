import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Parent folder has another package-lock.json; pin tracing to this app.
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
