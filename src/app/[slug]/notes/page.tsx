import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { CollegePageProps, IPagination, INote } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import NotesClient from './NotesClient';
import { FileText, CheckCircle2, TrendingUp } from 'lucide-react';

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    const collegeName = capitalizeWords(slug);
    
    return {
        title: `Notes & Study Material - ${collegeName} | Student Senior`,
        description: `Browse, download and share high-quality notes and study materials for ${collegeName}. Peer-reviewed class notes, summaries, and exam preparation guides.`,
    };
}

export default async function NotesPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;
    const collegeTitle = capitalizeWords(collegeName);

    let notes: INote[] = [];
    let pagination: IPagination | null = null;

    try {
        const url = `${api.notes.getNotesByCollegeSlug(collegeName)}`;
        const res = await fetch(url, { next: { revalidate: 60 } });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        notes = data?.data?.notes || [];
        pagination = data?.data?.pagination || null;
    } catch (error) {
        console.error('Error fetching notes:', error);
    }

    return (
        <main className='min-h-screen bg-white dark:bg-[#191919] text-[#101828] dark:text-[#ededed]'>
            {/* Header Section */}
            <section className='relative bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden pt-8 pb-9 sm:pt-10 sm:pb-11 px-4 sm:px-6 lg:px-8'>
                {/* Subtle Notion Document Grid / Dot Mesh */}
                <div className='absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.12] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:24px_24px]'></div>

                <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center'>
                    {/* Headline */}
                    <h1 className='font-bold tracking-[-0.03em] leading-tight mb-2 text-2xl sm:text-3xl md:text-4xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                        Study Notes & Materials —{' '}
                        <span className='text-[#0075de] dark:text-[#62aef0]'>
                            {collegeTitle}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='max-w-2xl mx-auto text-xs sm:text-sm text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-4'>
                        Access comprehensive class notes, clear concepts, and prepare for exams with our community-driven study repository.
                    </p>

                    {/* Highlights Badges */}
                    <div className='flex flex-wrap items-center justify-center gap-2 text-xs'>
                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474] font-medium'>
                            <FileText className='w-3 h-3' /> High-Quality Notes
                        </span>
                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] font-medium'>
                            <CheckCircle2 className='w-3 h-3' /> Peer Reviewed
                        </span>
                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fdf1e8] dark:bg-[#3d2411] text-[#dd5b00] dark:text-[#fb923c] border border-[#fbd8c1] dark:border-[#583318] font-medium'>
                            <TrendingUp className='w-3 h-3' /> Exam Prep Guides
                        </span>
                    </div>
                </div>
            </section>

            {/* Notes Catalog & Client Controls */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <NotesClient
                    initialNotes={notes}
                    initialPagination={
                        pagination || {
                            currentPage: 1,
                            totalPages: 1,
                            totalItems: 0,
                            hasNextPage: false,
                            hasPrevPage: false,
                        }
                    }
                    collegeName={collegeName}
                />
            </div>
        </main>
    );
}
