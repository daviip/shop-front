/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "0.0.0.0"],
  },
  env: {
    URL_BACK: process.env.URL_BACK,
  },
};

module.exports = nextConfig;
