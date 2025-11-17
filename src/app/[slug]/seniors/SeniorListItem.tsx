'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ISenior } from '@/utils/interface';
import {
    GraduationCap,
    Briefcase,
    Edit,
    Trash2,
    ExternalLink,
} from 'lucide-react';

interface SeniorListItemProps {
    senior: ISenior;
    onEdit: (senior: ISenior) => void;
    onDelete: (seniorId: string) => void;
    ownerId: string;
    collegeName: string;
}

export const SeniorListItem: React.FC<SeniorListItemProps> = ({
    senior,
    onEdit,
    onDelete,
    ownerId,
    collegeName,
}) => {
    const isOwner = ownerId === senior.owner._id;

    return (
        <article className='group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden backdrop-blur-sm'>
            {/* Animated Background Gradient */}
            <div className='absolute inset-0 bg-gradient-to-r from-sky-500/5 via-blue-500/5 to-purple-500/5 dark:from-sky-400/10 dark:via-blue-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500' />

            <div className='relative p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row gap-4'>
                    {/* Left Section - Profile Image */}
                    <div className='flex-shrink-0'>
                        <div className='relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-sky-400 dark:group-hover:ring-sky-600 transition-all duration-300'>
                            {senior.profilePicture ? (
                                <Image
                                    src={senior.profilePicture}
                                    alt={senior.name}
                                    fill
                                    className='object-cover'
                                    sizes='(max-width: 640px) 80px, 96px'
                                />
                            ) : (
                                <div className='w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center'>
                                    <span className='text-2xl font-bold text-white'>
                                        {senior.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Section - Main Info */}
                    <div className='flex-1 min-w-0 space-y-2'>
                        {/* Name and Domain */}
                        <div>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300'>
                                {senior.name}
                            </h3>
                            {senior.domain && (
                                <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mt-1'>
                                    <Briefcase className='w-4 h-4 flex-shrink-0' />
                                    <span>{senior.domain}</span>
                                </p>
                            )}
                        </div>

                        {/* Branch and Year Info */}
                        <div className='flex flex-wrap items-center gap-3 text-sm'>
                            <div className='flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                                <GraduationCap className='w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0' />
                                <span className='text-gray-700 dark:text-gray-300'>
                                    {senior.branch.branchName}
                                </span>
                            </div>

                            <div className='px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-lg font-medium'>
                                {senior.year}
                            </div>
                        </div>

                        {/* Description */}
                        {senior.description && (
                            <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                                {senior.description}
                            </p>
                        )}

                        {/* Social Media Links */}
                        {senior.socialMediaLinks &&
                            senior.socialMediaLinks.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {senior.socialMediaLinks.map(
                                        (link, index) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg transition-all duration-200'
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <span className='capitalize'>
                                                    {link.platform}
                                                </span>
                                                <ExternalLink className='w-3 h-3' />
                                            </a>
                                        ),
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className='flex sm:flex-col items-center gap-2'>
                        {/* View Profile Link */}
                        <Link
                            href={`/${collegeName}/seniors/${senior.slug}`}
                            className='flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl'
                        >
                            <span>View Profile</span>
                        </Link>

                        {/* Edit & Delete for Owners */}
                        {isOwner && (
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => onEdit(senior)}
                                    className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300'
                                    aria-label='Edit senior'
                                    title='Edit senior'
                                >
                                    <Edit className='w-4 h-4' />
                                </button>
                                <button
                                    onClick={() => onDelete(senior._id)}
                                    className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300'
                                    aria-label='Delete senior'
                                    title='Delete senior'
                                >
                                    <Trash2 className='w-4 h-4' />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};
