'use client';

import React, { useState } from 'react';
import { ILostFoundItem } from '@/utils/interface';
import {
    Phone,
    Calendar,
    ExternalLink,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Building2,
    Check,
    Copy,
    ShieldAlert,
    FileText,
    Send,
    PackageSearch,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { formatDate, capitalizeWords } from '@/utils/formatting';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';
import { useParams } from 'next/navigation';

interface LostFoundDetailClientProps {
    lostFoundItem: ILostFoundItem;
}

const LostFoundDetailClient: React.FC<LostFoundDetailClientProps> = ({
    lostFoundItem,
}) => {
    const params = useParams();
    const slug = params?.slug as string | undefined;
    const [copiedPhone, setCopiedPhone] = useState(false);

    const handleCopyPhone = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!lostFoundItem.whatsapp) return;
        navigator.clipboard.writeText(lostFoundItem.whatsapp);
        setCopiedPhone(true);
        toast.success('WhatsApp number copied!');
        setTimeout(() => setCopiedPhone(false), 2000);
    };

    const collegeRaw = lostFoundItem.college;
    const collegeDisplayName =
        typeof collegeRaw === 'string'
            ? collegeRaw
            : typeof collegeRaw === 'object' && collegeRaw !== null
              ? collegeRaw.name || collegeRaw.slug || slug || ''
              : slug || '';

    return (
        <div className='min-h-screen bg-[#fcfcfc] dark:bg-[#151515] text-[#101828] dark:text-[#ededed]'>
            {/* Header Nav */}
            <DetailPageNavbar
                path='lost-found'
                fullPath={slug ? `/${slug}/lost-found` : undefined}
            />

            <main className='max-w-6xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8'>
                {/* Compact Info Header Card */}
                <div className='bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'>
                    <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
                        {/* Title & Category */}
                        <div className='flex-1 min-w-0'>
                            <div className='flex flex-wrap items-center gap-2 mb-2'>
                                {/* Type Badge */}
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                                        lostFoundItem.type === 'lost'
                                            ? 'bg-[#fdf2f2] text-[#e11d48] dark:bg-[#3b1118] dark:text-[#fb7185] border-[#fecdd3] dark:border-[#5c2328]'
                                            : 'bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80] border-[#d2f0d9] dark:border-[#205130]'
                                    }`}
                                >
                                    {lostFoundItem.type === 'lost' ? (
                                        <AlertCircle className='w-3.5 h-3.5' />
                                    ) : (
                                        <CheckCircle2 className='w-3.5 h-3.5' />
                                    )}
                                    <span>{lostFoundItem.type === 'lost' ? 'Lost Item' : 'Found Item'}</span>
                                </span>

                                {/* Status Badge */}
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                                        lostFoundItem.currentStatus === 'open'
                                            ? 'bg-[#eaf3fd] text-[#0075de] dark:bg-[#183153] dark:text-[#62aef0] border-[#d2e4f9] dark:border-[#224474]'
                                            : 'bg-[#f6f5f4] text-[#615d59] dark:bg-[#282828] dark:text-[#a09e9a] border-[#e6e6e6] dark:border-[#383838]'
                                    }`}
                                >
                                    {lostFoundItem.currentStatus === 'open' ? 'Active Status' : 'Resolved'}
                                </span>

                                {collegeDisplayName && (
                                    <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] text-xs font-medium border border-[#e6e6e6] dark:border-[#383838]'>
                                        <Building2 className='w-3 h-3 text-[#e58b00]' />
                                        <span>{capitalizeWords(collegeDisplayName)}</span>
                                    </span>
                                )}
                            </div>

                            <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-[#101828] dark:text-white tracking-tight mb-3 leading-snug'>
                                {lostFoundItem.title}
                            </h1>

                            {/* Meta Badges */}
                            <div className='flex flex-wrap items-center gap-2 text-xs'>
                                <div className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#475467] dark:text-[#a39e98] border border-[#e6e6e6] dark:border-[#383838] font-medium'>
                                    <div className='w-4 h-4 rounded bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] font-bold text-[9px] flex items-center justify-center shrink-0'>
                                        {(lostFoundItem.owner?.username || 'A')[0].toUpperCase()}
                                    </div>
                                    <span>
                                        Posted by{' '}
                                        <strong className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                            {lostFoundItem.owner?.username || 'Anonymous'}
                                        </strong>
                                    </span>
                                </div>

                                <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838]'>
                                    <MapPin className='w-3 h-3 text-[#e11d48]' />
                                    <span>{lostFoundItem.location}</span>
                                </span>

                                <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838]'>
                                    <Calendar className='w-3 h-3 text-[#8a3fd6]' />
                                    <span>{formatDate(lostFoundItem.date)}</span>
                                </span>
                            </div>
                        </div>

                        {/* Top Quick Actions */}
                        <div className='flex flex-wrap items-center gap-2 shrink-0 md:self-start'>
                            {lostFoundItem.whatsapp && (
                                <a
                                    href={`https://wa.me/${lostFoundItem.whatsapp}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#eaf7ec] dark:bg-[#163821] hover:bg-[#d8f2dc] dark:hover:bg-[#1c472a] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]'
                                    title='Contact via WhatsApp'
                                >
                                    <Phone className='w-3.5 h-3.5' />
                                    <span>WhatsApp</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2-Column Main Content & Sidebar */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5'>
                    {/* Left Column: Image & Description */}
                    <div className='lg:col-span-2 space-y-4'>
                        {/* Image Card (if available) */}
                        {lostFoundItem.imageUrl && (
                            <div className='bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-3 sm:p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'>
                                <div className='relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden bg-[#faf9f8] dark:bg-[#222222]'>
                                    <Image
                                        src={lostFoundItem.imageUrl}
                                        alt={lostFoundItem.title}
                                        fill
                                        sizes='(max-width: 1024px) 100vw, 66vw'
                                        className='object-contain'
                                        priority
                                    />
                                </div>
                            </div>
                        )}

                        {/* Description Card */}
                        <div className='bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'>
                            <div className='flex items-center gap-2 pb-3 mb-3 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                                <FileText className='w-4 h-4 text-[#0075de] dark:text-[#62aef0]' />
                                <h2 className='text-xs font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                                    Item Description & Details
                                </h2>
                            </div>

                            <div className='text-xs sm:text-sm text-[#374151] dark:text-[#d1d5db] leading-relaxed whitespace-pre-wrap font-normal'>
                                {lostFoundItem.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact & Recovery Info */}
                    <div className='space-y-4'>
                        {/* Contact Card */}
                        <div className='bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'>
                            <div className='flex items-center gap-2 pb-3 mb-3 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                                <Send className='w-4 h-4 text-[#1aae39]' />
                                <h2 className='text-xs font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                                    Contact Poster
                                </h2>
                            </div>

                            <p className='text-xs text-[#615d59] dark:text-[#a09e9a] mb-3'>
                                Have information about this item or looking to claim it? Contact the poster directly:
                            </p>

                            <div className='space-y-2.5'>
                                {/* WhatsApp Contact */}
                                {lostFoundItem.whatsapp && (
                                    <div className='flex items-center justify-between p-2.5 rounded-lg border border-[#d2f0d9] dark:border-[#205130] bg-[#eaf7ec]/50 dark:bg-[#163821]/40'>
                                        <a
                                            href={`https://wa.me/${lostFoundItem.whatsapp}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex items-center gap-2.5 min-w-0 flex-1 hover:text-[#1aae39] transition-colors group'
                                            title='Click to open WhatsApp'
                                        >
                                            <div className='p-1.5 rounded-md bg-[#1aae39] text-white shrink-0'>
                                                <Phone className='w-3.5 h-3.5' />
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p className='text-[10px] font-semibold text-[#1aae39] dark:text-[#4ade80] uppercase tracking-wider'>
                                                    WhatsApp
                                                </p>
                                                <p className='text-xs font-medium text-[#101828] dark:text-[#ededed] group-hover:text-[#1aae39] truncate'>
                                                    {lostFoundItem.whatsapp}
                                                </p>
                                            </div>
                                        </a>
                                        <button
                                            onClick={handleCopyPhone}
                                            className='p-1.5 text-[#8c8883] hover:text-[#1aae39] rounded-md hover:bg-[#d8f2dc] dark:hover:bg-[#1e482b] transition-colors ml-1 shrink-0'
                                            title='Copy WhatsApp number'
                                            aria-label='Copy WhatsApp'
                                        >
                                            {copiedPhone ? (
                                                <Check className='w-3.5 h-3.5 text-[#1aae39]' />
                                            ) : (
                                                <Copy className='w-3.5 h-3.5' />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Details Card */}
                        <div className='bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3'>
                            <div className='flex items-center gap-2 pb-2.5 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                                <PackageSearch className='w-4 h-4 text-[#0075de]' />
                                <h3 className='text-xs font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                                    Recovery Details
                                </h3>
                            </div>

                            <div className='space-y-2 text-xs'>
                                <div className='flex items-start justify-between gap-2 py-1'>
                                    <span className='text-[#8c8883] dark:text-[#787672]'>Reported On</span>
                                    <span className='font-semibold text-[#101828] dark:text-[#ededed] text-right'>
                                        {formatDate(lostFoundItem.date)}
                                    </span>
                                </div>
                                <div className='flex items-start justify-between gap-2 py-1 border-t border-[#f6f5f4] dark:border-[#262626]'>
                                    <span className='text-[#8c8883] dark:text-[#787672]'>Location</span>
                                    <span className='font-semibold text-[#101828] dark:text-[#ededed] text-right'>
                                        {lostFoundItem.location}
                                    </span>
                                </div>
                                <div className='flex items-start justify-between gap-2 py-1 border-t border-[#f6f5f4] dark:border-[#262626]'>
                                    <span className='text-[#8c8883] dark:text-[#787672]'>Status</span>
                                    <span className='font-semibold text-[#101828] dark:text-[#ededed] text-right capitalize'>
                                        {lostFoundItem.currentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Safety & Campus Tip */}
                        <div className='p-3.5 rounded-xl bg-[#faf9f8] dark:bg-[#202020] border border-[#f0eee6] dark:border-[#2b2b2b] text-[11px] text-[#615d59] dark:text-[#a09e9a] space-y-1.5'>
                            <div className='flex items-center gap-1.5 font-semibold text-[#101828] dark:text-white'>
                                <ShieldAlert className='w-3.5 h-3.5 text-[#e58b00]' />
                                <span>Verification Advice</span>
                            </div>
                            <p className='leading-relaxed'>
                                When claiming lost items, always provide specific identification proof (e.g., student ID, photo, serial number, or detailed description) before meeting in a public campus area.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LostFoundDetailClient;

