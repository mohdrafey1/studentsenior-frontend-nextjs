import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import {
    Video,
    Eye,
    Plus,
    FileText,
    BookOpen,
    ExternalLink,
    Play,
} from "lucide-react";
import Link from "next/link";
import DetailPageNavbar from "@/components/Common/DetailPageNavbar";

interface IVideoItem {
    _id: string;
    title: string;
    slug: string;
    videoUrl: string;
    description?: string;
    clickCounts?: number;
}

interface SubjectVideosPageProps {
    params: Promise<{
        "video-slug": string;
        slug: string;
        courseCode: string;
        branchCode: string;
    }>;
}

export async function generateMetadata({
    params,
}: SubjectVideosPageProps): Promise<Metadata> {
    const { "video-slug": subjectCode, slug } = await params;
    return {
        title: `${capitalizeWords(subjectCode)} - Videos | ${capitalizeWords(
            slug
        )}`,
        description: "Educational videos and lectures for the subject",
    };
}

export default async function SubjectVideosPage({
    params,
}: SubjectVideosPageProps) {
    const {
        "video-slug": subjectCode,
        slug,
        courseCode,
        branchCode,
    } = await params;

    let videos: IVideoItem[] = [];
    try {
        const url = `${api.resources.getVideosBySubject(subjectCode, slug)}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        const data = await res.json();
        videos = data?.data || [];
    } catch (error) {
        console.error("Failed to fetch Videos by subject:", error);
    }

    return (
        <>
            <DetailPageNavbar
                path="subjects"
                fullPath={`/${slug}/resources/${courseCode}/${branchCode}`}
            />
            <div className="max-w-7xl mx-auto p-4 space-y-6">
                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Video className="w-6 h-6 text-purple-500" />
                                {subjectCode.toUpperCase()} - Video Lectures
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Educational videos and lectures to help you
                                learn
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Link
                                href={`/${slug}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                PYQs
                            </Link>
                            <Link
                                href={`/${slug}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                Notes
                            </Link>
                            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add Video
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {videos.length} video
                    {videos.length === 1 ? "" : "s"}
                </div>

                {/* Videos Grid or Empty State */}
                {videos.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12">
                        <div className="text-center">
                            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No Videos Available
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Be the first to contribute educational videos
                                for this subject and help fellow students learn
                                better.
                            </p>
                            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors">
                                <Plus className="w-4 h-4" />
                                Add First Video
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {videos.map((video) => (
                            <article
                                key={video._id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Video Thumbnail/Header */}
                                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white">
                                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-3">
                                        <Play className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-white line-clamp-2 text-lg">
                                        {video.title}
                                    </h3>
                                </div>

                                {/* Video Content */}
                                <div className="p-4">
                                    {video.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                            {video.description}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    {video.clickCounts !== undefined && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            <Eye className="w-4 h-4" />
                                            <span>
                                                {video.clickCounts} views
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Video Footer */}
                                <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
                                    <a
                                        href={video.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <Play className="w-4 h-4" />
                                        Watch Video
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
