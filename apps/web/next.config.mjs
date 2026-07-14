/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@invitation/domain',
    '@invitation/application',
    '@invitation/infrastructure',
    '@invitation/contracts',
    '@invitation/i18n',
  ],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
