'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import {
    Landmark,
    StickyNote,
    Zap,
    User,
    Store,
    Video,
    MessageCircle,
    Search,
    Compass,
    Menu,
    X,
} from 'lucide-react';

const Collegelink2 = () => {
    const { slug } = useParams();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleMore = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const mainLinks = [
        {
            href: `/${slug}`,
            icon: <Landmark size={20} />,
            text: 'College',
        },
        {
            href: `/${slug}/pyqs`,
            icon: <StickyNote size={20} />,
            text: 'PYQs',
        },
        {
            href: `/${slug}/notes`,
            icon: <StickyNote size={20} />,
            text: 'Notes',
        },
        {
            href: `/${slug}/store`,
            icon: <Store size={20} />,
            text: 'Store',
        },
    ];

    const moreLinks = [
        {
            href: `/${slug}/seniors`,
            icon: <User size={20} />,
            text: 'Seniors',
        },
        {
            href: `/${slug}/groups`,
            icon: <MessageCircle size={20} />,
            text: 'Groups',
        },
        {
            href: `/${slug}/opportunities`,
            icon: <Search size={20} />,
            text: 'Opportunity',
        },
        {
            href: `/${slug}/lost-found`,
            icon: <Compass size={20} />,
            text: 'Lost Found',
        },
        // {
        //     href: `/${slug}/community`,
        //     icon: <Users size={20} />,
        //     text: "Community",
        // },
        {
            href: `/${slug}/resources`,
            icon: <Zap size={20} />,
            text: 'Resources',
        },
        {
            href: `/${slug}/videos`,
            icon: <Video size={20} />,
            text: 'Videos',
        },
    ];

    return (
        <div className='lg:hidden'>
            {/* Fixed Bottom Navigation Bar */}
            <nav className='fixed z-30 bottom-0 left-0 right-0'>
                <div className='bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 shadow-lg'>
                    <div className='max-w-screen-xl mx-auto px-2'>
                        <div className='flex justify-around items-center'>
                            {mainLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={`group flex-1 flex flex-col items-center justify-center py-3 px-1 transition-all duration-200 ${
                                        pathname === link.href
                                            ? 'text-sky-600 dark:text-sky-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-300'
                                    }`}
                                >
                                    <div className='relative'>
                                        {link.icon}
                                        {pathname === link.href && (
                                            <span className='absolute -bottom-1 left-1/2 w-1 h-1 bg-sky-500 rounded-full transform -translate-x-1/2' />
                                        )}
                                    </div>
                                    <span className='mt-1 text-xs font-medium'>
                                        {link.text}
                                    </span>
                                </Link>
                            ))}
                            {/* More Button */}
                            <button
                                onClick={handleMore}
                                className={`group flex-1 flex flex-col items-center justify-center py-3 px-1 transition-all duration-200 ${
                                    isOpen
                                        ? 'text-sky-600 dark:text-sky-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-300'
                                }`}
                                aria-expanded={isOpen}
                                aria-label='Toggle menu'
                            >
                                <div className='relative'>
                                    {isOpen ? (
                                        <X size={20} />
                                    ) : (
                                        <Menu size={20} />
                                    )}
                                </div>
                                <span className='mt-1 text-xs font-medium'>
                                    {isOpen ? 'Close' : 'More'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* More Menu (Overlay) */}
            {isOpen && (
                <div
                    className='fixed inset-0 z-20 bg-black/20 dark:bg-black/40 backdrop-blur-sm'
                    onClick={handleMore}
                >
                    <div
                        className='absolute bottom-16 inset-x-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='pt-2 pb-safe px-4 max-h-[70vh] overflow-y-auto'>
                            <div className='w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4' />
                            <div className='grid grid-cols-3 gap-4 pb-4'>
                                {moreLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        onClick={handleMore}
                                        className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${
                                            pathname === link.href
                                                ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        <div className='p-2 rounded-lg mb-1'>
                                            {link.icon}
                                        </div>
                                        <span className='text-xs font-medium text-center'>
                                            {link.text}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collegelink2;
