'use client';
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { IPagination, ICourse, IBranch } from '@/utils/interface';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/config/apiUrls';
import {
    SearchIcon,
    FilterIcon,
    XIcon,
    BookOpenCheck,
    Eye,
    GraduationCap,
    BookOpen,
    Calendar,
    ArrowRight,
} from 'lucide-react';
import PaginationComponent from '@/components/Common/Pagination';
import Link from 'next/link';
import SearchableSelect from '@/components/Common/SearchableSelect';

interface ISyllabus {
    _id: string;
    slug: string;
    year: number;
    semester: number;
    subject: {
        subjectName?: string;
        subjectCode?: string;
        branch?: {
            branchCode?: string;
        };
    };
    college: {
        name?: string;
    };
    units: {
        unitNumber: number;
        title: string;
        content: string;
    }[];
    referenceBooks: string;
    description: string;
    isActive: boolean;
    viewCount: number;
}

const SyllabusClient = ({
    initialSyllabus,
    initialPagination,
    collegeName,
}: {
    initialSyllabus: ISyllabus[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [syllabus, setSyllabus] = useState<ISyllabus[]>(initialSyllabus);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
    const [searchInput, setSearchInput] = useState(
        searchParams.get('search') || '',
    );
    const [courseFilter, setCourseFilter] = useState(
        searchParams.get('course') || '',
    );
    const [branchFilter, setBranchFilter] = useState(
        searchParams.get('branch') || '',
    );
    const [yearFilter, setYearFilter] = useState(
        searchParams.get('year') || '',
    );
    const [semesterFilter, setSemesterFilter] = useState(
        searchParams.get('semester') || '',
    );

    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Course and Branch data
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch branches when course filter changes
    useEffect(() => {
        if (courseFilter) {
            fetchBranches(courseFilter);
        } else {
            setBranches([]);
        }
    }, [courseFilter]);

    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await fetch(api.resources.getCourses);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch courses');
            }

            setCourses(data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
        } finally {
            setLoadingCourses(false);
        }
    };

    const fetchBranches = async (courseCode: string) => {
        setLoadingBranches(true);
        try {
            const response = await fetch(api.resources.getBranches(courseCode));
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch branches');
            }

            setBranches(data.data || []);
        } catch (error) {
            console.error('Error fetching branches:', error);
            toast.error('Failed to fetch branches');
        } finally {
            setLoadingBranches(false);
        }
    };

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchInput) params.set('search', searchInput);
        if (courseFilter) params.set('course', courseFilter);
        if (branchFilter) params.set('branch', branchFilter);
        if (yearFilter) params.set('year', yearFilter);
        if (semesterFilter) params.set('semester', semesterFilter);
        if (page > 1) params.set('page', page.toString());

        const newUrl = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;

        router.replace(newUrl, { scroll: false });
    }, [
        searchInput,
        courseFilter,
        branchFilter,
        yearFilter,
        semesterFilter,
        page,
        pathname,
        router,
    ]);

    const fetchSyllabus = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchInput) params.set('search', searchInput);
            if (courseFilter) params.set('course', courseFilter);
            if (branchFilter) params.set('branch', branchFilter);
            if (yearFilter) params.set('year', yearFilter);
            if (semesterFilter) params.set('semester', semesterFilter);
            params.set('page', page.toString());
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
        } catch (error) {
            console.error('Error fetching syllabus:', error);
            toast.error('Failed to fetch syllabus');
        } finally {
            setLoading(false);
        }
    }, [
        collegeName,
        searchInput,
        courseFilter,
        branchFilter,
        yearFilter,
        semesterFilter,
        page,
    ]);

    useEffect(() => {
        fetchSyllabus();
    }, [fetchSyllabus]);

    const handleClearFilters = () => {
        setSearchInput('');
        setCourseFilter('');
        setBranchFilter('');
        setYearFilter('');
        setSemesterFilter('');
        setPage(1);
    };

    const hasActiveFilters =
        searchInput ||
        courseFilter ||
        branchFilter ||
        yearFilter ||
        semesterFilter;

    return (
        <div className='space-y-6'>
            {/* Search and Filters */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4'>
                <div className='flex flex-col gap-4'>
                    {/* Search Bar */}
                    <div className='relative'>
                        <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                        <input
                            type='text'
                            placeholder='Search by subject name or code...'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className='flex flex-wrap items-center gap-3'>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                                showFilters
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-300'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                            }`}
                        >
                            <FilterIcon className='w-5 h-5' />
                            Filters
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className='px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2'
                            >
                                <XIcon className='w-4 h-4' />
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                                {/* Course Filter */}
                                <SearchableSelect
                                    value={courseFilter}
                                    onChange={setCourseFilter}
                                    options={courses.map((course) => ({
                                        value: course.courseCode,
                                        label: course.courseName,
                                    }))}
                                    placeholder='Select Course'
                                    loading={loadingCourses}
                                />

                                {/* Branch Filter */}
                                <SearchableSelect
                                    value={branchFilter}
                                    onChange={setBranchFilter}
                                    options={branches.map((branch) => ({
                                        value: branch.branchCode,
                                        label: branch.branchName,
                                    }))}
                                    placeholder='Select Branch'
                                    loading={loadingBranches}
                                    disabled={!courseFilter}
                                />

                                {/* Year Filter */}
                                <select
                                    value={yearFilter}
                                    onChange={(e) =>
                                        setYearFilter(e.target.value)
                                    }
                                    className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                                >
                                    <option value=''>All Years</option>
                                    {[1, 2, 3, 4, 5, 6].map((year) => (
                                        <option key={year} value={year}>
                                            Year {year}
                                        </option>
                                    ))}
                                </select>

                                {/* Semester Filter */}
                                <select
                                    value={semesterFilter}
                                    onChange={(e) =>
                                        setSemesterFilter(e.target.value)
                                    }
                                    className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                                >
                                    <option value=''>All Semesters</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Syllabus Grid */}
            {loading ? (
                <div className='flex items-center justify-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                </div>
            ) : syllabus.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {syllabus.map((item) => (
                        <Link
                            key={item._id}
                            href={`/${collegeName}/syllabus/${item.slug}`}
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
                                                {item.subject?.subjectCode ||
                                                    'N/A'}
                                            </h3>
                                            {item.subject?.branch
                                                ?.branchCode && (
                                                <span className='text-xs font-medium px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 rounded-md'>
                                                    {
                                                        item.subject.branch
                                                            .branchCode
                                                    }
                                                </span>
                                            )}
                                        </div>
                                        <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'>
                                            {item.subject?.subjectName ||
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
                                                {item.year} / {item.semester}
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
                                                {item.units?.length || 0}
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
                <div className='text-center py-12'>
                    <BookOpenCheck className='w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4' />
                    <p className='text-gray-500 dark:text-gray-400 text-lg'>
                        No syllabus found
                    </p>
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className='mt-8'>
                    <PaginationComponent
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
};

export default SyllabusClient;
