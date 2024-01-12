/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_ROUTE: process.env.BACKEND_ROUTE,
    BASE_URL: process.env.BASE_URL,
  },
};

module.exports = nextConfig;
