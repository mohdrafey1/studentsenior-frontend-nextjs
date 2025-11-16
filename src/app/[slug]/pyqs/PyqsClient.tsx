'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import { IPagination, IPyq } from '@/utils/interface';
import {
    SEARCH_DEBOUNCE,
    PYQ_PAGE_SIZE,
    FILTER_ACADEMIC_YEARS,
} from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { PyqCard } from './PyqCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FileText } from 'lucide-react';
import PyqFormModal, { PyqFormData } from './PyqFormModal';
import EditPyqModal from './EditPyqModal';
import EarningFlowModal from '@/components/Common/EarningFlowModal';
import { PyqListItem } from './PyqListItem';
import { useCoursesAndBranches } from '@/hooks/useCoursesAndBranches';
import { useFilterState } from '@/hooks/useFilterState';
import { ResourcePageHeader } from '@/components/Common/ResourcePageHeader';
import { CommonFilters } from '@/components/Common/CommonFilters';
import { useSearchParams } from 'next/navigation';

const PyqsClient = ({
    initialPyqs,
    initialPagination,
    collegeName,
}: {
    initialPyqs: IPyq[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    const searchParams = useSearchParams();

    // PYQ-specific filters
    const [yearFilter, setYearFilter] = useState(
        searchParams.get('year') || '',
    );
    const [examTypeFilter, setExamTypeFilter] = useState(
        searchParams.get('examType') || '',
    );
    const [isSolvedFilter, setIsSolvedFilter] = useState(
        searchParams.get('isSolved') || '',
    );

    // Common filters hook with additional PYQ filters
    const filterState = useFilterState({
        debounceMs: SEARCH_DEBOUNCE,
        additionalFilters: {
            year: yearFilter,
            examType: examTypeFilter,
            isSolved: isSolvedFilter,
        },
    });

    // Courses and branches hook
    const {
        courses,
        branches,
        loadingCourses,
        loadingBranches,
        fetchBranches,
    } = useCoursesAndBranches(filterState.courseFilter);

    const [pyqs, setPyqs] = useState<IPyq[]>(initialPyqs);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
    const [loading, setLoading] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editPyq, setEditPyq] = useState<IPyq | null>(null);
    const [form, setForm] = useState({
        subject: '',
        year: '',
        examType: '',
        fileUrl: '',
        solved: false,
        isPaid: false,
        price: 0,
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showEarningModal, setShowEarningModal] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );

    const ownerId = currentUser?._id;

    const fetchPyqs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', filterState.page.toString());
            params.set('limit', PYQ_PAGE_SIZE.toString());
            if (filterState.searchTerm)
                params.set('search', filterState.searchTerm);
            if (filterState.courseFilter)
                params.set('course', filterState.courseFilter);
            if (filterState.branchFilter)
                params.set('branch', filterState.branchFilter);
            if (yearFilter) params.set('year', yearFilter);
            if (examTypeFilter) params.set('examType', examTypeFilter);
            if (filterState.semesterFilter)
                params.set('semester', filterState.semesterFilter);
            if (isSolvedFilter) params.set('isSolved', isSolvedFilter);
            const url = `${api.pyq.getPyqByCollegeSlug(
                collegeName,
            )}?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch PYQs');
            }

            const data = await response.json();
            setPyqs(data.data.pyqs || []);
            setPagination(data.data.pagination || null);
        } catch (error) {
            console.error('Error fetching PYQs:', error);
            toast.error('Failed to fetch PYQs');
        } finally {
            setLoading(false);
        }
    }, [
        collegeName,
        filterState.searchTerm,
        filterState.courseFilter,
        filterState.branchFilter,
        yearFilter,
        examTypeFilter,
        filterState.semesterFilter,
        isSolvedFilter,
        filterState.page,
    ]);

    useEffect(() => {
        fetchPyqs();
    }, [fetchPyqs]);

    const openAddModal = () => {
        if (!currentUser) {
            toast.error('Please sign in to post pyqs');
            return;
        }
        setForm({
            subject: '',
            year: '',
            examType: '',
            fileUrl: '',
            solved: false,
            isPaid: false,
            price: 0,
        });
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
        setForm({
            subject: '',
            year: '',
            examType: '',
            fileUrl: '',
            solved: false,
            isPaid: false,
            price: 0,
        });
    };

    const openEditModal = (pyq: IPyq) => {
        setEditPyq(pyq);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditPyq(null);
    };

    const handleAddSubmit = async (formData: PyqFormData) => {
        setLoading(true);
        try {
            const response = await fetch(api.pyq.createPyq, {
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
                throw new Error(data.message || 'Failed to create PYQ');
            }
            toast.success(data.message || 'PYQ created successfully!');

            // Refresh the PYQs list to show updated data
            await fetchPyqs();
        } catch (error) {
            console.error('Error creating PYQ:', error);
            throw error;
        } finally {
            setLoading(false);
            closeAddModal();
        }
    };

    const handleEditSubmit = async (formData: {
        isPaid: boolean;
        price: number;
    }) => {
        if (!editPyq) return;

        setLoading(true);
        try {
            const response = await fetch(api.pyq.editPyq(editPyq._id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update PYQ');
            }
            toast.success(data.message || 'PYQ updated successfully!');

            // Refresh the PYQs list to show updated data
            await fetchPyqs();
        } catch (error) {
            console.error('Error updating PYQ:', error);
            throw error;
        } finally {
            setLoading(false);
            closeEditModal();
        }
    };

    const handleDeleteRequest = (pyqId: string) => {
        setDeleteTargetId(pyqId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(api.pyq.deletePyq(deleteTargetId), {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete PYQ');
            }

            toast.success('PYQ deleted successfully!');
            fetchPyqs();
        } catch (error) {
            console.error('Error deleting PYQ:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to delete PYQ',
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

    const clearAllFilters = () => {
        filterState.clearFilters();
        setYearFilter('');
        setExamTypeFilter('');
        setIsSolvedFilter('');
    };

    const hasActiveFilters =
        filterState.searchTerm ||
        filterState.courseFilter ||
        filterState.branchFilter ||
        filterState.semesterFilter ||
        yearFilter ||
        examTypeFilter ||
        isSolvedFilter;

    return (
        <div className='space-y-6'>
            <ResourcePageHeader
                searchInput={filterState.searchInput}
                setSearchInput={filterState.setSearchInput}
                searchPlaceholder='Search PYQs...'
                showFilters={filterState.showFilters}
                setShowFilters={filterState.setShowFilters}
                hasActiveFilters={!!hasActiveFilters}
                activeFilterCount={
                    [
                        filterState.searchTerm,
                        filterState.courseFilter,
                        filterState.branchFilter,
                        filterState.semesterFilter,
                        yearFilter,
                        examTypeFilter,
                        isSolvedFilter,
                    ].filter(Boolean).length
                }
                clearFilters={clearAllFilters}
                onShowEarning={() => setShowEarningModal(true)}
                onAdd={openAddModal}
                addButtonText='Add PYQ'
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Filters Section */}
            {filterState.showFilters && (
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
                        <select
                            value={isSolvedFilter}
                            onChange={(e) => setIsSolvedFilter(e.target.value)}
                            className='w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-sm hover:border-sky-400 dark:hover:border-sky-500'
                        >
                            <option value=''>All Status</option>
                            <option value='true'>Solved</option>
                            <option value='false'>Unsolved</option>
                        </select>

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

                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className='w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-sm hover:border-sky-400 dark:hover:border-sky-500'
                        >
                            <option value=''>All Years</option>
                            {FILTER_ACADEMIC_YEARS.map((year) => (
                                <option key={year.value} value={year.value}>
                                    {year.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={examTypeFilter}
                            onChange={(e) => setExamTypeFilter(e.target.value)}
                            className='w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-sm hover:border-sky-400 dark:hover:border-sky-500'
                        >
                            <option value=''>All Exam Types</option>
                            <option value='midsem1'>Midsem 1</option>
                            <option value='midsem2'>Midsem 2</option>
                            <option value='endsem'>Endsem</option>
                            <option value='improvement'>Improvement</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className='min-h-screen flex justify-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600'></div>
                </div>
            )}

            {/* PYQs Display */}
            {!loading && (
                <>
                    {pyqs.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6'>
                                    {pyqs.map((pyq) => (
                                        <PyqCard
                                            key={pyq._id}
                                            pyq={pyq}
                                            onEdit={openEditModal}
                                            onDelete={handleDeleteRequest}
                                            ownerId={ownerId || ''}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='space-y-3'>
                                    {pyqs.map((pyq) => (
                                        <PyqListItem
                                            key={pyq._id}
                                            pyq={pyq}
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
                                    <FileText className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                    No PYQs Found
                                </h3>
                                <p className='text-gray-600 dark:text-gray-400 mb-4'>
                                    {hasActiveFilters
                                        ? 'Try adjusting your filters or add a new PYQ.'
                                        : 'Be the first to add a PYQ for this college!'}
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
                                    Add PYQ
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
            <PyqFormModal
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

            {editPyq && (
                <EditPyqModal
                    isOpen={editModalOpen}
                    onClose={closeEditModal}
                    onSubmit={handleEditSubmit}
                    pyq={editPyq}
                />
            )}

            <DeleteConfirmationModal
                open={deleteModalOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                message='Are you sure you want to delete this PYQ? This action cannot be undone.'
            />

            <EarningFlowModal
                isOpen={showEarningModal}
                onClose={() => setShowEarningModal(false)}
                triggerButton={true}
            />
        </div>
    );
};

export default PyqsClient;
