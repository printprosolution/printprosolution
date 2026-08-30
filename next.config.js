/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Allow the file-upload API route to accept larger images (up to 8mb).
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

module.exports = nextConfig;
