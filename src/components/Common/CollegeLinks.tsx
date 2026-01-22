'use client';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import type { CollegeSections } from '@/utils/interface';
import { DEFAULT_SECTIONS } from '@/constant';
import {
    Landmark,
    StickyNote,
    Zap,
    User,
    Store,
    MessageCircle,
    Search,
    Compass,
    Video,
    BookOpen,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';

interface CollegelinksProps {
    sections?: CollegeSections;
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

    const links = [
        {
            href: `/${slug}`,
            icon: <Landmark size={20} />,
            text: 'College',
        },
        {
            href: `/${slug}/pyqs`,
            icon: <Zap size={20} />,
            text: 'PYQs',
            sectionKey: 'pyqs',
        },
        {
            href: `/${slug}/notes`,
            icon: <StickyNote size={20} />,
            text: 'Notes',
            sectionKey: 'notes',
        },
        {
            href: `/${slug}/videos`,
            icon: <Video size={20} />,
            text: 'Videos',
            sectionKey: 'videos',
        },
        {
            href: `/${slug}/syllabus`,
            icon: <BookOpen size={20} />,
            text: 'Syllabus',
            sectionKey: 'syllabus',
        },
        {
            href: `/${slug}/store`,
            icon: <Store size={20} />,
            text: 'Store',
            sectionKey: 'store',
        },
        {
            href: `/${slug}/seniors`,
            icon: <User size={20} />,
            text: 'Seniors',
            sectionKey: 'seniors',
        },
        {
            href: `/${slug}/resources`,
            icon: <StickyNote size={20} />,
            text: 'Resources',
            sectionKey: 'resources',
        },
        {
            href: `/${slug}/groups`,
            icon: <MessageCircle size={20} />,
            text: 'Groups',
            sectionKey: 'groups',
        },
        {
            href: `/${slug}/opportunities`,
            icon: <Search size={20} />,
            text: 'Opportunity',
            sectionKey: 'opportunities',
        },
        {
            href: `/${slug}/lost-found`,
            icon: <Compass size={20} />,
            text: 'Lost/Found',
            sectionKey: 'lostFound',
        },
    ];

    const visibleLinks = links.filter(
        (link) =>
            !link.sectionKey ||
            enabledSections[link.sectionKey as keyof typeof enabledSections],
    );

    return (
        <aside
            className={`hidden lg:block sticky top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800  overflow-y-auto transition-all duration-300 ${
                isCollapsed ? 'w-16' : 'w-64'
            }`}
        >
            <nav className='relative p-2'>
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className='absolute -right-0 top-4 z-10 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md'
                    aria-label={
                        isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }
                >
                    {isCollapsed ? (
                        <ChevronRight
                            size={14}
                            className='text-gray-600 dark:text-gray-400'
                        />
                    ) : (
                        <ChevronLeft
                            size={14}
                            className='text-gray-600 dark:text-gray-400'
                        />
                    )}
                </button>

                <div className={`space-y-1 ${isCollapsed ? 'mt-12' : 'mt-2'}`}>
                    {visibleLinks.map((link, index) => (
                        <Link
                            prefetch={false}
                            key={index}
                            href={link.href}
                            className={`group flex items-center ${
                                isCollapsed
                                    ? 'justify-center px-2 py-3'
                                    : 'justify-between px-4 py-3'
                            } rounded-lg transition-all duration-200 ${
                                pathname === link.href
                                    ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400'
                            }`}
                            title={isCollapsed ? link.text : ''}
                        >
                            <div
                                className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}
                            >
                                <span className='transition-colors duration-200'>
                                    {link.icon}
                                </span>
                                {!isCollapsed && (
                                    <span className='text-sm font-medium'>
                                        {link.text}
                                    </span>
                                )}
                            </div>
                            {!isCollapsed && pathname === link.href && (
                                <ChevronRight
                                    size={16}
                                    className='opacity-50'
                                />
                            )}
                        </Link>
                    ))}
                </div>
            </nav>
        </aside>
    );
};

export default Collegelinks;
