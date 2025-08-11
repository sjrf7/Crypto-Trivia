import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      }
    ],
  },
   webpack: (config, { isServer }) => {
    // Solves build errors with libraries that require server-only dependencies
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Solves "TypeError: (0 , eu.createContext) is not a function"
    // by ensuring a single version of React is used.
    config.resolve.alias = {
        ...config.resolve.alias,
        'react': path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
    };
    
    return config;
  },
};

export default nextConfig;
