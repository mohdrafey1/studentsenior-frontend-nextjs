"use client";
import Link from "next/link";
import { IVideo } from "@/utils/interface";
import { Video, Edit2, Trash2, Play, Calendar, BookOpen } from "lucide-react";
import Image from "next/image";

interface VideoCardProps {
    video: IVideo;
    onEdit: (video: IVideo) => void;
    onDelete: (videoId: string) => void;
    ownerId: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
    video,
    onEdit,
    onDelete,
    ownerId,
}) => {
    const isOwner = video.owner._id === ownerId;

    // Extract YouTube video ID from URL
    const getYouTubeThumbnail = (url: string) => {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
        }
        return null;
    };

    const thumbnailUrl = getYouTubeThumbnail(video.videoUrl);

    return (
        <article
            className="group relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-emerald-300/60 dark:hover:border-emerald-600/60 shadow-sm hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col"
            aria-label={video.title}
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-400/10 dark:via-teal-400/10 dark:to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />

            {/* Floating Orb Effect - Smaller on mobile */}
            <div className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl sm:blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />

            {/* Thumbnail Section */}
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

            {/* Content Section - Compact padding on mobile */}
            <div className="flex-1 p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3 lg:space-y-4">
                {/* Title and Description - Smaller text on mobile */}
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

                {/* Subject Info - More compact on mobile */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">
                        {video.subject.subjectName}
                    </span>
                </div>

                {/* Details Grid - More compact on mobile */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">
                            Sem {video.subject.semester}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">
                            {new Date(video.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                }
                            )}
                        </span>
                    </div>
                </div>

                {/* Status Indicators - More compact on mobile */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {video.submissionStatus === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            <span className="hidden sm:inline">Pending</span>
                            <span className="sm:hidden">P</span>
                        </span>
                    )}
                    {video.submissionStatus === "rejected" && (
                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            <span className="hidden sm:inline">Rejected</span>
                            <span className="sm:hidden">R</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons - More compact on mobile */}
            <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6 z-40">
                <div className="flex gap-1.5 sm:gap-2">
                    <Link
                        href={`videos/${video.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 group-hover:shadow-lg"
                    >
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Watch Video</span>
                        <span className="sm:hidden">Watch</span>
                    </Link>

                    {isOwner && (
                        <>
                            <button
                                onClick={() => onEdit(video)}
                                aria-label="Edit Video"
                                className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60 transition-colors duration-200"
                            >
                                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400" />
                            </button>
                            <button
                                onClick={() => onDelete(video._id)}
                                aria-label="Delete Video"
                                className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 transition-colors duration-200"
                            >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};

export default VideoCard;
