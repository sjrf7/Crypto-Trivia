/** @type {import('next').NextConfig} */
const nextConfig = {
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
    
    return config;
  },
};

module.exports = nextConfig;
