'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IPagination } from '@/utils/interface';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/config/apiUrls';
import {
    SearchIcon,
    FilterIcon,
    XIcon,
    BookOpenCheck,
    Eye,
    GraduationCap,
} from 'lucide-react';
import PaginationComponent from '@/components/Common/Pagination';
import Link from 'next/link';

interface ISyllabus {
    _id: string;
    slug: string;
    year: number;
    semester: number;
    subject: {
        subjectName?: string;
        subjectCode?: string;
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
    const [yearFilter, setYearFilter] = useState(
        searchParams.get('year') || '',
    );
    const [semesterFilter, setSemesterFilter] = useState(
        searchParams.get('semester') || '',
    );

    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchInput) params.set('search', searchInput);
        if (yearFilter) params.set('year', yearFilter);
        if (semesterFilter) params.set('semester', semesterFilter);
        if (page > 1) params.set('page', page.toString());

        const newUrl = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;

        router.replace(newUrl, { scroll: false });
    }, [searchInput, yearFilter, semesterFilter, page, pathname, router]);

    const fetchSyllabus = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchInput) params.set('search', searchInput);
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
    };

    useEffect(() => {
        fetchSyllabus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput, yearFilter, semesterFilter, page]);

    const handleClearFilters = () => {
        setSearchInput('');
        setYearFilter('');
        setSemesterFilter('');
        setPage(1);
    };

    const hasActiveFilters = searchInput || yearFilter || semesterFilter;

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
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                            className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow'
                        >
                            <div className='flex items-start gap-4 mb-4'>
                                <div className='flex-shrink-0'>
                                    <div className='h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                                        <GraduationCap className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                                    </div>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-1'>
                                        {item.subject?.subjectCode || 'N/A'}
                                    </h3>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                                        {item.subject?.subjectName ||
                                            'Subject name not available'}
                                    </p>
                                </div>
                            </div>

                            <div className='mb-3 pb-3 border-b border-gray-100 dark:border-gray-700'>
                                {item.description && (
                                    <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2 mb-4'>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-500 dark:text-gray-400'>
                                        Year {item.year} • Semester{' '}
                                        {item.semester}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-500 dark:text-gray-400'>
                                        Units
                                    </span>
                                    <span className='font-semibold text-gray-900 dark:text-white'>
                                        {item.units?.length || 0}
                                    </span>
                                </div>
                            </div>

                            <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700'>
                                <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                                    <div className='flex items-center gap-1'>
                                        <Eye className='w-4 h-4' />
                                        {item.viewCount || 0}
                                    </div>
                                </div>
                                <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                                    View Details →
                                </span>
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
