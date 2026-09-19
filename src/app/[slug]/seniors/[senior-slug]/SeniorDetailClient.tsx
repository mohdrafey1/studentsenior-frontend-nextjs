'use client';
import React from 'react';
import { ISenior } from '@/utils/interface';
import { capitalizeWords } from '@/utils/formatting';
import {
    ExternalLink,
    GraduationCap,
    Calendar,
    Globe,
    User,
    MessageCircle,
    MapPin,
    Eye,
    MessageSquare,
} from 'lucide-react';
import Image from 'next/image';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';

interface SeniorDetailClientProps {
    senior: ISenior;
    collegeName: string;
}

const SeniorDetailClient: React.FC<SeniorDetailClientProps> = ({
    senior,
    collegeName,
}) => {
    // --- Helper functions ---
    const getSocialMediaIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'whatsapp':
                return <MessageCircle className='w-4 h-4 sm:w-5 sm:h-5' />;
            case 'telegram':
                return <MessageSquare className='w-4 h-4 sm:w-5 sm:h-5' />;
            default:
                return <ExternalLink className='w-4 h-4 sm:w-5 sm:h-5' />;
        }
    };

    const getSocialMediaColor = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'whatsapp':
                return 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/60';
            case 'telegram':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/60';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800/60';
        }
    };

    const getSocialMediaUrl = (platform: string, url: string) => {
        switch (platform) {
            case 'whatsapp':
                const message = encodeURIComponent(
                    'Hey! I came from StudentSenior. I would like to connect with you.',
                );
                return `https://wa.me/${url}?text=${message}`;
            case 'telegram':
                return `https://t.me/${url}`;
            default:
                return url;
        }
    };

    return (
        <>
            <DetailPageNavbar
                path='seniors'
                fullPath={`/${collegeName}/seniors`}
            />
            <div className='max-w-6xl mx-auto px-4 py-8'>
                <div className='bg-white dark:bg-[#1c1c1c] rounded-xl sm:rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-sm p-4 sm:p-8 mb-6 sm:mb-8'>
                    <div className='flex flex-col lg:flex-row gap-6 sm:gap-8'>
                        {/* Image Section */}
                        <div className='w-full lg:w-1/3 flex-shrink-0'>
                            <div className='aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#f6f5f4] dark:bg-[#191919] border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                {senior.profilePicture ? (
                                    <Image
                                        src={senior.profilePicture}
                                        alt={senior.name}
                                        className='object-cover w-full h-full'
                                        width={600}
                                        height={600}
                                        priority
                                    />
                                ) : (
                                    <div className='w-full h-full flex flex-col items-center justify-center text-[#8c8883] dark:text-[#787672] bg-[#eaf3fd] dark:bg-[#183153]'>
                                        <span className='text-6xl font-bold text-[#0075de] dark:text-[#62aef0]'>
                                            {senior.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Info Section */}
                        <div className='flex-1 flex flex-col'>
                            <div className='flex justify-between items-start mb-2'>
                                <p className='text-sm font-medium text-[#0075de] dark:text-[#62aef0]'>
                                    {senior.domain || 'Tech Enthusiast'}
                                </p>
                                {senior.submissionStatus !== 'approved' && (
                                    <span
                                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                                            senior.submissionStatus === 'pending'
                                                ? 'bg-[#fffbeb] text-[#d97706] dark:bg-[#382606] dark:text-[#fbbf24]'
                                                : 'bg-[#fff1f2] text-[#e11d48] dark:bg-[#3b1118] dark:text-[#fb7185]'
                                        }`}
                                    >
                                        {capitalizeWords(senior.submissionStatus)}
                                    </span>
                                )}
                            </div>

                            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-fugaz font-bold text-[#101828] dark:text-white mb-6 leading-tight'>
                                {senior.name}
                            </h1>

                            {/* Details Grid */}
                            <div className='grid grid-cols-2 gap-4 sm:gap-6 mb-8'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-[#eaf7ec] dark:bg-[#163821] rounded-lg flex items-center justify-center shrink-0'>
                                        <GraduationCap className='w-5 h-5 text-[#1aae39] dark:text-[#4ade80]' />
                                    </div>
                                    <div>
                                        <p className='text-xs sm:text-sm text-[#475467] dark:text-[#9ea3ae]'>
                                            Branch
                                        </p>
                                        <p className='font-bold text-sm sm:text-base text-[#101828] dark:text-white'>
                                            {senior.branch?.branchName || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-[#eaf3fd] dark:bg-[#183153] rounded-lg flex items-center justify-center shrink-0'>
                                        <Calendar className='w-5 h-5 text-[#0075de] dark:text-[#62aef0]' />
                                    </div>
                                    <div>
                                        <p className='text-xs sm:text-sm text-[#475467] dark:text-[#9ea3ae]'>
                                            Year
                                        </p>
                                        <p className='font-medium text-sm sm:text-base text-[#101828] dark:text-white'>
                                            {senior.year}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-[#fffbeb] dark:bg-[#382606] rounded-lg flex items-center justify-center shrink-0'>
                                        <Eye className='w-5 h-5 text-[#d97706] dark:text-[#fbbf24]' />
                                    </div>
                                    <div>
                                        <p className='text-xs sm:text-sm text-[#475467] dark:text-[#9ea3ae]'>
                                            Views
                                        </p>
                                        <p className='font-medium text-sm sm:text-base text-[#101828] dark:text-white'>
                                            {senior.clickCount || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-[#f4f3ff] dark:bg-[#2e264f] rounded-lg flex items-center justify-center shrink-0'>
                                        <MapPin className='w-5 h-5 text-[#6941c6] dark:text-[#a58ced]' />
                                    </div>
                                    <div>
                                        <p className='text-xs sm:text-sm text-[#475467] dark:text-[#9ea3ae]'>
                                            College
                                        </p>
                                        <p className='font-medium text-sm sm:text-base text-[#101828] dark:text-white truncate' title={senior.college?.name || collegeName}>
                                            {senior.college?.name || collegeName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className='mb-8 flex-grow'>
                                <h2 className='text-lg font-bold text-[#101828] dark:text-white mb-3'>
                                    About
                                </h2>
                                <p className='text-[#475467] dark:text-[#9ea3ae] leading-relaxed text-sm sm:text-base whitespace-pre-wrap'>
                                    {senior.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Social Links / Contact Section */}
                            <div className='pt-6 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                                <h2 className='text-lg font-bold text-[#101828] dark:text-white mb-4'>
                                    Connect with {senior.name.split(' ')[0]}
                                </h2>
                                {senior.socialMediaLinks && senior.socialMediaLinks.length > 0 ? (
                                    <div className='flex flex-wrap gap-3'>
                                        {senior.socialMediaLinks.map((link, index) => (
                                            <a
                                                key={index}
                                                href={getSocialMediaUrl(link.platform, link.url)}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-xl transition-colors duration-200 ${getSocialMediaColor(link.platform)}`}
                                            >
                                                {getSocialMediaIcon(link.platform)}
                                                <span className='capitalize'>{link.platform}</span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='w-full p-4 bg-[#f6f5f4] dark:bg-[#191919] rounded-xl text-center border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                        <p className='text-sm text-[#475467] dark:text-[#9ea3ae]'>
                                            No contact information provided.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SeniorDetailClient;
