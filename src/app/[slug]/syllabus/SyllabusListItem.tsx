'use client';
import React from 'react';
import Link from 'next/link';
import {
    BookOpenCheck,
    Eye,
    GraduationCap,
    BookOpen,
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
            prefetch={false}
            href={`/${collegeName}/syllabus/${syllabus.slug}`}
            className='group bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#d2d2d2] dark:hover:border-[#383838] transition-all duration-300 overflow-hidden block hover:shadow-[0_4px_12px_rgb(0,0,0,0.03)] dark:hover:shadow-[0_4px_12px_rgb(0,0,0,0.1)]'
        >
            <div className='p-5 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-6'>
                    {/* Left Section - Main Info */}
                    <div className='flex-1 min-w-0 flex items-start gap-4'>
                        <div className='flex-shrink-0 w-12 h-12 bg-[#f6f5f4] dark:bg-[#191919] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-center transition-transform duration-300 group-hover:scale-105'>
                            <BookOpenCheck className='w-5 h-5 text-[#101828] dark:text-[#ededed]' />
                        </div>

                        <div className='flex-1 min-w-0'>
                            <div className='flex flex-wrap items-center gap-2 mb-1.5'>
                                <h3 className='text-base font-bold text-[#101828] dark:text-[#ededed] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors duration-300 leading-tight'>
                                    {syllabus.subject.subjectName}
                                </h3>
                                <span className='text-xs font-semibold px-2 py-0.5 bg-[#fcfbf9] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838] rounded-full'>
                                    {syllabus.subject.subjectCode}
                                </span>
                                {syllabus.subject.branch?.branchCode && (
                                    <span className='text-xs font-semibold px-2 py-0.5 bg-[#fcfbf9] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838] rounded-full'>
                                        {syllabus.subject.branch.branchCode}
                                    </span>
                                )}
                            </div>

                            {syllabus.description && (
                                <p className='text-sm text-[#615d59] dark:text-[#a09e9a] line-clamp-1 mb-3'>
                                    {syllabus.description}
                                </p>
                            )}

                            {/* Stats Row */}
                            <div className='flex flex-wrap items-center gap-4 text-xs font-medium text-[#615d59] dark:text-[#a09e9a]'>
                                <div className='flex items-center gap-1.5'>
                                    <GraduationCap className='w-4 h-4' />
                                    <span>
                                        Year {syllabus.year} / Sem{' '}
                                        {syllabus.semester}
                                    </span>
                                </div>
                                <div className='hidden sm:block w-1 h-1 rounded-full bg-[#e6e6e6] dark:bg-[#383838]'></div>
                                <div className='flex items-center gap-1.5'>
                                    <BookOpen className='w-4 h-4' />
                                    <span>
                                        {syllabus.units?.length || 0} Units
                                    </span>
                                </div>
                                <div className='hidden sm:block w-1 h-1 rounded-full bg-[#e6e6e6] dark:bg-[#383838]'></div>
                                <div className='flex items-center gap-1.5'>
                                    <Eye className='w-4 h-4' />
                                    <span>
                                        {syllabus.viewCount} views
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - View Button */}
                    <div className='flex-shrink-0'>
                        <div className='px-4 py-2 bg-white dark:bg-[#202020] text-[#101828] dark:text-[#ededed] text-sm font-semibold rounded-lg border border-[#e6e6e6] dark:border-[#383838] group-hover:bg-[#f6f5f4] dark:group-hover:bg-[#2a2a2a] transition-colors'>
                            View Syllabus
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
