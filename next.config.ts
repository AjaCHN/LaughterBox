import type {NextConfig} from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const isDeployingToVercel = process.env.VERCEL === '1';
const isDeployingToEdgeOne = process.env.EDGEONE === '1';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  ...(isDeployingToVercel || isDeployingToEdgeOne
    ? {}
    : { output: 'standalone' }),
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default withPWA(nextConfig);
