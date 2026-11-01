/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone in container environments, standard on Vercel
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
