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
            <main role='main' className='min-h-screen bg-[#ffffff] dark:bg-[#191919] text-[#000000] dark:text-[#ededed]'>
                {/* Hero Section - Notion Warm Paper & Confident Typography */}
                <section className='relative bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8'>
                    {/* Subtle Notion Document Grid / Dot Mesh */}
                    <div className='absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.15] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:24px_24px]'></div>

                    {/* Main Content */}
                    <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center'>
                        {/* Eyebrow Badge Pill */}
                        {/* <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#262626] text-[#0075de] dark:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] shadow-[0_1px_2px_rgba(0,0,0,0.03)] mb-6'>
                            <span className='w-2 h-2 rounded-full bg-[#0075de] animate-pulse'></span>
                            <span>Academic Mentorship & Resource Platform</span>
                        </div> */}

                        {/* Headline */}
                        <h1 className='font-bold tracking-[-0.035em] leading-[1.08] mb-5 text-4xl sm:text-5xl md:text-6xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                            Student Senior :{' '}
                            <span className='text-[#0075de] dark:text-[#62aef0]'>
                                Study Smarter, Score Better
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className='max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-8'>
                            Access verified{' '}
                            <strong className='text-[#000000] dark:text-white font-semibold'>
                                PYQs
                            </strong>
                            , curated{' '}
                            <strong className='text-[#000000] dark:text-white font-semibold'>
                                study notes
                            </strong>
                            , and connect with{' '}
                            <strong className='text-[#000000] dark:text-white font-semibold'>
                                senior mentors
                            </strong>{' '}
                            across universities — everything you need to ace your semester.
                        </p>

                        {/* Download App CTA (Android Only / PWA) */}
                        <DownloadAppButton />

                        {/* Notion-style College Selector */}
                        <div className='w-full max-w-xl mx-auto'>
                            <CollegeSelectHandler colleges={colleges} />
                        </div>

                        {/* Sticker Accent Highlights */}
                        <div className='hidden lg:flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-8'>
                            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474]'>
                                📚 1500+ PYQs
                            </span>
                            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f5edfd] dark:bg-[#321c4b] text-[#8a3fd6] dark:text-[#d6b6f6] border border-[#e8d5fc] dark:border-[#4a2673]'>
                                🎓 50+ Senior Guides
                            </span>
                            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130]'>
                                ⚡ Verified Notes
                            </span>
                            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fdf1e8] dark:bg-[#3d2411] text-[#dd5b00] dark:text-[#fb923c] border border-[#fbd8c1] dark:border-[#583318]'>
                                💰 Earn While Helping
                            </span>
                        </div>
                    </div>

                </section>

                {/* Resource Quick Start Section */}
                {/* <div className='relative py-4 sm:py-6 px-4 sm:px-6 '> */}
                    <ResourceQuickStart colleges={colleges} />
                {/* </div> */}

                {/* Quick Access Section */}
                <QuickLinks colleges={colleges} />

                {/* Earning Showcase Section */}
                <EarningShowcase />

                {/* Features & Achievements Section */}
                <OurFeatures />

                {/* FAQ Section */}
                <FAQPage />
            </main>

            {/* Academic Chatbot (lazy client-only) */}
            <AcademicChatbotLazy />
        </>
    );
}

