import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async headers() {
        return [{ source: '/sw.js', headers: [
            { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
            { key: 'Service-Worker-Allowed', value: '/' },
            { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        ] }];
    },
    // Reduce initial JS by improving tree-shaking for icon libs and other ESM packages
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    // Minor security/perf hardening
    poweredByHeader: false,
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'studentsenior.s3.ap-south-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'dixu7g0y1r80v.cloudfront.net',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
    },
};

export default nextConfig;
