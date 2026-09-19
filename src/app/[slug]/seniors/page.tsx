import { api } from '@/config/apiUrls';
import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { CollegePageProps, IPagination, ISenior } from '@/utils/interface';
import SeniorClient from './SeniorClient';

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Seniors - ${capitalizeWords(slug)}`,
        description:
            'Connect with seniors to get valuable insights and advice for your college journey.',
    };
}

export default async function SeniorsPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    let seniors: ISenior[] = [];
    let pagination: IPagination | null = null;

    try {
        const url = `${api.seniors.getSeniorsByCollegeSlug(collegeName)}`;
        const res = await fetch(url, { next: { revalidate: 10 } });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        seniors = data?.data?.seniors || [];
        pagination = data?.data?.pagination || null;
    } catch (error) {
        console.error('Error fetching seniors:', error);
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
                        Seniors —{' '}
                        <span className='text-[#0075de] dark:text-[#62aef0]'>
                            {capitalizeWords(collegeName)}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='max-w-2xl mx-auto text-xs sm:text-sm text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-4'>
                        Connect with seniors to get valuable insights and advice for your college journey.
                    </p>
                </div>
            </section>
            
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <SeniorClient
                    initialSeniors={seniors}
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
