'use client';

import React, { useState } from 'react';
import { IOpportunity } from '@/utils/interface';
import {
    Mail,
    Phone,
    Link as LinkIcon,
    Calendar,
    ExternalLink,
    Briefcase,
    Building2,
    Check,
    Copy,
    ShieldAlert,
    FileText,
    Send,
} from 'lucide-react';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';
import { useParams } from 'next/navigation';
import { formatDate, capitalizeWords } from '@/utils/formatting';
import toast from 'react-hot-toast';

interface OpportunityDetailClientProps {
    opportunity: IOpportunity;
}

const OpportunityDetailClient: React.FC<OpportunityDetailClientProps> = ({
    opportunity,
}) => {
    const params = useParams();
    const slug = params?.slug as string | undefined;
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!opportunity.email) return;
        navigator.clipboard.writeText(opportunity.email);
        setCopiedEmail(true);
        toast.success('Email copied to clipboard!');
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleCopyPhone = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!opportunity.whatsapp) return;
        navigator.clipboard.writeText(opportunity.whatsapp);
        setCopiedPhone(true);
        toast.success('WhatsApp number copied!');
        setTimeout(() => setCopiedPhone(false), 2000);
    };

    const collegeDisplayName =
        typeof opportunity.college === 'string'
            ? opportunity.college
            : (opportunity.college as any)?.name ||
              (opportunity.college as any)?.slug ||
              slug ||
              '';

    return (
        <div className='min-h-screen bg-[#fcfcfc] dark:bg-[#151515] text-[#101828] dark:text-[#ededed]'>
            {/* Header Nav */}
            <DetailPageNavbar
                path='opportunities'
                fullPath={slug ? `/${slug}/opportunities` : undefined}
            />

            <main className='max-w-6xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8'>
                {/* Compact Info Header Card */}
                <div className='bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'>
                    <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
                        {/* Title & Category */}
                        <div className='flex-1 min-w-0'>
                            <div className='flex flex-wrap items-center gap-2 mb-2'>
                                <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#eaf3fd] dark:bg-[#183153]/70 text-[#0075de] dark:text-[#62aef0] text-xs font-semibold border border-[#d2e4f9]/60 dark:border-[#224474]/60'>
                                    <Briefcase className='w-3 h-3' />
                                    <span>Career Opportunity</span>
                                </span>
                                {collegeDisplayName && (
                                    <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] text-xs font-medium border border-[#e6e6e6] dark:border-[#383838]'>
                                        <Building2 className='w-3 h-3 text-[#e58b00]' />
                                        <span>{capitalizeWords(collegeDisplayName)}</span>
                                    </span>
                                )}
                            </div>

                            <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-[#101828] dark:text-white tracking-tight mb-3 leading-snug'>
                                {opportunity.name}
                            </h1>

                            {/* Meta Badges */}
                            <div className='flex flex-wrap items-center gap-2 text-xs'>
                                <div className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#475467] dark:text-[#a39e98] border border-[#e6e6e6] dark:border-[#383838] font-medium'>
                                    <div className='w-4 h-4 rounded bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] font-bold text-[9px] flex items-center justify-center shrink-0'>
                                        {(opportunity.owner?.username || 'A')[0].toUpperCase()}
                                    </div>
                                    <span>
                                        Posted by{' '}
                                        <strong className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                            {opportunity.owner?.username || 'Anonymous'}
                                        </strong>
                                    </span>
                                </div>

                                <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838]'>
                                    <Calendar className='w-3 h-3 text-[#8a3fd6]' />
                                    <span>{formatDate(opportunity.createdAt)}</span>
                                </span>
                            </div>
                        </div>

                        {/* Top Quick Actions */}
                        <div className='flex flex-wrap items-center gap-2 shrink-0 md:self-start'>
                            {opportunity.link && (
                                <a
                                    href={opportunity.link}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.98]'
                                    title='Visit Official Application'
                                >
                                    <span>Apply Now</span>
                                    <ExternalLink className='w-3.5 h-3.5' />
                                </a>
                            )}
                            {opportunity.whatsapp && (
                                <a
                                    href={`https://wa.me/${opportunity.whatsapp}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eaf7ec] dark:bg-[#163821] hover:bg-[#d8f2dc] dark:hover:bg-[#1c472a] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]'
                                    title='Chat on WhatsApp'
                                >
                                    <Phone className='w-3.5 h-3.5' />
                                    <span>WhatsApp</span>
                                </a>
                            )}
                            {opportunity.email && (
                                <a
                                    href={`mailto:${opportunity.email}`}
                                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#101828] dark:text-[#ededed] border border-[#e6e6e6] dark:border-[#383838] text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]'
                                    title='Send Email'
                                >
                                    <Mail className='w-3.5 h-3.5 text-[#0075de]' />
                                    <span>Email</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2-Column Main Content & Sidebar */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5'>
                    {/* Left Column: Description & Details */}
                    <div className='lg:col-span-2 space-y-4'>
                        <div className='bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'>
                            <div className='flex items-center gap-2 pb-3 mb-3 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                                <FileText className='w-4 h-4 text-[#0075de] dark:text-[#62aef0]' />
                                <h2 className='text-xs font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                                    Role Description & Details
                                </h2>
                            </div>

                            <div className='text-xs sm:text-sm text-[#374151] dark:text-[#d1d5db] leading-relaxed whitespace-pre-wrap font-normal'>
                                {opportunity.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Cards & Tips */}
                    <div className='space-y-4'>
                        {/* Contact Channels Card */}
                        <div className='bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'>
                            <div className='flex items-center gap-2 pb-3 mb-3 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                                <Send className='w-4 h-4 text-[#1aae39]' />
                                <h2 className='text-xs font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                                    Contact & Application
                                </h2>
                            </div>

                            <div className='space-y-2.5'>
                                {/* Email */}
                                {opportunity.email && (
                                    <div className='flex items-center justify-between p-2.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#222222]'>
                                        <a
                                            href={`mailto:${opportunity.email}`}
                                            className='flex items-center gap-2.5 min-w-0 flex-1 hover:text-[#0075de] dark:hover:text-[#62aef0] transition-colors group'
                                            title='Click to compose email'
                                        >
                                            <div className='p-1.5 rounded-md bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] shrink-0'>
                                                <Mail className='w-3.5 h-3.5' />
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p className='text-[10px] font-semibold text-[#8c8883] dark:text-[#787672] uppercase tracking-wider'>
                                                    Email
                                                </p>
                                                <p className='text-xs font-medium text-[#101828] dark:text-[#ededed] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] truncate'>
                                                    {opportunity.email}
                                                </p>
                                            </div>
                                        </a>
                                        <button
                                            onClick={handleCopyEmail}
                                            className='p-1.5 text-[#8c8883] hover:text-[#101828] dark:hover:text-white rounded-md hover:bg-[#ededeb] dark:hover:bg-[#2e2e2e] transition-colors ml-1 shrink-0'
                                            title='Copy email address'
                                            aria-label='Copy email'
                                        >
                                            {copiedEmail ? (
                                                <Check className='w-3.5 h-3.5 text-[#1aae39]' />
                                            ) : (
                                                <Copy className='w-3.5 h-3.5' />
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* WhatsApp */}
                                {opportunity.whatsapp && (
                                    <div className='flex items-center justify-between p-2.5 rounded-lg border border-[#d2f0d9] dark:border-[#205130] bg-[#eaf7ec]/50 dark:bg-[#163821]/40'>
                                        <a
                                            href={`https://wa.me/${opportunity.whatsapp}`}
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
                                                    {opportunity.whatsapp}
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

                                {/* Application Link */}
                                {opportunity.link && (
                                    <a
                                        href={opportunity.link}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center justify-between p-2.5 rounded-lg border border-[#e2d5f3] dark:border-[#3e2b58] bg-[#f0ebf8]/60 dark:bg-[#2b1f3d]/40 hover:bg-[#e7dcf5] dark:hover:bg-[#34244b] text-[#101828] dark:text-[#ededed] transition-all group'
                                        title='Open external application website'
                                    >
                                        <div className='flex items-center gap-2.5 min-w-0 flex-1'>
                                            <div className='p-1.5 rounded-md bg-[#8a3fd6] text-white shrink-0'>
                                                <LinkIcon className='w-3.5 h-3.5' />
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p className='text-[10px] font-semibold text-[#8a3fd6] dark:text-[#c084fc] uppercase tracking-wider'>
                                                    External Website
                                                </p>
                                                <p className='text-xs font-medium truncate'>
                                                    Visit Application Portal
                                                </p>
                                            </div>
                                        </div>
                                        <ExternalLink className='w-3.5 h-3.5 text-[#8a3fd6] shrink-0' />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Safety & Reminder Card */}
                        <div className='p-3.5 rounded-xl bg-[#faf9f8] dark:bg-[#202020] border border-[#f0eee6] dark:border-[#2b2b2b] text-[11px] text-[#615d59] dark:text-[#a09e9a] space-y-1.5'>
                            <div className='flex items-center gap-1.5 font-semibold text-[#101828] dark:text-white'>
                                <ShieldAlert className='w-3.5 h-3.5 text-[#e58b00]' />
                                <span>Safety Reminder</span>
                            </div>
                            <p className='leading-relaxed'>
                                Never pay any registration or application fee for any job or internship. Always verify official company domains.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OpportunityDetailClient;
