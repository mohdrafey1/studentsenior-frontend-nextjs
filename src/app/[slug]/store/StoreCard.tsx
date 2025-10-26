'use client';
import React from 'react';
import { IStoreItem } from '@/utils/interface';
import { capitalizeWords } from '@/utils/formatting';
import {
    Edit,
    Trash2,
    Eye,
    MessageCircle,
    IndianRupee,
    ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface StoreCardProps {
    item: IStoreItem;
    onEdit: (item: IStoreItem) => void;
    onDelete: (itemId: string) => void;
    ownerId: string;
}

export const StoreCard: React.FC<StoreCardProps> = ({
    item,
    onEdit,
    onDelete,
    ownerId,
}) => {
    return (
        <article
            className='group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col'
            aria-label={item.name}
        >
            {/* Animated Background Gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700' />

            {/* Floating Orb Effect */}
            <div className='absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110' />

            {/* Image Section - Responsive height */}
            <div className='relative h-32 sm:h-40 lg:h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden'>
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                        width={500}
                        height={500}
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
                        <div className='text-center'>
                            <div className='w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-1 sm:mb-2 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                                <Eye className='w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400' />
                            </div>
                            <span className='text-xs sm:text-sm font-medium'>
                                No Image
                            </span>
                        </div>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                {/* Status Badges - Smaller on mobile */}
                <div className='absolute top-1.5 sm:top-3 right-1.5 sm:right-3'>
                    <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
                            item.available
                                ? 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200 border border-emerald-200/50'
                                : 'bg-red-100/90 text-red-800 dark:bg-red-900/80 dark:text-red-200 border border-red-200/50'
                        }`}
                    >
                        {item.available ? 'Available' : 'Sold'}
                    </span>
                </div>

                {/* Submission Status Badge */}
                {item.submissionStatus !== 'approved' && (
                    <div className='absolute top-1.5 sm:top-3 left-1.5 sm:left-3'>
                        <span
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
                                item.submissionStatus === 'pending'
                                    ? 'bg-amber-100/90 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 border border-amber-200/50'
                                    : 'bg-red-100/90 text-red-800 dark:bg-red-900/80 dark:text-red-200 border border-red-200/50'
                            }`}
                        >
                            {capitalizeWords(item.submissionStatus)}
                        </span>
                    </div>
                )}

                {/* Edit/Delete Controls for Owner - Smaller on mobile */}
                {ownerId === item.owner._id && (
                    <div
                        className='absolute top-1.5 sm:top-3 right-1.5 sm:right-3 flex gap-1 sm:gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300'
                        style={{ marginTop: item.available ? '28px' : '0' }}
                    >
                        <button
                            onClick={() => onEdit(item)}
                            className='p-1.5 sm:p-2 rounded-full bg-amber-50/90 text-amber-600 hover:bg-amber-100/90 dark:bg-amber-900/40 dark:text-amber-400 dark:hover:bg-amber-900/60 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md backdrop-blur-sm'
                            aria-label={`Edit item: ${item.name}`}
                        >
                            <Edit className='w-3 h-3 sm:w-4 sm:h-4' />
                        </button>
                        <button
                            onClick={() => onDelete(item._id)}
                            className='p-1.5 sm:p-2 rounded-full bg-red-50/90 text-red-600 hover:bg-red-100/90 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md backdrop-blur-sm'
                            aria-label={`Delete item: ${item.name}`}
                        >
                            <Trash2 className='w-3 h-3 sm:w-4 sm:h-4' />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Section - Responsive padding */}
            <div className='relative p-3 sm:p-4 lg:p-6 flex-grow flex flex-col'>
                {/* Title and Price - More compact on mobile */}
                <div className='flex justify-between items-start mb-2 sm:mb-3'>
                    <h3 className='text-sm sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-600 dark:group-hover:from-sky-400 dark:group-hover:to-cyan-400 transition-all duration-300 flex-1 mr-2 sm:mr-3'>
                        {item.name}
                    </h3>
                    <div className='flex items-center bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-emerald-200/30 dark:border-emerald-700/30'>
                        <IndianRupee className='w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 mr-0.5 sm:mr-1' />
                        <span className='text-sm sm:text-lg font-bold text-emerald-600 dark:text-emerald-400'>
                            {item.price}
                        </span>
                    </div>
                </div>

                {/* Description - Smaller and more compact on mobile */}
                {/* <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-2 sm:mb-4 flex-grow">
                    {item.description}
                </p> */}

                {/* Contact Buttons - More compact on mobile */}
                <div className='space-y-1.5 sm:space-y-3 mb-2 sm:mb-4'>
                    {item.whatsapp && (
                        <a
                            href={`https://wa.me/91${item.whatsapp}?text=${encodeURIComponent(`Hey! I came from StudentSenior. I want to know about the "${item.name}" listed on StudentSenior.`)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center group/contact p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50/50 hover:bg-emerald-50 dark:bg-gray-800/50 dark:hover:bg-emerald-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-md'
                        >
                            <div className='p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-emerald-100 dark:bg-emerald-900/40 group-hover/contact:bg-emerald-200 dark:group-hover/contact:bg-emerald-800/60 transition-colors duration-200'>
                                <MessageCircle className='w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400' />
                            </div>
                            <span className='ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 group-hover/contact:text-emerald-700 dark:group-hover/contact:text-emerald-300 transition-colors duration-200 font-medium'>
                                WhatsApp
                            </span>
                        </a>
                    )}
                </div>

                {/* Gradient Separator */}
                <div className='h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-2 sm:mb-4' />

                {/* Footer Section - More compact on mobile */}
                <div className='mt-auto'>
                    {/* <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-4">
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
                                {(item.owner?.username || "A")[0].toUpperCase()}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                                By
                            </span>
                            <span className="font-medium text-xs sm:text-sm">
                                {item.owner?.username || "Anonymous"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <time className="bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                {formatDate(item.createdAt)}
                            </time>
                        </div>
                    </div> */}

                    <Link
                        href={`store/${item.slug}`}
                        className='group/cta relative inline-flex items-center justify-center w-full py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02] overflow-hidden'
                    >
                        {/* Button Background Animation */}
                        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-500 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300' />

                        <span className='relative flex items-center text-sm sm:text-base'>
                            <span className='hidden sm:inline'>
                                View Details
                            </span>
                            <span className='sm:hidden'>View</span>
                            <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover/cta:translate-x-1 transition-transform duration-300' />
                        </span>
                    </Link>
                </div>
            </div>
        </article>
    );
};
