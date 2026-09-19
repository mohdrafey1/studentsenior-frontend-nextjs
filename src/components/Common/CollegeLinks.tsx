'use client';

import React, { useState } from 'react';
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
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';

interface CollegelinksProps {
    sections?: CollegeSections;
}

interface SidebarLink {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    sectionKey?: keyof CollegeSections;
    colorClasses: {
        icon: string;
        bg: string;
    };
}

const Collegelinks = ({ sections }: CollegelinksProps) => {
    const { slug } = useParams();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Prevent rendering if slug is not available
    if (!slug) return null;

    const enabledSections: CollegeSections = {
        ...DEFAULT_SECTIONS,
        ...(sections || {}),
    };

    const links: SidebarLink[] = [
        {
            href: `/${slug}`,
            icon: GraduationCap,
            text: 'Campus Hub',
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
            text: 'Study Notes',
            sectionKey: 'notes',
            colorClasses: {
                icon: 'text-[#16a34a] dark:text-[#4ade80]',
                bg: 'bg-[#f0fdf4] dark:bg-[#093318]',
            },
        },
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
            href: `/${slug}/videos`,
            icon: Video,
            text: 'Course Videos',
            sectionKey: 'videos',
            colorClasses: {
                icon: 'text-[#9333ea] dark:text-[#c084fc]',
                bg: 'bg-[#faf5ff] dark:bg-[#301257]',
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
            href: `/${slug}/store`,
            icon: Store,
            text: 'Student Store',
            sectionKey: 'store',
            colorClasses: {
                icon: 'text-[#0d9488] dark:text-[#2dd4bf]',
                bg: 'bg-[#f0fdfa] dark:bg-[#08332f]',
            },
        },
        {
            href: `/${slug}/seniors`,
            icon: UserCheck,
            text: 'Senior Mentors',
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
            href: `/${slug}/groups`,
            icon: Users,
            text: 'Campus Groups',
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

    const visibleLinks = links.filter(
        (link) => !link.sectionKey || enabledSections[link.sectionKey],
    );

    return (
        <aside
            aria-label='College Navigation'
            className={`hidden lg:flex flex-col sticky top-16 h-[calc(100vh-4rem)] bg-[#fbfbfa] dark:bg-[#161616] border-r border-[#e6e6e6] dark:border-[#2f2f2f] transition-all duration-200 z-20 select-none ${
                isCollapsed ? 'w-16' : 'w-56'
            }`}
        >
            {/* Header & Toggle */}
            <div className='flex items-center justify-between px-3 py-2.5 border-b border-[#e6e6e6] dark:border-[#2f2f2f] min-h-[46px] bg-white/70 dark:bg-[#191919]/70 backdrop-blur-xs'>
                {!isCollapsed ? (
                    <span className='text-[11px] font-bold uppercase tracking-wider text-[#73716d] dark:text-[#9e9c97] px-1.5'>
                        Navigation
                    </span>
                ) : (
                    <span className='mx-auto text-[10px] font-bold text-[#73716d] dark:text-[#9e9c97]'>
                        NAV
                    </span>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className='p-1.5 rounded-lg text-[#555] dark:text-[#bbb] hover:text-[#000] dark:hover:text-white hover:bg-[#eae8e4] dark:hover:bg-[#2a2a2a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0075de]/30'
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    aria-expanded={!isCollapsed}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <PanelLeftOpen size={16} />
                    ) : (
                        <PanelLeftClose size={16} />
                    )}
                </button>
            </div>

            {/* Navigation Links */}
            <nav className='flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 scrollbar-thin'>
                {visibleLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        link.href === `/${slug}`
                            ? pathname === `/${slug}`
                            : pathname.startsWith(link.href);

                    return (
                        <div key={link.href} className='relative group'>
                            <Link
                                prefetch={false}
                                href={link.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`flex items-center rounded-lg text-xs font-medium transition-all duration-150 ${
                                    isCollapsed
                                        ? 'justify-center p-2'
                                        : 'px-2.5 py-1.5 justify-between'
                                } ${
                                    isActive
                                        ? 'bg-white dark:bg-[#242424] text-[#0075de] dark:text-[#62aef0] font-semibold shadow-xs border border-[#d0e4f7] dark:border-[#224474]'
                                        : 'text-[#1c1917] dark:text-[#ededed] hover:bg-white dark:hover:bg-[#222222] hover:text-[#000] dark:hover:text-white border border-transparent hover:border-[#e6e6e6] dark:hover:border-[#333]'
                                }`}
                            >
                                <div className='flex items-center gap-2.5 min-w-0'>
                                    {/* Icon Container with Sticker Palette */}
                                    <div
                                        className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                                            isActive
                                                ? 'bg-[#0075de] text-white shadow-xs'
                                                : `${link.colorClasses.bg} ${link.colorClasses.icon}`
                                        }`}
                                    >
                                        <Icon className='w-3.5 h-3.5' />
                                    </div>

                                    {!isCollapsed && (
                                        <span className={`truncate leading-tight ${isActive ? 'text-[#0075de] dark:text-[#62aef0] font-semibold' : 'text-[#292524] dark:text-[#e7e5e4]'}`}>
                                            {link.text}
                                        </span>
                                    )}
                                </div>

                                {!isCollapsed && isActive && (
                                    <div className='w-1.5 h-1.5 rounded-full bg-[#0075de] dark:bg-[#62aef0] flex-shrink-0 mr-1' />
                                )}
                            </Link>

                            {/* Floating Accessible Tooltip on Hover (When Collapsed) */}
                            {isCollapsed && (
                                <div
                                    role='tooltip'
                                    className='pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 px-2.5 py-1 bg-[#101828] dark:bg-[#2a2a2a] text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap border border-white/10'
                                >
                                    {link.text}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Collegelinks;


