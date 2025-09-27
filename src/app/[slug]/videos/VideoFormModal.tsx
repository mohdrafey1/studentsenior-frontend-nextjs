'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ICourse, IBranch } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import { CheckCircle, X, Youtube, ExternalLink } from 'lucide-react';
import SearchableSelect from '@/components/Common/SearchableSelect';
import toast from 'react-hot-toast';

export interface VideoFormData {
    title: string;
    description: string;
    videoUrl: string;
    subjectCode: string;
}

interface VideoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: VideoFormData) => Promise<void>;
    form: VideoFormData;
    setForm: React.Dispatch<React.SetStateAction<VideoFormData>>;
    courses: ICourse[];
    branches: IBranch[];
    loadingCourses: boolean;
    loadingBranches: boolean;
    fetchBranches: (courseCode: string) => Promise<void>;
}

const VideoFormModal: React.FC<VideoFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    courses,
    branches,
    loadingCourses,
    loadingBranches,
    fetchBranches,
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [subjects, setSubjects] = useState<
        Array<{
            _id: string;
            subjectName: string;
            subjectCode: string;
            semester: number;
        }>
    >([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [loadingVideoData, setLoadingVideoData] = useState(false);
    const appliedPrefRef = useRef(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSelectedCourse('');
            setSubjects([]);
            appliedPrefRef.current = false;
        }
    }, [isOpen]);

    // Apply saved preference: set course by courseCode when modal opens
    useEffect(() => {
        if (!isOpen || courses.length === 0 || selectedCourse) return;
        try {
            const saved = localStorage.getItem('ss:resourcePref');
            if (!saved) return;
            const pref = JSON.parse(saved) as { courseCode?: string };
            if (!pref.courseCode) return;
            const match = courses.find((c) => c.courseCode === pref.courseCode);
            if (match) {
                setSelectedCourse(match._id);
                // Trigger branches load
                fetchBranches(match.courseCode);
            }
        } catch {
            // ignore
        }
    }, [isOpen, courses, selectedCourse, fetchBranches]);

    // After branches load, apply saved branch by branchCode (once per open)
    useEffect(() => {
        if (!isOpen || appliedPrefRef.current || branches.length === 0) return;
        try {
            const saved = localStorage.getItem('ss:resourcePref');
            if (!saved) return;
            const pref = JSON.parse(saved) as { branchCode?: string };
            if (!pref.branchCode) return;
            const match = branches.find(
                (b) => b.branchCode === pref.branchCode,
            );
            if (match) {
                setSelectedBranch(match._id);
                // Also prefetch subjects list for convenience
                fetchSubjects(match.branchCode);
                appliedPrefRef.current = true;
            }
        } catch {
            // ignore
        }
    }, [isOpen, branches]);

    const fetchSubjects = async (branchCode: string) => {
        setLoadingSubjects(true);
        try {
            const response = await fetch(api.resources.getSubjects(branchCode));
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch subjects');
            }

            setSubjects(data.data || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleCourseChange = (courseId: string) => {
        setSelectedCourse(courseId);
        const course = courses.find((c) => c._id === courseId);
        if (course) {
            fetchBranches(course.courseCode);
        }
    };

    const handleBranchChange = (branchId: string) => {
        setSelectedBranch(branchId);
        const branch = branches.find((b) => b._id === branchId);
        if (branch) {
            fetchSubjects(branch.branchCode);
        }
    };

    // Function to extract YouTube video data
    const extractYouTubeData = async (url: string) => {
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
            return null;
        }

        // Check for playlist
        const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
        if (playlistMatch) {
            toast.success(
                'YouTube playlist detected. Playlist info cannot be auto-filled.',
            );
            return {
                title: '',
                description: '',
                thumbnail: '',
                isPlaylist: true,
            };
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
                console.error('Error fetching oEmbed data:', error);
                // fallback
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
            if (videoData) {
                if (videoData.isPlaylist) {
                    // Playlist detected, do not autofill title/desc
                    return;
                }
                if (videoData.title) {
                    setForm((prev) => ({
                        ...prev,
                        title: videoData.title,
                        description: videoData.description || prev.description,
                    }));
                    toast.success(
                        'Video information auto-filled from YouTube!',
                    );
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!selectedCourse) {
            toast.error('Please select a course');
            return;
        }

        if (!selectedBranch) {
            toast.error('Please select a branch');
            return;
        }

        if (!form.subjectCode) {
            toast.error('Please select a subject');
            return;
        }

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
        const loadingToast = toast.loading('Processing your request...');

        try {
            // Submit the form data
            await onSubmit(form);

            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to save video',
            );
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    // Format data for searchable selects
    const courseOptions = courses.map((course) => ({
        value: course._id,
        label: `${course.courseName} (${course.courseCode})`,
    }));

    const branchOptions = branches.map((branch) => ({
        value: branch._id,
        label: `${branch.branchName} (${branch.branchCode})`,
    }));

    const subjectOptions = subjects.map((subject) => ({
        value: subject.subjectCode,
        label: `${subject.subjectName} (${subject.subjectCode})`,
    }));

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-sky-50 dark:bg-gray-900 flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
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

                <form
                    onSubmit={handleSubmit}
                    className='p-6 space-y-4 bg-white dark:bg-gray-800'
                >
                    {/* Video URL */}
                    <div>
                        <label className='block font-semibold text-sky-500 dark:text-sky-400 mb-1'>
                            YouTube Video or Playlist URL*
                        </label>
                        <div className='relative'>
                            <Youtube className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                            <input
                                type='url'
                                value={form.videoUrl}
                                onChange={handleVideoUrlChange}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent'
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
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                            placeholder='Enter video title'
                            required
                        />
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
                            rows={3}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                            placeholder='Enter video description (optional)'
                        />
                    </div>

                    {/* Course Selection */}
                    <div>
                        <SearchableSelect
                            label='Course *'
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            options={courseOptions}
                            placeholder='Select Course'
                            loading={loadingCourses}
                        />
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <SearchableSelect
                            label='Branch *'
                            value={selectedBranch}
                            onChange={handleBranchChange}
                            options={branchOptions}
                            placeholder='Select Branch'
                            loading={loadingBranches}
                            disabled={!selectedCourse}
                        />
                    </div>

                    {/* Subject Selection */}
                    <div>
                        <SearchableSelect
                            label='Subject *'
                            value={form.subjectCode}
                            onChange={(subjectCode) =>
                                setForm((prev) => ({
                                    ...prev,
                                    subjectCode,
                                }))
                            }
                            options={subjectOptions}
                            placeholder='Select Subject'
                            loading={loadingSubjects}
                            disabled={!selectedBranch}
                        />
                    </div>

                    {/* Loading State for Video Data */}
                    {loadingVideoData && (
                        <div className='flex items-center justify-center py-4'>
                            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600'></div>
                            <span className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
                                Extracting video information...
                            </span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className='flex justify-end gap-3 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={
                                loading ||
                                !form.title ||
                                !form.videoUrl ||
                                !form.subjectCode ||
                                loadingVideoData
                            }
                            className='px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
                        >
                            {loading ? 'Saving...' : 'Add Video'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VideoFormModal;
