import React from 'react';
import { IWhatsAppGroup } from '@/utils/interface';
import { MessageCircle, ExternalLink, Pencil, Trash2, Users } from 'lucide-react';

export const GroupCard = ({
    group,
    openModal,
    handleDeleteRequest,
    ownerId,
}: {
    group: IWhatsAppGroup;
    openModal: (group: IWhatsAppGroup) => void;
    handleDeleteRequest: (groupId: string) => void;
    ownerId: string;
}) => {
    const isOwner = ownerId === group.owner;

    return (
        <article
            className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#d0ceca] dark:hover:border-[#383838] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between h-full group'
            aria-label={group.title}
        >
            {/* Top Content */}
            <div>
                {/* Domain & Group Badge */}
                <div className='flex items-center justify-between gap-2 mb-3'>
                    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0075de] dark:text-[#62aef0] bg-[#eaf3fd] dark:bg-[#183153]/70 border border-[#d2e4f9]/60 dark:border-[#224474]/60 rounded-lg'>
                        <Users className='w-3.5 h-3.5' />
                        <span>{group.domain || 'Community'}</span>
                    </span>

                    <span className='inline-flex items-center gap-1 text-[11px] font-medium text-[#1aae39] dark:text-[#4ade80] bg-[#eaf7ec] dark:bg-[#163821] px-2 py-0.5 rounded-md border border-[#d2f0d9] dark:border-[#205130]'>
                        <span className='w-1.5 h-1.5 rounded-full bg-[#1aae39] animate-pulse'></span>
                        WhatsApp
                    </span>
                </div>

                {/* Group Title */}
                <h2 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors line-clamp-2 mb-2'>
                    {group.title}
                </h2>

                {/* Group Description */}
                <p className='text-xs sm:text-sm text-[#475467] dark:text-[#a09e9a] line-clamp-3 leading-relaxed mb-4'>
                    {group.info}
                </p>
            </div>

            {/* Bottom Actions */}
            <div className='border-t border-[#f0eee9] dark:border-[#2a2a2a] pt-4 mt-auto'>
                <div className='flex items-center gap-2'>
                    {/* Join Group Button */}
                    <a
                        href={group.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1aae39] hover:bg-[#169631] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98]'
                        aria-label={`Join WhatsApp group: ${group.title}`}
                    >
                        <MessageCircle className='w-4 h-4' />
                        <span>Join Group</span>
                        <ExternalLink className='w-3.5 h-3.5 opacity-80' />
                    </a>

                    {/* Owner Action Buttons */}
                    {isOwner && (
                        <div className='flex items-center gap-1.5'>
                            <button
                                onClick={() => openModal(group)}
                                className='p-2.5 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white transition-all shadow-xs active:scale-[0.95]'
                                title='Edit group'
                                aria-label={`Edit group: ${group.title}`}
                            >
                                <Pencil className='w-4 h-4' />
                            </button>
                            <button
                                onClick={() => handleDeleteRequest(group._id)}
                                className='p-2.5 rounded-xl border border-[#fecdd3] dark:border-[#5c2328] bg-[#fff1f2] dark:bg-[#3b1118] hover:bg-[#ffe4e6] dark:hover:bg-[#4c0519] text-[#e11d48] dark:text-[#fb7185] transition-all shadow-xs active:scale-[0.95]'
                                title='Delete group'
                                aria-label={`Delete group: ${group.title}`}
                            >
                                <Trash2 className='w-4 h-4' />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};
