/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'tailwindcss.com' },
      { protocol: 'https', hostname: 'supabase.com' },
      { protocol: 'https', hostname: 'ui.shadcn.com' },
      { protocol: 'https', hostname: 'lucide.dev' }
    ]
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
};

export default nextConfig; 