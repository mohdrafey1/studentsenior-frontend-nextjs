'use client';

import React from 'react';
import { User, GraduationCap, ExternalLink, Globe } from 'lucide-react';
import { ISenior } from '@/utils/interface';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/formatting';

interface FeaturedSeniorsProps {
    seniors: ISenior[];
    collegeName: string;
}

export default function FeaturedSeniors({
    seniors,
    collegeName,
}: FeaturedSeniorsProps) {
    if (!seniors || seniors.length === 0) {
        return (
            <section className='py-16'>
                <div className='container mx-auto px-4'>
                    <div className='text-center'>
                        <h2 className='text-3xl font-fugaz font-bold text-gray-900 dark:text-white mb-4'>
                            Featured Seniors
                        </h2>
                        <p className='text-gray-600 dark:text-gray-300'>
                            No seniors available at the moment. Be the first to
                            join!
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='py-16'>
            <div className='container mx-auto px-4'>
                <div className='text-center mb-12'>
                    <h2 className='text-4xl font-fugaz sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400'>
                        Featured Seniors
                    </h2>
                    <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg'>
                        Connect with experienced seniors who can guide you
                        through your academic journey
                    </p>
                </div>

                <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {seniors.map((senior) => (
                        <article
                            key={senior._id}
                            className='group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col'
                        >
                            {/* Animated Background Gradient */}
                            <div className='absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700' />

                            {/* Floating Orb Effect */}
                            <div className='absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110' />

                            {/* Profile Picture Section */}
                            <div className='relative h-52 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 overflow-hidden flex items-center justify-center'>
                                {senior.profilePicture ? (
                                    <div className='relative z-10'>
                                        <div className='relative w-48 h-48 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-xl group-hover:ring-sky-200 dark:group-hover:ring-sky-700 transition-all duration-500'>
                                            <Image
                                                src={senior.profilePicture}
                                                alt={senior.name}
                                                className='object-cover w-full h-full group-hover:scale-110 transition-transform duration-700'
                                                width={200}
                                                height={200}
                                            />
                                            <div className='absolute inset-0 bg-gradient-to-t from-sky-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                        </div>
                                        <div className='absolute -inset-2 rounded-full border border-sky-200/50 dark:border-sky-700/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500' />
                                    </div>
                                ) : (
                                    <div className='relative z-10 text-center'>
                                        <div className='relative w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-xl group-hover:ring-sky-200 dark:group-hover:ring-sky-700 transition-all duration-500'>
                                            <div className='w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                                                <User className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                                            </div>
                                            <div className='absolute -inset-2 rounded-full border border-gray-200/50 dark:border-gray-600/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500' />
                                        </div>
                                        <span className='text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full backdrop-blur-sm'>
                                            No Photo
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className='relative p-6 flex-grow flex flex-col'>
                                {/* Name and Year */}
                                <div className='flex justify-between items-start mb-3'>
                                    <h3 className='text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-600 dark:group-hover:from-sky-400 dark:group-hover:to-cyan-400 transition-all duration-300 flex-1 mr-3'>
                                        {senior.name}
                                    </h3>
                                    <div className='flex items-center bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-3 py-2 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30'>
                                        <span className='text-sm font-bold text-emerald-600 dark:text-emerald-400'>
                                            Year {senior.year}
                                        </span>
                                    </div>
                                </div>

                                {/* Branch and Domain */}
                                <div className='space-y-2 mb-4'>
                                    <div className='flex items-center text-gray-600 dark:text-gray-300'>
                                        <GraduationCap className='w-4 h-4 mr-2' />
                                        <span className='text-sm'>
                                            {senior.branch.branchName}
                                        </span>
                                    </div>
                                    {senior.domain && (
                                        <div className='flex items-center text-gray-600 dark:text-gray-300'>
                                            <Globe className='w-4 h-4 mr-2' />
                                            <span className='text-sm'>
                                                {senior.domain}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Gradient Separator */}
                                <div className='h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-4' />

                                {/* Footer Section */}
                                <div className='mt-auto'>
                                    <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4'>
                                        <div className='flex items-center gap-2 text-xs'>
                                            <time className='bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full'>
                                                Joined{' '}
                                                {formatDate(senior.createdAt)}
                                            </time>
                                        </div>
                                    </div>

                                    <Link
                                        href={`${collegeName}/seniors/${senior.slug}`}
                                        className='group/cta relative inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02] overflow-hidden'
                                    >
                                        {/* Button Background Animation */}
                                        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-500 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300' />

                                        <span className='relative flex items-center'>
                                            View Profile
                                            <ExternalLink className='w-4 h-4 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300' />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {seniors.length === 4 && (
                    <div className='text-center mt-8'>
                        <Link
                            href='seniors'
                            className='inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02]'
                        >
                            View All Seniors
                            <ExternalLink className='w-4 h-4 ml-2' />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
