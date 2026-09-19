import React from 'react';
import { formatDate } from '@/utils/formatting';
import { ILostFoundItem } from '@/utils/interface';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin,
    Calendar,
    ArrowRight,
    Pencil,
    Trash2,
    PackageSearch,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';

export const LostFoundCard = ({
    item,
    openModal,
    handleDeleteRequest,
    ownerId,
    collegeName,
}: {
    item: ILostFoundItem;
    openModal: (item: ILostFoundItem) => void;
    handleDeleteRequest: (itemId: string) => void;
    ownerId: string;
    collegeName?: string;
}) => {
    const isOwner = ownerId === item.owner?._id;
    const detailUrl = collegeName
        ? `/${collegeName}/lost-found/${item.slug}`
        : `lost-found/${item.slug}`;

    return (
        <article
            className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#d0ceca] dark:hover:border-[#383838] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between h-full group'
            aria-label={item.title}
        >
            {/* Top Content */}
            <div>
                {/* Header: Badges and Owner Controls */}
                <div className='flex items-center justify-between gap-2 mb-3'>
                    <div className='flex items-center gap-1.5 flex-wrap'>
                        {/* Type Badge */}
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-md border ${
                                item.type === 'lost'
                                    ? 'bg-[#fdf2f2] text-[#e11d48] dark:bg-[#3b1118] dark:text-[#fb7185] border-[#fecdd3] dark:border-[#5c2328]'
                                    : 'bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80] border-[#d2f0d9] dark:border-[#205130]'
                            }`}
                        >
                            {item.type === 'lost' ? (
                                <AlertCircle className='w-3 h-3' />
                            ) : (
                                <CheckCircle2 className='w-3 h-3' />
                            )}
                            <span className='capitalize'>{item.type}</span>
                        </span>

                        {/* Status Badge */}
                        <span
                            className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md border ${
                                item.currentStatus === 'open'
                                    ? 'bg-[#eaf3fd] text-[#0075de] dark:bg-[#183153] dark:text-[#62aef0] border-[#d2e4f9] dark:border-[#224474]'
                                    : 'bg-[#f6f5f4] text-[#615d59] dark:bg-[#282828] dark:text-[#a09e9a] border-[#e6e6e6] dark:border-[#383838]'
                            }`}
                        >
                            {item.currentStatus === 'open' ? 'Active' : 'Resolved'}
                        </span>
                    </div>

                    {/* Owner Edit / Delete */}
                    {isOwner && (
                        <div className='flex items-center gap-1 shrink-0'>
                            <button
                                onClick={() => openModal(item)}
                                className='p-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white transition-all shadow-xs active:scale-[0.95]'
                                title='Edit item'
                                aria-label={`Edit item: ${item.title}`}
                            >
                                <Pencil className='w-3.5 h-3.5' />
                            </button>
                            <button
                                onClick={() => handleDeleteRequest(item._id)}
                                className='p-1.5 rounded-lg border border-[#fecdd3] dark:border-[#5c2328] bg-[#fff1f2] dark:bg-[#3b1118] hover:bg-[#ffe4e6] dark:hover:bg-[#4c0519] text-[#e11d48] dark:text-[#fb7185] transition-all shadow-xs active:scale-[0.95]'
                                title='Delete item'
                                aria-label={`Delete item: ${item.title}`}
                            >
                                <Trash2 className='w-3.5 h-3.5' />
                            </button>
                        </div>
                    )}
                </div>

                {/* Item Image */}
                <Link
                    prefetch={false}
                    href={detailUrl}
                    className='block mb-3.5 overflow-hidden rounded-xl border border-[#f0eee9] dark:border-[#2b2b2b] relative group/img'
                >
                    {item.imageUrl ? (
                        <div className='relative w-full aspect-[16/10] bg-[#f6f5f4] dark:bg-[#242424]'>
                            <Image
                                src={item.imageUrl}
                                alt={item.title || 'Lost & Found Item'}
                                fill
                                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                className='object-cover group-hover/img:scale-[1.03] transition-transform duration-300'
                            />
                        </div>
                    ) : (
                        <div className='w-full aspect-[16/10] bg-[#faf9f8] dark:bg-[#222222] flex flex-col items-center justify-center text-[#8c8883] dark:text-[#6b6965] gap-1.5'>
                            <PackageSearch className='w-8 h-8 stroke-1' />
                            <span className='text-[11px] font-medium'>No image provided</span>
                        </div>
                    )}
                </Link>

                {/* Title */}
                <Link prefetch={false} href={detailUrl} className='block group/link mb-2'>
                    <h2 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white group-hover/link:text-[#0075de] dark:group-hover/link:text-[#62aef0] transition-colors line-clamp-1'>
                        {item.title}
                    </h2>
                </Link>

                {/* Description */}
                <p className='text-xs sm:text-sm text-[#475467] dark:text-[#a09e9a] line-clamp-2 leading-relaxed mb-3.5'>
                    {item.description}
                </p>

                {/* Location and Date Chips */}
                <div className='flex flex-wrap gap-2 text-xs text-[#615d59] dark:text-[#a09e9a] mb-4'>
                    <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f6f5f4] dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] truncate max-w-[200px]'>
                        <MapPin className='w-3 h-3 text-[#e11d48] shrink-0' />
                        <span className='truncate'>{item.location}</span>
                    </span>
                    <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f6f5f4] dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838]'>
                        <Calendar className='w-3 h-3 text-[#8a3fd6] shrink-0' />
                        <span>{formatDate(item.date)}</span>
                    </span>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className='border-t border-[#f0eee9] dark:border-[#2a2a2a] pt-3 mt-auto'>
                <div className='flex items-center justify-between gap-2'>
                    {/* Poster Info */}
                    <div className='flex items-center gap-2 min-w-0'>
                        <div className='w-6 h-6 rounded-lg bg-[#eaf3fd] dark:bg-[#183153] border border-[#d2e4f9] dark:border-[#224474] text-[#0075de] dark:text-[#62aef0] text-[11px] font-bold flex items-center justify-center shrink-0'>
                            {(item.owner?.username || 'A')[0].toUpperCase()}
                        </div>
                        <p className='text-xs font-semibold text-[#101828] dark:text-[#ededed] truncate'>
                            {item.owner?.username || 'Anonymous'}
                        </p>
                    </div>

                    {/* View Details Link */}
                    <Link
                        prefetch={false}
                        href={detailUrl}
                        className='inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#101828] dark:text-[#ededed] border border-[#e6e6e6] dark:border-[#383838] rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-[0.98] shrink-0 group/btn'
                    >
                        <span>Details</span>
                        <ArrowRight className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672] group-hover/btn:translate-x-0.5 transition-transform' />
                    </Link>
                </div>
            </div>
        </article>
    );
};

