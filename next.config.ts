import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
                hostname: '**',
            },
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
