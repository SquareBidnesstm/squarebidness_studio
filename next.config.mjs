/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "videodelivery.net" },
      { protocol: "https", hostname: "*.cloudflarestream.com" },
      { protocol: "https", hostname: "imagedelivery.net" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/stripe/webhook/", destination: "/api/stripe/webhook" },
    ];
  },
};
export default nextConfig;
