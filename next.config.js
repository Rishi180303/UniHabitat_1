/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['framer-motion'],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 