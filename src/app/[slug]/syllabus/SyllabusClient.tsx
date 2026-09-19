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
        page: 1,
    });

    // Memoize current filters to avoid recreation
    const currentFilters = useMemo(
        () => ({
            search: filterState.searchTerm,
            course: filterState.courseFilter,
            branch: filterState.branchFilter,
            year: yearFilter,
            semester: filterState.semesterFilter,
            page: filterState.page,
        }),
        [
            filterState.searchTerm,
            filterState.courseFilter,
            filterState.branchFilter,
            yearFilter,
            filterState.semesterFilter,
            filterState.page,
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
            prevFilters.semester !== currentFilters.semester ||
            prevFilters.page !== currentFilters.page;

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
                <div className='bg-white dark:bg-[#202020] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-[#e6e6e6] dark:border-[#2f2f2f] p-6'>
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
                            className='w-full px-3 py-2.5 border border-[#e6e6e6] dark:border-[#383838] rounded-xl bg-white dark:bg-[#202020] text-[#101828] dark:text-[#ededed] focus:ring-2 focus:ring-[#0075de] focus:border-[#0075de] transition-all shadow-sm outline-none text-sm'
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
                <div className='bg-[#fff5f5] dark:bg-[#3d1a1a] border border-[#ffcccc] dark:border-[#5c2626] rounded-xl p-4 flex items-center gap-3'>
                    <AlertCircle className='w-5 h-5 text-[#cc0000] dark:text-[#ff9999] flex-shrink-0' />
                    <div>
                        <p className='text-sm font-semibold text-[#cc0000] dark:text-[#ff9999]'>
                            Failed to load syllabus
                        </p>
                        <p className='text-xs text-[#b30000] dark:text-[#ffb3b3] mt-1'>
                            {error}
                        </p>
                    </div>
                    <button
                        onClick={fetchSyllabus}
                        className='ml-auto px-4 py-2 bg-white dark:bg-[#4d2020] text-[#cc0000] dark:text-[#ff9999] text-sm font-medium rounded-xl border border-[#ffcccc] dark:border-[#7a3333] hover:bg-[#fff0f0] dark:hover:bg-[#5c2626] transition-all shadow-sm'
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Syllabus Grid/List */}
            {loading ? (
                <div className='flex items-center justify-center py-20'>
                    <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#0075de]'></div>
                </div>
            ) : syllabus.length > 0 ? (
                <>
                    {viewMode === 'grid' ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                            {syllabus.map((item) => (
                                <Link
                                    prefetch={false}
                                    key={item._id}
                                    href={`/${collegeName}/syllabus/${item.slug}`}
                                    className='group bg-white dark:bg-[#202020] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#d2d2d2] dark:hover:border-[#383838] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300 block'
                                >
                                    <div className='p-6'>
                                        {/* Header with Icon and Code */}
                                        <div className='flex items-start gap-4 mb-4'>
                                            <div className='flex-shrink-0'>
                                                <div className='h-12 w-12 rounded-xl bg-[#f6f5f4] dark:bg-[#191919] flex items-center justify-center border border-[#e6e6e6] dark:border-[#2f2f2f] transition-transform duration-300 group-hover:scale-105'>
                                                    <GraduationCap className='h-5 w-5 text-[#101828] dark:text-[#ededed]' />
                                                </div>
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2 mb-1.5'>
                                                    <h3 className='text-lg font-bold text-[#101828] dark:text-[#ededed] leading-tight tracking-tight'>
                                                        {item.subject
                                                            ?.subjectCode ||
                                                            'N/A'}
                                                    </h3>
                                                    {item.subject?.branch
                                                        ?.branchCode && (
                                                        <span className='text-xs font-semibold px-2.5 py-0.5 bg-[#fcfbf9] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838] rounded-full'>
                                                            {
                                                                item.subject
                                                                    .branch
                                                                    .branchCode
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                                <p className='text-sm font-medium text-[#615d59] dark:text-[#a09e9a] line-clamp-2 leading-snug'>
                                                    {item.subject
                                                        ?.subjectName ||
                                                        'Subject name not available'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <div className='mb-4 pb-4 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                                <p className='text-[13px] text-[#615d59] dark:text-[#a09e9a] line-clamp-2 leading-relaxed'>
                                                    {item.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Info Grid */}
                                        <div className='grid grid-cols-2 gap-3 mb-5'>
                                            <div className='flex items-center gap-3 px-3 py-2 bg-[#fcfbf9] dark:bg-[#191919] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl'>
                                                <Calendar className='w-4 h-4 text-[#8c8883] dark:text-[#787672]' />
                                                <div className='flex flex-col'>
                                                    <span className='text-[11px] font-bold text-[#8c8883] dark:text-[#787672] uppercase tracking-wider mb-0.5'>
                                                        Year / Sem
                                                    </span>
                                                    <span className='text-xs font-semibold text-[#101828] dark:text-[#ededed]'>
                                                        {item.year} /{' '}
                                                        {item.semester}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-3 px-3 py-2 bg-[#fcfbf9] dark:bg-[#191919] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl'>
                                                <BookOpen className='w-4 h-4 text-[#8c8883] dark:text-[#787672]' />
                                                <div className='flex flex-col'>
                                                    <span className='text-[11px] font-bold text-[#8c8883] dark:text-[#787672] uppercase tracking-wider mb-0.5'>
                                                        Units
                                                    </span>
                                                    <span className='text-xs font-semibold text-[#101828] dark:text-[#ededed]'>
                                                        {item.units?.length || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className='flex items-center justify-between pt-4 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                            <div className='flex items-center gap-1.5 text-[#615d59] dark:text-[#a09e9a]'>
                                                <Eye className='w-4 h-4' />
                                                <span className='text-xs font-medium'>
                                                    {item.viewCount || 0} views
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-center px-4 py-2 bg-[#0075de] hover:bg-[#005bab] text-white text-sm font-semibold rounded-xl transition-colors'>
                                                View Syllabus
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className='space-y-4'>
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
                <div className='flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-[#e6e6e6] dark:border-[#2f2f2f] rounded-2xl bg-[#fcfbf9] dark:bg-[#191919]'>
                    <div className='w-16 h-16 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#383838] rounded-2xl flex items-center justify-center mb-6 shadow-sm'>
                        <BookOpenCheck className='w-8 h-8 text-[#a39e98] dark:text-[#787672]' />
                    </div>
                    <p className='text-lg font-semibold text-[#101828] dark:text-[#ededed] mb-2'>
                        No Syllabus Found
                    </p>
                    <p className='text-sm text-[#615d59] dark:text-[#a09e9a] max-w-md text-center'>
                        We couldn't find any syllabus matching your current filters. Try adjusting your search criteria.
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className='mt-6 px-4 py-2 bg-white dark:bg-[#202020] text-[#101828] dark:text-[#ededed] text-sm font-medium rounded-xl border border-[#e6e6e6] dark:border-[#383838] hover:bg-[#f6f5f4] dark:hover:bg-[#2a2a2a] transition-all shadow-sm'
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className='mt-8 flex justify-center'>
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
