'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/config/apiUrls';
import { X } from 'lucide-react';
import SearchableSelect from '@/components/Common/SearchableSelect';
import toast from 'react-hot-toast';

export interface VideoFormData {
    subject: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    subjectCode: string;
    college: string;
}

interface ISubject {
    _id: string;
    subjectName: string;
    subjectCode: string;
    semester: number;
}

interface VideoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: VideoFormData) => void;
    form: VideoFormData;
    setForm: React.Dispatch<React.SetStateAction<VideoFormData>>;
    branchCode: string;
    subjectCode: string;
    college: string;
}

const VideoFormModal: React.FC<VideoFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    branchCode,
    subjectCode,
}) => {
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [fetchingTitle, setFetchingTitle] = useState(false);

    useEffect(() => {
        if (isOpen) setSubjects([]);
    }, [isOpen]);

    const fetchSubjects = useCallback(async (bCode: string) => {
        if (!bCode) return;
        setLoadingSubjects(true);
        try {
            const response = await fetch(api.resources.getSubjects(bCode));
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || 'Failed to fetch subjects');
            setSubjects(data.data || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoadingSubjects(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && branchCode) fetchSubjects(branchCode);
    }, [isOpen, branchCode, fetchSubjects]);

    useEffect(() => {
        if (subjects.length > 0 && subjectCode) {
            const matchingSubject = subjects.find(
                (s) => s.subjectCode === subjectCode,
            );
            if (matchingSubject) {
                setForm((prev) => ({
                    ...prev,
                    subject: matchingSubject._id,
                    subjectCode: subjectCode,
                }));
            }
        }
    }, [subjects, subjectCode, setForm]);

    // Auto-fetch YouTube title & thumbnail
    useEffect(() => {
        const fetchVideoTitle = async (url: string) => {
            if (!url) return;
            setFetchingTitle(true);
            try {
                const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
                const res = await fetch(oEmbedUrl);
                if (!res.ok) throw new Error('Failed to fetch video info');
                const data = await res.json();
                setForm((prev) => ({
                    ...prev,
                    title: data.title || prev.title,
                    thumbnailUrl: data.thumbnail_url || prev.thumbnailUrl,
                }));
            } catch (error) {
                console.warn('Could not fetch video title:', error);
            } finally {
                setFetchingTitle(false);
            }
        };
        if (form.videoUrl) fetchVideoTitle(form.videoUrl);
    }, [form.videoUrl, setForm]);

    // Parse YouTube URL to embed
    const getYouTubeEmbedUrl = (url: string) => {
        const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
        if (playlistMatch)
            return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}`;
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11)
            return `https://www.youtube.com/embed/${match[2]}`;
        return null;
    };

    const embedUrl = getYouTubeEmbedUrl(form.videoUrl);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.subject || !form.title || !form.videoUrl) {
            toast.error('Please fill all required fields.');
            return;
        }
        setLoading(true);
        try {
            await onSubmit({ ...form });
            onClose();
        } catch (error) {
            console.error('Error:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to add video',
            );
        } finally {
            setLoading(false);
        }
    };

    const subjectOptions = subjects.map((s) => ({
        value: s._id,
        label: `${s.subjectName} (${s.subjectCode})`,
    }));

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-sky-50 dark:bg-gray-900 flex items-center justify-center z-[9999] p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
                <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                        Add New Video
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors'
                    >
                        <X className='w-6 h-6' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                    {/* Video Preview */}
                    {embedUrl && (
                        <div className='aspect-video w-full rounded-lg overflow-hidden mt-2'>
                            <iframe
                                src={embedUrl}
                                title={form.title}
                                className='w-full h-full'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                            />
                        </div>
                    )}
                    {/* Subject */}
                    <SearchableSelect
                        label='Subject *'
                        value={form.subject}
                        onChange={(subjectCode) =>
                            setForm((prev) => ({
                                ...prev,
                                subject: subjectCode,
                            }))
                        }
                        options={subjectOptions}
                        placeholder='Select Subject'
                        loading={loadingSubjects}
                        disabled={true}
                    />

                    {/* YouTube URL */}
                    <div>
                        <label className='block font-semibold text-sky-500 dark:text-sky-400 mb-1'>
                            YouTube URL *
                        </label>
                        <input
                            type='url'
                            value={form.videoUrl}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    videoUrl: e.target.value,
                                }))
                            }
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                            placeholder='https://www.youtube.com/watch?v=...'
                            required
                        />
                    </div>
                    {/* Title */}
                    <div>
                        <label className='block font-semibold text-sky-500 dark:text-sky-400 mb-1'>
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
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                            placeholder='Enter video title'
                            required
                            disabled={fetchingTitle}
                        />
                        {fetchingTitle && (
                            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                Fetching title...
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className='block font-semibold text-sky-500 dark:text-sky-400 mb-1'>
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
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                            placeholder='Short description'
                        />
                    </div>

                    {/* Submit */}
                    <div className='flex justify-between gap-3 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                        >
                            Cancel
                        </button>
                        <div className='flex gap-2'>
                            <button
                                type='submit'
                                disabled={
                                    loading ||
                                    !form.subject ||
                                    !form.title ||
                                    !form.videoUrl
                                }
                                className='px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            >
                                {loading ? 'Saving...' : 'Add Video'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VideoFormModal;
