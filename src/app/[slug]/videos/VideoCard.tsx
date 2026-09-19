'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IVideo } from '@/utils/interface';
import { Video, Edit2, Trash2, Play, Calendar, BookOpen } from 'lucide-react';
import Image from 'next/image';

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
    const isOwner = video.owner?._id === ownerId;
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    useEffect(() => {
        const getYouTubeThumbnail = (url: string) => {
            if (url.includes('playlist?list=')) {
                // Show a default playlist placeholder image
                setThumbnailUrl('/assets/images/playlist.png'); // Add a local image in /public
                return;
            }

            const regExp =
                /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) {
                setThumbnailUrl(
                    `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`,
                );
            }
        };

        getYouTubeThumbnail(video.videoUrl);
    }, [video.videoUrl]);

    return (
        <article
            className='group bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full'
            aria-label={video.title}
        >
            {/* Thumbnail Section */}
            <div className='relative aspect-video overflow-hidden border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={video.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                        width={500}
                        height={500}
                    />
                ) : (
                    <div className='w-full h-full bg-[#fcfbf9] dark:bg-[#191919] flex items-center justify-center'>
                        <Video className='w-12 h-12 text-[#8c8883] dark:text-[#787672]' />
                    </div>
                )}

                {/* Play Button Overlay */}
                <div className='absolute inset-0 cursor-pointer bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='w-14 h-14 bg-white/95 dark:bg-[#191919]/95 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#e6e6e6] dark:border-[#383838]'>
                        <Link  
                        prefetch={false}
                        href={`videos/${video.slug}`}>
                        <Play className='w-6 h-6 text-[#101828] dark:text-white ml-1' />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className='flex-1 p-3 sm:p-4 flex flex-col'>
                {/* Title and Description */}
                <div className='mb-3'>
                    <h3 className='text-sm font-bold text-[#101828] dark:text-[#ededed] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors line-clamp-2 leading-snug'>
                        {video.title}
                    </h3>
                    {video.description && (
                        <p className='text-[11px] sm:text-xs text-[#615d59] dark:text-[#a09e9a] line-clamp-2 mt-1.5 leading-relaxed'>
                            {video.description}
                        </p>
                    )}
                </div>

                {/* Subject Info */}
                <div className='flex items-center gap-1.5 text-[11px] sm:text-xs text-[#615d59] dark:text-[#a09e9a] mb-2'>
                    <BookOpen className='w-3 h-3 flex-shrink-0' />
                    <span className='truncate font-medium text-[#101828] dark:text-[#ededed]'>
                        {video.subject.subjectName}
                    </span>
                </div>

                {/* Details Grid */}
                <div className='grid grid-cols-2 gap-2 text-[11px] sm:text-xs mb-3 flex-1'>
                    <div className='flex items-center gap-1.5 text-[#8c8883] dark:text-[#787672]'>
                        <BookOpen className='w-3 h-3 flex-shrink-0' />
                        <span className='truncate'>
                            Sem {video.subject.semester}
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 text-[#8c8883] dark:text-[#787672]'>
                        <Calendar className='w-3 h-3 flex-shrink-0' />
                        <span className='truncate'>
                            {new Date(video.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                },
                            )}
                        </span>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className='flex flex-wrap gap-1.5 mb-3'>
                    {video.submissionStatus === 'pending' && (
                        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#fffbeb] text-[#d97706] border border-[#fef08a] dark:bg-[#382606] dark:border-[#524419] dark:text-[#fbbf24]'>
                            <span className='w-1.5 h-1.5 bg-[#d97706] dark:bg-[#fbbf24] rounded-full'></span>
                            <span>Pending</span>
                        </span>
                    )}
                    {video.submissionStatus === 'rejected' && (
                        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] dark:bg-[#3f1616] dark:border-[#5c1c1c] dark:text-[#f87171]'>
                            <span className='w-1.5 h-1.5 bg-[#dc2626] dark:bg-[#f87171] rounded-full'></span>
                            <span>Rejected</span>
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-2 pt-3 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                    <Link
                        prefetch={false}
                        href={`videos/${video.slug}`}
                        className='flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                    >
                        {!isOwner ? (
                            <>
                                <Play className='w-3.5 h-3.5' />
                                <span>Watch Video</span>
                            </>
                        ) : (
                            <Play className='w-3.5 h-3.5' />
                        )}
                    </Link>

                    {isOwner && (
                        <>
                            <button
                                onClick={() => onEdit(video)}
                                aria-label='Edit Video'
                                className='w-8 h-8 flex cursor-pointer items-center justify-center rounded-lg bg-[#fffbeb] hover:bg-[#fef3c7] dark:bg-[#382606] dark:hover:bg-[#473007] border border-[#fef08a] dark:border-[#524419] transition-colors duration-200'
                            >
                                <Edit2 className='w-3.5 h-3.5 text-[#d97706] dark:text-[#fbbf24]' />
                            </button>
                            <button
                                onClick={() => onDelete(video._id)}
                                aria-label='Delete Video'
                                className='w-8 h-8 flex cursor-pointer items-center justify-center rounded-lg bg-[#fef2f2] hover:bg-[#fee2e2] dark:bg-[#3f1616] dark:hover:bg-[#4a1a1a] border border-[#fecaca] dark:border-[#5c1c1c] transition-colors duration-200'
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

export default VideoCard;
