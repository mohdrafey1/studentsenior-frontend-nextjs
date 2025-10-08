'use client';
import React from 'react';
import { ISenior } from '@/utils/interface';
import { Linkedin, Github, Globe, Youtube, Send, Phone } from 'lucide-react';
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
                return `https://wa.me/${url}`;
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
                return <Phone size={20} className='text-green-600' />;
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
        <div className='max-w-sm min-w-xs lg:min-w-sm mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
            {/* Top Header */}
            <div className='bg-sky-600 h-24'></div>

            {/* Profile Image */}
            <div className='flex justify-center -mt-12'>
                {senior.profilePicture ? (
                    <Image
                        src={senior.profilePicture}
                        alt={senior.name}
                        width={100}
                        height={100}
                        className='w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 shadow-md object-cover'
                    />
                ) : (
                    <div className='w-24 h-24 rounded-full bg-gray-300 border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-md'>
                        <span className='text-gray-600 text-sm'>No Photo</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className='p-5 text-center'>
                {/* Name + Domain */}
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {senior.name}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {senior.domain || 'Tech Enthusiast'}
                </p>

                {/* Social Links */}
                <div className='flex justify-center flex-wrap gap-4 mt-4'>
                    {senior.socialMediaLinks?.slice(0, 5).map((link, i) => (
                        <Link
                            key={i}
                            href={formatSocialMediaLink(
                                link.platform,
                                link.url,
                            )}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-sky-100 dark:hover:bg-sky-800 transition'
                        >
                            {renderSocialIcon(link.platform)}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <Link
                    href={`seniors/${senior.slug}`}
                    className='mt-6 inline-block px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-xl shadow-md transition'
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};
