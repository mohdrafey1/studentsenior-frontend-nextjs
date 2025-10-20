import { MetadataRoute } from 'next';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://studentsenior.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/sign-in',
                    '/sign-up',
                    '/profile',
                    '/wallet',
                    '/payment/',
                    '/_next/',
                    '/static/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/sign-in',
                    '/sign-up',
                    '/profile',
                    '/wallet',
                    '/payment/',
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
