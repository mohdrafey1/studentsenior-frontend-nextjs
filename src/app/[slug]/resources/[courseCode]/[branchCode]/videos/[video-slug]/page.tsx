import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import { Video, Eye, Plus, FileText, BookOpen, Play } from "lucide-react";
import Link from "next/link";
import DetailPageNavbar from "@/components/Common/DetailPageNavbar";
import Image from "next/image";

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

    const getYouTubeThumbnail = (url: string) => {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
        }
        return null;
    };

    const thumbnailUrl = getYouTubeThumbnail(videos[0]?.videoUrl || "");

    return (
        <>
            <DetailPageNavbar
                path="subjects"
                fullPath={`/${slug}/resources/${courseCode}/${branchCode}`}
            />
            <main className="min-h-screen">
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
                                    Be the first to contribute educational
                                    videos for this subject and help fellow
                                    students learn better.
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
                                    <div className="relative aspect-video overflow-hidden">
                                        {thumbnailUrl ? (
                                            <Image
                                                src={thumbnailUrl}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                width={500}
                                                height={500}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <Video className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        )}

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg">
                                                <Play className="w-8 h-8 text-gray-800 dark:text-white ml-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video Content */}
                                    <div className="p-4">
                                        <div className="space-y-1 sm:space-y-2">
                                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 leading-tight">
                                                {video.title}
                                            </h3>
                                            {video.description && (
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                    {video.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        {video.clickCounts !== undefined && (
                                            <div className="flex mt-2 items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                <Eye className="w-4 h-4" />
                                                <span>
                                                    {video.clickCounts} views
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Video Footer */}
                                    <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
                                        <Link
                                            href={`/${slug}/videos/${video.slug}`}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 group-hover:shadow-lg"
                                        >
                                            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="hidden sm:inline">
                                                Watch Video
                                            </span>
                                            <span className="sm:hidden">
                                                Watch
                                            </span>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
