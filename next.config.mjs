/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    // Loan KYC server action: multiple files up to 5 MB each (app/actions/loan-kyc.ts)
    serverActions: {
      bodySizeLimit: "32mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "img.clerk.com", pathname: "/**" },
      { protocol: "https", hostname: "images.clerk.dev", pathname: "/**" },
    ],
  },
};

export default nextConfig;
