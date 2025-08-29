import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/config/apiUrls";
import VideoDetailClient from "./VideoDetailClient";

interface VideoDetailPageProps {
    params: Promise<{
        slug: string;
        "video-slug": string;
    }>;
}

export async function generateMetadata({
    params,
}: VideoDetailPageProps): Promise<Metadata> {
    const { slug, "video-slug": videoSlug } = await params;
    const collegeName = decodeURIComponent(slug);
    const videoTitle = decodeURIComponent(videoSlug);

    return {
        title: `${videoTitle} - ${collegeName} | StudentSenior`,
        description: `Watch ${videoTitle} at ${collegeName}. Educational video content shared by students and seniors.`,
        keywords: [
            "video",
            "educational content",
            "tutorial",
            "lecture",
            videoTitle,
            collegeName,
            "student resources",
        ],
    };
}

async function getVideoData(collegeSlug: string, videoSlug: string) {
    try {
        const response = await fetch(
            `${api.videos.getVideoBySlug(videoSlug)}`,
            {
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch video");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
}

export default async function VideoDetailPage({
    params,
}: VideoDetailPageProps) {
    const { slug, "video-slug": videoSlug } = await params;
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
