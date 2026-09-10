import CollegeSelectHandler from '@/components/HomePage/CollegeSelectHandler';
import DownloadAppButton from '@/components/HomePage/DownloadAppButton';
import ResourceQuickStart from '@/components/HomePage/ResourceQuickStart';
import QuickLinks from '@/components/HomePage/QuickLinks';
import { api } from '@/config/apiUrls';
import type { Metadata } from 'next';
import FAQPage from '@/components/HomePage/FAQ';
import OurFeatures from '@/components/HomePage/OurFeatures';
import { IApiResponse } from '@/utils/interface';
import { rawColleges } from '@/constant';
import AcademicChatbotLazy from '@/components/Common/AcademicChatbotLazy';
import EarningShowcase from '@/components/HomePage/EarningShowcase';

type College = {
    name: string;
    slug: string;
};

async function getColleges(): Promise<IApiResponse<College[]>> {
    try {
        const res = await fetch(api.college.getColleges, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Failed fetching colleges:', errorText);
            throw new Error('Failed to fetch colleges');
        }

        return await res.json();
    } catch (e) {
        console.error('Fetch error:', e);
        return {
            status: false,
            message: 'Failed to fetch colleges',
            data: [],
        };
    }
}

// Enhanced SEO metadata
export const metadata: Metadata = {
    title: 'Student Senior - Academic Mentorship, PYQs & Student Resources Platform',
    description:
        "Connect with college seniors, access past year questions (PYQs), study notes, and academic resources. Join India's leading student community platform for academic success.",
    keywords: [
        'college mentorship',
        'past year questions',
        'PYQ papers',
        'student community',
        'academic resources',
        'study notes',
        'college seniors',
        'student marketplace',
        'university resources',
        'exam preparation',
    ].join(', '),
    authors: [{ name: 'Student Senior Team' }],
    creator: 'Student Senior',
    publisher: 'Student Senior',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://studentsenior.com',
        siteName: 'Student Senior',
        title: 'Student Senior - Your Academic Success Partner',
        description:
            'Access mentorship, PYQs, study materials, and connect with seniors. Boost your academic journey with our comprehensive student platform.',
        images: [
            {
                url: 'https://studentsenior.com/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Student Senior - Academic Platform for College Students',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Student Senior - Academic Mentorship Platform',
        description:
            'Get mentorship, PYQs, notes, and connect with college seniors for academic success.',
        images: ['https://studentsenior.com/og-image.png'],
        creator: '@studentsenior',
    },
    alternates: {
        canonical: 'https://studentsenior.com',
        types: {
            'text/plain': 'https://studentsenior.com/llms.txt',
        },
    },
    category: 'Education',
};

// Cache the entire home page for 1 hour by default
export const revalidate = 3600;

export default async function HomePage() {
    const AllColleges = await getColleges();
    const colleges = AllColleges.data?.length ? AllColleges.data : rawColleges;

    if (!AllColleges.data?.length) {
        console.warn(
            '⚠️ Using rawColleges fallback due to fetch failure or empty response',
        );
    }

    return (
        <>
            <main role='main'>
                {/* Hero Section - Modern Tech SaaS with Brand Tagline */}
                <section className='relative lg:min-h-[95dvh] lg:rounded-none rounded-b-4xl flex flex-col justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden py-16 px-4 sm:px-6 lg:px-8'>
                    {/* Ambient Glow & Dotted Grid Mesh */}
                    <div className='absolute inset-0 pointer-events-none'>
                        {/* Top Ambient Spotlight Glow */}
                        <div className='absolute -top-28 left-1/2 -translate-x-1/2 w-[680px] h-[320px] bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent blur-[110px] rounded-full dark:from-blue-600/15 dark:via-indigo-600/10'></div>

                        {/* Subtle Ambient Accent Glows */}
                        <div className='absolute top-1/4 -left-16 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl'></div>
                        <div className='absolute top-1/3 -right-16 w-72 h-72 bg-indigo-400/10 dark:bg-purple-500/5 rounded-full blur-3xl'></div>

                        {/* Modern Tech SaaS Dotted Grid */}
                        <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.12] dark:opacity-[0.07] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_35%,#000_70%,transparent_100%)]'></div>
                    </div>

                    {/* Main Content */}
                    <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center my-auto'>
                        {/* Headline */}
                        <h1 className='font-extrabold tracking-tight leading-[1.14] mb-6 text-4xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white max-w-3xl mx-auto'>
                            Student Senior :{' '}
                            <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent'>
                                Study Smarter, Score Better
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className='max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8'>
                            Access verified{' '}
                            <strong className='text-slate-900 dark:text-white font-semibold'>
                                PYQs
                            </strong>
                            , curated{' '}
                            <strong className='text-slate-900 dark:text-white font-semibold'>
                                study notes
                            </strong>
                            , and connect with{' '}
                            <strong className='text-slate-900 dark:text-white font-semibold'>
                                senior mentors
                            </strong>{' '}
                            across universities — everything you need to ace
                            your semester.
                        </p>

                        {/* CTA Button */}
                        <DownloadAppButton />

                        {/* College Selector */}
                        <div className='w-full max-w-xl mx-auto pt-4'>
                            <CollegeSelectHandler colleges={colleges} />
                        </div>
                    </div>
                </section>

                <div className='relative py-10 bg-gradient-to-b from-white via-slate-50/40 to-white dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950 border-t border-slate-100 dark:border-slate-800/60'>
                    <ResourceQuickStart colleges={colleges} />
                </div>

                {/* Quick Access Section */}
                <QuickLinks colleges={colleges} />

                {/* Earning Showcase Section */}
                <EarningShowcase />

                <OurFeatures />

                <FAQPage />
            </main>

            {/* Academic Chatbot (lazy client-only) */}
            <AcademicChatbotLazy />
        </>
    );
}
