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
    const isOwner = ownerId === pyq.owner?._id;
    const { saveResource, unsaveResource } = useSaveResource();
    const [isSaved, setIsSaved] = useState(false);

    const { savedPYQs } = useSelector(
        (state: RootState) => state.savedCollection,
    );

    useEffect(() => {
        const isSavedEntry = !!savedPYQs?.some((entry) =>
            typeof entry.pyqId === 'string'
                ? entry.pyqId === pyq._id
                : entry.pyqId && typeof entry.pyqId === 'object'
                  ? entry.pyqId._id === pyq._id
                  : false,
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
            className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full flex flex-col justify-between'
            aria-label={pyq.subject.subjectName}
        >
            {/* Content Section */}
            <div className='p-3 sm:p-4 space-y-2 sm:space-y-3'>
                {/* Title and Subject */}
                <div className='space-y-1'>
                    <h3 className='text-sm sm:text-base font-bold text-[#101828] dark:text-white group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors line-clamp-2 leading-snug'>
                        {pyq.subject.subjectName}
                    </h3>
                    <div className='flex items-center gap-1.5 text-xs text-[#615d59] dark:text-[#a09e9a]'>
                        <GraduationCap className='w-3.5 h-3.5 text-[#0075de] dark:text-[#62aef0] flex-shrink-0' />
                        <span className='truncate font-medium'>
                            {pyq.subject.branch.branchCode}
                        </span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className='grid grid-cols-2 gap-1.5 sm:gap-2 text-xs pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                    <div className='flex items-center gap-1.5 text-[#615d59] dark:text-[#a09e9a]'>
                        <BookOpen className='w-3 h-3 text-[#8c8883] dark:text-[#787672] flex-shrink-0' />
                        <span className='truncate'>
                            {pyq.subject.semester} Sem
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 text-[#615d59] dark:text-[#a09e9a]'>
                        <Calendar className='w-3 h-3 text-[#8c8883] dark:text-[#787672] flex-shrink-0' />
                        <span>{pyq.year}</span>
                    </div>
                    <div className='flex items-center gap-1.5 text-[#615d59] dark:text-[#a09e9a]'>
                        <FileText className='w-3 h-3 text-[#8c8883] dark:text-[#787672] flex-shrink-0' />
                        <span className='truncate capitalize'>{pyq.examType}</span>
                    </div>
                    <div className='flex items-center gap-1.5 text-[#615d59] dark:text-[#a09e9a]'>
                        <Eye className='w-3 h-3 text-[#8c8883] dark:text-[#787672] flex-shrink-0' />
                        <span>{pyq.clickCounts} views</span>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className='flex flex-wrap gap-1.5'>
                    {pyq.solved && (
                        <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130]'>
                            Solved
                        </span>
                    )}
                    {pyq.isPaid && (
                        <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#fffbeb] text-[#d97706] dark:bg-[#382606] dark:text-[#fbbf24] border border-[#fef08a] dark:border-[#524419]'>
                            ₹{pyq.price / 5}
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className='p-3 sm:p-4 pt-0'>
                <div className='flex gap-1.5 sm:gap-2 pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                    <Link
                        prefetch={false}
                        href={`pyqs/${pyq.slug}`}
                        className='flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                    >
                        <Eye className='w-3.5 h-3.5' />
                        <span>View PYQ</span>
                    </Link>
                    <button
                        className='w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium bg-[#f6f5f4] dark:bg-[#282828] text-[#555] dark:text-[#bbb] hover:bg-[#eae8e4] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#383838] transition-colors shadow-xs'
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
                            className='w-4 h-4'
                            fill={isSaved ? 'currentColor' : 'none'}
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                            style={{
                                color: isSaved ? '#0075de' : 'currentColor',
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
                                    className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#fffbeb] dark:bg-[#382606] text-[#d97706] dark:text-[#fbbf24] hover:bg-[#fef3c7] dark:hover:bg-[#451a03] border border-[#fef08a] dark:border-[#524419] transition-colors'
                                >
                                    <Edit className='w-3.5 h-3.5' />
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(pyq._id)}
                                aria-label='Delete PYQ'
                                className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#fff1f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185] hover:bg-[#ffe4e6] dark:hover:bg-[#4c0519] border border-[#fecdd3] dark:border-[#5c2328] transition-colors'
                            >
                                <Trash2 className='w-3.5 h-3.5' />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};

