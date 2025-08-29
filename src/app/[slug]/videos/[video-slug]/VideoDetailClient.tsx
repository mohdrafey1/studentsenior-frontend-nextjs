"use client";
import { IVideo } from "@/utils/interface";

import { Play, Calendar, BookOpen, User, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import DetailPageNavbar from "@/components/Common/DetailPageNavbar";

interface VideoDetailClientProps {
    video: IVideo;
}

const VideoDetailClient: React.FC<VideoDetailClientProps> = ({ video }) => {
    const handleShare = async () => {
        try {
            await navigator.share({
                title: video.title,
                text:
                    video.description || `Check out this video: ${video.title}`,
                url: window.location.href,
            });
        } catch (error) {
            // Fallback to copying URL
            console.log(error);
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    // Extract YouTube video ID from URL
    const getYouTubeEmbedUrl = (url: string) => {
        // Check for playlist
        const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
        if (playlistMatch) {
            return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}`;
        }
        // Fallback to single video
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return null;
    };

    const embedUrl = getYouTubeEmbedUrl(video.videoUrl);

    return (
        <>
            <DetailPageNavbar path="videos" />
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                {/* Video Player */}
                <div className="bg-white mt-5 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {embedUrl ? (
                        <div className="aspect-video w-full">
                            <iframe
                                src={embedUrl}
                                title={video.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <div className="text-center">
                                <Play className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Video not available
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    {/* Title and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {video.title}
                            </h1>
                            {video.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {video.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-600 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-400 dark:hover:bg-sky-900/60 rounded-lg transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                <span className="hidden sm:inline">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Video Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Subject
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {video.subject.subjectName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Semester
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {video.subject.semester}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Posted
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {new Date(
                                        video.createdAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Play className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Views
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {video.clickCounts || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Owner Information */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/40 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Shared by
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {video.owner.username}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoDetailClient;
