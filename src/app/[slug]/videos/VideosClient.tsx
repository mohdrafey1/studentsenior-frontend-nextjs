'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import { IPagination, IVideo, ICourse, IBranch } from '@/utils/interface';
import { SEARCH_DEBOUNCE, NOTES_PAGE_SIZE } from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PlusIcon, SearchIcon, FilterIcon, XIcon, Video } from 'lucide-react';
import SearchableSelect from '@/components/Common/SearchableSelect';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import VideoCard from './VideoCard';
import VideoFormModal from './VideoFormModal';
import EditVideoModal from './EditVideoModal';

const VideosClient = ({
    initialVideos,
    initialPagination,
    collegeName,
}: {
    initialVideos: IVideo[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [videos, setVideos] = useState<IVideo[]>(initialVideos);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination
    );
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get('search') || ''
    );
    const [searchInput, setSearchInput] = useState(
        searchParams.get('search') || ''
    );
    const [courseFilter, setCourseFilter] = useState(
        searchParams.get('course') || ''
    );
    const [branchFilter, setBranchFilter] = useState(
        searchParams.get('branch') || ''
    );
    const [semesterFilter, setSemesterFilter] = useState(
        searchParams.get('semester') || ''
    );

    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [loading, setLoading] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editVideo, setEditVideo] = useState<IVideo | null>(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        videoUrl: '',
        subjectCode: '',
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Course and Branch data
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser
    );

    const ownerId = currentUser?._id;

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch branches when course filter changes
    useEffect(() => {
        if (courseFilter) {
            fetchBranches(courseFilter);
        } else {
            setBranches([]);
        }
    }, [courseFilter]);

    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await fetch(api.resources.getCourses);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch courses');
            }

            setCourses(data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
        } finally {
            setLoadingCourses(false);
        }
    };

    const fetchBranches = async (courseCode: string) => {
        setLoadingBranches(true);
        try {
            const response = await fetch(api.resources.getBranches(courseCode));
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch branches');
            }

            setBranches(data.data || []);
        } catch (error) {
            console.error('Error fetching branches:', error);
            toast.error('Failed to fetch branches');
        } finally {
            setLoadingBranches(false);
        }
    };

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (courseFilter) params.set('course', courseFilter);
        if (branchFilter) params.set('branch', branchFilter);
        if (semesterFilter) params.set('semester', semesterFilter);
        if (page > 1) params.set('page', page.toString());

        const newUrl = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;
        router.replace(newUrl);
    }, [
        searchTerm,
        courseFilter,
        branchFilter,
        semesterFilter,
        page,
        pathname,
        router,
    ]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
        }, SEARCH_DEBOUNCE);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', NOTES_PAGE_SIZE.toString());
            if (searchTerm) params.set('search', searchTerm);
            if (courseFilter) params.set('course', courseFilter);
            if (branchFilter) params.set('branch', branchFilter);
            if (semesterFilter) params.set('semester', semesterFilter);

            const url = `${api.videos.getVideosByCollegeSlug(
                collegeName
            )}?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const data = await response.json();
            setVideos(data.data.videos || []);
            setPagination(data.data.pagination || null);
        } catch (error) {
            console.error('Error fetching videos:', error);
            toast.error('Failed to fetch videos');
        } finally {
            setLoading(false);
        }
    }, [
        collegeName,
        searchTerm,
        courseFilter,
        branchFilter,
        semesterFilter,
        page,
    ]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const openAddModal = () => {
        if (!currentUser) {
            toast.error('Please sign in to post videos');
            return;
        }
        setForm({
            title: '',
            description: '',
            videoUrl: '',
            subjectCode: '',
        });
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
        setForm({
            title: '',
            description: '',
            videoUrl: '',
            subjectCode: '',
        });
    };

    const openEditModal = (video: IVideo) => {
        setEditVideo(video);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditVideo(null);
    };

    const handleAddSubmit = async (formData: typeof form) => {
        setLoading(true);
        try {
            const response = await fetch(api.videos.createVideo, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    college: collegeName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create video');
            }
            toast.success(data.message || 'Video created successfully!');

            // Refresh the videos list to show updated data
            await fetchVideos();
        } catch (error) {
            console.error('Error creating video:', error);
            throw error;
        } finally {
            setLoading(false);
            closeAddModal();
        }
    };

    const handleEditSubmit = async (formData: {
        title?: string;
        description?: string;
        videoUrl?: string;
    }) => {
        if (!editVideo) return;

        setLoading(true);
        try {
            const response = await fetch(api.videos.editVideo(editVideo._id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update video');
            }
            toast.success(data.message || 'Video updated successfully!');

            // Refresh the videos list to show updated data
            await fetchVideos();
        } catch (error) {
            console.error('Error updating video:', error);
            throw error;
        } finally {
            setLoading(false);
            closeEditModal();
        }
    };

    const handleDeleteRequest = (videoId: string) => {
        setDeleteTargetId(videoId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(
                api.videos.deleteVideo(deleteTargetId),
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete video');
            }

            toast.success('Video deleted successfully!');
            fetchVideos();
        } catch (error) {
            console.error('Error deleting video:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to delete video'
            );
        } finally {
            setDeleteLoading(false);
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    };

    const goToPage = (p: number) => {
        if (pagination && p >= 1 && p <= pagination.totalPages) setPage(p);
    };

    const clearFilters = () => {
        setSearchInput('');
        setCourseFilter('');
        setBranchFilter('');
        setSemesterFilter('');
        setPage(1);
    };

    const hasActiveFilters =
        searchTerm || courseFilter || branchFilter || semesterFilter;

    return (
        <div className='space-y-6'>
            {/* Header with Add Button */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='flex items-center gap-4'>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className='flex gap-3 w-full p-3 justify-center items-center bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-lg  dark:bg-gray-500 dark:hover:bg-gray-600'
                    >
                        <FilterIcon className='w-4 h-4' />
                        Filters
                        {hasActiveFilters && (
                            <span className='inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full'>
                                {
                                    [
                                        searchTerm,
                                        courseFilter,
                                        branchFilter,
                                        semesterFilter,
                                    ].filter(Boolean).length
                                }
                            </span>
                        )}
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className='inline-flex items-center p-3 rounded-lg bg-red-200 gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 '
                        >
                            <XIcon className='w-4 h-4' />
                            Clear
                        </button>
                    )}
                </div>

                <div className='relative flex-grow'>
                    <div className='flex gap-3 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 dark:bg-gray-800 dark:text-white transition-all'>
                        <SearchIcon className='w-5 h-5 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search videos...'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className='w-full bg-transparent outline-none text-black dark:text-white'
                        />
                    </div>
                </div>

                <button
                    onClick={openAddModal}
                    className='flex gap-3 w-full sm:w-1/5 p-3 justify-center items-center bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600'
                >
                    <PlusIcon className='w-4 h-4' />
                    Add Video
                </button>
            </div>

            {/* Filters Section */}
            {showFilters && (
                <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4 text-black dark:text-white'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {/* Course Filter */}
                        <SearchableSelect
                            value={courseFilter}
                            onChange={setCourseFilter}
                            options={courses.map((course) => ({
                                value: course.courseCode,
                                label: course.courseName,
                            }))}
                            placeholder='Select Course'
                            loading={loadingCourses}
                        />

                        {/* Branch Filter */}
                        <SearchableSelect
                            value={branchFilter}
                            onChange={setBranchFilter}
                            options={branches.map((branch) => ({
                                value: branch.branchCode,
                                label: branch.branchName,
                            }))}
                            placeholder='Select Branch'
                            loading={loadingBranches}
                            disabled={!courseFilter}
                        />

                        {/* Semester Filter */}
                        <select
                            value={semesterFilter}
                            onChange={(e) => setSemesterFilter(e.target.value)}
                            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                        >
                            <option value=''>All Semesters</option>
                            <option value='1'>1st Semester</option>
                            <option value='2'>2nd Semester</option>
                            <option value='3'>3rd Semester</option>
                            <option value='4'>4th Semester</option>
                            <option value='5'>5th Semester</option>
                            <option value='6'>6th Semester</option>
                            <option value='7'>7th Semester</option>
                            <option value='8'>8th Semester</option>
                            <option value='9'>9th Semester</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className='flex justify-center items-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600'></div>
                </div>
            )}

            {/* Videos Grid */}
            {!loading && (
                <>
                    {videos.length > 0 ? (
                        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6'>
                            {videos.map((video) => (
                                <VideoCard
                                    key={video._id}
                                    video={video}
                                    onEdit={openEditModal}
                                    onDelete={handleDeleteRequest}
                                    ownerId={ownerId || ''}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-12'>
                            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto'>
                                <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center'>
                                    <Video className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                    No Videos Found
                                </h3>
                                <p className='text-gray-600 dark:text-gray-400 mb-4'>
                                    {hasActiveFilters
                                        ? 'Try adjusting your filters or add a new video.'
                                        : 'Be the first to add a video for this college!'}
                                </p>
                                <button
                                    onClick={openAddModal}
                                    className='inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200'
                                >
                                    <PlusIcon className='w-4 h-4' />
                                    Add Video
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <PaginationComponent
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={goToPage}
                        />
                    )}
                </>
            )}

            {/* Modals */}
            <VideoFormModal
                isOpen={addModalOpen}
                onClose={closeAddModal}
                onSubmit={handleAddSubmit}
                form={form}
                setForm={setForm}
                courses={courses}
                branches={branches}
                loadingCourses={loadingCourses}
                loadingBranches={loadingBranches}
                fetchBranches={fetchBranches}
            />

            {editVideo && (
                <EditVideoModal
                    isOpen={editModalOpen}
                    onClose={closeEditModal}
                    onSubmit={handleEditSubmit}
                    video={editVideo}
                />
            )}

            <DeleteConfirmationModal
                open={deleteModalOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                message='Are you sure you want to delete this video? This action cannot be undone.'
            />
        </div>
    );
};

export default VideosClient;
