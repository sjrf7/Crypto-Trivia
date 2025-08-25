
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
    if (isServer) {
      config.externals.push(
        'handlebars',
        'lokijs',
        '@opentelemetry/exporter-jaeger',
        '@opentelemetry/sdk-node',
         // Genkit plugins depending on grpc may not work properly.
        'grpc',
        '@grpc/grpc-js',
        'express',
        'firebase-admin'
      );
    }
    return config;
  },
};

module.exports = nextConfig;
