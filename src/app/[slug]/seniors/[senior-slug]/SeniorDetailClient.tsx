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
    Phone,
    MapPin,
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
    const getSocialMediaIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'whatsapp':
                return <Phone className='w-3 h-3 sm:w-4 sm:h-4' />;
            case 'telegram':
                return <MessageCircle className='w-3 h-3 sm:w-4 sm:h-4' />;
            case 'instagram':
                return <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4' />;
            case 'linkedin':
                return <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4' />;
            case 'facebook':
                return <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4' />;
            case 'twitter':
                return <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4' />;
            case 'youtube':
                return <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4' />;
            case 'github':
                return <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4' />;
            default:
                return <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4' />;
        }
    };

    const getSocialMediaColor = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'whatsapp':
                return 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400';
            case 'telegram':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400';
            case 'instagram':
                return 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400';
            case 'linkedin':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400';
            case 'facebook':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400';
            case 'twitter':
                return 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400';
            case 'youtube':
                return 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400';
            case 'github':
                return 'bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400';
        }
    };

    const getSocialMediaUrl = (platform: string, url: string) => {
        switch (platform) {
            case 'whatsapp':
                return `https://wa.me/${url}`;
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
            <div className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-8'>
                {/* Floating Background Elements - Smaller on mobile */}
                <div className='fixed inset-0 overflow-hidden pointer-events-none'>
                    <div className='absolute top-10 sm:top-20 left-5 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-gradient-to-br from-sky-400/10 to-cyan-400/10 rounded-full blur-2xl sm:blur-3xl'></div>
                    <div className='absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-60 sm:w-96 h-60 sm:h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl sm:blur-3xl'></div>
                </div>

                {/* Main Content */}
                <div className='relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60'>
                    {/* Animated Background Gradient */}
                    <div className='absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10'></div>

                    {/* Header Section - Responsive height */}
                    <div className='relative h-40 sm:h-56 md:h-64 lg:h-80 bg-gradient-to-br from-sky-500 to-cyan-500'>
                        {senior.profilePicture ? (
                            <Image
                                src={senior.profilePicture}
                                alt={senior.name}
                                className='w-full h-full object-cover'
                                width={800}
                                height={400}
                            />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-500'>
                                <div className='text-center text-white'>
                                    <User className='w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-4 opacity-80' />
                                    <h1 className='text-lg sm:text-xl lg:text-2xl font-bold'>
                                        {senior.name}
                                    </h1>
                                </div>
                            </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

                        {/* Status Badge - Smaller on mobile */}
                        {senior.submissionStatus !== 'approved' && (
                            <div className='absolute top-2 sm:top-4 left-2 sm:left-4'>
                                <span
                                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg ${
                                        senior.submissionStatus === 'pending'
                                            ? 'bg-amber-100/90 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 border border-amber-200/50'
                                            : 'bg-red-100/90 text-red-800 dark:bg-red-900/80 dark:text-red-200 border border-red-200/50'
                                    }`}
                                >
                                    {capitalizeWords(senior.submissionStatus)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section - Responsive padding */}
                    <div className='relative p-3 sm:p-4 md:p-6 lg:p-8'>
                        {/* Title and Basic Info - More compact on mobile */}
                        <div className='mb-4 sm:mb-6'>
                            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text'>
                                {senior.name}
                            </h1>

                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6'>
                                <div className='flex items-center p-2 sm:p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-lg sm:rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30'>
                                    <GraduationCap className='w-4 h-4 sm:w-5 sm:h-5 text-sky-600 dark:text-sky-400 mr-2 sm:mr-3' />
                                    <div>
                                        <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                                            Branch
                                        </p>
                                        <p className='text-sm sm:text-base font-medium text-gray-900 dark:text-white'>
                                            {senior.branch?.branchName ||
                                                'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center p-2 sm:p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-lg sm:rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30'>
                                    <Calendar className='w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 mr-2 sm:mr-3' />
                                    <div>
                                        <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                                            Year
                                        </p>
                                        <p className='text-sm sm:text-base font-medium text-gray-900 dark:text-white'>
                                            {senior.year}
                                        </p>
                                    </div>
                                </div>

                                {senior.domain && (
                                    <div className='flex items-center p-2 sm:p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-lg sm:rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30'>
                                        <Globe className='w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mr-2 sm:mr-3' />
                                        <div>
                                            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                                                Domain
                                            </p>
                                            <p className='text-sm sm:text-base font-medium text-gray-900 dark:text-white'>
                                                {senior.domain}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description - More compact on mobile */}
                        {senior.description && (
                            <div className='mb-4 sm:mb-6 lg:mb-8'>
                                <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2'>
                                    <div className='w-0.5 sm:w-1 h-4 sm:h-5 lg:h-6 bg-gradient-to-b from-sky-500 to-cyan-500 rounded-full'></div>
                                    About
                                </h2>
                                <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-gray-800/50 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-200/30 dark:border-gray-700/30'>
                                    {senior.description}
                                </p>
                            </div>
                        )}

                        {/* Social Media Links - More compact on mobile */}
                        {senior.socialMediaLinks &&
                            senior.socialMediaLinks.length > 0 && (
                                <div className='mb-4 sm:mb-6 lg:mb-8'>
                                    <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2'>
                                        <div className='w-0.5 sm:w-1 h-4 sm:h-5 lg:h-6 bg-gradient-to-b from-sky-500 to-cyan-500 rounded-full'></div>
                                        Connect
                                    </h2>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
                                        {senior.socialMediaLinks.map(
                                            (link, index) => (
                                                <a
                                                    key={index}
                                                    href={getSocialMediaUrl(
                                                        link.platform,
                                                        link.url,
                                                    )}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='group flex items-center p-3 sm:p-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-lg sm:rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-md backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30'
                                                >
                                                    <div
                                                        className={`p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 ${getSocialMediaColor(
                                                            link.platform,
                                                        )} group-hover:scale-110 transition-transform shadow-sm`}
                                                    >
                                                        {getSocialMediaIcon(
                                                            link.platform,
                                                        )}
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <p className='text-sm sm:text-base font-medium text-gray-900 dark:text-white'>
                                                            {capitalizeWords(
                                                                link.platform,
                                                            )}
                                                        </p>
                                                        <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate'>
                                                            {link.url}
                                                        </p>
                                                    </div>
                                                    <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0' />
                                                </a>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Gradient Separator */}
                        <div className='h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-3 sm:mb-6' />

                        {/* Footer Info - More compact on mobile */}
                        <div className='pt-3 sm:pt-6'>
                            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                                <div className='flex items-center gap-2 sm:gap-4'>
                                    <span className='font-medium'>
                                        {senior.college?.name || collegeName}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 sm:gap-4'>
                                    <span className='flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full'>
                                        <MapPin className='w-3 h-3 sm:w-4 sm:h-4 mr-1' />
                                        {senior.clickCount || 0} views
                                    </span>
                                    <span className='bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full'>
                                        {new Date(
                                            senior.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SeniorDetailClient;
