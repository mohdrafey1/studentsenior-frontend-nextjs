'use client';
import React, { useEffect, useState } from 'react';
import { IPyq } from '@/utils/interface';
import {
    Edit,
    Trash2,
    FileText,
    GraduationCap,
    Calendar,
    Eye,
    BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useSaveResource } from '@/hooks/useSaveResource';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface PyqCardProps {
    pyq: IPyq;
    onEdit: (pyq: IPyq) => void;
    onDelete: (pyqId: string) => void;
    ownerId: string;
}

export const PyqCard: React.FC<PyqCardProps> = ({
    pyq,
    onEdit,
    onDelete,
    ownerId,
}) => {
    const isOwner = ownerId === pyq.owner._id;
    const { saveResource, unsaveResource } = useSaveResource();
    const [isSaved, setIsSaved] = useState(false);

    const { savedPYQs } = useSelector(
        (state: RootState) => state.savedCollection,
    );

    useEffect(() => {
        const isSavedEntry = savedPYQs.some((entry) =>
            typeof entry.pyqId === 'string'
                ? entry.pyqId === pyq._id
                : entry.pyqId._id === pyq._id,
        );
        setIsSaved(isSavedEntry);
    }, [savedPYQs, pyq._id]);

    const handleSave = async () => {
        await saveResource('pyq', pyq._id);
    };

    const handleUnsave = async () => {
        await unsaveResource('pyq', pyq._id);
    };

    return (
        <article
            className='group relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col'
            aria-label={pyq.subject.subjectName}
        >
            {/* Animated Background Gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700' />

            {/* Floating Orb Effect - Smaller on mobile */}
            <div className='absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-2xl sm:blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110' />

            {/* Content Section - Compact padding on mobile */}
            <div className='flex-1 p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3 lg:space-y-4'>
                {/* Title and Subject - Smaller text on mobile */}
                <div className='space-y-1 sm:space-y-2'>
                    <h3 className='text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 line-clamp-2 leading-tight'>
                        {pyq.subject.subjectName}
                    </h3>
                    <div className='flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                        <GraduationCap className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
                        <span className='truncate'>
                            {pyq.subject.branch.branchCode}
                        </span>
                    </div>
                </div>

                {/* Details Grid - More compact on mobile */}
                <div className='grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm'>
                    <div className='flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400'>
                        <BookOpen className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
                        <span className='truncate'>
                            {pyq.subject.semester} Sem
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400'>
                        <Calendar className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
                        <span>{pyq.year}</span>
                    </div>
                    <div className='flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400'>
                        <FileText className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
                        <span className='truncate'>{pyq.examType}</span>
                    </div>
                    <div className='flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400'>
                        <Eye className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
                        <span>{pyq.clickCounts}</span>
                    </div>
                </div>

                {/* Status Indicators - More compact on mobile */}
                <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                    {pyq.solved && (
                        <span className='inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
                            Solved
                        </span>
                    )}
                    {pyq.isPaid && (
                        <span className='inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'>
                            ₹{pyq.price / 5}
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons - More compact on mobile */}
            <div className='px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6 z-40'>
                <div className='flex gap-1.5 sm:gap-2'>
                    <Link
                        href={`pyqs/${pyq.slug}`}
                        className='flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-sky-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200 group-hover:shadow-lg'
                    >
                        <Eye className='w-3 h-3 sm:w-4 sm:h-4' />
                        <span className='hidden sm:inline'>View PYQ</span>
                        <span className='sm:hidden'>View</span>
                    </Link>
                    <button
                        className='w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow'
                        onClick={() => {
                            if (isSaved) {
                                handleUnsave();
                            } else {
                                handleSave();
                            }
                        }}
                        title={isSaved ? 'Unsave this PYQ' : 'Save this PYQ'}
                        aria-label={
                            isSaved ? 'Unsave this PYQ' : 'Save this PYQ'
                        }
                    >
                        <svg
                            className='w-4 h-4 sm:w-5 sm:h-5'
                            fill={isSaved ? 'currentColor' : 'none'}
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                            style={{
                                color: isSaved ? '#3B82F6' : '#9CA3AF',
                            }}
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                            ></path>
                        </svg>
                    </button>

                    {isOwner && (
                        <>
                            {pyq.solved && (
                                <button
                                    onClick={() => onEdit(pyq)}
                                    aria-label='Edit PYQ'
                                    className='w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60 transition-colors'
                                >
                                    <Edit className='w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400' />
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(pyq._id)}
                                aria-label='Delete PYQ'
                                className='w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 transition-colors'
                            >
                                <Trash2 className='w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400' />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};
