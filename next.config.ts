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
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
    // 对不同部署平台设置不同的优化器
    unoptimized: false,
  },
  // 根据部署平台设置输出模式
  ...(isDeployingToVercel || isDeployingToEdgeOne
    ? {}
    : { output: 'standalone' }),
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default withPWA(nextConfig);
