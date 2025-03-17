/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    poolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    orgId: process.env.NEXT_PUBLIC_ORG_ID || 'default',
  },
  // Enable strict mode for enhanced development experience
  reactStrictMode: true,
  // Configure images domain if needed
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
