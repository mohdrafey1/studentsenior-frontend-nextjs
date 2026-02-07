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
import { IPagination } from '@/utils/interface';
import { useFilterState } from '@/hooks/useFilterState';
import { useCoursesAndBranches } from '@/hooks/useCoursesAndBranches';
import { ResourcePageHeader } from '@/components/Common/ResourcePageHeader';
import { CommonFilters } from '@/components/Common/CommonFilters';
import PaginationComponent from '@/components/Common/Pagination';
import { Zap } from 'lucide-react';
import Link from 'next/link';

const SEARCH_DEBOUNCE = 500;
const PAGE_SIZE = 12;

interface IQuickNote {
    _id: string;
    unitNumber: number;
    title: string;
    slug: string;
    lastUpdated: string;
    subject: {
        subjectName: string;
        subjectCode: string;
        semester: number;
        branch: {
            branchCode: string;
            course: {
                courseCode: string;
            };
        };
    };
}

interface QuickNotesClientProps {
    initialQuickNotes: IQuickNote[];
    initialPagination: IPagination;
    collegeName: string;
}

const QuickNoteCard = ({
    note,
    collegeName,
}: {
    note: IQuickNote;
    collegeName: string;
}) => {
    return (
        <Link
            href={`/${collegeName}/quicknotes/${note.subject.subjectCode}/${note.slug}`}
            className='block group'
        >
            <div className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all'>
                {/* Accent Strip */}
                <div className='h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600' />

                <div className='p-4'>
                    {/* Header */}
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center border border-purple-100 dark:border-purple-800'>
                            <span className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                                {note.unitNumber}
                            </span>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-0.5'>
                                <span className='text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase'>
                                    {note.subject?.subjectCode}
                                </span>
                                <span className='text-[10px] text-gray-400'>
                                    Sem {note.subject?.semester}
                                </span>
                            </div>
                            <h3 className='text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2'>
                                {note.title}
                            </h3>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className='flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700'>
                        <div className='flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400'>
                            <Zap className='w-3 h-3' />
                            <span>Quick Revision</span>
                        </div>
                        <span className='text-xs text-gray-400 truncate max-w-[120px]'>
                            {note.subject?.subjectName}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const QuickNotesClient = ({
    initialQuickNotes,
    initialPagination,
    collegeName,
}: QuickNotesClientProps) => {
    const filterState = useFilterState({ debounceMs: SEARCH_DEBOUNCE });
    const { courses, branches, loadingCourses, loadingBranches } =
        useCoursesAndBranches(filterState.courseFilter);

    const [quicknotes, setQuicknotes] =
        useState<IQuickNote[]>(initialQuickNotes);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
    const [loading, setLoading] = useState(false);

    const [isInitialMount, setIsInitialMount] = useState(true);
    const [forceRefetch, setForceRefetch] = useState(false);
    const prevFiltersRef = useRef({
        search: '',
        course: '',
        branch: '',
        semester: '',
        page: 1,
    });

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

    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    const fetchQuickNotes = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', filterState.page.toString());
            params.set('limit', PAGE_SIZE.toString());
            if (filterState.searchTerm)
                params.set('search', filterState.searchTerm);
            if (filterState.courseFilter)
                params.set('course', filterState.courseFilter);
            if (filterState.branchFilter)
                params.set('branch', filterState.branchFilter);
            if (filterState.semesterFilter)
                params.set('semester', filterState.semesterFilter);

            const url = `${api.quickNotes.getQuickNotesByCollegeSlug(
                collegeName,
            )}?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch quick notes');
            }

            const data = await response.json();
            setQuicknotes(data.data.quicknotes || []);
            setPagination(data.data.pagination || null);
        } catch (error) {
            console.error('Error fetching quick notes:', error);
            toast.error('Failed to fetch quick notes');
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
        if (isInitialMount) return;

        const prevFilters = prevFiltersRef.current;
        const filterChanged =
            prevFilters.search !== currentFilters.search ||
            prevFilters.course !== currentFilters.course ||
            prevFilters.branch !== currentFilters.branch ||
            prevFilters.semester !== currentFilters.semester ||
            prevFilters.page !== currentFilters.page;

        if (filterChanged || forceRefetch) {
            fetchQuickNotes();
            prevFiltersRef.current = currentFilters;
            if (forceRefetch) {
                setForceRefetch(false);
            }
        }
    }, [currentFilters, isInitialMount, fetchQuickNotes, forceRefetch]);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className='space-y-6'>
            <ResourcePageHeader
                searchInput={filterState.searchInput}
                setSearchInput={filterState.setSearchInput}
                searchPlaceholder='Search quick notes...'
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
                addButtonText=''
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
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
                </div>
            )}

            {/* Quick Notes Grid */}
            {!loading && (
                <>
                    {quicknotes.length > 0 ? (
                        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4'>
                            {quicknotes.map((note) => (
                                <QuickNoteCard
                                    key={note._id}
                                    note={note}
                                    collegeName={collegeName}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-12'>
                            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto'>
                                <div className='w-16 h-16 mx-auto mb-4 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center'>
                                    <Zap className='w-8 h-8 text-purple-500' />
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                    No Quick Notes Found
                                </h3>
                                <p className='text-gray-600 dark:text-gray-400'>
                                    {filterState.hasActiveFilters
                                        ? 'Try adjusting your filters.'
                                        : 'Quick notes for this college are coming soon!'}
                                </p>
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
        </div>
    );
};

export default QuickNotesClient;
