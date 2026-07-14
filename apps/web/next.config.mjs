/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lint alohida (turbo/CI) o'tkaziladi — Vercel build'ni sekinlashtirmaslik uchun.
  eslint: { ignoreDuringBuilds: true },
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
