// import { Metadata } from 'next';
// import { notFound } from 'next/navigation';
// import { api } from '@/config/apiUrls';
// import { College, IStoreItem, ISenior } from '@/utils/interface';
// import { capitalizeWords } from '@/utils/formatting';
// import { CollegePageProps } from '@/utils/interface';
// import CollegeAbout from '@/components/College/CollegeAbout';
// import FeaturedProducts from '@/components/College/FeaturedProducts';
// import FeaturedSeniors from '@/components/College/FeaturedSeniors';
// import Link from 'next/link';
// import { ArrowRight, Archive, FileText, BookOpen } from 'lucide-react';

// interface CollegeWithFeaturedSeniorsAndProducts {
//     data: {
//         college: College;
//         seniors: ISenior[];
//         products: IStoreItem[];
//     };
//     message: string;
//     status: boolean;
// }

// // Fetch college data
// async function getCollegeWithFeaturedSeniorsAndProducts(
//     slug: string,
// ): Promise<CollegeWithFeaturedSeniorsAndProducts | null> {
//     try {
//         const res = await fetch(
//             api.college.getCollegeWithFeaturedSeniorsAndProducts(slug),
//             { cache: 'no-store' },
//             // {
//             //     next: { revalidate: 3600 }, // Cache for 1 hour
//             // }
//         );

//         if (!res.ok) {
//             console.error(
//                 'College not found or API error:',
//                 res.status,
//                 res.statusText,
//             );
//             return null;
//         }

//         const data = await res.json();

//         return data;
//     } catch (error) {
//         console.error('Error fetching college:', error);
//         return null;
//     }
// }

// // Generate metadata for SEO
// export async function generateMetadata({
//     params,
// }: CollegePageProps): Promise<Metadata> {
//     const { slug } = await params;
//     const data = await getCollegeWithFeaturedSeniorsAndProducts(slug);

//     if (!data) {
//         return {
//             title: 'College Not Found - Student Senior',
//             description: 'The requested college could not be found.',
//         };
//     }

//     const collegeName = capitalizeWords(slug);

//     return {
//         title: `${collegeName} - Student Community, Seniors & Resources | Student Senior`,
//         description: `Connect with seniors at ${collegeName}, access study materials, past year questions, and academic resources. Join the student community at ${data.data.college.location}.`,
//         keywords: [
//             collegeName,
//             'college seniors',
//             'student community',
//             'study materials',
//             'past year questions',
//             'academic resources',
//             data.data.college.location,
//             'student mentorship',
//             'college resources',
//         ].join(', '),
//         authors: [{ name: 'Student Senior Team' }],
//         creator: 'Student Senior',
//         publisher: 'Student Senior',
//         robots: {
//             index: true,
//             follow: true,
//             googleBot: {
//                 index: true,
//                 follow: true,
//                 'max-video-preview': -1,
//                 'max-image-preview': 'large',
//                 'max-snippet': -1,
//             },
//         },
//         openGraph: {
//             type: 'website',
//             locale: 'en_IN',
//             url: `https://studentsenior.com/college/${slug}`,
//             siteName: 'Student Senior',
//             title: `${collegeName} - Student Community & Resources`,
//             description: `Connect with seniors, access study materials, and join the student community at ${collegeName}.`,
//             images: [
//                 {
//                     url:
//                         data.data.college.image ||
//                         'https://studentsenior.com/og-college-image.jpg',
//                     width: 1200,
//                     height: 630,
//                     alt: `${collegeName} - Student Senior Community`,
//                 },
//             ],
//         },
//         twitter: {
//             card: 'summary_large_image',
//             title: `${collegeName} - Student Senior Community`,
//             description: `Connect with seniors and access resources at ${collegeName}.`,
//             creator: '@studentsenior',
//         },
//         alternates: {
//             canonical: `https://studentsenior.com/college/${slug}`,
//         },
//         category: 'Education',
//     };
// }

// export default async function CollegePage({ params }: CollegePageProps) {
//     const { slug } = await params;
//     console.log('College page requested for slug:', slug);

//     const data = await getCollegeWithFeaturedSeniorsAndProducts(slug);

//     if (!data) {
//         console.log('College not found, calling notFound()');
//         notFound();
//     }

//     return (
//         <>
//             <section className='relative min-h-full bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden'>
//                 {/* Animated Background Elements */}
//                 <div className='absolute inset-0'>
//                     {/* Floating Orbs */}
//                     <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse'></div>
//                     <div className='absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-bounce'></div>
//                     <div
//                         className='absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse'
//                         style={{ animationDelay: '1s' }}
//                     ></div>

//                     {/* Geometric Shapes */}
//                     <div
//                         className='absolute top-1/4 right-1/3 w-16 h-16 border-2 border-sky-300/30 rotate-45 animate-spin'
//                         style={{ animationDuration: '20s' }}
//                     ></div>
//                     <div
//                         className='absolute bottom-1/3 left-1/3 w-12 h-12 border-2 border-cyan-300/30 rotate-12 animate-spin'
//                         style={{
//                             animationDuration: '15s',
//                             animationDirection: 'reverse',
//                         }}
//                     ></div>

//                     {/* Gradient Mesh */}
//                     <div className='absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/10 to-transparent dark:via-sky-900/10'></div>
//                 </div>

//                 {/* Main Content */}
//                 <div className='relative isolate overflow-hidden bg-white dark:bg-gray-900'>
//                     {/* Background Aurora Effect */}
//                     <div
//                         className='absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2'
//                         aria-hidden='true'
//                     >
//                         <div
//                             className='aspect-[1.5] w-[80rem] bg-gradient-to-tr from-[#06b6d4] to-[#3b82f6] opacity-20 dark:opacity-30'
//                             style={{
//                                 clipPath:
//                                     'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
//                             }}
//                         />
//                     </div>

//                     {/* Main Content */}
//                     <div className='relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center'>
//                         {/* Pre-title Badge */}
//                         <div className='animate-fade-in mb-4'>
//                             <span className='inline-flex items-center gap-x-2 rounded-full bg-cyan-100/80 px-4 py-1 text-sm font-medium text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200 ring-1 ring-inset ring-cyan-600/20'>
//                                 <BookOpen className='w-4 h-4' />
//                                 Your Academic Partner
//                             </span>
//                         </div>

//                         {/* Welcome Text */}
//                         <div className='max-w-4xl mx-auto'>
//                             <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
//                                 <span className='bg-gradient-to-r from-gray-900 via-sky-800 to-cyan-700 dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent animate-fade-in'>
//                                     Welcome to
//                                 </span>
//                                 <br />
//                                 <span className='bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600 dark:from-sky-400 dark:via-cyan-300 dark:to-blue-400 bg-clip-text text-transparent animate-slide-up'>
//                                     {capitalizeWords(slug)}
//                                 </span>
//                             </h1>

//                             {/* Subtitle */}
//                             <p className='text-xl sm:text-2xl text-slate-700 dark:text-slate-300 mb-10 max-w-3xl mx-auto animate-fade-in-delay'>
//                                 Connect with seniors, access resources, and grow
//                                 your academic journey at {capitalizeWords(slug)}
//                             </p>
//                         </div>

//                         {/* CTAs */}
//                         <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-delay'>
//                             {/* Primary CTA */}
//                             <Link
//                                 href={`/${slug}/pyqs`}
//                                 className='group flex-1 flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg shadow-cyan-500/30 dark:shadow-cyan-400/20 animate-pulse-slow'
//                                 aria-label={`View Previous Year Questions for ${capitalizeWords(slug)}`}
//                             >
//                                 <Archive className='w-4 h-4' />
//                                 View PYQs
//                                 <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
//                             </Link>

//                             {/* Secondary CTA */}
//                             <Link
//                                 href={`/${slug}/notes`}
//                                 className='group flex-1 flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-slate-100 text-slate-800 font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-xl shadow-slate-500/10
//                                     dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
//                                 aria-label={`View Notes for ${capitalizeWords(slug)}`}
//                             >
//                                 <FileText className='w-4 h-4' />
//                                 Browse Notes
//                                 <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Featured Seniors Section */}
//             <FeaturedSeniors seniors={data.data.seniors} collegeName={slug} />

//             {/* Divider */}
//             <hr className='border-gray-200 dark:border-gray-700' />

//             {/* Featured Products Section */}
//             <FeaturedProducts
//                 products={data.data.products}
//                 collegeName={slug}
//             />

//             {/* Divider */}
//             <hr className='border-gray-200 dark:border-gray-700' />

//             {/* About Section */}
//             <CollegeAbout college={data.data.college} />
//         </>
//     );
// }

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { College } from '@/utils/interface';
import { capitalizeWords } from '@/utils/formatting';
import { CollegePageProps } from '@/utils/interface';
import CollegeAbout from '@/components/College/CollegeAbout';
import Link from 'next/link';
import {
    ArrowRight,
    Archive,
    FileText,
    BookOpen,
    Video,
    GraduationCap,
    Store,
    Users,
    FolderOpen,
    MessageSquare,
    Briefcase,
    Search,
    Plus,
    TrendingUp,
    DollarSign,
    BookMarked,
    ShoppingBag,
    UserCheck,
    Gift,
    Layers,
} from 'lucide-react';

interface CollegeDataResponse {
    success: boolean;
    message: string;
    data: College;
}

// Fetch college data
async function getCollegeData(
    slug: string,
): Promise<CollegeDataResponse | null> {
    try {
        const res = await fetch(api.college.getCollegeBySlug(slug), {
            next: { revalidate: 86400 }, // Cache for 24 hours (86400 seconds)
        });

        if (!res.ok) {
            console.error(
                'College not found or API error:',
                res.status,
                res.statusText,
            );
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching college:', error);
        return null;
    }
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    const data = await getCollegeData(slug);

    if (!data) {
        return {
            title: 'College Not Found - Student Senior',
            description: 'The requested college could not be found.',
        };
    }

    const collegeName = capitalizeWords(slug);

    return {
        title: `${collegeName} - Student Community, Seniors & Resources | Student Senior`,
        description: `Connect with seniors at ${collegeName}, access study materials, past year questions, and academic resources. Join the student community at ${data.data.location}.`,
        keywords: [
            collegeName,
            'college seniors',
            'student community',
            'study materials',
            'past year questions',
            'academic resources',
            data.data.location,
            'student mentorship',
            'college resources',
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
            url: `https://studentsenior.com/college/${slug}`,
            siteName: 'Student Senior',
            title: `${collegeName} - Student Community & Resources`,
            description: `Connect with seniors, access study materials, and join the student community at ${collegeName}.`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${collegeName} - Student Senior Community`,
            description: `Connect with seniors and access resources at ${collegeName}.`,
            creator: '@studentsenior',
        },
        alternates: {
            canonical: `https://studentsenior.com/${slug}`,
        },
        category: 'Education',
    };
}

// Enable static generation for college pages
export const revalidate = 86400; // Revalidate every 24 hours

export default async function CollegePage({ params }: CollegePageProps) {
    const { slug } = await params;

    const data = await getCollegeData(slug);

    if (!data) {
        console.log('College not found, calling notFound()');
        notFound();
    }

    const features = [
        {
            id: 'pyqs',
            title: 'Previous Year Questions',
            icon: Archive,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient:
                'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
            description: 'Access vast collection of PYQs for exam preparation',
            benefits: [
                { icon: Search, text: 'Browse & Download PYQs' },
                { icon: Plus, text: 'Earn 10 Points per Upload' },
                { icon: DollarSign, text: 'Sell Premium PYQs' },
            ],
            link: `/${slug}/pyqs`,
        },
        {
            id: 'notes',
            title: 'Study Notes',
            icon: FileText,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient:
                'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
            description: 'Get comprehensive notes for all subjects',
            benefits: [
                { icon: BookMarked, text: 'Access Quality Notes' },
                { icon: Plus, text: 'Earn 5 Points per Upload' },
                { icon: TrendingUp, text: 'Earn from Downloads' },
            ],
            link: `/${slug}/notes`,
        },
        {
            id: 'videos',
            title: 'Course Videos',
            icon: Video,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient:
                'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
            description: 'Watch video lectures and tutorials',
            benefits: [
                { icon: Video, text: 'Course Video Lectures' },
                { icon: BookOpen, text: 'Topic-wise Learning' },
                { icon: Users, text: 'Shared by Students' },
            ],
            link: `/${slug}/videos`,
        },
        {
            id: 'syllabus',
            title: 'Syllabus',
            icon: BookMarked,
            gradient: 'from-orange-500 to-red-500',
            bgGradient:
                'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
            description: 'Complete syllabus for all courses',
            benefits: [
                { icon: Layers, text: 'Semester-wise Syllabus' },
                { icon: BookOpen, text: 'Course Structure' },
                { icon: FileText, text: 'Subject Details' },
            ],
            link: `/${slug}/syllabus`,
        },
        {
            id: 'store',
            title: 'Student Store',
            icon: Store,
            gradient: 'from-yellow-500 to-amber-500',
            bgGradient:
                'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
            description: 'Buy and sell products within your college',
            benefits: [
                { icon: ShoppingBag, text: 'Buy Old/New Products' },
                { icon: Plus, text: 'List Your Products' },
                { icon: DollarSign, text: 'Earn from Sales' },
            ],
            link: `/${slug}/store`,
        },
        {
            id: 'seniors',
            title: 'Connect with Seniors',
            icon: GraduationCap,
            gradient: 'from-indigo-500 to-blue-500',
            bgGradient:
                'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
            description: 'Get guidance and advice from your seniors',
            benefits: [
                { icon: UserCheck, text: 'Talk to Seniors' },
                { icon: MessageSquare, text: 'Get Academic Advice' },
                { icon: Briefcase, text: 'Career Guidance' },
            ],
            link: `/${slug}/seniors`,
        },
        {
            id: 'resources',
            title: 'All Resources',
            icon: FolderOpen,
            gradient: 'from-teal-500 to-cyan-500',
            bgGradient:
                'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
            description: 'Explore resources by course, branch & subject',
            benefits: [
                { icon: Layers, text: 'Filter by Course' },
                { icon: BookOpen, text: 'Filter by Branch' },
                { icon: FileText, text: 'Filter by Subject' },
            ],
            link: `/${slug}/resources`,
        },
        {
            id: 'groups',
            title: 'College Groups',
            icon: Users,
            gradient: 'from-pink-500 to-rose-500',
            bgGradient:
                'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
            description: 'Join important WhatsApp & Telegram groups',
            benefits: [
                { icon: MessageSquare, text: 'Important Groups' },
                { icon: Plus, text: 'Add Your Group' },
                { icon: Users, text: 'Connect with Peers' },
            ],
            link: `/${slug}/groups`,
        },
        {
            id: 'opportunities',
            title: 'Opportunities',
            icon: Briefcase,
            gradient: 'from-violet-500 to-purple-500',
            bgGradient:
                'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
            description: 'Find internships, projects & job opportunities',
            benefits: [
                { icon: Briefcase, text: 'Browse Opportunities' },
                { icon: Plus, text: 'Post Opportunities' },
                { icon: Users, text: 'Find Project Partners' },
            ],
            link: `/${slug}/opportunities`,
        },
        {
            id: 'lostfound',
            title: 'Lost & Found',
            icon: Search,
            gradient: 'from-red-500 to-orange-500',
            bgGradient:
                'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
            description: 'Report lost items or found items in your college',
            benefits: [
                { icon: Search, text: 'Find Lost Items' },
                { icon: Plus, text: 'Report Found Items' },
                { icon: Gift, text: 'Help Each Other' },
            ],
            link: `/${slug}/lost-found`,
        },
    ];

    return (
        <>
            {/* <section className='relative min-h-full bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden'>
                <div className='absolute inset-0'>
                    <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-bounce'></div>
                    <div
                        className='absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse'
                        style={{ animationDelay: '1s' }}
                    ></div>

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

                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/10 to-transparent dark:via-sky-900/10'></div>
                </div>

                <div className='relative isolate overflow-hidden bg-white dark:bg-gray-900'>
                    <div
                        className='absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2'
                        aria-hidden='true'
                    >
                        <div
                            className='aspect-[1.5] w-[80rem] bg-gradient-to-tr from-[#06b6d4] to-[#3b82f6] opacity-20 dark:opacity-30'
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>

                    <div className='relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center'>
                        <div className='animate-fade-in mb-4'>
                            <span className='inline-flex items-center gap-x-2 rounded-full bg-cyan-100/80 px-4 py-1 text-sm font-medium text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200 ring-1 ring-inset ring-cyan-600/20'>
                                <BookOpen className='w-4 h-4' />
                                Your Academic Partner
                            </span>
                        </div>

                        <div className='max-w-4xl mx-auto'>
                            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
                                <span className='bg-gradient-to-r from-gray-900 via-sky-800 to-cyan-700 dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent animate-fade-in'>
                                    Welcome to
                                </span>
                                <br />
                                <span className='bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600 dark:from-sky-400 dark:via-cyan-300 dark:to-blue-400 bg-clip-text text-transparent animate-slide-up'>
                                    {capitalizeWords(slug)}
                                </span>
                            </h1>

                            <p className='text-xl sm:text-2xl text-slate-700 dark:text-slate-300 mb-10 max-w-3xl mx-auto animate-fade-in-delay'>
                                Connect with seniors, access resources, and grow
                                your academic journey at {capitalizeWords(slug)}
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-delay'>
                            <Link
                                href={`/${slug}/pyqs`}
                                className='group flex-1 flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg shadow-cyan-500/30 dark:shadow-cyan-400/20 animate-pulse-slow'
                                aria-label={`View Previous Year Questions for ${capitalizeWords(slug)}`}
                            >
                                <Archive className='w-4 h-4' />
                                View PYQs
                                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                            </Link>

                            <Link
                                href={`/${slug}/notes`}
                                className='group flex-1 flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-slate-100 text-slate-800 font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-xl shadow-slate-500/10
                                    dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                aria-label={`View Notes for ${capitalizeWords(slug)}`}
                            >
                                <FileText className='w-4 h-4' />
                                Browse Notes
                                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                            </Link>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Features Grid Section */}
            <section className='py-8 bg-white dark:bg-gray-900'>
                <div className='container mx-auto px-4'>
                    {/* Section Header */}
                    <div className='text-center mb-10'>
                        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                            Everything You Need at {capitalizeWords(slug)}
                        </h2>
                    </div>

                    {/* Features Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto'>
                        {features.map((feature) => {
                            const IconComponent = feature.icon;
                            return (
                                <Link
                                    prefetch={false}
                                    key={feature.id}
                                    href={feature.link}
                                    className='group relative bg-gradient-to-br overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-opacity-50'
                                    style={{
                                        background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                                    }}
                                >
                                    {/* Background Pattern */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-100`}
                                    ></div>

                                    {/* Decorative Element */}
                                    <div
                                        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-full`}
                                    ></div>

                                    {/* Content */}
                                    <div className='relative z-10'>
                                        {/* Icon */}
                                        <div
                                            className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-4 group-hover:scale-50 transition-transform`}
                                        >
                                            <IconComponent className='w-6 h-6' />
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className='text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-sky-900 group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all'
                                            style={{
                                                backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                                            }}
                                        >
                                            {feature.title}
                                        </h3>

                                        {/* Description */}
                                        <p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>
                                            {feature.description}
                                        </p>

                                        {/* Benefits List */}
                                        <ul className='space-y-2 mb-4'>
                                            {feature.benefits.map(
                                                (benefit, idx) => {
                                                    const BenefitIcon =
                                                        benefit.icon;
                                                    return (
                                                        <li
                                                            key={idx}
                                                            className='flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200'
                                                        >
                                                            <BenefitIcon className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                                                            <span>
                                                                {benefit.text}
                                                            </span>
                                                        </li>
                                                    );
                                                },
                                            )}
                                        </ul>

                                        {/* CTA */}
                                        <div className='flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white group-hover:gap-3 transition-all'>
                                            <span>Explore Now</span>
                                            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <div className='mt-16 text-center'>
                        <div className='inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-sky-200 dark:border-sky-700'>
                            <div className='flex-1 text-left'>
                                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                                    Start Contributing & Earning Today!
                                </h3>
                                <p className='text-gray-600 dark:text-gray-300'>
                                    Upload PYQs, Notes, sell products, and earn
                                    points that convert to real money
                                </p>
                            </div>
                            <Link
                                prefetch={false}
                                href={`/${slug}/pyqs`}
                                className='whitespace-nowrap inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-cyan-700 transition-all shadow-sm hover:shadow-md'
                            >
                                Get Started
                                <ArrowRight className='w-4 h-4' />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <hr className='border-gray-200 dark:border-gray-700' />

            {/* About Section */}
            <CollegeAbout college={data.data} />
        </>
    );
}
