'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, BookOpen, Eye, Search } from 'lucide-react';
import Link from 'next/link';

interface ICourse {
    _id: string;
    courseName: string;
    courseCode: string;
    clickCounts: number;
}

export default function CourseList({ courses }: { courses: ICourse[] }) {
    const [search, setSearch] = useState('');

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const q = search.toLowerCase();
            return (
                course.courseName.toLowerCase().includes(q) ||
                course.courseCode.toLowerCase().includes(q)
            );
        });
    }, [search, courses]);

    return (
        <div className='space-y-4 sm:space-y-6'>
            {/* Search */}
            <div className='max-w-xl mx-auto w-full px-4 sm:px-0'>
                <div className='relative'>
                    <Search
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
                        size={16}
                    />
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search courses...'
                        className='w-full pl-9 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                    />
                </div>
                <p className='mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center'>
                    {filteredCourses.length} course
                    {filteredCourses.length === 1 ? '' : 's'}
                </p>
            </div>

            {/* List */}
            <div className='space-y-3 sm:space-y-4 px-4 sm:px-0'>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div
                            key={course._id}
                            className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow'
                        >
                            <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
                                {/* Course Info */}
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-start gap-3'>
                                        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                                            <BookOpen className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400' />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-lg sm:text-xl font-quicksand font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight'>
                                                {course.courseName}
                                            </h3>
                                            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                                                <span className='font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs'>
                                                    {course.courseCode}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <Eye className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                                                    {course.clickCounts} views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className='flex sm:flex-shrink-0'>
                                    <Link
                                        href={`resources/${course.courseCode}`}
                                        className='bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-500 text-white px-4 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:min-w-[160px] text-sm sm:text-base'
                                    >
                                        <span className='sm:hidden'>
                                            Explore
                                        </span>
                                        <span className='hidden sm:inline'>
                                            Explore Course
                                        </span>
                                        <ArrowRight className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg mx-4 sm:mx-0'>
                        <BookOpen className='w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4' />
                        <h3 className='text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2'>
                            No courses found
                        </h3>
                        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                            Try adjusting your search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
