import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The render path holds a WebSocket open for roughly the duration of the
  // note, so this app must run as a long-lived Node server, never as edge or
  // serverless functions. See docs/bmad/recommended-mvp.md section 4.
  output: "standalone",
  // Pin the trace root to this project. Without it Next walks up and finds an
  // unrelated lockfile in the home directory, which produces a standalone
  // bundle missing files at deploy time.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
