/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add empty turbopack config to silence the warning
  turbopack: {},
  // Exclude server-side packages that have issues with bundling
  serverComponentsExternalPackages: [
    'pino',
    'pino-pretty',
    'thread-stream',
    '@walletconnect/logger',
    'lokijs',
    'encoding'
  ],
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
}

export default nextConfig
