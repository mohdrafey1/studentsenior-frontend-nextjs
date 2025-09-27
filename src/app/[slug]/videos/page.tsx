import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/config/apiUrls';
import VideosClient from './VideosClient';

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
        <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <header className='text-center mb-8'>
                <h1 className='text-2xl font-fugaz sm:text-4xl font-bold text-gray-800 dark:text-white mb-3'>
                    Videos
                </h1>
                <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto'>
                    Discover educational videos, tutorials, and lectures shared
                    by students and seniors at {collegeSlug.replace(/-/g, ' ')}.
                </p>
            </header>

            <VideosClient
                initialVideos={videos}
                initialPagination={pagination}
                collegeName={collegeSlug}
            />
        </main>
    );
}
