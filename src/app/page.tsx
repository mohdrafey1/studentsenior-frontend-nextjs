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
                url: 'https://studentsenior.com/image192edge.png',
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
        images: ['https://studentsenior.com/image192edge.png'],
        creator: '@studentsenior',
    },
    alternates: {
        canonical: 'https://studentsenior.com',
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
                {/* Hero Section - Redesigned to match college page style */}
                <section className='relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden'>
                    {/* Animated Background Elements */}
                    <div className='absolute inset-0'>
                        {/* Floating Orbs */}
                        <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse'></div>
                        <div className='absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-bounce'></div>
                        <div
                            className='absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse'
                            style={{ animationDelay: '1s' }}
                        ></div>

                        {/* Geometric Shapes */}
                        <div
                            className='absolute top-1/4 right-1/3 w-16 h-16 border-2 border-sky-300/30 rotate-45 animate-spin'
                            style={{ animationDuration: '20s' }}
                        ></div>
                        <div
                            className='absolute bottom-1/3 left-1/3 w-12 h-12 border-2 border-cyan-300/30 rotate-12 animate-spin'
                            style={{
                                animationDuration: '15s',
                                animationDirection: 'reverse',
                            }}
                        ></div>

                        {/* Gradient Mesh */}
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/10 to-transparent dark:via-sky-900/10'></div>
                    </div>
                    <div className='h-screen flex flex-col'>
                        {/* Main Content */}
                        <div className='relative my-auto z-10 flex flex-col items-center justify-center min-h-[60vh] px-4 py-16'>
                            {/* Welcome Text */}
                            <div className='text-center max-w-4xl mx-auto'>
                                <h1 className='text-xl sm:text-xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
                                    <span className='bg-gradient-to-r from-black via-[#2563eb] to-[#2563eb] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent animate-fade-in'>
                                        Student Senior - Where College Life Gets
                                        Easier
                                    </span>
                                </h1>

                                {/* Subtitle */}
                                <p className='text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-delay'>
                                    Learn smarter with PYQs, notes, and real
                                    senior support — connect with seniors,
                                    access trusted resources, and take your
                                    academic journey further.
                                </p>

                                {/* CTA Button */}
                                <DownloadAppButton />
                            </div>

                            {/* College Selector */}
                            <div className='w-full max-w-2xl space-y-4 pt-8'>
                                <CollegeSelectHandler colleges={colleges} />
                            </div>
                        </div>
                    </div>
                </section>
                <div className='py-8 bg-gradient-to-tr from-sky-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
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
