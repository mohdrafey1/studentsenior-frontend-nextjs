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
import { IPagination, INote } from '@/utils/interface';
import { SEARCH_DEBOUNCE, NOTES_PAGE_SIZE } from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FileText } from 'lucide-react';
import NotesCard from './NotesCard';
import NotesFormModal from './NotesFormModal';
import EditNotesModal from './EditNotesModal';
import EarningFlowModal from '@/components/Common/EarningFlowModal';
import { useCoursesAndBranches } from '@/hooks/useCoursesAndBranches';
import { useFilterState } from '@/hooks/useFilterState';
import { ResourcePageHeader } from '@/components/Common/ResourcePageHeader';
import { CommonFilters } from '@/components/Common/CommonFilters';
import { NoteListItem } from './NoteListItem';

const NotesClient = ({
    initialNotes,
    initialPagination,
    collegeName,
}: {
    initialNotes: INote[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );

    // Use custom hooks
    const filterState = useFilterState({ debounceMs: SEARCH_DEBOUNCE });
    const {
        courses,
        branches,
        loadingCourses,
        loadingBranches,
        fetchBranches,
    } = useCoursesAndBranches(filterState.courseFilter);

    const [notes, setNotes] = useState<INote[]>(initialNotes);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
    const [loading, setLoading] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editNote, setEditNote] = useState<INote | null>(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        fileUrl: '',
        subjectCode: '',
        isPaid: false,
        price: 0,
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showEarningModal, setShowEarningModal] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

    const fetchNotes = useCallback(async () => {
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

            const url = `${api.notes.getNotesByCollegeSlug(
                collegeName,
            )}?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            setNotes(data.data.notes || []);
            setPagination(data.data.pagination || null);
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Failed to fetch notes');
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
            fetchNotes();
            prevFiltersRef.current = currentFilters;
            if (forceRefetch) {
                setForceRefetch(false);
            }
        }
    }, [currentFilters, isInitialMount, fetchNotes, forceRefetch]);

    const openAddModal = useCallback(() => {
        if (!currentUser) {
            toast.error('Please sign in to post notes');
            return;
        }
        setForm({
            title: '',
            description: '',
            fileUrl: '',
            subjectCode: '',
            isPaid: false,
            price: 0,
        });
        setAddModalOpen(true);
    }, [currentUser]);

    const closeAddModal = useCallback(() => {
        setAddModalOpen(false);
        setForm({
            title: '',
            description: '',
            fileUrl: '',
            subjectCode: '',
            isPaid: false,
            price: 0,
        });
    }, []);

    const openEditModal = useCallback((note: INote) => {
        setEditNote(note);
        setEditModalOpen(true);
    }, []);

    const closeEditModal = useCallback(() => {
        setEditModalOpen(false);
        setEditNote(null);
    }, []);

    const handleAddSubmit = useCallback(
        async (formData: typeof form) => {
            setLoading(true);
            try {
                const response = await fetch(api.notes.createNote, {
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
                    throw new Error(data.message || 'Failed to create note');
                }
                toast.success(data.message || 'Note created successfully!');

                closeAddModal();
                setForceRefetch(true);
            } catch (error) {
                console.error('Error creating note:', error);
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
            fileUrl?: string;
            isPaid?: boolean;
            price?: number;
        }) => {
            if (!editNote) return;

            setLoading(true);
            try {
                const response = await fetch(api.notes.editNote(editNote._id), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to update note');
                }
                toast.success(data.message || 'Note updated successfully!');

                closeEditModal();
                setForceRefetch(true);
            } catch (error) {
                console.error('Error updating note:', error);
                throw error;
            } finally {
                setLoading(false);
                closeEditModal();
            }
        },
        [editNote, closeEditModal],
    );

    const handleDeleteRequest = useCallback((noteId: string) => {
        setDeleteTargetId(noteId);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTargetId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(api.notes.deleteNote(deleteTargetId), {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete note');
            }

            toast.success('Note deleted successfully!');
            setForceRefetch(true);
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to delete note',
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

    return (
        <div className='space-y-6'>
            <ResourcePageHeader
                searchInput={filterState.searchInput}
                setSearchInput={filterState.setSearchInput}
                searchPlaceholder='Search notes...'
                showFilters={filterState.showFilters}
                setShowFilters={filterState.setShowFilters}
                hasActiveFilters={!!filterState.hasActiveFilters}
                activeFilterCount={
                    [
                        filterState.searchTerm,
                        filterState.courseFilter,
                        filterState.branchFilter,
                        filterState.semesterFilter,
                    ].filter(Boolean).length
                }
                clearFilters={filterState.clearFilters}
                onShowEarning={() => setShowEarningModal(true)}
                onAdd={openAddModal}
                addButtonText='Add Note'
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

            {/* Notes Grid */}
            {!loading && (
                <>
                    {notes.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6'>
                                    {notes.map((note) => (
                                        <NotesCard
                                            key={note._id}
                                            note={note}
                                            onEdit={openEditModal}
                                            onDelete={handleDeleteRequest}
                                            ownerId={ownerId || ''}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='space-y-3'>
                                    {notes.map((note) => (
                                        <NoteListItem
                                            key={note._id}
                                            note={note}
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
                                    No Notes Found
                                </h3>
                                <p className='text-gray-600 dark:text-gray-400 mb-4'>
                                    {filterState.hasActiveFilters
                                        ? 'Try adjusting your filters or add a new note.'
                                        : 'Be the first to add a note for this college!'}
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
                                    Add Note
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
            <NotesFormModal
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

            {editNote && (
                <EditNotesModal
                    isOpen={editModalOpen}
                    onClose={closeEditModal}
                    onSubmit={handleEditSubmit}
                    note={editNote}
                />
            )}

            <DeleteConfirmationModal
                open={deleteModalOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                message='Are you sure you want to delete this note? This action cannot be undone.'
            />

            <EarningFlowModal
                isOpen={showEarningModal}
                onClose={() => setShowEarningModal(false)}
                triggerButton={true}
            />
        </div>
    );
};

export default NotesClient;
