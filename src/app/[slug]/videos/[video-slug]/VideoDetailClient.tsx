'use client';
import { IVideo } from '@/utils/interface';

import { Play, Calendar, BookOpen, User, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';

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
            toast.success('Link copied to clipboard!');
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
        <div className='min-h-screen bg-white dark:bg-[#191919]'>
            <DetailPageNavbar path='videos' />
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8'>
                
                {/* Title and Share Header */}
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                    <div className='flex-1'>
                        <h1 className='text-2xl sm:text-4xl font-bold text-[#101828] dark:text-[#ededed] mb-3 tracking-tight'>
                            {video.title}
                        </h1>
                        {video.description && (
                            <p className='text-base sm:text-lg text-[#615d59] dark:text-[#a09e9a] leading-relaxed max-w-4xl'>
                                {video.description}
                            </p>
                        )}
                    </div>
                    <div className='flex items-center gap-3 shrink-0'>
                        <button
                            onClick={handleShare}
                            className='inline-flex items-center gap-2 px-4 py-2.5 bg-[#fcfbf9] hover:bg-[#f0eee9] dark:bg-[#202020] dark:hover:bg-[#2a2a2a] text-[#101828] dark:text-[#ededed] text-sm font-semibold rounded-xl border border-[#e6e6e6] dark:border-[#383838] transition-all shadow-sm active:scale-[0.98]'
                        >
                            <Share2 className='w-4 h-4' />
                            <span>Share</span>
                        </button>
                    </div>
                </div>

                {/* Video Player */}
                <div className='w-full max-w-5xl mx-auto bg-black dark:bg-[#0a0a0a] rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.3)] overflow-hidden border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                    {embedUrl ? (
                        <div className='aspect-video w-full'>
                            <iframe
                                src={embedUrl}
                                title={video.title}
                                className='w-full h-full'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className='aspect-video w-full bg-[#fcfbf9] dark:bg-[#191919] flex items-center justify-center'>
                            <div className='text-center'>
                                <Play className='w-16 h-16 text-[#8c8883] dark:text-[#787672] mx-auto mb-4' />
                                <p className='text-[#615d59] dark:text-[#a09e9a] font-medium'>
                                    Video not available
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Details Grid */}
                <div className='bg-white dark:bg-[#202020] rounded-2xl shadow-sm border border-[#e6e6e6] dark:border-[#2f2f2f] p-6 sm:p-8'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
                        <div>
                            <div className='flex items-center gap-2 text-[#8c8883] dark:text-[#787672] mb-1'>
                                <BookOpen className='w-4 h-4' />
                                <p className='text-xs font-bold uppercase tracking-wider'>
                                    Subject
                                </p>
                            </div>
                            <p className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                {video.subject.subjectName}
                            </p>
                        </div>

                        <div>
                            <div className='flex items-center gap-2 text-[#8c8883] dark:text-[#787672] mb-1'>
                                <BookOpen className='w-4 h-4' />
                                <p className='text-xs font-bold uppercase tracking-wider'>
                                    Semester
                                </p>
                            </div>
                            <p className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                {video.subject.semester}
                            </p>
                        </div>

                        <div>
                            <div className='flex items-center gap-2 text-[#8c8883] dark:text-[#787672] mb-1'>
                                <Calendar className='w-4 h-4' />
                                <p className='text-xs font-bold uppercase tracking-wider'>
                                    Posted
                                </p>
                            </div>
                            <p className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                {new Date(
                                    video.createdAt,
                                ).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div>
                            <div className='flex items-center gap-2 text-[#8c8883] dark:text-[#787672] mb-1'>
                                <Play className='w-4 h-4' />
                                <p className='text-xs font-bold uppercase tracking-wider'>
                                    Views
                                </p>
                            </div>
                            <p className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                {video.clickCounts || 0}
                            </p>
                        </div>
                    </div>

                    {/* Owner Information */}
                    <div className='border-t border-[#f0eee9] dark:border-[#2a2a2a] pt-6'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-[#eaf3fd] dark:bg-[#183153] border border-[#d2e4f9] dark:border-[#224474] rounded-full flex items-center justify-center'>
                                <User className='w-5 h-5 text-[#0075de] dark:text-[#62aef0]' />
                            </div>
                            <div>
                                <p className='text-xs font-bold uppercase tracking-wider text-[#8c8883] dark:text-[#787672] mb-0.5'>
                                    Shared by
                                </p>
                                <p className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                    {video.owner.username}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoDetailClient;
