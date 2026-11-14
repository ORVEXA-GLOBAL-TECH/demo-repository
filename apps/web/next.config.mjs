import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // The shared client lives in ../../packages, so trace from the repo root.
  outputFileTracingRoot: path.resolve(here, '../..'),
  experimental: { externalDir: true },
};

export default nextConfig;
