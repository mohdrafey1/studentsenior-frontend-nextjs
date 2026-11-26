import { fetchPublicApi } from '@/utils/serverFetch';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/config/apiUrls';
import VideoDetailClient from './VideoDetailClient';

// No pages are built ahead of time: each URL is rendered on its first visit,
// then cached and served from the CDN until it is 86400s old.
export const revalidate = 86400;
export async function generateStaticParams() {
    return [];
}

interface VideoDetailPageProps {
    params: Promise<{
        slug: string;
        videoSlug: string;
    }>;
}

export async function generateMetadata({
    params,
}: VideoDetailPageProps): Promise<Metadata> {
    const { slug, videoSlug } = await params;
    const collegeName = decodeURIComponent(slug);
    const videoTitle = decodeURIComponent(videoSlug);

    return {
        title: `${videoTitle} - ${collegeName} | StudentSenior`,
        description: `Watch ${videoTitle} at ${collegeName}. Educational video content shared by students and seniors.`,
        keywords: [
            'video',
            'educational content',
            'tutorial',
            'lecture',
            videoTitle,
            collegeName,
            'student resources',
        ],
    };
}

async function getVideoData(collegeSlug: string, videoSlug: string) {
    try {
        const response = await fetchPublicApi(
            `${api.videos.getVideoBySlug(videoSlug)}`,
            {
                next: { revalidate: 86400 },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to fetch video');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
}

export default async function VideoDetailPage({
    params,
}: VideoDetailPageProps) {
    const { slug, videoSlug } = await params;
    const collegeSlug = decodeURIComponent(slug);
    const videoSlugDecoded = decodeURIComponent(videoSlug);

    const video = await getVideoData(collegeSlug, videoSlugDecoded);

    if (!video) {
        notFound();
    }

    return (
        <main>
            <VideoDetailClient video={video} />
        </main>
    );
}
