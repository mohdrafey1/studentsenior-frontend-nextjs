'use client';
import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import toast from 'react-hot-toast';
import { ISyllabus, IPagination } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import {
    BookOpenCheck,
    Eye,
    GraduationCap,
    BookOpen,
    Calendar,
    ArrowRight,
    AlertCircle,
} from 'lucide-react';
import PaginationComponent from '@/components/Common/Pagination';
import Link from 'next/link';
import { useCoursesAndBranches } from '@/hooks/useCoursesAndBranches';
import { useFilterState } from '@/hooks/useFilterState';
import { CommonFilters } from '@/components/Common/CommonFilters';
import { SyllabusListItem } from './SyllabusListItem';
import { ResourcePageHeader } from '@/components/Common/ResourcePageHeader';

const SyllabusClient = ({
    initialSyllabus,
    initialPagination,
    collegeName,
    initialError,
}: {
    initialSyllabus: ISyllabus[];
    initialPagination: IPagination;
    collegeName: string;
    initialError?: string | null;
}) => {
    // Syllabus-specific filters
    const [yearFilter, setYearFilter] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('year') || '';
        }
        return '';
    });

    // Common filters hook with additional yearFilter
    const filterState = useFilterState({
        debounceMs: 500,
        additionalFilters: { year: yearFilter },
    });

    // Courses and branches hook
    const { courses, branches, loadingCourses, loadingBranches } =
        useCoursesAndBranches(filterState.courseFilter);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [syllabus, setSyllabus] = useState<ISyllabus[]>(initialSyllabus);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(initialError || null);

    // Track if this is the first mount
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [forceRefetch, setForceRefetch] = useState(false);
    const prevFiltersRef = useRef({
        search: '',
        course: '',
        branch: '',
        year: '',
        semester: '',
    });

    // Memoize current filters to avoid recreation
    const currentFilters = useMemo(
        () => ({
            search: filterState.searchTerm,
            course: filterState.courseFilter,
            branch: filterState.branchFilter,
            year: yearFilter,
            semester: filterState.semesterFilter,
        }),
        [
            filterState.searchTerm,
            filterState.courseFilter,
            filterState.branchFilter,
            yearFilter,
            filterState.semesterFilter,
        ],
    );

    // Mark initial mount as complete
    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    const fetchSyllabus = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filterState.searchTerm)
                params.set('search', filterState.searchTerm);
            if (filterState.courseFilter)
                params.set('course', filterState.courseFilter);
            if (filterState.branchFilter)
                params.set('branch', filterState.branchFilter);
            if (yearFilter) params.set('year', yearFilter);
            if (filterState.semesterFilter)
                params.set('semester', filterState.semesterFilter);
            params.set('page', filterState.page.toString());
            params.set('limit', '12');

            const baseUrl = api.syllabus.getSyllabusByCollege(collegeName);
            const url = `${baseUrl}?${params.toString()}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch syllabus');
            }

            setSyllabus(data?.data?.syllabus || []);
            setPagination(data?.data?.pagination || null);
        } catch (err) {
            console.error('Error fetching syllabus:', err);
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to fetch syllabus';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [
        collegeName,
        filterState.searchTerm,
        filterState.courseFilter,
        filterState.branchFilter,
        yearFilter,
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
            prevFilters.year !== currentFilters.year ||
            prevFilters.semester !== currentFilters.semester;

        if (filterChanged || forceRefetch) {
            fetchSyllabus();
            prevFiltersRef.current = currentFilters;
            if (forceRefetch) {
                setForceRefetch(false);
            }
        }
    }, [currentFilters, isInitialMount, fetchSyllabus, forceRefetch]);

    const hasActiveFilters = useMemo(
        () =>
            !!(
                filterState.searchTerm ||
                filterState.courseFilter ||
                filterState.branchFilter ||
                yearFilter ||
                filterState.semesterFilter
            ),
        [
            filterState.searchTerm,
            filterState.courseFilter,
            filterState.branchFilter,
            yearFilter,
            filterState.semesterFilter,
        ],
    );

    const activeFilterCount = useMemo(
        () =>
            [
                filterState.searchTerm,
                filterState.courseFilter,
                filterState.branchFilter,
                yearFilter,
                filterState.semesterFilter,
            ].filter(Boolean).length,
        [
            filterState.searchTerm,
            filterState.courseFilter,
            filterState.branchFilter,
            yearFilter,
            filterState.semesterFilter,
        ],
    );

    const clearAllFilters = useCallback(() => {
        filterState.clearFilters();
        setYearFilter('');
        setForceRefetch(true);
    }, [filterState]);

    return (
        <div className='space-y-6'>
            <ResourcePageHeader
                searchInput={filterState.searchInput}
                setSearchInput={filterState.setSearchInput}
                searchPlaceholder='Search syllabus...'
                showFilters={filterState.showFilters}
                setShowFilters={filterState.setShowFilters}
                hasActiveFilters={!!hasActiveFilters}
                activeFilterCount={activeFilterCount}
                clearFilters={clearAllFilters}
                addButtonText='Add Syllabus'
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Filters Section */}
            {filterState.showFilters && (
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
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
                            {[1, 2, 3, 4, 5, 6].map((year) => (
                                <option key={year} value={year}>
                                    Year {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3'>
                    <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0' />
                    <div>
                        <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                            Failed to load syllabus
                        </p>
                        <p className='text-xs text-red-600 dark:text-red-400 mt-1'>
                            {error}
                        </p>
                    </div>
                    <button
                        onClick={fetchSyllabus}
                        className='ml-auto px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-md transition-colors'
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Syllabus Grid/List */}
            {loading ? (
                <div className='flex items-center justify-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                </div>
            ) : syllabus.length > 0 ? (
                <>
                    {viewMode === 'grid' ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {syllabus.map((item) => (
                                <Link
                                    key={item._id}
                                    href={`/${collegeName}/syllabus/${item.slug}`}
                                    prefetch={false}
                                    className='group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300 hover:-translate-y-1'
                                >
                                    {/* Gradient Top Border */}
                                    <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600'></div>

                                    <div className='p-6'>
                                        {/* Header with Icon and Code */}
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='flex-shrink-0'>
                                                <div className='h-14 w-14 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/40 dark:to-blue-900/40 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300'>
                                                    <GraduationCap className='h-7 w-7 text-sky-600 dark:text-sky-400' />
                                                </div>
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                                                        {item.subject
                                                            ?.subjectCode ||
                                                            'N/A'}
                                                    </h3>
                                                    {item.subject?.branch
                                                        ?.branchCode && (
                                                        <span className='text-xs font-medium px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 rounded-md'>
                                                            {
                                                                item.subject
                                                                    .branch
                                                                    .branchCode
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'>
                                                    {item.subject
                                                        ?.subjectName ||
                                                        'Subject name not available'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <div className='mb-4 pb-4 border-b border-gray-100 dark:border-gray-700'>
                                                <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed'>
                                                    {item.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Info Grid */}
                                        <div className='grid grid-cols-2 gap-3 mb-4'>
                                            <div className='flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                                                <Calendar className='w-4 h-4 text-sky-600 dark:text-sky-400' />
                                                <div className='flex flex-col'>
                                                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                        Year / Sem
                                                    </span>
                                                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                                                        {item.year} /{' '}
                                                        {item.semester}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                                                <BookOpen className='w-4 h-4 text-sky-600 dark:text-sky-400' />
                                                <div className='flex flex-col'>
                                                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                        Units
                                                    </span>
                                                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                                                        {item.units?.length ||
                                                            0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className='flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700'>
                                            <div className='flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-md'>
                                                <Eye className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                                                <span className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                                                    {item.viewCount || 0} views
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-1 text-sm font-semibold text-sky-600 dark:text-sky-400 group-hover:gap-2 transition-all duration-300'>
                                                View Details
                                                <ArrowRight className='w-4 h-4' />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className='space-y-3'>
                            {syllabus.map((item) => (
                                <SyllabusListItem
                                    key={item._id}
                                    syllabus={item}
                                    collegeName={collegeName}
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className='text-center py-12'>
                    <BookOpenCheck className='w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4' />
                    <p className='text-gray-500 dark:text-gray-400 text-lg'>
                        No syllabus found
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className='mt-4 text-sky-600 dark:text-sky-400 hover:underline'
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className='mt-8'>
                    <PaginationComponent
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(p) => filterState.setPage(p)}
                    />
                </div>
            )}
        </div>
    );
};

export default SyllabusClient;
