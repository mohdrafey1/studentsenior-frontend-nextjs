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
            className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full flex flex-col justify-between'
        >
            <div className='p-3 sm:p-4'>
                {/* Header with Unit Number */}
                <div className='flex items-start gap-3 mb-3'>
                    <div className='flex-shrink-0 w-10 h-10 rounded-xl bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center border border-[#e6e6e6] dark:border-[#383838] group-hover:border-[#0075de] dark:group-hover:border-[#0075de] transition-colors'>
                        <span className='text-sm font-bold text-[#101828] dark:text-[#ededed]'>
                            U{note.unitNumber}
                        </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                            <span className='text-[10px] font-bold text-[#0075de] dark:text-[#62aef0] uppercase tracking-wider bg-[#eaf3fd] dark:bg-[#183153] px-1.5 py-0.5 rounded'>
                                {note.subject?.subjectCode}
                            </span>
                            <span className='text-[10px] font-medium text-[#8c8883] dark:text-[#787672]'>
                                Sem {note.subject?.semester}
                            </span>
                        </div>
                        <h3 className='text-sm font-bold text-[#101828] dark:text-white group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors line-clamp-2 leading-snug'>
                            {note.title}
                        </h3>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex items-center justify-between pt-3 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                    <div className='flex items-center gap-1.5 text-[11px] font-semibold text-[#d97706] dark:text-[#fbbf24] bg-[#fffbeb] dark:bg-[#382606] border border-[#fef08a] dark:border-[#524419] px-2 py-0.5 rounded-md'>
                       <span className='text-[11px] font-medium text-[#615d59] dark:text-[#a09e9a] truncate'>
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

            {/* Quick Notes Grid */}
            {!loading && (
                <>
                    {quicknotes.length > 0 ? (
                        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5'>
                            {quicknotes.map((note) => (
                                <QuickNoteCard
                                    key={note._id}
                                    note={note}
                                    collegeName={collegeName}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-16 px-4'>
                            <div className='bg-white dark:bg-[#191919] border border-dashed border-[#e6e6e6] dark:border-[#383838] rounded-2xl p-10 max-w-md mx-auto shadow-sm'>
                                <div className='w-16 h-16 mx-auto mb-5 bg-[#fcfbf9] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#383838] rounded-2xl flex items-center justify-center rotate-3'>
                                    <Zap className='w-8 h-8 text-[#8c8883] dark:text-[#787672] -rotate-3' />
                                </div>
                                <h3 className='text-lg font-bold text-[#101828] dark:text-[#ededed] mb-2'>
                                    No Quick Notes Found
                                </h3>
                                <p className='text-sm text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                    {filterState.hasActiveFilters
                                        ? "We couldn't find any quick notes matching your filters. Try adjusting them."
                                        : "Quick notes for this college are coming soon!"}
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
