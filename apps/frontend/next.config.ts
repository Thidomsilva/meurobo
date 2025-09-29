import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* Simplified config for stable build */
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compress: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development' ? [
      {
        source: '/api/robot/:path*',
        destination: 'http://localhost:4000/:path*',
      },
    ] : [];
  },
};

export default nextConfig;
