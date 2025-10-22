import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'res.cloudinary.com',
            'studentsenior.s3.ap-south-1.amazonaws.com',
            'dixu7g0y1r80v.cloudfront.net',
            'lh3.googleusercontent.com',
            'img.youtube.com',
            'avatars.githubusercontent.com',
        ],
    },
    // Force cache busting for PWA migration
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                    {
                        key: 'Expires',
                        value: '0',
                    },
                    {
                        key: 'Clear-Site-Data',
                        value: '"cache", "cookies", "storage"',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
