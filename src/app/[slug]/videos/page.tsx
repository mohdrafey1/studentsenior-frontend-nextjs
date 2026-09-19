import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/config/apiUrls';
import VideosClient from './VideosClient';
import { PlayCircle, MonitorPlay, Film } from 'lucide-react';
import { capitalizeWords } from '@/utils/formatting';

interface VideosPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({
    params,
}: VideosPageProps): Promise<Metadata> {
    const { slug } = await params;
    const collegeName = decodeURIComponent(slug);

    return {
        title: `Videos - ${collegeName} | StudentSenior`,
        description: `Explore educational videos for ${collegeName}. Find video content, tutorials, and lectures shared by students and seniors.`,
        keywords: [
            'videos',
            'educational content',
            'tutorials',
            'lectures',
            collegeName,
            'student resources',
        ],
    };
}

async function getVideosData(collegeSlug: string) {
    try {
        const response = await fetch(
            `${api.videos.getVideosByCollegeSlug(collegeSlug)}?page=1&limit=12`,
            {
                next: { revalidate: 60 },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        return {
            videos: data.data.videos || [],
            pagination: data.data.pagination || null,
        };
    } catch (error) {
        console.error('Error fetching videos:', error);
        return {
            videos: [],
            pagination: null,
        };
    }
}

export default async function VideosPage({ params }: VideosPageProps) {
    const { slug } = await params;
    const collegeSlug = decodeURIComponent(slug);

    const { videos, pagination } = await getVideosData(collegeSlug);

    if (!videos) {
        notFound();
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
                        Educational Videos —{' '}
                        <span className='text-[#0075de] dark:text-[#62aef0]'>
                            {capitalizeWords(collegeSlug.replace(/-/g, ' '))}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='max-w-2xl mx-auto text-xs sm:text-sm text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-4'>
                        Discover educational videos, tutorials, and lectures shared by students and seniors.
                    </p>

                    {/* Highlights Badges */}
                    <div className='flex flex-wrap items-center justify-center gap-2 text-xs'>
                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fdf1e8] dark:bg-[#3d2411] text-[#dd5b00] dark:text-[#fb923c] border border-[#fbd8c1] dark:border-[#583318] font-medium'>
                            <PlayCircle className='w-3 h-3' /> Lectures
                        </span>
                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474] font-medium'>
                            <MonitorPlay className='w-3 h-3' /> Tutorials
                        </span>
                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] font-medium'>
                            <Film className='w-3 h-3' /> Course Content
                        </span>
                    </div>
                </div>
            </section>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <VideosClient
                    initialVideos={videos}
                    initialPagination={pagination}
                    collegeName={collegeSlug}
                />
            </div>
        </main>
    );
}
