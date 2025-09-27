'use client';

import React from 'react';
import { IOpportunity } from '@/utils/interface';
import {
    Mail,
    Phone,
    Link as LinkIcon,
    Calendar,
    Share2,
    ExternalLink,
    MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';

interface OpportunityDetailClientProps {
    opportunity: IOpportunity;
}

const OpportunityDetailClient: React.FC<OpportunityDetailClientProps> = ({
    opportunity,
}) => {
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: opportunity.name,
                    text: opportunity.description,
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
            <DetailPageNavbar path='opportunities' />
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
                                            <h1 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 mb-2 leading-tight'>
                                                {opportunity.name}
                                            </h1>
                                        </div>
                                        <button
                                            onClick={handleShare}
                                            className='group p-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-full shadow-sm hover:shadow-md hover:scale-110'
                                            aria-label='Share opportunity'
                                        >
                                            <Share2 className='w-5 h-5 group-hover:rotate-12 transition-transform duration-300' />
                                        </button>
                                    </div>

                                    {/* Meta Information */}
                                    <div className='flex flex-wrap gap-6 mb-6'>
                                        <div className='flex items-center bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full'>
                                            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold mr-3'>
                                                {(opportunity.owner?.username ||
                                                    'A')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className='text-xs text-blue-600 dark:text-blue-400 font-medium'>
                                                    Posted by
                                                </div>
                                                <div className='text-sm font-semibold text-blue-900 dark:text-blue-100'>
                                                    {opportunity.owner
                                                        ?.username ||
                                                        'Anonymous'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex items-center bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full'>
                                            <Calendar className='w-5 h-5 text-purple-600 dark:text-purple-400 mr-3' />
                                            <div>
                                                <div className='text-xs text-purple-600 dark:text-purple-400 font-medium'>
                                                    Posted on
                                                </div>
                                                <div className='text-sm font-semibold text-purple-900 dark:text-purple-100'>
                                                    {new Date(
                                                        opportunity.createdAt,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Card */}
                            <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50'>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
                                    <div className='w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4'></div>
                                    About This Opportunity
                                </h2>
                                <div className='prose dark:prose-invert max-w-none'>
                                    <p className='text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-lg'>
                                        {opportunity.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Contact Information */}
                        <div className='lg:col-span-1'>
                            <div className='sticky top-8'>
                                <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50'>
                                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
                                        <MessageCircle className='w-6 h-6 mr-3 text-blue-600 dark:text-blue-400' />
                                        Get In Touch
                                    </h2>

                                    <div className='space-y-4'>
                                        {opportunity.email && (
                                            <a
                                                href={`mailto:${opportunity.email}`}
                                                className='group relative block py-4 px-2 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 hover:from-blue-100 hover:to-sky-100 dark:hover:from-blue-900/40 dark:hover:to-sky-900/40 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-blue-100 dark:border-blue-800/50'
                                            >
                                                <div className='flex items-center'>
                                                    <div className='p-3 bg-blue-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300'>
                                                        <Mail className='w-5 h-5 text-white' />
                                                    </div>
                                                    <div className='ml-4 flex-1'>
                                                        <div className='font-semibold text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors'>
                                                            Email
                                                        </div>
                                                        <div className='text-sm text-blue-700 dark:text-blue-300 truncate'>
                                                            {opportunity.email}
                                                        </div>
                                                    </div>
                                                    <ExternalLink className='w-4 h-4 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
                                                </div>
                                            </a>
                                        )}

                                        {opportunity.whatsapp && (
                                            <a
                                                href={`https://wa.me/${opportunity.whatsapp}`}
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
                                                            {
                                                                opportunity.whatsapp
                                                            }
                                                        </div>
                                                    </div>
                                                    <ExternalLink className='w-4 h-4 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
                                                </div>
                                            </a>
                                        )}

                                        {opportunity.link && (
                                            <a
                                                href={opportunity.link}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='group relative block py-4 px-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-purple-100 dark:border-purple-800/50'
                                            >
                                                <div className='flex items-center'>
                                                    <div className='p-3 bg-purple-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300'>
                                                        <LinkIcon className='w-5 h-5 text-white' />
                                                    </div>
                                                    <div className='ml-4 flex-1'>
                                                        <div className='font-semibold text-purple-900 dark:text-purple-100 group-hover:text-purple-700 dark:group-hover:text-purple-200 transition-colors'>
                                                            External Link
                                                        </div>
                                                        <div className='text-sm text-purple-700 dark:text-purple-300 truncate'>
                                                            Visit website
                                                        </div>
                                                    </div>
                                                    <ExternalLink className='w-4 h-4 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
                                                </div>
                                            </a>
                                        )}
                                    </div>

                                    {/* Contact CTA */}
                                    <div className='mt-8 py-4 px-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-center'>
                                        <div className='text-white font-semibold mb-1'>
                                            Ready to connect?
                                        </div>
                                        <div className='text-blue-100 text-sm'>
                                            Choose your preferred contact method
                                            above
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

export default OpportunityDetailClient;
