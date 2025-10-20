import { MetadataRoute } from 'next';

const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'
).replace(/\/api\/v2$/, '');
const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://studentsenior.com';

// Helper function to sanitize slugs for XML
function sanitizeSlug(slug: string): string {
    if (!slug) return '';
    // URL encode the slug to handle special characters like &, <, >, etc.
    // Then replace %20 with - for better readability
    return encodeURIComponent(slug).replace(/%20/g, '-');
}

interface SitemapItem {
    slug: string;
    updatedAt?: string;
    collegeSlug?: string;
}

interface SitemapData {
    colleges: SitemapItem[];
    pyqs: SitemapItem[];
    notes: SitemapItem[];
    videos: SitemapItem[];
    seniors: SitemapItem[];
    opportunities: SitemapItem[];
    // groups: SitemapItem[];
    lostFound: SitemapItem[];
    store: SitemapItem[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const currentDate = new Date();

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/sign-in`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/sign-up`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/profile`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/wallet`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/collections`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/leaderboard`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/add-college`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
    ];

    try {
        // Fetch all sitemap data in a single API call
        console.log(`[Sitemap] Fetching from: ${API_BASE_URL}/api/v2/sitemap`);

        const response = await fetch(`${API_BASE_URL}/api/v2/sitemap`, {
            next: { revalidate: 3600 }, // Revalidate every hour
            cache: 'no-store', // Disable cache during development
        });

        if (!response.ok) {
            console.error(
                `[Sitemap] Failed to fetch sitemap data: ${response.status} ${response.statusText}`,
            );
            return staticRoutes;
        }

        const apiResponse = await response.json();

        if (!apiResponse.success || !apiResponse.data) {
            console.error(
                '[Sitemap] Invalid API response structure:',
                apiResponse,
            );
            return staticRoutes;
        }

        const sitemapData: SitemapData = apiResponse.data;

        console.log(`[Sitemap] Successfully fetched data:`, {
            colleges: sitemapData.colleges?.length || 0,
            pyqs: sitemapData.pyqs?.length || 0,
            notes: sitemapData.notes?.length || 0,
            videos: sitemapData.videos?.length || 0,
            seniors: sitemapData.seniors?.length || 0,
            opportunities: sitemapData.opportunities?.length || 0,
            // groups: sitemapData.groups?.length || 0,
            lostFound: sitemapData.lostFound?.length || 0,
            store: sitemapData.store?.length || 0,
        });

        const dynamicRoutes: MetadataRoute.Sitemap = [];

        // College pages
        (sitemapData.colleges || []).forEach((college) => {
            const collegeSlug = sanitizeSlug(college.slug);
            dynamicRoutes.push({
                url: `${SITE_URL}/${collegeSlug}`,
                lastModified: college.updatedAt
                    ? new Date(college.updatedAt)
                    : currentDate,
                changeFrequency: 'weekly',
                priority: 0.9,
            });

            // College sub-pages
            const collegeSubPages = [
                'pyqs',
                'notes',
                'videos',
                'seniors',
                'opportunities',
                'groups',
                'lost-found',
                'store',
                'community',
                'resources',
            ];

            collegeSubPages.forEach((page) => {
                dynamicRoutes.push({
                    url: `${SITE_URL}/${collegeSlug}/${page}`,
                    lastModified: currentDate,
                    changeFrequency: 'daily',
                    priority: 0.8,
                });
            });
        });

        // PYQ pages
        (sitemapData.pyqs || []).forEach((pyq) => {
            if (pyq.collegeSlug) {
                dynamicRoutes.push({
                    url: `${SITE_URL}/${sanitizeSlug(pyq.collegeSlug)}/pyqs/${sanitizeSlug(pyq.slug)}`,
                    lastModified: pyq.updatedAt
                        ? new Date(pyq.updatedAt)
                        : currentDate,
                    changeFrequency: 'monthly',
                    priority: 0.7,
                });
            }
        });

        // Notes pages
        (sitemapData.notes || []).forEach((note) => {
            if (note.collegeSlug) {
                dynamicRoutes.push({
                    url: `${SITE_URL}/${sanitizeSlug(note.collegeSlug)}/notes/${sanitizeSlug(note.slug)}`,
                    lastModified: note.updatedAt
                        ? new Date(note.updatedAt)
                        : currentDate,
                    changeFrequency: 'monthly',
                    priority: 0.7,
                });
            }
        });

        // Video pages
        (sitemapData.videos || []).forEach((video) => {
            if (video.collegeSlug) {
                dynamicRoutes.push({
                    url: `${SITE_URL}/${sanitizeSlug(video.collegeSlug)}/videos/${sanitizeSlug(video.slug)}`,
                    lastModified: video.updatedAt
                        ? new Date(video.updatedAt)
                        : currentDate,
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            }
        });

        // Senior pages
        (sitemapData.seniors || []).forEach((senior) => {
            if (senior.collegeSlug) {
                dynamicRoutes.push({
                    url: `${SITE_URL}/${sanitizeSlug(senior.collegeSlug)}/seniors/${sanitizeSlug(senior.slug)}`,
                    lastModified: senior.updatedAt
                        ? new Date(senior.updatedAt)
                        : currentDate,
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            }
        });

        // Opportunity pages
        (sitemapData.opportunities || []).forEach((opportunity) => {
            if (opportunity.collegeSlug) {
                dynamicRoutes.push({
                    url: `${SITE_URL}/${sanitizeSlug(opportunity.collegeSlug)}/opportunities/${sanitizeSlug(opportunity.slug)}`,
                    lastModified: opportunity.updatedAt
                        ? new Date(opportunity.updatedAt)
                        : currentDate,
                    changeFrequency: 'weekly',
                    priority: 0.6,
                });
            }
        });

        // Group pages
        // (sitemapData.groups || []).forEach((group) => {
        //     if (group.collegeSlug) {
        //         dynamicRoutes.push({
        //             url: `${SITE_URL}/${group.collegeSlug}/groups/${group.slug}`,
        //             lastModified: group.updatedAt
        //                 ? new Date(group.updatedAt)
        //                 : currentDate,
        //             changeFrequency: 'weekly',
        //             priority: 0.5,
        //         });
        //     }
        // });

        // Lost & Found pages
        (sitemapData.lostFound || []).forEach((item) => {
            if (item.collegeSlug) {
                dynamicRoutes.push({
                    url: `${SITE_URL}/${sanitizeSlug(item.collegeSlug)}/lost-found/${sanitizeSlug(item.slug)}`,
                    lastModified: item.updatedAt
                        ? new Date(item.updatedAt)
                        : currentDate,
                    changeFrequency: 'weekly',
                    priority: 0.5,
                });
            }
        });

        // Store pages
        (sitemapData.store || []).forEach((item) => {
            if (item.collegeSlug) {
                dynamicRoutes.push({
                    url: `${SITE_URL}/${sanitizeSlug(item.collegeSlug)}/store/${sanitizeSlug(item.slug)}`,
                    lastModified: item.updatedAt
                        ? new Date(item.updatedAt)
                        : currentDate,
                    changeFrequency: 'weekly',
                    priority: 0.5,
                });
            }
        });

        // Combine all routes
        console.log(
            `[Sitemap] Generated ${staticRoutes.length} static routes and ${dynamicRoutes.length} dynamic routes`,
        );
        return [...staticRoutes, ...dynamicRoutes];
    } catch (error) {
        console.error('[Sitemap] Error generating sitemap:', error);
        console.error('[Sitemap] Falling back to static routes only');
        // Return at least static routes if there's an error
        return staticRoutes;
    }
}
