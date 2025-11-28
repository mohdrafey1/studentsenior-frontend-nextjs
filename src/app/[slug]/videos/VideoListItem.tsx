'use client';
import Link from 'next/link';
import { IVideo } from '@/utils/interface';
import {
    Play,
    Edit2,
    Trash2,
    Calendar,
    BookOpen,
    Eye,
    Folder,
} from 'lucide-react';

interface VideoListItemProps {
    video: IVideo;
    onEdit: (video: IVideo) => void;
    onDelete: (videoId: string) => void;
    ownerId: string;
}

export const VideoListItem: React.FC<VideoListItemProps> = ({
    video,
    onEdit,
    onDelete,
    ownerId,
}) => {
    const isOwner = video.owner?._id === ownerId;

    return (
        <article className='group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:border-purple-300/60 dark:hover:border-purple-600/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden backdrop-blur-sm'>
            {/* Animated Background Gradient */}
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-red-500/5 dark:from-purple-400/10 dark:via-pink-400/10 dark:to-red-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500' />

            <div className='relative p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    {/* Left Section - Main Info */}
                    <div className='flex-1 min-w-0 space-y-2'>
                        {/* Title */}
                        <div className='flex-1 min-w-0'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 line-clamp-1'>
                                {video.title}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1'>
                                {video.description}
                            </p>
                        </div>

                        {/* Subject Info */}
                        <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400'>
                            <div className='flex items-center gap-1.5'>
                                <Folder className='w-4 h-4 flex-shrink-0' />
                                <span className='truncate'>
                                    {video.subject.subjectCode}
                                </span>
                            </div>
                            <span className='text-gray-300 dark:text-gray-600'>
                                •
                            </span>
                            <div className='flex items-center gap-1.5'>
                                <BookOpen className='w-4 h-4 flex-shrink-0' />
                                <span>{video.subject.semester} Sem</span>
                            </div>
                            <span className='text-gray-300 dark:text-gray-600'>
                                •
                            </span>
                            <div className='flex items-center gap-1.5'>
                                <Eye className='w-4 h-4 flex-shrink-0' />
                                <span>{video.clickCounts || 0}</span>
                            </div>
                        </div>

                        {/* Date */}
                        <div className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500'>
                            <Calendar className='w-3.5 h-3.5 flex-shrink-0' />
                            <time>
                                {new Date(video.createdAt).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    },
                                )}
                            </time>
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className='flex sm:flex-col items-center gap-2'>
                        {/* Watch Video Link */}
                        <Link
                            prefetch={false}
                            href={`/${video.college.slug}/videos/${video.slug}`}
                            className='flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl'
                        >
                            <Play className='w-4 h-4' />
                            <span>Watch</span>
                        </Link>

                        <div className='flex items-center gap-2'>
                            {/* Edit & Delete for Owners */}
                            {isOwner && (
                                <>
                                    <button
                                        onClick={() => onEdit(video)}
                                        className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300'
                                        aria-label='Edit video'
                                        title='Edit video'
                                    >
                                        <Edit2 className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() => onDelete(video._id)}
                                        className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300'
                                        aria-label='Delete video'
                                        title='Delete video'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};
