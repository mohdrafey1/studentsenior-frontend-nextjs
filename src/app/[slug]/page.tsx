import { Metadata } from 'next';
import GoogleAd from '@/components/GoogleAd';
import { notFound } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { College, CollegeSections } from '@/utils/interface';
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
    Zap,
    MapPin,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';
import { DEFAULT_SECTIONS } from '@/constant';

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
        title: `${collegeName} - Academic Hub, Seniors & PYQs | Student Senior`,
        description: `Connect with seniors at ${collegeName}, access study materials, past year questions (PYQs), notes, and campus resources. Join India's leading student community at ${data.data.location || 'campus'}.`,
        keywords: [
            collegeName,
            'college seniors',
            'student community',
            'study materials',
            'past year questions',
            'PYQ papers',
            'academic resources',
            data.data.location,
            'student mentorship',
            'college resources',
        ].filter(Boolean).join(', '),
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
            url: `https://studentsenior.com/${slug}`,
            siteName: 'Student Senior',
            title: `${collegeName} - Student Community & Academic Resources`,
            description: `Connect with seniors, access study materials, and join the student community at ${collegeName}.`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${collegeName} - Student Senior Community`,
            description: `Connect with seniors and access academic resources at ${collegeName}.`,
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
        notFound();
    }

    const college = data.data;
    const collegeName = capitalizeWords(slug);

    const features = [
        {
            id: 'pyqs',
            title: 'Previous Year Questions',
            shortTitle: 'PYQs',
            icon: Archive,
            tag: 'Exam Essential',
            iconStyle:
                'bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474]',
            description: 'Vast collection of past semester question papers and solutions.',
            benefits: [
                { icon: Search, text: 'Browse & Download PYQs' },
                { icon: Plus, text: 'Earn 10 Points per Upload' },
                { icon: DollarSign, text: 'Sell Premium Solved PYQs' },
            ],
            link: `/${slug}/pyqs`,
        },
        {
            id: 'notes',
            title: 'Study Notes',
            shortTitle: 'Notes',
            icon: FileText,
            tag: 'Top Rated',
            iconStyle:
                'bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130]',
            description: 'Comprehensive handwritten and curated subject notes.',
            benefits: [
                { icon: BookMarked, text: 'Access Quality Notes' },
                { icon: Plus, text: 'Earn 5 Points per Upload' },
                { icon: TrendingUp, text: 'Earn from Note Downloads' },
            ],
            link: `/${slug}/notes`,
        },
        {
            id: 'quicknotes',
            title: 'Quick Revision Notes',
            shortTitle: 'Quick Notes',
            icon: Zap,
            tag: 'Last-Minute Prep',
            iconStyle:
                'bg-[#fefce8] dark:bg-[#392f13] text-[#d97706] dark:text-[#fbbf24] border border-[#fef08a] dark:border-[#524419]',
            description: 'Concise summary cheat-sheets for rapid revision before exams.',
            benefits: [
                { icon: Zap, text: 'Rapid Last-Minute Revision' },
                { icon: BookMarked, text: 'Exam-Oriented Highlights' },
                { icon: TrendingUp, text: 'Save Time Before Tests' },
            ],
            link: `/${slug}/quicknotes`,
        },
        {
            id: 'videos',
            title: 'Course Videos',
            shortTitle: 'Videos',
            icon: Video,
            tag: 'Visual Learning',
            iconStyle:
                'bg-[#f5edfd] dark:bg-[#321c4b] text-[#8a3fd6] dark:text-[#d6b6f6] border border-[#e8d5fc] dark:border-[#4a2673]',
            description: 'Curated topic-wise video lectures and playlist recommendations.',
            benefits: [
                { icon: Video, text: 'Subject Video Playlists' },
                { icon: BookOpen, text: 'Topic-Wise Learning' },
                { icon: Users, text: 'Shared by Top Seniors' },
            ],
            link: `/${slug}/videos`,
        },
        {
            id: 'syllabus',
            title: 'Official Syllabus',
            shortTitle: 'Syllabus',
            icon: BookMarked,
            tag: 'Structure',
            iconStyle:
                'bg-[#fdf1e8] dark:bg-[#3d2411] text-[#dd5b00] dark:text-[#fb923c] border border-[#fbd8c1] dark:border-[#583318]',
            description: 'Complete updated syllabus, marking schemes, and course outlines.',
            benefits: [
                { icon: Layers, text: 'Semester-Wise Syllabus' },
                { icon: BookOpen, text: 'Course & Credit Structure' },
                { icon: FileText, text: 'Subject Details & Units' },
            ],
            link: `/${slug}/syllabus`,
        },
        {
            id: 'store',
            title: 'Campus Store',
            shortTitle: 'Store',
            icon: Store,
            tag: 'Marketplace',
            iconStyle:
                'bg-[#ecfdf5] dark:bg-[#133328] text-[#059669] dark:text-[#34d399] border border-[#a7f3d0] dark:border-[#1d4d3d]',
            description: 'Buy and sell books, drafters, calculators, and lab essentials locally.',
            benefits: [
                { icon: ShoppingBag, text: 'Buy Pre-Loved Gear' },
                { icon: Plus, text: 'List Your Products Free' },
                { icon: DollarSign, text: 'Direct Peer-to-Peer Sales' },
            ],
            link: `/${slug}/store`,
        },
        {
            id: 'seniors',
            title: 'Senior Mentorship',
            shortTitle: 'Seniors',
            icon: GraduationCap,
            tag: '1-on-1 Guidance',
            iconStyle:
                'bg-[#eef2ff] dark:bg-[#1e1e4a] text-[#4f46e5] dark:text-[#818cf8] border border-[#c7d2fe] dark:border-[#2e2e6b]',
            description: 'Get personal guidance, placement advice, and tips from verified seniors.',
            benefits: [
                { icon: UserCheck, text: 'Connect with Seniors' },
                { icon: MessageSquare, text: 'Academic & Exam Advice' },
                { icon: Briefcase, text: 'Internship & Career Tips' },
            ],
            link: `/${slug}/seniors`,
        },
        {
            id: 'resources',
            title: 'Resources Directory',
            shortTitle: 'Resources',
            icon: FolderOpen,
            tag: 'All Resources',
            iconStyle:
                'bg-[#ecfeff] dark:bg-[#15343d] text-[#0891b2] dark:text-[#22d3ee] border border-[#a5f3fc] dark:border-[#1e4d5a]',
            description: 'Browse all college resources organized by branch, year, and subject.',
            benefits: [
                { icon: Layers, text: 'Filter by Degree & Branch' },
                { icon: BookOpen, text: 'Subject-Specific Folders' },
                { icon: FileText, text: 'Unified Academic Repository' },
            ],
            link: `/${slug}/resources`,
        },
        {
            id: 'groups',
            title: 'Campus Groups',
            shortTitle: 'Groups',
            icon: Users,
            tag: 'Community',
            iconStyle:
                'bg-[#fdf2f8] dark:bg-[#3f1629] text-[#db2777] dark:text-[#f472b6] border border-[#fbcfe8] dark:border-[#5a213c]',
            description: 'Join verified student WhatsApp and Telegram study communities.',
            benefits: [
                { icon: MessageSquare, text: 'Official Batch Groups' },
                { icon: Plus, text: 'Submit Your Club Group' },
                { icon: Users, text: 'Stay Connected with Peers' },
            ],
            link: `/${slug}/groups`,
        },
        {
            id: 'opportunities',
            title: 'Opportunities Hub',
            shortTitle: 'Opportunities',
            icon: Briefcase,
            tag: 'Careers',
            iconStyle:
                'bg-[#f5f3ff] dark:bg-[#271d47] text-[#7c3aed] dark:text-[#a78bfa] border border-[#ddd6fe] dark:border-[#3b2b6b]',
            description: 'Discover student internships, hackathons, and project collaborations.',
            benefits: [
                { icon: Briefcase, text: 'Curated Opportunities' },
                { icon: Plus, text: 'Post Project Openings' },
                { icon: Users, text: 'Find Hackathon Teammates' },
            ],
            link: `/${slug}/opportunities`,
        },
        {
            id: 'lostfound',
            title: 'Lost & Found',
            shortTitle: 'Lost & Found',
            icon: Search,
            tag: 'Campus Help',
            iconStyle:
                'bg-[#fff1f2] dark:bg-[#3d161a] text-[#e11d48] dark:text-[#fb7185] border border-[#fecdd3] dark:border-[#5c2328]',
            description: 'Report lost items or help batchmates recover misplaced belongings.',
            benefits: [
                { icon: Search, text: 'Search Lost Belongings' },
                { icon: Plus, text: 'Report Found Items' },
                { icon: Gift, text: 'Campus Good Samaritan' },
            ],
            link: `/${slug}/lost-found`,
        },
    ];

    // Merge college sections with defaults
    const collegeSections: CollegeSections = {
        ...DEFAULT_SECTIONS,
        ...(college.sections || {}),
    };

    // Map feature id to section key
    const featureToSectionMap: Record<string, keyof CollegeSections> = {
        pyqs: 'pyqs',
        notes: 'notes',
        quicknotes: 'quickNotes',
        videos: 'videos',
        syllabus: 'syllabus',
        store: 'store',
        seniors: 'seniors',
        resources: 'resources',
        groups: 'groups',
        opportunities: 'opportunities',
        lostfound: 'lostFound',
    };

    // Filter features based on enabled sections
    const enabledFeatures = features.filter((feature) => {
        const sectionKey = featureToSectionMap[feature.id];
        return sectionKey ? collegeSections[sectionKey] : true;
    });

    return (
        <main className='min-h-screen bg-white dark:bg-[#191919] text-[#101828] dark:text-[#ededed]'>
            {/* Compact Hero Section */}
            <section className='relative bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden pt-8 pb-9 sm:pt-10 sm:pb-12 px-4 sm:px-6 lg:px-8'>
                {/* Subtle Notion Document Grid / Dot Mesh */}
                <div className='absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.15] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:24px_24px]'></div>

                <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center'>
                    {/* Eyebrow Pill Badge */}
                    <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#262626] text-[#0075de] dark:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] shadow-[0_1px_2px_rgba(0,0,0,0.03)] mb-3.5'>
                        {/* <GraduationCap className='w-3.5 h-3.5' /> */}
                        {/* <span>{}</span> */}
                        {college.location && (
                            <>
                                <span className='inline-flex items-center gap-1 text-[#615d59] dark:text-[#a09e9a]'>
                                    <MapPin className='w-3 h-3' />
                                    {college.location}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Headline */}
                    <h1 className='font-bold tracking-[-0.03em] leading-tight mb-2.5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                        {collegeName} {' '}
                        <span className='text-[#0075de] dark:text-[#62aef0]'>
                            Academic Hub
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-5'>
                        Everything you need to excel this semester. Access verified previous year questions (PYQs), curated study notes, syllabus, and connect directly with seniors.
                    </p>

                    {/* Quick Access Pills for Top Sections */}
                    <div className='flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-2xl mx-auto'>
                        {enabledFeatures.slice(0, 6).map((f) => (
                            <Link
                                key={f.id}
                                href={f.link}
                                className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#262626] text-[#101828] dark:text-[#ededed] border border-[#e6e6e6] dark:border-[#383838] hover:border-[#0075de] dark:hover:border-[#62aef0] hover:text-[#0075de] dark:hover:text-[#62aef0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all'
                            >
                                <f.icon className='w-3 h-3 text-[#0075de] dark:text-[#62aef0]' />
                                <span>{f.shortTitle}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Compact Features & Hub Grid Section */}
            <section className='py-8 sm:py-10 bg-white dark:bg-[#191919]'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {/* Section Header */}
                    <div className='flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 gap-2'>
                        <div>
                            {/* <div className='inline-flex items-center gap-1 text-[11px] font-semibold text-[#0075de] dark:text-[#62aef0] uppercase tracking-wider mb-1'>
                                <Sparkles className='w-3 h-3' />
                                <span>Campus Portals</span>
                            </div> */}
                            <h2 className='text-xl sm:text-2xl font-bold tracking-tight text-[#000000] dark:text-white'>
                                Resources for {collegeName}
                            </h2>
                        </div>
                        {/* <span className='text-xs text-[#615d59] dark:text-[#a09e9a]'>
                            {enabledFeatures.length} portals available
                        </span> */}
                    </div>

                    {/* Compact Features Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4'>
                        {enabledFeatures.map((feature) => {
                            const IconComponent = feature.icon;
                            return (
                                <Link
                                    prefetch={false}
                                    key={feature.id}
                                    href={feature.link}
                                    className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 flex flex-col justify-between'
                                >
                                    <div>
                                        {/* Card Top: Icon & Tag */}
                                        <div className='flex items-center justify-between gap-2 mb-2.5'>
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${feature.iconStyle}`}
                                            >
                                                <IconComponent className='w-4 h-4' />
                                            </div>
                                            <span className='text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#f4f3f0] dark:bg-[#282828] text-[#73716d] dark:text-[#a09e9a] border border-[#e6e6e6]/60 dark:border-[#383838]'>
                                                {feature.tag}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className='text-base font-bold text-[#101828] dark:text-white mb-1 group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors leading-snug'>
                                            {feature.title}
                                        </h3>

                                        {/* Description */}
                                        <p className='text-xs text-[#615d59] dark:text-[#a09e9a] leading-relaxed mb-3 line-clamp-2'>
                                            {feature.description}
                                        </p>

                                        {/* Benefits / Highlights Chips */}
                                        <div className='flex flex-wrap gap-1.5 mb-3.5'>
                                            {feature.benefits.map((benefit, idx) => {
                                                const BenefitIcon = benefit.icon;
                                                return (
                                                    <span
                                                        key={idx}
                                                        className='inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#444] dark:text-[#c4c2be] border border-[#e6e6e6]/50 dark:border-[#333]'
                                                    >
                                                        <BenefitIcon className='w-3 h-3 text-[#0075de] dark:text-[#62aef0] flex-shrink-0' />
                                                        <span className='truncate max-w-[150px]'>{benefit.text}</span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Action Link Footer */}
                                    <div className='pt-2.5 border-t border-[#f0eee9] dark:border-[#2a2a2a] flex items-center justify-between text-xs font-semibold text-[#0075de] dark:text-[#62aef0]'>
                                        <span>Open {feature.shortTitle}</span>
                                        <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-1 transition-transform' />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Compact Contribution Banner */}
                    <div className='mt-8 sm:mt-10'>
                        <div className='relative overflow-hidden rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#202020] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm'>
                            <div className='text-center sm:text-left flex-1'>
                                <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] text-[11px] font-semibold mb-1.5'>
                                    <CheckCircle2 className='w-3 h-3' />
                                    <span>Earn While Helping Juniors</span>
                                </div>
                                <h3 className='text-base sm:text-lg font-bold text-[#000000] dark:text-white mb-0.5'>
                                    Start Contributing & Earning Today
                                </h3>
                                <p className='text-xs text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                    Upload verified PYQs and study notes to earn reward points that convert to real earnings.
                                </p>
                            </div>
                            <Link
                                prefetch={false}
                                href={`/${slug}/pyqs`}
                                className='whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.98]'
                            >
                                <span>Upload & Explore</span>
                                <ArrowRight className='w-3.5 h-3.5' />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ad Unit: After Features Grid */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6'>
                <GoogleAd
                    adSlot='8453205351'
                    style={{ display: 'block', textAlign: 'center' }}
                    label='College Page Middle'
                />
            </div>

            {/* Section Divider */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <hr className='border-[#e6e6e6] dark:border-[#2f2f2f]' />
            </div>

            {/* Ad Unit: Top of About Section */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6'>
                <GoogleAd
                    adSlot='8453205351'
                    style={{ display: 'block', textAlign: 'center' }}
                    label='College Page Bottom'
                />
            </div>

            {/* About Section */}
            <CollegeAbout college={college} />
        </main>
    );
}


