'use client';
import React, { useEffect, useState, useCallback } from 'react';
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
    // Common filters hook
    const filterState = useFilterState();

    // Courses and branches hook
    const { courses, branches, loadingCourses, loadingBranches } =
        useCoursesAndBranches(filterState.courseFilter);

    // Senior-specific filter
    const [yearFilter, setYearFilter] = useState(
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('year') || ''
            : '',
    );

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

    useEffect(() => {
        const params = new URLSearchParams();

        if (filterState.searchTerm)
            params.set('search', filterState.searchTerm);
        if (filterState.courseFilter)
            params.set('course', filterState.courseFilter);
        if (filterState.branchFilter)
            params.set('branch', filterState.branchFilter);
        if (yearFilter) params.set('year', yearFilter);
        if (filterState.page > 1) params.set('page', String(filterState.page));

        const newUrl = `${filterState.pathname}?${params.toString()}`;
        filterState.router.replace(newUrl);
    }, [
        filterState.searchTerm,
        filterState.courseFilter,
        filterState.branchFilter,
        yearFilter,
        filterState.page,
        filterState.pathname,
        filterState.router,
    ]);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            filterState.setSearchTerm(filterState.searchInput);
            filterState.setPage(1);
        }, SEARCH_DEBOUNCE);
        return () => clearTimeout(handler);
    }, [filterState.searchInput, filterState]);

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

    useEffect(() => {
        fetchSeniors();
    }, [fetchSeniors]);

    const openModal = (senior?: ISenior) => {
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
    };

    const closeModal = () => {
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
    };

    const handleSubmit = async (formData: SeniorFormData) => {
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
            fetchSeniors();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to save senior profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = (seniorId: string) => {
        setDeleteTargetId(seniorId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
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
            fetchSeniors();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete senior profile');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    };

    // Check for active filters
    const hasActiveFilters =
        filterState.searchTerm ||
        filterState.courseFilter ||
        filterState.branchFilter ||
        yearFilter;

    return (
        <>
            {/* Header with Search, Filters and Add Button */}
            <section className='mb-8' aria-label='Search and Add Senior'>
                <ResourcePageHeader
                    searchInput={filterState.searchInput}
                    setSearchInput={filterState.setSearchInput}
                    showFilters={filterState.showFilters}
                    setShowFilters={filterState.setShowFilters}
                    hasActiveFilters={!!hasActiveFilters}
                    activeFilterCount={
                        [
                            filterState.searchTerm,
                            filterState.courseFilter,
                            filterState.branchFilter,
                            yearFilter,
                        ].filter(Boolean).length
                    }
                    clearFilters={() => {
                        filterState.clearFilters();
                        setYearFilter('');
                    }}
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
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600'></div>
                    </div>
                ) : seniors.length > 0 ? (
                    <>
                        <p className='text-gray-600 dark:text-gray-300 mb-4 text-sm'>
                            Showing {seniors.length} of{' '}
                            {pagination?.totalItems ?? 0} seniors
                        </p>

                        {viewMode === 'grid' ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
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
                    <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
                        <i className='fas fa-users text-5xl text-gray-400 mb-4'></i>
                        <h3 className='text-xl font-medium text-gray-700 dark:text-gray-200 mb-2'>
                            No Seniors Found
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400 mb-6'>
                            Be the first to add your senior profile in{' '}
                            {capitalizeWords(collegeName)}
                        </p>
                        <button
                            onClick={() => openModal()}
                            className='px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md dark:bg-sky-500 dark:hover:bg-sky-600'
                            aria-label='Add New Senior'
                        >
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
