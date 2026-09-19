'use client';
import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
} from 'react';
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
    const filterState = useFilterState({ debounceMs: SEARCH_DEBOUNCE });

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

    // Track initial mount and previous filters
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [forceRefetch, setForceRefetch] = useState(false);
    const prevFiltersRef = useRef({
        search: '',
        course: '',
        branch: '',
        semester: '',
        page: 1,
    });

    // Memoize current filters
    const currentFilters = useMemo(
        () => ({
            search: filterState.searchTerm,
            course: filterState.courseFilter,
            branch: filterState.branchFilter,
            semester: filterState.semesterFilter,
            page: filterState.page,
        }),
        [
            filterState.searchTerm,
            filterState.courseFilter,
            filterState.branchFilter,
            filterState.semesterFilter,
            filterState.page,
        ],
    );

    // Mark initial mount as complete
    useEffect(() => {
        setIsInitialMount(false);
    }, []);

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

    // Only fetch when filters change, not on initial mount
    useEffect(() => {
        if (isInitialMount) return;

        const prevFilters = prevFiltersRef.current;
        const filterChanged =
            prevFilters.search !== currentFilters.search ||
            prevFilters.course !== currentFilters.course ||
            prevFilters.branch !== currentFilters.branch ||
            prevFilters.semester !== currentFilters.semester ||
            prevFilters.page !== currentFilters.page;

        if (filterChanged || forceRefetch) {
            fetchVideos();
            prevFiltersRef.current = currentFilters;
            if (forceRefetch) {
                setForceRefetch(false);
            }
        }
    }, [currentFilters, isInitialMount, fetchVideos, forceRefetch]);

    const openAddModal = useCallback(() => {
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
    }, [currentUser]);

    const closeAddModal = useCallback(() => {
        setAddModalOpen(false);
        setForm({
            title: '',
            description: '',
            videoUrl: '',
            subjectCode: '',
        });
    }, []);

    const openEditModal = useCallback((video: IVideo) => {
        setEditVideo(video);
        setEditModalOpen(true);
    }, []);

    const closeEditModal = useCallback(() => {
        setEditModalOpen(false);
        setEditVideo(null);
    }, []);

    const handleAddSubmit = useCallback(
        async (formData: typeof form) => {
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

                closeAddModal();
                setForceRefetch(true);
            } catch (error) {
                console.error('Error creating video:', error);
                throw error;
            } finally {
                setLoading(false);
                closeAddModal();
            }
        },
        [collegeName, closeAddModal],
    );

    const handleEditSubmit = useCallback(
        async (formData: {
            title?: string;
            description?: string;
            videoUrl?: string;
        }) => {
            if (!editVideo) return;

            setLoading(true);
            try {
                const response = await fetch(
                    api.videos.editVideo(editVideo._id),
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(formData),
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to update video');
                }
                toast.success(data.message || 'Video updated successfully!');

                closeEditModal();
                setForceRefetch(true);
            } catch (error) {
                console.error('Error updating video:', error);
                throw error;
            } finally {
                setLoading(false);
                closeEditModal();
            }
        },
        [editVideo, closeEditModal],
    );

    const handleDeleteRequest = useCallback((videoId: string) => {
        setDeleteTargetId(videoId);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
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
            setForceRefetch(true);
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
    }, [deleteTargetId]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    }, []);

    const hasActiveFilters = useMemo(
        () =>
            !!(
                filterState.searchTerm ||
                filterState.courseFilter ||
                filterState.branchFilter ||
                filterState.semesterFilter
            ),
        [
            filterState.searchTerm,
            filterState.courseFilter,
            filterState.branchFilter,
            filterState.semesterFilter,
        ],
    );

    const activeFilterCount = useMemo(
        () =>
            [
                filterState.searchTerm,
                filterState.courseFilter,
                filterState.branchFilter,
                filterState.semesterFilter,
            ].filter(Boolean).length,
        [
            filterState.searchTerm,
            filterState.courseFilter,
            filterState.branchFilter,
            filterState.semesterFilter,
        ],
    );

    return (
        <div className='space-y-6'>
            <ResourcePageHeader
                searchInput={filterState.searchInput}
                setSearchInput={filterState.setSearchInput}
                searchPlaceholder='Search videos...'
                showFilters={filterState.showFilters}
                setShowFilters={filterState.setShowFilters}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
                clearFilters={filterState.clearFilters}
                onAdd={openAddModal}
                addButtonText='Add Video'
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {filterState.showFilters && (
                <div className='bg-white dark:bg-[#191919] rounded-xl shadow-sm border border-[#e6e6e6] dark:border-[#2f2f2f] p-6 transition-all duration-300'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
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
                <div className='flex justify-center min-h-[40vh] items-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0075de]'></div>
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
                        <div className='text-center py-16 px-4'>
                            <div className='bg-white dark:bg-[#191919] border border-dashed border-[#e6e6e6] dark:border-[#383838] rounded-2xl p-10 max-w-md mx-auto shadow-sm'>
                                <div className='w-16 h-16 mx-auto mb-5 bg-[#fcfbf9] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#383838] rounded-2xl flex items-center justify-center rotate-3'>
                                    <Video className='w-8 h-8 text-[#8c8883] dark:text-[#787672] -rotate-3' />
                                </div>
                                <h3 className='text-lg font-bold text-[#101828] dark:text-[#ededed] mb-2'>
                                    No Videos Found
                                </h3>
                                <p className='text-sm text-[#615d59] dark:text-[#a09e9a] mb-6 leading-relaxed'>
                                    {hasActiveFilters
                                        ? "We couldn't find any videos matching your filters. Try adjusting them."
                                        : "Be the first to share your knowledge and add a video for this college!"}
                                </p>
                                <button
                                    onClick={openAddModal}
                                    className='inline-flex items-center gap-2 px-5 py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98]'
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
                                            strokeWidth={2.5}
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
                collegeSlug={collegeName}
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
