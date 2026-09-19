'use client';
import React, { useState } from 'react';
import { IVideo } from '@/utils/interface';
import { CheckCircle, X, Youtube, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title?: string;
        description?: string;
        videoUrl?: string;
    }) => Promise<void>;
    video: IVideo;
}

const EditVideoModal: React.FC<EditVideoModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    video,
}) => {
    const [loading, setLoading] = useState(false);
    const [loadingVideoData, setLoadingVideoData] = useState(false);
    const [form, setForm] = useState({
        title: video.title,
        description: video.description || '',
        videoUrl: video.videoUrl,
    });

    // Function to extract YouTube video data
    const extractYouTubeData = async (url: string) => {
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
            return null;
        }

        setLoadingVideoData(true);
        try {
            // Extract video ID from various YouTube URL formats
            const regExp =
                /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);

            if (!match || match[2].length !== 11) {
                toast.error('Invalid YouTube URL format');
                return null;
            }

            const videoId = match[2];

            // Try to fetch video data from YouTube oEmbed API
            const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

            try {
                const response = await fetch(oembedUrl);
                if (response.ok) {
                    const data = await response.json();
                    return {
                        title: data.title,
                        description: data.description || '',
                        thumbnail: data.thumbnail_url,
                    };
                }
            } catch (error) {
                console.log(
                    'Could not fetch YouTube oEmbed data, using fallback',
                    error,
                );
            }

            // Fallback: just return the video ID for thumbnail
            return {
                title: '',
                description: '',
                thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            };
        } catch (error) {
            console.error('Error extracting YouTube data:', error);
            toast.error('Failed to extract video information');
        } finally {
            setLoadingVideoData(false);
        }
    };

    const handleVideoUrlChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const url = e.target.value;
        setForm((prev) => ({ ...prev, videoUrl: url }));

        // Auto-fill video data if it's a YouTube URL
        if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
            const videoData = await extractYouTubeData(url);
            if (videoData && videoData.title) {
                setForm((prev) => ({
                    ...prev,
                    title: videoData.title,
                    description: videoData.description || prev.description,
                }));
                toast.success('Video information auto-filled from YouTube!');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!form.videoUrl.trim()) {
            toast.error('Please enter a video URL');
            return;
        }

        // Validate YouTube URL
        if (
            !form.videoUrl.includes('youtube.com') &&
            !form.videoUrl.includes('youtu.be')
        ) {
            toast.error('Please enter a valid YouTube URL');
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Updating video...');

        try {
            await onSubmit({
                title: form.title,
                description: form.description,
                videoUrl: form.videoUrl,
            });

            onClose();
        } catch (error) {
            console.error('Error updating video:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to update video',
            );
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300'>
            <div className='bg-white dark:bg-[#191919] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-[#e6e6e6] dark:border-[#2f2f2f] max-w-lg w-full max-h-[90vh] overflow-y-auto overflow-hidden'>
                {/* Header */}
                <div className='flex items-center justify-between p-5 sm:p-6 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                    <h2 className='text-lg sm:text-xl font-bold text-[#101828] dark:text-[#ededed]'>
                        Edit Video
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-[#8c8883] hover:text-[#101828] dark:text-[#787672] dark:hover:text-white transition-colors bg-[#fcfbf9] hover:bg-[#f0eee9] dark:bg-[#202020] dark:hover:bg-[#2a2a2a] p-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#383838]'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className='p-5 sm:p-6 space-y-5'
                >
                    {/* Video URL */}
                    <div>
                        <label className='block text-xs font-bold text-[#101828] dark:text-[#ededed] uppercase tracking-wide mb-2'>
                            YouTube Video URL *
                        </label>
                        <div className='relative'>
                            <Youtube className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8c8883] dark:text-[#787672]' />
                            <input
                                type='url'
                                value={form.videoUrl}
                                onChange={handleVideoUrlChange}
                                className='w-full pl-10 pr-4 py-2.5 text-sm border border-[#e6e6e6] dark:border-[#383838] rounded-xl bg-[#fcfbf9] dark:bg-[#202020] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#787672] focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:border-[#62aef0] outline-none transition-all duration-200 shadow-sm'
                                placeholder='https://www.youtube.com/watch?v=...'
                                required
                            />
                        </div>
                        {form.videoUrl && (
                            <div className='mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400'>
                                <CheckCircle className='w-4 h-4' />
                                <span>YouTube URL detected</span>
                                <a
                                    href={form.videoUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300'
                                >
                                    <ExternalLink className='w-3 h-3' />
                                    Open
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className='block text-xs font-bold text-[#101828] dark:text-[#ededed] uppercase tracking-wide mb-2'>
                            Title *
                        </label>
                        <input
                            type='text'
                            value={form.title}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className='w-full px-4 py-2.5 text-sm border border-[#e6e6e6] dark:border-[#383838] rounded-xl bg-[#fcfbf9] dark:bg-[#202020] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#787672] focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:border-[#62aef0] outline-none transition-all duration-200 shadow-sm'
                            placeholder='Enter video title'
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className='block text-xs font-bold text-[#101828] dark:text-[#ededed] uppercase tracking-wide mb-2'>
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            rows={3}
                            className='w-full px-4 py-2.5 text-sm border border-[#e6e6e6] dark:border-[#383838] rounded-xl bg-[#fcfbf9] dark:bg-[#202020] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#787672] focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:border-[#62aef0] outline-none transition-all duration-200 shadow-sm resize-y'
                            placeholder='Enter video description (optional)'
                        />
                    </div>

                    {/* Loading State for Video Data */}
                    {loadingVideoData && (
                        <div className='flex items-center justify-center py-4'>
                            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#0075de]'></div>
                            <span className='ml-2 text-sm text-[#8c8883] dark:text-[#787672] font-medium'>
                                Extracting video information...
                            </span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className='flex justify-end gap-3 pt-4 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-5 py-2 text-sm font-semibold text-[#615d59] dark:text-[#a09e9a] bg-[#fcfbf9] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#383838] rounded-xl hover:bg-[#f0eee9] dark:hover:bg-[#2a2a2a] transition-all duration-200'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={
                                loading ||
                                !form.title ||
                                !form.videoUrl ||
                                loadingVideoData
                            }
                            className='px-5 py-2 text-sm font-semibold text-white bg-[#0075de] rounded-xl hover:bg-[#0062bd] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm active:scale-[0.98]'
                        >
                            {loading ? 'Updating...' : 'Update Video'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVideoModal;
