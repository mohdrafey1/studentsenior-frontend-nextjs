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
        <article className='group bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#0075de] dark:hover:border-[#0075de] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200 overflow-hidden flex items-stretch'>
            {/* Accent border left */}
            <div className='w-1 bg-[#f0eee9] dark:bg-[#2a2a2a] group-hover:bg-[#0075de] transition-colors'></div>

            <div className='flex-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                {/* Left Section - Main Info */}
                <div className='flex-1 min-w-0 flex flex-col gap-2'>
                    {/* Title */}
                    <div>
                        <h3 className='text-base font-bold text-[#101828] dark:text-[#ededed] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors line-clamp-1'>
                            {video.title}
                        </h3>
                        <p className='text-sm text-[#615d59] dark:text-[#a09e9a] line-clamp-1 mt-0.5'>
                            {video.description}
                        </p>
                    </div>

                    {/* Metadata Row */}
                    <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-[#8c8883] dark:text-[#787672] font-medium'>
                        <div className='flex items-center gap-1.5'>
                            <Folder className='w-3.5 h-3.5 flex-shrink-0 text-[#a09e9a]' />
                            <span>{video.subject.subjectCode}</span>
                        </div>
                        <span className='text-[#e6e6e6] dark:text-[#383838]'>|</span>
                        <div className='flex items-center gap-1.5'>
                            <BookOpen className='w-3.5 h-3.5 flex-shrink-0 text-[#a09e9a]' />
                            <span>Sem {video.subject.semester}</span>
                        </div>
                        <span className='text-[#e6e6e6] dark:text-[#383838]'>|</span>
                        <div className='flex items-center gap-1.5'>
                            <Eye className='w-3.5 h-3.5 flex-shrink-0 text-[#a09e9a]' />
                            <span>{video.clickCounts || 0}</span>
                        </div>
                        <span className='text-[#e6e6e6] dark:text-[#383838]'>|</span>
                        <div className='flex items-center gap-1.5'>
                            <Calendar className='w-3.5 h-3.5 flex-shrink-0 text-[#a09e9a]' />
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
                </div>

                {/* Right Section - Actions */}
                <div className='flex items-center gap-2 sm:pl-4 sm:border-l border-[#f0eee9] dark:border-[#2a2a2a]'>
                    {/* Watch Link */}
                    <Link
                        prefetch={false}
                        href={`/${video.college.slug}/videos/${video.slug}`}
                        className='px-4 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-1.5'
                    >
                        <Play className='w-3.5 h-3.5' />
                        <span className='hidden sm:inline'>Watch</span>
                    </Link>

                    {/* Edit & Delete for Owners */}
                    {isOwner && (
                        <>
                            <button
                                onClick={() => onEdit(video)}
                                className='w-8 h-8 flex items-center justify-center rounded-lg bg-[#fffbeb] hover:bg-[#fef3c7] dark:bg-[#382606] dark:hover:bg-[#473007] border border-[#fef08a] dark:border-[#524419] transition-colors duration-200'
                                aria-label='Edit video'
                                title='Edit video'
                            >
                                <Edit2 className='w-3.5 h-3.5 text-[#d97706] dark:text-[#fbbf24]' />
                            </button>
                            <button
                                onClick={() => onDelete(video._id)}
                                className='w-8 h-8 flex items-center justify-center rounded-lg bg-[#fef2f2] hover:bg-[#fee2e2] dark:bg-[#3f1616] dark:hover:bg-[#4a1a1a] border border-[#fecaca] dark:border-[#5c1c1c] transition-colors duration-200'
                                aria-label='Delete video'
                                title='Delete video'
                            >
                                <Trash2 className='w-3.5 h-3.5 text-[#dc2626] dark:text-[#f87171]' />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};
