'use client';
import React from 'react';
import Link from 'next/link';
import {
    BookOpenCheck,
    Eye,
    GraduationCap,
    BookOpen,
    ArrowRight,
} from 'lucide-react';

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

interface SyllabusListItemProps {
    syllabus: ISyllabus;
    collegeName: string;
}

export const SyllabusListItem: React.FC<SyllabusListItemProps> = ({
    syllabus,
    collegeName,
}) => {
    return (
        <Link
            href={`/${collegeName}/syllabus/${syllabus.slug}`}
            className='group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden backdrop-blur-sm block'
        >
            {/* Gradient Top Border */}
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600'></div>

            {/* Animated Background Gradient */}
            <div className='absolute inset-0 bg-gradient-to-r from-sky-500/5 via-blue-500/5 to-cyan-500/5 dark:from-sky-400/10 dark:via-blue-400/10 dark:to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500' />

            <div className='relative p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
                    {/* Left Section - Main Info */}
                    <div className='flex-1 min-w-0 space-y-3'>
                        {/* Subject Info */}
                        <div className='flex items-start gap-4'>
                            <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg'>
                                <BookOpenCheck className='w-6 h-6 text-white' />
                            </div>

                            <div className='flex-1 min-w-0'>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 line-clamp-1'>
                                    {syllabus.subject.subjectName}
                                </h3>
                                <div className='flex items-center gap-2 mt-1'>
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                                        {syllabus.subject.subjectCode}
                                    </span>
                                    <span className='text-gray-300 dark:text-gray-600'>
                                        •
                                    </span>
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                                        {syllabus.subject.branch?.branchCode}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {syllabus.description && (
                            <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                                {syllabus.description}
                            </p>
                        )}

                        {/* Stats Row */}
                        <div className='flex items-center gap-4 text-sm'>
                            <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                                <GraduationCap className='w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0' />
                                <span className='text-gray-700 dark:text-gray-300'>
                                    Year {syllabus.year} / Sem{' '}
                                    {syllabus.semester}
                                </span>
                            </div>

                            <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                                <BookOpen className='w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0' />
                                <span className='text-gray-700 dark:text-gray-300'>
                                    {syllabus.units?.length || 0} Units
                                </span>
                            </div>

                            <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                                <Eye className='w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0' />
                                <span className='text-gray-700 dark:text-gray-300'>
                                    {syllabus.viewCount} views
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - View Button */}
                    <div className='flex-shrink-0'>
                        <div className='px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg group-hover:shadow-xl'>
                            <span>View Syllabus</span>
                            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
