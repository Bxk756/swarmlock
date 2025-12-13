/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly disable Turbopack
  turbopack: false,

  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
