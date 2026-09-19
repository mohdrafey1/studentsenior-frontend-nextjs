'use client';
import React from 'react';
import { ISenior } from '@/utils/interface';
import {
    Linkedin,
    Github,
    Globe,
    Youtube,
    Send,
    MessageCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SeniorCardProps {
    senior: ISenior;
    onEdit: (senior: ISenior) => void;
    onDelete: (seniorId: string) => void;
    ownerId: string;
}

export const SeniorCard: React.FC<SeniorCardProps> = ({
    senior,
    // onEdit,
    // onDelete,
    // ownerId,
}) => {
    const formatSocialMediaLink = (platform: string, url: string) => {
        switch (platform.toLowerCase()) {
            case 'whatsapp':
                const message = encodeURIComponent(
                    'Hey! I came from StudentSenior. I would like to connect with you.',
                );
                return `https://wa.me/${url}?text=${message}`;
            case 'telegram':
                return `https://t.me/${url}`;
            case 'linkedin':
            case 'github':
            case 'youtube':
            case 'website':
                return url;
            default:
                return url;
        }
    };

    const renderSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'whatsapp':
                return <MessageCircle size={20} className='text-green-600' />;
            case 'telegram':
                return <Send size={20} className='text-sky-500' />;
            case 'github':
                return (
                    <Github
                        size={20}
                        className='text-gray-800 dark:text-gray-200'
                    />
                );
            case 'youtube':
                return <Youtube size={20} className='text-red-600' />;
            case 'linkedin':
                return <Linkedin size={20} className='text-blue-600' />;
            default:
                return <Globe size={20} className='text-gray-600' />;
        }
    };

    return (
        <article className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full flex flex-col justify-between'>
            <div className='flex flex-col flex-grow'>
                {/* Profile Cover and Image */}
                <div className='relative h-24 bg-[#f6f5f4] dark:bg-[#191919] border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                    <div className='absolute -bottom-10 left-4'>
                        {senior.profilePicture ? (
                            <Image
                                src={senior.profilePicture}
                                alt={senior.name}
                                width={80}
                                height={80}
                                className='w-20 h-20 rounded-xl border-4 border-white dark:border-[#202020] object-cover bg-white dark:bg-gray-800'
                            />
                        ) : (
                            <div className='w-20 h-20 rounded-xl border-4 border-white dark:border-[#202020] bg-[#eaf3fd] dark:bg-[#183153] flex items-center justify-center'>
                                <span className='text-2xl font-bold text-[#0075de] dark:text-[#62aef0]'>
                                    {senior.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className='p-4 pt-12 space-y-3 flex-grow flex flex-col'>
                    {/* Header Info */}
                    <div className='space-y-1'>
                        <h3 className='text-lg font-bold text-[#101828] dark:text-white group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors line-clamp-1'>
                            {senior.name}
                        </h3>
                        {senior.domain && (
                            <p className='text-sm text-[#475467] dark:text-[#9ea3ae] line-clamp-1'>
                                {senior.domain}
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className='flex flex-wrap gap-1.5 pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#eaf3fd] text-[#0075de] dark:bg-[#183153] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474]'>
                            {senior.year}
                        </span>
                        <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f6f5f4] text-[#475467] dark:bg-[#2b2b2b] dark:text-[#9ea3ae] border border-[#e6e6e6] dark:border-[#3b3b3b] max-w-[150px] truncate'>
                            {senior.branch?.branchCode || 'Tech'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='p-4 pt-0'>
                <div className='flex gap-2 pt-3 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                    <Link
                        prefetch={false}
                        href={`seniors/${senior.slug}`}
                        className='flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                    >
                        <span>View Profile</span>
                    </Link>

                    {senior.socialMediaLinks && senior.socialMediaLinks.length > 0 && (
                        <a
                            href={formatSocialMediaLink(
                                senior.socialMediaLinks[0].platform,
                                senior.socialMediaLinks[0].url
                            )}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium bg-[#f6f5f4] dark:bg-[#2b2b2b] text-[#475467] dark:text-[#9ea3ae] hover:bg-[#eae9e8] dark:hover:bg-[#3b3b3b] border border-[#e6e6e6] dark:border-[#3b3b3b] transition-colors shadow-xs'
                            title={`Connect on ${senior.socialMediaLinks[0].platform}`}
                        >
                            {renderSocialIcon(senior.socialMediaLinks[0].platform)}
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
};
