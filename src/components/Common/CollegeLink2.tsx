'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import type { CollegeSections } from '@/utils/interface';
import { DEFAULT_SECTIONS } from '@/constant';
import {
    GraduationCap,
    Archive,
    FileText,
    Zap,
    Video,
    BookMarked,
    Store,
    UserCheck,
    FolderOpen,
    Users,
    Briefcase,
    Search,
    X,
    LayoutGrid,
} from 'lucide-react';

interface CollegeLink2Props {
    sections?: CollegeSections;
}

interface NavLink {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    sectionKey?: keyof CollegeSections;
    colorClasses: {
        icon: string;
        bg: string;
    };
}

const CollegeLink2 = ({ sections }: CollegeLink2Props) => {
    const { slug } = useParams();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    // Body scroll lock effect
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close menu automatically on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent rendering if slug is not available
    if (!slug) return null;

    const enabledSections: CollegeSections = {
        ...DEFAULT_SECTIONS,
        ...(sections || {}),
    };

    const mainLinks: NavLink[] = [
        {
            href: `/${slug}`,
            icon: GraduationCap,
            text: 'Campus',
            colorClasses: {
                icon: 'text-[#0075de] dark:text-[#62aef0]',
                bg: 'bg-[#eaf3fd] dark:bg-[#183153]',
            },
        },
        {
            href: `/${slug}/pyqs`,
            icon: Archive,
            text: 'PYQs',
            sectionKey: 'pyqs',
            colorClasses: {
                icon: 'text-[#0284c7] dark:text-[#38bdf8]',
                bg: 'bg-[#f0f9ff] dark:bg-[#0c2d48]',
            },
        },
        {
            href: `/${slug}/notes`,
            icon: FileText,
            text: 'Notes',
            sectionKey: 'notes',
            colorClasses: {
                icon: 'text-[#16a34a] dark:text-[#4ade80]',
                bg: 'bg-[#f0fdf4] dark:bg-[#093318]',
            },
        },
        {
            href: `/${slug}/store`,
            icon: Store,
            text: 'Store',
            sectionKey: 'store',
            colorClasses: {
                icon: 'text-[#0d9488] dark:text-[#2dd4bf]',
                bg: 'bg-[#f0fdfa] dark:bg-[#08332f]',
            },
        },
    ];

    const moreLinks: NavLink[] = [
        {
            href: `/${slug}/quicknotes`,
            icon: Zap,
            text: 'Quick Notes',
            sectionKey: 'quickNotes',
            colorClasses: {
                icon: 'text-[#d97706] dark:text-[#fbbf24]',
                bg: 'bg-[#fffbeb] dark:bg-[#382606]',
            },
        },
        {
            href: `/${slug}/seniors`,
            icon: UserCheck,
            text: 'Seniors',
            sectionKey: 'seniors',
            colorClasses: {
                icon: 'text-[#4f46e5] dark:text-[#818cf8]',
                bg: 'bg-[#eef2ff] dark:bg-[#1d1b4d]',
            },
        },
        {
            href: `/${slug}/resources`,
            icon: FolderOpen,
            text: 'Resources',
            sectionKey: 'resources',
            colorClasses: {
                icon: 'text-[#0891b2] dark:text-[#22d3ee]',
                bg: 'bg-[#ecfeff] dark:bg-[#0c313b]',
            },
        },
        {
            href: `/${slug}/syllabus`,
            icon: BookMarked,
            text: 'Syllabus',
            sectionKey: 'syllabus',
            colorClasses: {
                icon: 'text-[#ea580c] dark:text-[#fb923c]',
                bg: 'bg-[#fff7ed] dark:bg-[#3b1906]',
            },
        },
        {
            href: `/${slug}/videos`,
            icon: Video,
            text: 'Videos',
            sectionKey: 'videos',
            colorClasses: {
                icon: 'text-[#9333ea] dark:text-[#c084fc]',
                bg: 'bg-[#faf5ff] dark:bg-[#301257]',
            },
        },
        {
            href: `/${slug}/groups`,
            icon: Users,
            text: 'Groups',
            sectionKey: 'groups',
            colorClasses: {
                icon: 'text-[#db2777] dark:text-[#f472b6]',
                bg: 'bg-[#fdf2f8] dark:bg-[#3d1226]',
            },
        },
        {
            href: `/${slug}/opportunities`,
            icon: Briefcase,
            text: 'Opportunities',
            sectionKey: 'opportunities',
            colorClasses: {
                icon: 'text-[#7c3aed] dark:text-[#a78bfa]',
                bg: 'bg-[#f5f3ff] dark:bg-[#2b164f]',
            },
        },
        {
            href: `/${slug}/lost-found`,
            icon: Search,
            text: 'Lost & Found',
            sectionKey: 'lostFound',
            colorClasses: {
                icon: 'text-[#e11d48] dark:text-[#fb7185]',
                bg: 'bg-[#fff1f2] dark:bg-[#3b1118]',
            },
        },
    ];

    const visibleMainLinks = mainLinks.filter(
        (link) => !link.sectionKey || enabledSections[link.sectionKey],
    );
    const visibleMoreLinks = moreLinks.filter(
        (link) => !link.sectionKey || enabledSections[link.sectionKey],
    );

    const isAnyMoreLinkActive = visibleMoreLinks.some((link) =>
        pathname.startsWith(link.href),
    );

    return (
        <div className='lg:hidden'>
            {/* Fixed Bottom Navigation Bar */}
            <nav
                aria-label='Mobile College Navigation'
                className='fixed z-40 bottom-0 left-0 right-0 bg-white/95 dark:bg-[#161616]/95 backdrop-blur-md border-t border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)] pb-safe'
            >
                <div className='max-w-screen-xl mx-auto px-2'>
                    <div className='flex items-center justify-around h-15'>
                        {visibleMainLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive =
                                link.href === `/${slug}`
                                    ? pathname === `/${slug}`
                                    : pathname.startsWith(link.href);

                            return (
                                <Link
                                    prefetch={false}
                                    key={link.href}
                                    href={link.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 transition-all duration-150 ${
                                        isActive
                                            ? 'text-[#0075de] dark:text-[#62aef0] font-semibold'
                                            : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${
                                            isActive
                                                ? 'bg-[#0075de] text-white shadow-xs'
                                                : `${link.colorClasses.bg} ${link.colorClasses.icon}`
                                        }`}
                                    >
                                        <Icon className='w-4 h-4' />
                                    </div>
                                    <span className='mt-1 text-[10px] leading-tight font-medium'>
                                        {link.text}
                                    </span>
                                </Link>
                            );
                        })}

                        {/* More Button */}
                        <button
                            onClick={toggleMenu}
                            className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 transition-all duration-150 ${
                                isOpen || isAnyMoreLinkActive
                                    ? 'text-[#0075de] dark:text-[#62aef0] font-semibold'
                                    : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                            }`}
                            aria-expanded={isOpen}
                            aria-label='Toggle all college links'
                        >
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${
                                    isOpen || isAnyMoreLinkActive
                                        ? 'bg-[#0075de] text-white shadow-xs'
                                        : 'bg-[#f4f3f0] dark:bg-[#282828] text-[#555] dark:text-[#bbb]'
                                }`}
                            >
                                {isOpen ? <X size={16} /> : <LayoutGrid size={16} />}
                            </div>
                            <span className='mt-1 text-[10px] leading-tight font-medium'>
                                {isOpen ? 'Close' : 'More'}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* More Menu Drawer (Overlay) */}
            {isOpen && (
                <div
                    className='fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end'
                    onClick={toggleMenu}
                >
                    <div
                        className='bg-white dark:bg-[#1a1a1a] rounded-t-2xl border-t border-[#e6e6e6] dark:border-[#2f2f2f] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Drag Pill */}
                        <div className='pt-3 pb-1 flex justify-center'>
                            <div className='w-10 h-1 bg-[#dcdad5] dark:bg-[#444] rounded-full' />
                        </div>

                        {/* Drawer Header */}
                        <div className='px-5 py-2.5 flex items-center justify-between border-b border-[#f0eee9] dark:border-[#282828]'>
                            <div className='flex items-center gap-2'>
                                <LayoutGrid className='w-4 h-4 text-[#0075de] dark:text-[#62aef0]' />
                                <h3 className='text-sm font-bold text-[#101828] dark:text-white'>
                                    Campus Links
                                </h3>
                            </div>
                            <button
                                onClick={toggleMenu}
                                className='p-1 text-[#888] hover:text-[#000] dark:text-[#aaa] dark:hover:text-white rounded-md'
                                aria-label='Close drawer'
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Drawer Content Grid */}
                        <div className='p-4 overflow-y-auto max-h-[60vh] pb-8'>
                            <div className='grid grid-cols-3 sm:grid-cols-4 gap-2.5'>
                                {visibleMoreLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname.startsWith(link.href);

                                    return (
                                        <Link
                                            prefetch={false}
                                            key={link.href}
                                            href={link.href}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-150 text-center ${
                                                isActive
                                                    ? 'bg-[#eaf3fd] dark:bg-[#183153] border-[#0075de]/30 text-[#0075de] dark:text-[#62aef0] font-semibold shadow-xs'
                                                    : 'bg-[#fcfbf9] dark:bg-[#222222] border-[#e6e6e6] dark:border-[#333] text-[#292524] dark:text-[#e7e5e4] hover:border-[#0075de]/40'
                                            }`}
                                        >
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 transition-transform ${
                                                    isActive
                                                        ? 'bg-[#0075de] text-white shadow-xs'
                                                        : `${link.colorClasses.bg} ${link.colorClasses.icon}`
                                                }`}
                                            >
                                                <Icon className='w-4 h-4' />
                                            </div>
                                            <span className='text-xs leading-tight font-medium line-clamp-1'>
                                                {link.text}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollegeLink2;
