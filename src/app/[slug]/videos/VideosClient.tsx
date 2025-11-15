'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import { IPagination, IVideo } from '@/utils/interface';
import { SEARCH_DEBOUNCE, NOTES_PAGE_SIZE } from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Video } from 'lucide-react';
import VideoCard from './VideoCard';
import VideoFormModal from './VideoFormModal';
import EditVideoModal from './EditVideoModal';
import { useCoursesAndBranches } from '@/hooks/useCoursesAndBranches';
import { useFilterState } from '@/hooks/useFilterState';
import { ResourcePageHeader } from '@/components/Common/ResourcePageHeader';
import { CommonFilters } from '@/components/Common/CommonFilters';
import { VideoListItem } from './VideoListItem';

const VideosClient = ({
    initialVideos,
    initialPagination,
    collegeName,
}: {
    initialVideos: IVideo[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    // Common filters hook
    const filterState = useFilterState();

    // Courses and branches hook
    const {
        courses,
        branches,
        loadingCourses,
        loadingBranches,
        fetchBranches,
    } = useCoursesAndBranches(filterState.courseFilter);

    const [videos, setVideos] = useState<IVideo[]>(initialVideos);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
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

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );

    const ownerId = currentUser?._id;

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filterState.searchTerm)
            params.set('search', filterState.searchTerm);
        if (filterState.courseFilter)
            params.set('course', filterState.courseFilter);
        if (filterState.branchFilter)
            params.set('branch', filterState.branchFilter);
        if (filterState.semesterFilter)
            params.set('semester', filterState.semesterFilter);
        if (filterState.page > 1)
            params.set('page', filterState.page.toString());

        const newUrl = params.toString()
            ? `${filterState.pathname}?${params.toString()}`
            : filterState.pathname;
        filterState.router.replace(newUrl);
    }, [
        filterState.searchTerm,
        filterState.courseFilter,
        filterState.branchFilter,
        filterState.semesterFilter,
        filterState.page,
        filterState.pathname,
        filterState.router,
    ]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            filterState.setSearchTerm(filterState.searchInput);
            filterState.setPage(1);
        }, SEARCH_DEBOUNCE);

        return () => clearTimeout(timer);
    }, [filterState.searchInput, filterState]);

    // Reset page when filters change
    useEffect(() => {
        filterState.setPage(1);
    }, [
        filterState,
        filterState.courseFilter,
        filterState.branchFilter,
        filterState.semesterFilter,
    ]);

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', filterState.page.toString());
            params.set('limit', NOTES_PAGE_SIZE.toString());
            if (filterState.searchTerm)
                params.set('search', filterState.searchTerm);
            if (filterState.courseFilter)
                params.set('course', filterState.courseFilter);
            if (filterState.branchFilter)
                params.set('branch', filterState.branchFilter);
            if (filterState.semesterFilter)
                params.set('semester', filterState.semesterFilter);

            const url = `${api.videos.getVideosByCollegeSlug(
                collegeName,
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
        filterState.searchTerm,
        filterState.courseFilter,
        filterState.branchFilter,
        filterState.semesterFilter,
        filterState.page,
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
                },
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
                    : 'Failed to delete video',
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

    const hasActiveFilters =
        filterState.searchTerm ||
        filterState.courseFilter ||
        filterState.branchFilter ||
        filterState.semesterFilter;

    return (
        <div className='space-y-6'>
            <ResourcePageHeader
                searchInput={filterState.searchInput}
                setSearchInput={filterState.setSearchInput}
                searchPlaceholder='Search videos...'
                showFilters={filterState.showFilters}
                setShowFilters={filterState.setShowFilters}
                hasActiveFilters={!!hasActiveFilters}
                activeFilterCount={
                    [
                        filterState.searchTerm,
                        filterState.courseFilter,
                        filterState.branchFilter,
                        filterState.semesterFilter,
                    ].filter(Boolean).length
                }
                clearFilters={filterState.clearFilters}
                onAdd={openAddModal}
                addButtonText='Add Video'
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {filterState.showFilters && (
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <CommonFilters
                            courseFilter={filterState.courseFilter}
                            setCourseFilter={filterState.setCourseFilter}
                            branchFilter={filterState.branchFilter}
                            setBranchFilter={filterState.setBranchFilter}
                            semesterFilter={filterState.semesterFilter}
                            setSemesterFilter={filterState.setSemesterFilter}
                            courses={courses}
                            branches={branches}
                            loadingCourses={loadingCourses}
                            loadingBranches={loadingBranches}
                        />
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className='flex justify-center min-h-screen py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600'></div>
                </div>
            )}

            {/* Videos Grid */}
            {!loading && (
                <>
                    {videos.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
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
                                <div className='space-y-3'>
                                    {videos.map((video) => (
                                        <VideoListItem
                                            key={video._id}
                                            video={video}
                                            onEdit={openEditModal}
                                            onDelete={handleDeleteRequest}
                                            ownerId={ownerId || ''}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
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
                                    <svg
                                        className='w-4 h-4'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M12 4v16m8-8H4'
                                        />
                                    </svg>
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
                            onPageChange={(p) => filterState.setPage(p)}
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
