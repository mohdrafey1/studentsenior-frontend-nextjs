import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { CollegePageProps } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';
import { BookOpen, Eye } from 'lucide-react';
import Link from 'next/link';

interface IBranch {
    _id: string;
    branchName: string;
    branchCode: string;
    clickCounts: number;
}

interface ICollegePageProps {
    params: Promise<{
        slug: string;
        courseCode: string;
    }>;
}

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Branches - ${capitalizeWords(slug)}`,
        description:
            'Explore the branches of the course to get the best resources.',
    };
}

export default async function BranchesPage({ params }: ICollegePageProps) {
    const { slug, courseCode } = await params;
    const collegeName = slug;

    let branches: IBranch[] = [];

    try {
        const url = `${api.resources.getBranches(courseCode)}`;
        const res = await fetch(url, { next: { revalidate: 86400 } });
        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        branches = data?.data || [];
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }

    return (
        <>
            <DetailPageNavbar
                path='resources'
                fullPath={`/${slug}/resources`}
            />

            <main className='min-h-screen bg-white dark:bg-[#191919] text-[#101828] dark:text-[#ededed]'>
                {/* Header Section */}
                <section className='relative bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden pt-8 pb-9 sm:pt-10 sm:pb-11 px-4 sm:px-6 lg:px-8'>
                    {/* Subtle Notion Document Grid / Dot Mesh */}
                    <div className='absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.12] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:24px_24px]'></div>

                    <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center'>
                        {/* Headline */}
                        <h1 className='font-bold tracking-[-0.03em] leading-tight mb-2 text-2xl sm:text-3xl md:text-4xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                            Branches —{' '}
                            <span className='text-[#0075de] dark:text-[#62aef0]'>
                                {capitalizeWords(collegeName)}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className='max-w-2xl mx-auto text-xs sm:text-sm text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-4'>
                            Explore the branches of the course to get the best resources.
                        </p>
                    </div>
                </section>

                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                    {/* List */}
                    <div className='space-y-4'>
                        {branches.length > 0 ? (
                            branches.map((branch) => (
                                <div
                                    key={branch._id}
                                    className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden'
                                >
                                    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                                        {/* Left Section - Info */}
                                        <div className='flex-1 min-w-0 flex items-start gap-3 sm:gap-4'>
                                            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-[#eaf3fd] dark:bg-[#183153] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#d2e4f9] dark:border-[#224474]'>
                                                <BookOpen className='w-5 h-5 sm:w-6 sm:h-6 text-[#0075de] dark:text-[#62aef0]' />
                                            </div>
                                            <div className='flex-1 min-w-0 pt-0.5'>
                                                <h3 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white mb-1.5 leading-tight group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors truncate max-w-xl'>
                                                    {branch.branchName}
                                                </h3>
                                                <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a]'>
                                                    <span className='font-mono font-medium text-[#0075de] dark:text-[#62aef0] bg-[#eaf3fd] dark:bg-[#183153] px-2 py-0.5 rounded-md border border-[#d2e4f9] dark:border-[#224474]'>
                                                        {branch.branchCode}
                                                    </span>
                                                    <span className='text-[#d0ceca] dark:text-[#404040]'>•</span>
                                                    <span className='flex items-center gap-1.5 font-medium'>
                                                        <Eye className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8c8883] dark:text-[#787672]' />
                                                        {branch.clickCounts} views
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Section - Action */}
                                        <div className='flex flex-col sm:flex-row gap-2 lg:flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#f0eee9] dark:border-[#2a2a2a]'>
                                            <Link
                                                prefetch={false}
                                                href={`${courseCode}/${branch.branchCode}`}
                                                className='inline-flex items-center justify-center px-4 py-2 sm:py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98] w-full sm:w-auto min-w-[160px]'
                                            >
                                                Explore Subjects
                                            </Link>
                                            <Link
                                                prefetch={false}
                                                href={`/${slug}/syllabus/branch/${branch.branchCode}`}
                                                className='inline-flex items-center justify-center px-4 py-2 sm:py-2.5 bg-[#f6f5f4] dark:bg-[#282828] text-[#555] dark:text-[#bbb] hover:bg-[#eae8e4] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#383838] text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98] w-full sm:w-auto min-w-[160px]'
                                            >
                                                View Syllabus
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-8 sm:p-12 text-center shadow-sm max-w-2xl mx-auto'>
                                <BookOpen className='w-12 h-12 sm:w-14 sm:h-14 text-[#8c8883] dark:text-[#787672] mx-auto mb-4' />
                                <h3 className='text-lg font-bold text-[#101828] dark:text-white mb-2'>
                                    No branches found
                                </h3>
                                <p className='text-sm text-[#475467] dark:text-[#9ea3ae]'>
                                    Check back later or try adjusting your search.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
