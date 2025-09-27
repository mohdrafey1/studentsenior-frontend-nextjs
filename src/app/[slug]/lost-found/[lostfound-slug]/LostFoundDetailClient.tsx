'use client';

import React from 'react';
import { ILostFoundItem } from '@/utils/interface';
import {
    Phone,
    Calendar,
    Share2,
    ExternalLink,
    MapPin,
    Tag,
    AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { formatDate } from '@/utils/formatting';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';

interface LostFoundDetailClientProps {
    lostFoundItem: ILostFoundItem;
}

const LostFoundDetailClient: React.FC<LostFoundDetailClientProps> = ({
    lostFoundItem,
}) => {
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: lostFoundItem.title,
                    text: lostFoundItem.description,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <>
            <DetailPageNavbar path='lost-found' />
            <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 relative overflow-hidden'>
                {/* Background Decorative Elements */}
                <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl' />
                <div className='absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl' />

                <div className='relative max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Main Content */}
                        <div className='lg:col-span-2 space-y-6'>
                            {/* Header Card */}
                            <div className='relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden'>
                                {/* Header Background Pattern */}
                                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10' />

                                <div className='relative'>
                                    <div className='flex justify-between items-start mb-6'>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-3 mb-2'>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        lostFoundItem.type ===
                                                        'lost'
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}
                                                >
                                                    {lostFoundItem.type.toUpperCase()}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        lostFoundItem.currentStatus ===
                                                        'open'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {lostFoundItem.currentStatus.toUpperCase()}
                                                </span>
                                            </div>
                                            <h1 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 mb-2 leading-tight'>
                                                {lostFoundItem.title}
                                            </h1>
                                        </div>
                                        <button
                                            onClick={handleShare}
                                            className='group p-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-full shadow-sm hover:shadow-md hover:scale-110'
                                            aria-label='Share item'
                                        >
                                            <Share2 className='w-5 h-5 group-hover:rotate-12 transition-transform duration-300' />
                                        </button>
                                    </div>

                                    {/* Meta Information */}
                                    <div className='flex flex-wrap gap-6 mb-6'>
                                        <div className='flex items-center bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full'>
                                            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold mr-3'>
                                                {(lostFoundItem.owner
                                                    ?.username ||
                                                    'A')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className='text-xs text-blue-600 dark:text-blue-400 font-medium'>
                                                    Posted by
                                                </div>
                                                <div className='text-sm font-semibold text-blue-900 dark:text-blue-100'>
                                                    {lostFoundItem.owner
                                                        ?.username ||
                                                        'Anonymous'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex items-center bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full'>
                                            <Calendar className='w-5 h-5 text-purple-600 dark:text-purple-400 mr-3' />
                                            <div>
                                                <div className='text-xs text-purple-600 dark:text-purple-400 font-medium'>
                                                    Date
                                                </div>
                                                <div className='text-sm font-semibold text-purple-900 dark:text-purple-100'>
                                                    {formatDate(
                                                        lostFoundItem.date,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Card (if available) */}
                            {lostFoundItem.imageUrl && (
                                <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50'>
                                    <div className='relative w-full h-[400px] rounded-2xl overflow-hidden'>
                                        <Image
                                            src={lostFoundItem.imageUrl}
                                            alt={lostFoundItem.title}
                                            fill
                                            className='object-cover'
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Description Card */}
                            <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50'>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
                                    <div className='w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4'></div>
                                    Description
                                </h2>
                                <div className='prose dark:prose-invert max-w-none'>
                                    <p className='text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-lg'>
                                        {lostFoundItem.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Contact Information */}
                        <div className='lg:col-span-1'>
                            <div className='sticky top-8'>
                                <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50'>
                                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
                                        <AlertCircle className='w-6 h-6 mr-3 text-blue-600 dark:text-blue-400' />
                                        Item Details
                                    </h2>

                                    <div className='space-y-4'>
                                        {/* Location */}
                                        <div className='group relative block py-4 px-2 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50'>
                                            <div className='flex items-center'>
                                                <div className='p-3 bg-blue-600 rounded-xl shadow-lg'>
                                                    <MapPin className='w-5 h-5 text-white' />
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='font-semibold text-blue-900 dark:text-blue-100'>
                                                        Location
                                                    </div>
                                                    <div className='text-sm text-blue-700 dark:text-blue-300'>
                                                        {lostFoundItem.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className='group relative block py-4 px-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50'>
                                            <div className='flex items-center'>
                                                <div className='p-3 bg-purple-600 rounded-xl shadow-lg'>
                                                    <Tag className='w-5 h-5 text-white' />
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='font-semibold text-purple-900 dark:text-purple-100'>
                                                        Status
                                                    </div>
                                                    <div className='text-sm text-purple-700 dark:text-purple-300'>
                                                        {lostFoundItem.currentStatus.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* WhatsApp Contact */}
                                        <a
                                            href={`https://wa.me/${lostFoundItem.whatsapp}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='group relative block py-4 px-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-green-100 dark:border-green-800/50'
                                        >
                                            <div className='flex items-center'>
                                                <div className='p-3 bg-green-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300'>
                                                    <Phone className='w-5 h-5 text-white' />
                                                </div>
                                                <div className='ml-4 flex-1'>
                                                    <div className='font-semibold text-green-900 dark:text-green-100 group-hover:text-green-700 dark:group-hover:text-green-200 transition-colors'>
                                                        WhatsApp
                                                    </div>
                                                    <div className='text-sm text-green-700 dark:text-green-300 truncate'>
                                                        {lostFoundItem.whatsapp}
                                                    </div>
                                                </div>
                                                <ExternalLink className='w-4 h-4 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
                                            </div>
                                        </a>
                                    </div>

                                    {/* Contact CTA */}
                                    <div className='mt-8 py-4 px-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-center'>
                                        <div className='text-white font-semibold mb-1'>
                                            Have information?
                                        </div>
                                        <div className='text-blue-100 text-sm'>
                                            Contact the poster via WhatsApp
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LostFoundDetailClient;
