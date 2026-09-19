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
            className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full flex flex-col justify-between'
            aria-label={item.name}
        >
            <div className='flex flex-col flex-grow'>
                {/* Image Section */}
                <div className='relative h-40 sm:h-48 bg-[#f6f5f4] dark:bg-[#191919] overflow-hidden border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                            width={500}
                            height={500}
                        />
                    ) : (
                        <div className='w-full h-full flex flex-col items-center justify-center text-[#8c8883] dark:text-[#787672]'>
                            <Eye className='w-8 h-8 mb-2 opacity-50' />
                            <span className='text-xs font-medium'>
                                No Image
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className='p-3 sm:p-4 space-y-2 sm:space-y-3 flex-grow flex flex-col'>
                    {/* Title and Price */}
                    <div className='space-y-1 flex-grow'>
                        <div className='flex justify-between items-start gap-2'>
                            <h3 className='text-sm sm:text-base font-bold text-[#101828] dark:text-white group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors line-clamp-2 leading-snug'>
                                {item.name}
                            </h3>
                            <div className='flex items-center gap-0.5 font-bold text-[#1aae39] dark:text-[#4ade80] bg-[#eaf7ec] dark:bg-[#163821] px-2 py-0.5 rounded-md border border-[#d2f0d9] dark:border-[#205130] flex-shrink-0'>
                                <IndianRupee className='w-3 h-3' />
                                <span className='text-xs'>{item.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className='flex flex-wrap gap-1.5 pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                item.available
                                    ? 'bg-[#eaf3fd] text-[#0075de] dark:bg-[#183153] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474]'
                                    : 'bg-[#fff1f2] text-[#e11d48] dark:bg-[#3b1118] dark:text-[#fb7185] border border-[#fecdd3] dark:border-[#5c2328]'
                            }`}
                        >
                            {item.available ? 'Available' : 'Sold Out'}
                        </span>
                        
                        {item.submissionStatus !== 'approved' && (
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                    item.submissionStatus === 'pending'
                                        ? 'bg-[#fffbeb] text-[#d97706] dark:bg-[#382606] dark:text-[#fbbf24] border border-[#fef08a] dark:border-[#524419]'
                                        : 'bg-[#fff1f2] text-[#e11d48] dark:bg-[#3b1118] dark:text-[#fb7185] border border-[#fecdd3] dark:border-[#5c2328]'
                                }`}
                            >
                                {capitalizeWords(item.submissionStatus)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='p-3 sm:p-4 pt-0'>
                <div className='flex gap-1.5 sm:gap-2 pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                    <Link
                        prefetch={false}
                        href={`store/${item.slug}`}
                        className='flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                    >
                        <Eye className='w-3.5 h-3.5' />
                        <span>View Details</span>
                    </Link>

                    {item.whatsapp && (
                        <a
                            href={`https://wa.me/91${item.whatsapp}?text=${encodeURIComponent(`Hey! I came from StudentSenior. I want to know about the "${item.name}" listed on StudentSenior.`)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] hover:bg-[#d8f2dc] dark:hover:bg-[#1c472a] border border-[#d2f0d9] dark:border-[#205130] transition-colors shadow-xs'
                            title='Contact on WhatsApp'
                            aria-label='Contact on WhatsApp'
                        >
                            <MessageCircle className='w-4 h-4' />
                        </a>
                    )}

                    {ownerId === item.owner?._id && (
                        <>
                            <button
                                onClick={() => onEdit(item)}
                                aria-label='Edit item'
                                className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#fffbeb] dark:bg-[#382606] text-[#d97706] dark:text-[#fbbf24] hover:bg-[#fef3c7] dark:hover:bg-[#451a03] border border-[#fef08a] dark:border-[#524419] transition-colors'
                            >
                                <Edit className='w-3.5 h-3.5' />
                            </button>
                            <button
                                onClick={() => onDelete(item._id)}
                                aria-label='Delete item'
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
