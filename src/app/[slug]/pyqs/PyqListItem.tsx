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
    Download,
    BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useSaveResource } from '@/hooks/useSaveResource';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface PyqListItemProps {
    pyq: IPyq;
    onEdit: (pyq: IPyq) => void;
    onDelete: (pyqId: string) => void;
    ownerId: string;
}

export const PyqListItem: React.FC<PyqListItemProps> = ({
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
        <article className='group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden backdrop-blur-sm'>
            {/* Animated Background Gradient */}
            <div className='absolute inset-0 bg-gradient-to-r from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500' />

            <div className='relative p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    {/* Left Section - Main Info */}
                    <div className='flex-1 min-w-0 space-y-2'>
                        {/* Subject Name and Branch */}
                        <div className='flex items-start justify-between'>
                            <div className='flex-1 min-w-0'>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 truncate'>
                                    {pyq.subject.subjectName}
                                </h3>
                                <div className='flex items-center gap-2 mt-1'>
                                    <div className='flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400'>
                                        <GraduationCap className='w-4 h-4 flex-shrink-0' />
                                        <span>
                                            {pyq.subject.branch.branchCode}
                                        </span>
                                    </div>
                                    <span className='text-gray-300 dark:text-gray-600'>
                                        •
                                    </span>
                                    <div className='flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400'>
                                        <BookOpen className='w-4 h-4 flex-shrink-0' />
                                        <span>{pyq.subject.semester} Sem</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div className='flex flex-wrap gap-1.5 ml-4'>
                                {pyq.solved && (
                                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
                                        Solved
                                    </span>
                                )}
                                {pyq.isPaid && (
                                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'>
                                        ₹{pyq.price / 5}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Details Row */}
                        <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                            <div className='flex items-center gap-1.5'>
                                <Calendar className='w-4 h-4 flex-shrink-0' />
                                <span>{pyq.year}</span>
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <FileText className='w-4 h-4 flex-shrink-0' />
                                <span className='capitalize'>
                                    {pyq.examType}
                                </span>
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <Eye className='w-4 h-4 flex-shrink-0' />
                                <span>{pyq.clickCounts} views</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className='flex items-center gap-2 flex-shrink-0'>
                        <Link
                            href={`pyqs/${pyq.slug}`}
                            className='inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200 group-hover:shadow-lg'
                        >
                            <Download className='w-4 h-4' />
                            <span className='hidden sm:inline'>View PYQ</span>
                            <span className='sm:hidden'>View</span>
                        </Link>

                        <button
                            className='w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow'
                            onClick={() => {
                                if (isSaved) {
                                    handleUnsave();
                                } else {
                                    handleSave();
                                }
                            }}
                            title={
                                isSaved ? 'Unsave this PYQ' : 'Save this PYQ'
                            }
                            aria-label={
                                isSaved ? 'Unsave this PYQ' : 'Save this PYQ'
                            }
                        >
                            <svg
                                className='w-5 h-5'
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
                                        className='w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60 transition-colors'
                                    >
                                        <Edit className='w-4 h-4 text-yellow-600 dark:text-yellow-400' />
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(pyq._id)}
                                    aria-label='Delete PYQ'
                                    className='w-10 h-10 flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 transition-colors'
                                >
                                    <Trash2 className='w-4 h-4 text-red-600 dark:text-red-400' />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};
