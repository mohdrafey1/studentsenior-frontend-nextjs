'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ISenior } from '@/utils/interface';
import {
    GraduationCap,
    Briefcase,
    Edit,
    Trash2,
    ExternalLink,
} from 'lucide-react';

interface SeniorListItemProps {
    senior: ISenior;
    onEdit: (senior: ISenior) => void;
    onDelete: (seniorId: string) => void;
    ownerId: string;
    collegeName: string;
}

export const SeniorListItem: React.FC<SeniorListItemProps> = ({
    senior,
    onEdit,
    onDelete,
    ownerId,
    collegeName,
}) => {
    const isOwner = ownerId === senior.owner?._id;

    return (
        <article
            className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden'
        >
            <div className='p-3 sm:p-4 md:p-5'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
                    {/* Left Section - Main Info */}
                    <div className='flex flex-row gap-3 sm:gap-4 flex-1 min-w-0'>
                        {/* Profile Image */}
                        <div className='flex-shrink-0'>
                            {senior.profilePicture ? (
                                <Image
                                    src={senior.profilePicture}
                                    alt={senior.name}
                                    width={48}
                                    height={48}
                                    className='w-12 h-12 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] object-cover'
                                />
                            ) : (
                                <div className='w-12 h-12 rounded-lg bg-[#eaf3fd] dark:bg-[#183153] border border-[#d2e4f9] dark:border-[#224474] flex items-center justify-center'>
                                    <span className='text-lg font-bold text-[#0075de] dark:text-[#62aef0]'>
                                        {senior.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Name and Info */}
                        <div className='flex-1 min-w-0 space-y-1 sm:space-y-1.5'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <h3 className='text-sm sm:text-base font-bold text-[#101828] dark:text-white group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors truncate max-w-lg'>
                                    {senior.name}
                                </h3>
                            </div>

                            <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#615d59] dark:text-[#a09e9a]'>
                                <div className='flex items-center gap-1.5'>
                                    <GraduationCap className='w-3.5 h-3.5 text-[#0075de] dark:text-[#62aef0] flex-shrink-0' />
                                    <span className='font-medium text-[#101828] dark:text-[#ededed]'>
                                        {senior.branch.branchCode || 'Tech'}
                                    </span>
                                </div>
                                <span className='text-[#d0ceca] dark:text-[#404040]'>•</span>
                                <div className='flex items-center gap-1'>
                                    <span>{senior.year}</span>
                                </div>
                                {senior.domain && (
                                    <>
                                        <span className='text-[#d0ceca] dark:text-[#404040]'>•</span>
                                        <div className='flex items-center gap-1'>
                                            <Briefcase className='w-3 h-3 text-[#8c8883] dark:text-[#787672] flex-shrink-0' />
                                            <span>{senior.domain}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <Link
                            prefetch={false}
                            href={`/${collegeName}/seniors/${senior.slug}`}
                            className='inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                        >
                            <ExternalLink className='w-3.5 h-3.5' />
                            <span>View Profile</span>
                        </Link>

                        {isOwner && (
                            <>
                                <button
                                    onClick={() => onEdit(senior)}
                                    aria-label='Edit senior'
                                    className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#fffbeb] dark:bg-[#382606] text-[#d97706] dark:text-[#fbbf24] hover:bg-[#fef3c7] dark:hover:bg-[#451a03] border border-[#fef08a] dark:border-[#524419] transition-colors'
                                >
                                    <Edit className='w-3.5 h-3.5' />
                                </button>
                                <button
                                    onClick={() => onDelete(senior._id)}
                                    aria-label='Delete senior'
                                    className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#fff1f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185] hover:bg-[#ffe4e6] dark:hover:bg-[#4c0519] border border-[#fecdd3] dark:border-[#5c2328] transition-colors'
                                >
                                    <Trash2 className='w-3.5 h-3.5' />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};
