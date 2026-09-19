import React from 'react';
import { formatDate } from '@/utils/formatting';
import { IOpportunity } from '@/utils/interface';
import {
    Mail,
    Phone,
    Link as LinkIcon,
    Pencil,
    Trash2,
    ArrowRight,
    Briefcase,
} from 'lucide-react';
import Link from 'next/link';

export const OpportunityCard = ({
    opportunity,
    openModal,
    handleDeleteRequest,
    ownerId,
    collegeName,
}: {
    opportunity: IOpportunity;
    openModal: (opportunity: IOpportunity) => void;
    handleDeleteRequest: (opportunityId: string) => void;
    ownerId: string;
    collegeName: string;
}) => {
    const isOwner = ownerId === opportunity.owner?._id;
    const detailUrl = `/${collegeName}/opportunities/${opportunity.slug}`;

    return (
        <article
            className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#d0ceca] dark:hover:border-[#383838] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between h-full group'
            aria-label={opportunity.name}
        >
            {/* Top Content */}
            <div>
                {/* Header with Title and Owner Controls */}
                <div className='flex items-start justify-between gap-3 mb-2.5'>
                    <Link
                        prefetch={false}
                        href={detailUrl}
                        className='flex-1 block group/link'
                    >
                        <div className='inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-[#0075de] dark:text-[#62aef0] bg-[#eaf3fd] dark:bg-[#183153]/70 border border-[#d2e4f9]/60 dark:border-[#224474]/60 rounded-md mb-2'>
                            <Briefcase className='w-3 h-3' />
                            <span>Opportunity</span>
                        </div>
                        <h2 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white group-hover/link:text-[#0075de] dark:group-hover/link:text-[#62aef0] transition-colors line-clamp-2'>
                            {opportunity.name}
                        </h2>
                    </Link>

                    {isOwner && (
                        <div className='flex items-center gap-1 shrink-0'>
                            <button
                                onClick={() => openModal(opportunity)}
                                className='p-2 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white transition-all shadow-xs active:scale-[0.95]'
                                title='Edit opportunity'
                                aria-label={`Edit opportunity: ${opportunity.name}`}
                            >
                                <Pencil className='w-3.5 h-3.5' />
                            </button>
                            <button
                                onClick={() => handleDeleteRequest(opportunity._id)}
                                className='p-2 rounded-lg border border-[#fecdd3] dark:border-[#5c2328] bg-[#fff1f2] dark:bg-[#3b1118] hover:bg-[#ffe4e6] dark:hover:bg-[#4c0519] text-[#e11d48] dark:text-[#fb7185] transition-all shadow-xs active:scale-[0.95]'
                                title='Delete opportunity'
                                aria-label={`Delete opportunity: ${opportunity.name}`}
                            >
                                <Trash2 className='w-3.5 h-3.5' />
                            </button>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className='text-xs sm:text-sm text-[#475467] dark:text-[#a09e9a] line-clamp-3 leading-relaxed mb-4'>
                    {opportunity.description}
                </p>

                {/* Contact Chips */}
                <div className='flex flex-wrap gap-1.5 mb-4'>
                    {opportunity.email && (
                        <a
                            href={`mailto:${opportunity.email}`}
                            className='inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#475467] dark:text-[#a09e9a] hover:text-[#0075de] dark:hover:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] transition-colors truncate max-w-[200px]'
                            title={opportunity.email}
                        >
                            <Mail className='w-3 h-3 text-[#0075de]' />
                            <span className='truncate'>{opportunity.email}</span>
                        </a>
                    )}
                    {opportunity.whatsapp && (
                        <a
                            href={`https://wa.me/${opportunity.whatsapp}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] hover:bg-[#d8f2dc] dark:hover:bg-[#1c472a] border border-[#d2f0d9] dark:border-[#205130] transition-colors'
                            title='Chat on WhatsApp'
                        >
                            <Phone className='w-3 h-3' />
                            <span>WhatsApp</span>
                        </a>
                    )}
                    {opportunity.link && (
                        <a
                            href={opportunity.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#475467] dark:text-[#a09e9a] hover:text-[#0075de] dark:hover:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] transition-colors'
                            title='External Link'
                        >
                            <LinkIcon className='w-3 h-3 text-[#8a3fd6]' />
                            <span>Link</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Bottom Footer */}
            <div className='border-t border-[#f0eee9] dark:border-[#2a2a2a] pt-4 mt-auto'>
                <div className='flex items-center justify-between gap-2'>
                    {/* Poster Info */}
                    <div className='flex items-center gap-2 min-w-0'>
                        <div className='w-7 h-7 rounded-lg bg-[#eaf3fd] dark:bg-[#183153] border border-[#d2e4f9] dark:border-[#224474] text-[#0075de] dark:text-[#62aef0] text-xs font-bold flex items-center justify-center shrink-0'>
                            {(opportunity.owner?.username || 'A')[0].toUpperCase()}
                        </div>
                        <div className='min-w-0'>
                            <p className='text-xs font-semibold text-[#101828] dark:text-[#ededed] truncate'>
                                {opportunity.owner?.username || 'Anonymous'}
                            </p>
                            <p className='text-[11px] text-[#8c8883] dark:text-[#787672]'>
                                {formatDate(opportunity.createdAt)}
                            </p>
                        </div>
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
