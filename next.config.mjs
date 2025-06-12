/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Abaikan error ESLint saat build
  },
};

export default nextConfig;
