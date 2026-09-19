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
import { IPagination, ISenior } from '@/utils/interface';
import { SEARCH_DEBOUNCE, SENIOR_PAGE_SIZE } from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { SeniorCard } from './SeniorCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SeniorFormModal, { SeniorFormData } from './SeniorFormModal';
import { capitalizeWords } from '@/utils/formatting';
import { useCoursesAndBranches } from '@/hooks/useCoursesAndBranches';
import { useFilterState } from '@/hooks/useFilterState';
import { ResourcePageHeader } from '@/components/Common/ResourcePageHeader';
import { CommonFilters } from '@/components/Common/CommonFilters';
import { SeniorListItem } from './SeniorListItem';

const SeniorClient = ({
    initialSeniors,
    initialPagination,
    collegeName,
}: {
    initialSeniors: ISenior[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    // Senior-specific filter
    const [yearFilter, setYearFilter] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('year') || '';
        }
        return '';
    });

    // Common filters hook with additional yearFilter
    const filterState = useFilterState({
        debounceMs: SEARCH_DEBOUNCE,
        additionalFilters: { year: yearFilter },
    });

    // Courses and branches hook
    const { courses, branches, loadingCourses, loadingBranches } =
        useCoursesAndBranches(filterState.courseFilter);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [seniors, setSeniors] = useState<ISenior[]>(initialSeniors);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editSenior, setEditSenior] = useState<ISenior | null>(null);
    const [form, setForm] = useState({
        name: '',
        domain: '',
        branch: '',
        year: '',
        profilePicture: '',
        socialMediaLinks: [] as { platform: string; url: string }[],
        description: '',
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );

    const ownerId = currentUser?._id;

    // Track initial mount and previous filters
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [forceRefetch, setForceRefetch] = useState(false);
    const prevFiltersRef = useRef({
        search: '',
        branch: '',
        year: '',
        page: 1,
    });

    // Memoize current filters
    const currentFilters = useMemo(
        () => ({
            search: filterState.searchTerm,
            branch: filterState.branchFilter,
            year: yearFilter,
            page: filterState.page,
        }),
        [
            filterState.searchTerm,
            filterState.branchFilter,
            yearFilter,
            filterState.page,
        ],
    );

    // Mark initial mount as complete
    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    // Fetch seniors from backend - now uses URL params
    const fetchSeniors = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(filterState.page),
                limit: String(SENIOR_PAGE_SIZE),
            });
            if (filterState.searchTerm.trim())
                params.append('search', filterState.searchTerm.trim());
            if (filterState.branchFilter)
                params.append('branch', filterState.branchFilter);
            if (yearFilter) params.append('year', yearFilter);

            const url = `${api.seniors.getSeniorsByCollegeSlug(
                collegeName,
            )}?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message || 'Failed to fetch seniors');

            setSeniors(data.data.seniors || []);
            setPagination(data.data.pagination || null);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to fetch seniors');
        } finally {
            setLoading(false);
        }
    }, [
        collegeName,
        filterState.page,
        filterState.searchTerm,
        filterState.branchFilter,
        yearFilter,
    ]);

    // Only fetch when filters change, not on initial mount
    useEffect(() => {
        if (isInitialMount) return;

        const prevFilters = prevFiltersRef.current;
        const filterChanged =
            prevFilters.search !== currentFilters.search ||
            prevFilters.branch !== currentFilters.branch ||
            prevFilters.year !== currentFilters.year ||
            prevFilters.page !== currentFilters.page;

        if (filterChanged || forceRefetch) {
            fetchSeniors();
            prevFiltersRef.current = currentFilters;
            if (forceRefetch) {
                setForceRefetch(false);
            }
        }
    }, [currentFilters, isInitialMount, fetchSeniors, forceRefetch]);

    const openModal = useCallback(
        (senior?: ISenior) => {
            if (!currentUser) {
                toast.error('Please sign in to add senior profile');
                return;
            }
            setEditSenior(senior || null);
            setForm(
                senior
                    ? {
                          name: senior.name,
                          domain: senior.domain || '',
                          branch: senior.branch._id,
                          year: senior.year,
                          profilePicture: senior.profilePicture || '',
                          socialMediaLinks: senior.socialMediaLinks || [],
                          description: senior.description || '',
                      }
                    : {
                          name: '',
                          domain: '',
                          branch: '',
                          year: '',
                          profilePicture: '',
                          socialMediaLinks: [],
                          description: '',
                      },
            );
            setModalOpen(true);
        },
        [currentUser],
    );

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditSenior(null);
        setForm({
            name: '',
            domain: '',
            branch: '',
            year: '',
            profilePicture: '',
            socialMediaLinks: [],
            description: '',
        });
    }, []);

    const handleSubmit = useCallback(
        async (formData: SeniorFormData) => {
            setLoading(true);
            try {
                const method = editSenior ? 'PUT' : 'POST';

                const url = editSenior
                    ? api.seniors.editSenior(editSenior._id)
                    : api.seniors.createSenior;

                const body = {
                    ...formData,
                    ...(method === 'POST' && { college: collegeName }),
                };

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    credentials: 'include',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to save senior profile',
                    );
                }

                toast.success(
                    data.message ||
                        (editSenior
                            ? 'Senior profile updated!'
                            : 'Senior profile added!'),
                );
                closeModal();
                setForceRefetch(true);
            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
                else toast.error('Failed to save senior profile');
            } finally {
                setLoading(false);
            }
        },
        [editSenior, collegeName, closeModal],
    );

    const handleDeleteRequest = useCallback((seniorId: string) => {
        setDeleteTargetId(seniorId);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTargetId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(
                api.seniors.deleteSenior(deleteTargetId),
                {
                    method: 'DELETE',
                    credentials: 'include',
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to delete senior profile',
                );
            }

            toast.success('Senior profile deleted successfully');
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            setForceRefetch(true);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete senior profile');
        } finally {
            setDeleteLoading(false);
        }
    }, [deleteTargetId]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    }, []);

    // Memoize active filters check and count
    const hasActiveFilters = useMemo(
        () =>
            !!(
                filterState.searchTerm ||
                filterState.courseFilter ||
                filterState.branchFilter ||
                yearFilter
            ),
        [
            filterState.searchTerm,
            filterState.courseFilter,
            filterState.branchFilter,
            yearFilter,
        ],
    );

    const activeFilterCount = useMemo(
        () =>
            [
                filterState.searchTerm,
                filterState.courseFilter,
                filterState.branchFilter,
                yearFilter,
            ].filter(Boolean).length,
        [
            filterState.searchTerm,
            filterState.courseFilter,
            filterState.branchFilter,
            yearFilter,
        ],
    );

    const clearAllFilters = useCallback(() => {
        filterState.clearFilters();
        setYearFilter('');
        setForceRefetch(true);
    }, [filterState]);

    return (
        <>
            {/* Header with Search, Filters and Add Button */}
            <section className='mb-8' aria-label='Search and Add Senior'>
                <ResourcePageHeader
                    searchInput={filterState.searchInput}
                    setSearchInput={filterState.setSearchInput}
                    showFilters={filterState.showFilters}
                    setShowFilters={filterState.setShowFilters}
                    hasActiveFilters={hasActiveFilters}
                    activeFilterCount={activeFilterCount}
                    clearFilters={clearAllFilters}
                    onAdd={() => openModal()}
                    addButtonText='Add Senior'
                    searchPlaceholder='Search seniors...'
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                {/* Filters Section */}
                {filterState.showFilters && (
                    <div className='mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                            <CommonFilters
                                courseFilter={filterState.courseFilter}
                                setCourseFilter={filterState.setCourseFilter}
                                branchFilter={filterState.branchFilter}
                                setBranchFilter={filterState.setBranchFilter}
                                courses={courses}
                                branches={branches}
                                loadingCourses={loadingCourses}
                                loadingBranches={loadingBranches}
                            />

                            <select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className='w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-sm hover:border-sky-400 dark:hover:border-sky-500'
                            >
                                <option value=''>All Years</option>
                                <option value='1st Year'>1st Year</option>
                                <option value='2nd Year'>2nd Year</option>
                                <option value='3rd Year'>3rd Year</option>
                                <option value='4th Year'>4th Year</option>
                                <option value='5th Year'>5th Year</option>
                                <option value='Alumni'>Alumni</option>
                            </select>
                        </div>
                    </div>
                )}
            </section>

            <section aria-label='Seniors List'>
                {/* Loading State */}
                {loading ? (
                    <div className='flex justify-center min-h-screen py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#0075de] dark:border-[#62aef0]'></div>
                    </div>
                ) : seniors.length > 0 ? (
                    <>
                        <p className='text-[#475467] dark:text-[#9ea3ae] mb-4 text-sm font-medium'>
                            Showing {seniors.length} of{' '}
                            {pagination?.totalItems ?? 0} seniors
                        </p>

                        {viewMode === 'grid' ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {seniors.map((senior) => (
                                    <SeniorCard
                                        key={senior._id}
                                        senior={senior}
                                        onEdit={openModal}
                                        onDelete={handleDeleteRequest}
                                        ownerId={ownerId || ''}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {seniors.map((senior) => (
                                    <SeniorListItem
                                        key={senior._id}
                                        senior={senior}
                                        onEdit={openModal}
                                        onDelete={handleDeleteRequest}
                                        ownerId={ownerId || ''}
                                        collegeName={collegeName}
                                    />
                                ))}
                            </div>
                        )}
                        <PaginationComponent
                            currentPage={filterState.page}
                            totalPages={pagination?.totalPages || 1}
                            onPageChange={(p) => filterState.setPage(p)}
                        />
                    </>
                ) : (
                    <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-8 text-center shadow-sm'>
                        <i className='fas fa-users text-4xl text-[#8c8883] dark:text-[#787672] mb-3'></i>
                        <h3 className='text-lg font-bold text-[#101828] dark:text-white mb-2'>
                            No Seniors Found
                        </h3>
                        <p className='text-sm text-[#475467] dark:text-[#9ea3ae] mb-6 max-w-md mx-auto'>
                            Be the first to add your senior profile in{' '}
                            {capitalizeWords(collegeName)}
                        </p>
                        <button
                            onClick={() => openModal()}
                            className='inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                            aria-label='Add New Senior'
                        >
                            <i className='fas fa-plus'></i>
                            Add New Senior
                        </button>
                    </div>
                )}
            </section>

            {/* Form Modal */}
            <SeniorFormModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editSenior={editSenior}
                form={form}
                setForm={setForm}
                loading={loading}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                open={deleteModalOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                message='Are you sure you want to delete this senior profile? This action cannot be undone.'
            />
        </>
    );
};

export default SeniorClient;
