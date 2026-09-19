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
                        className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8883] dark:text-[#787672]'
                        size={18}
                    />
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search courses...'
                        className='w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl bg-white dark:bg-[#191919] text-[#101828] dark:text-white focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] outline-none transition-all shadow-sm'
                    />
                </div>
                <p className='mt-2 text-xs sm:text-sm text-[#615d59] dark:text-[#9ea3ae] text-center font-medium'>
                    Showing {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'}
                </p>
            </div>

            {/* List */}
            <div className='space-y-3 sm:space-y-4 px-4 sm:px-0'>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div
                            key={course._id}
                            className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden'
                        >
                            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
                                {/* Left Section - Info */}
                                <div className='flex-1 min-w-0 flex items-start gap-3 sm:gap-4'>
                                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-[#eaf3fd] dark:bg-[#183153] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#d2e4f9] dark:border-[#224474]'>
                                        <BookOpen className='w-5 h-5 sm:w-6 sm:h-6 text-[#0075de] dark:text-[#62aef0]' />
                                    </div>
                                    <div className='flex-1 min-w-0 pt-0.5'>
                                        <h3 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white mb-1.5 leading-tight group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors truncate max-w-xl'>
                                            {course.courseName}
                                        </h3>
                                        <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a]'>
                                            <span className='font-mono font-medium text-[#0075de] dark:text-[#62aef0] bg-[#eaf3fd] dark:bg-[#183153] px-2 py-0.5 rounded-md border border-[#d2e4f9] dark:border-[#224474]'>
                                                {course.courseCode}
                                            </span>
                                            <span className='text-[#d0ceca] dark:text-[#404040]'>•</span>
                                            <span className='flex items-center gap-1.5 font-medium'>
                                                <Eye className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8c8883] dark:text-[#787672]' />
                                                {course.clickCounts} views
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section - Action */}
                                <div className='flex sm:flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0eee9] dark:border-[#2a2a2a]'>
                                    <Link
                                        prefetch={false}
                                        href={`resources/${course.courseCode}`}
                                        className='inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98] w-full sm:w-auto'
                                    >
                                        <span>Explore Course</span>
                                        <ArrowRight className='w-4 h-4' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-8 sm:p-12 text-center shadow-sm max-w-2xl mx-auto'>
                        <BookOpen className='w-12 h-12 sm:w-14 sm:h-14 text-[#8c8883] dark:text-[#787672] mx-auto mb-4' />
                        <h3 className='text-lg font-bold text-[#101828] dark:text-white mb-2'>
                            No courses found
                        </h3>
                        <p className='text-sm text-[#475467] dark:text-[#9ea3ae]'>
                            Try adjusting your search criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
