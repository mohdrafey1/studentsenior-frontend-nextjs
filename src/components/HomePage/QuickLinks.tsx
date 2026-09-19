'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    Download,
    X,
    Zap,
    BookOpen,
    Search,
    GraduationCap,
    ShoppingBag,
    Users,
    Building2,
    Check,
    ArrowRight,
    PlusCircle,
} from 'lucide-react';

type QuickAccessItem = {
    icon: React.ReactNode;
    label: string;
    path: string;
    ariaLabel: string;
    description: string;
    color: string;
    stickerBg: string;
    badgeText: string;
};

type College = {
    name: string;
    slug: string;
};

// Minimal typing for the BeforeInstallPromptEvent used by Chromium browsers
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
}

const QuickLinks: React.FC<{ colleges: College[] }> = ({ colleges }) => {
    const [visible, setVisible] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeItem, setActiveItem] = useState<QuickAccessItem | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [installPromptEvent, setInstallPromptEvent] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Capture the PWA install prompt event when available
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            const bipEvent = e as BeforeInstallPromptEvent;
            setInstallPromptEvent(bipEvent);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            setInstallPromptEvent(null);
            setIsInstallable(false);
            toast.success('App installed successfully');
        };

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt as EventListener,
        );
        window.addEventListener('appinstalled', handleAppInstalled);
        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt as EventListener,
            );
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/android/i.test(userAgent)) {
            setIsAndroid(true);
        }
    }, []);

    // Handle Escape key to close modal & lock body scroll
    useEffect(() => {
        if (!visible) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCloseModal();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        // Auto-focus search input on modal open
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 50);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [visible]);

    const handleInstall = useCallback(async () => {
        try {
            if (!installPromptEvent) {
                toast.error(
                    'Install not available on this device/browser right now.',
                );
                return;
            }
            await installPromptEvent.prompt();
            const choice = await installPromptEvent.userChoice;
            if (choice.outcome === 'accepted') {
                toast.success('Installing app...');
            } else {
                toast('Installation dismissed');
            }
            setInstallPromptEvent(null);
            setIsInstallable(false);
        } catch (err) {
            toast.error('Failed to start installation');
            console.log(err);
        }
    }, [installPromptEvent]);

    const handleOpenModal = (item: QuickAccessItem) => {
        setActiveItem(item);
        setSearchQuery('');
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
        setSelectedCollege('');
        setSearchQuery('');
        setActiveItem(null);
    };

    const handleNavigate = async (collegeSlug?: string) => {
        const targetCollege = collegeSlug || selectedCollege;
        if (!targetCollege) {
            toast.error('Please select a college first!');
            return;
        }

        setIsNavigating(true);
        try {
            const targetPath = activeItem?.path || 'resources';
            await router.push(`/${targetCollege}/${targetPath}`);
            setVisible(false);
        } catch (error) {
            toast.error('Navigation failed. Please try again.');
            console.log(error);
        } finally {
            setIsNavigating(false);
        }
    };

    const quickAccessItems: QuickAccessItem[] = [
        {
            icon: <Zap className='w-5 h-5 text-[#dd5b00]' strokeWidth={2.2} />,
            label: 'PYQs',
            path: 'pyqs',
            ariaLabel: 'Access Past Year Questions and previous exam papers',
            description: 'Previous year question papers',
            color: 'bg-[#fdf1e8] dark:bg-[#381e0f] text-[#dd5b00]',
            stickerBg: 'bg-[#fdf1e8] dark:bg-[#381e0f]',
            badgeText: 'Exam Papers',
        },
        {
            icon: <BookOpen className='w-5 h-5 text-[#1aae39]' strokeWidth={2.2} />,
            label: 'Notes',
            path: 'notes',
            ariaLabel: 'Access comprehensive study notes and materials',
            description: 'Curated study materials',
            color: 'bg-[#eaf7ec] dark:bg-[#112d1b] text-[#1aae39]',
            stickerBg: 'bg-[#eaf7ec] dark:bg-[#112d1b]',
            badgeText: 'Study Notes',
        },
        {
            icon: <Search className='w-5 h-5 text-[#0075de]' strokeWidth={2.2} />,
            label: 'Resources',
            path: 'resources',
            ariaLabel: 'Browse extensive academic resources and tools',
            description: 'Academic resources & tools',
            color: 'bg-[#eaf3fd] dark:bg-[#10243e] text-[#0075de]',
            stickerBg: 'bg-[#eaf3fd] dark:bg-[#10243e]',
            badgeText: 'All Resources',
        },
        {
            icon: (
                <GraduationCap className='w-5 h-5 text-[#8a3fd6]' strokeWidth={2.2} />
            ),
            label: 'Seniors',
            path: 'seniors',
            ariaLabel: 'Connect with senior students and mentors',
            description: 'Connect with experienced seniors',
            color: 'bg-[#f5edfd] dark:bg-[#2b1744] text-[#8a3fd6]',
            stickerBg: 'bg-[#f5edfd] dark:bg-[#2b1744]',
            badgeText: 'Mentorship',
        },
        {
            icon: <ShoppingBag className='w-5 h-5 text-[#2a9d99]' strokeWidth={2.2} />,
            label: 'Store',
            path: 'store',
            ariaLabel: 'Visit student marketplace for books and materials',
            description: 'Student marketplace',
            color: 'bg-[#eaf6f6] dark:bg-[#122c2c] text-[#2a9d99]',
            stickerBg: 'bg-[#eaf6f6] dark:bg-[#122c2c]',
            badgeText: 'Marketplace',
        },
        {
            icon: <Users className='w-5 h-5 text-[#ff64c8]' strokeWidth={2.2} />,
            label: 'Groups',
            path: 'groups',
            ariaLabel: 'Join active student community discussions',
            description: 'Join student discussions',
            color: 'bg-[#fdeaf5] dark:bg-[#3d132e] text-[#ff64c8]',
            stickerBg: 'bg-[#fdeaf5] dark:bg-[#3d132e]',
            badgeText: 'Community',
        },
    ];

    // Filter colleges based on user search query
    const filteredColleges = useMemo(() => {
        if (!searchQuery.trim()) return colleges;
        const query = searchQuery.toLowerCase().trim();
        return colleges.filter(
            (c) =>
                c.name.toLowerCase().includes(query) ||
                c.slug.toLowerCase().includes(query),
        );
    }, [colleges, searchQuery]);

    return (
        <section
            className='py-14 sm:py-18 bg-[#f6f5f4] dark:bg-[#191919]'
            aria-labelledby='quick-access-heading'
        >
            <div className='container mx-auto px-4 sm:px-6 max-w-6xl'>
                <header className='text-center mb-10'>
                    {/* <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#262626] text-[#0075de] dark:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] mb-3'>
                        <span>Directory</span>
                    </div> */}
                    <h2
                        id='quick-access-heading'
                        className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#000000] dark:text-white tracking-[-0.025em] mb-2.5'
                    >
                        Quick Access Hub
                    </h2>
                    <p className='text-sm sm:text-base text-[#615d59] dark:text-[#a39e98] max-w-xl mx-auto'>
                        Everything you need for academic success, organized in one place
                    </p>
                </header>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4'>
                    {quickAccessItems.map((item, index) => (
                        <article
                            key={index}
                            className='group cursor-pointer'
                            onClick={() => handleOpenModal(item)}
                            role='button'
                            tabIndex={0}
                            aria-label={item.ariaLabel}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleOpenModal(item);
                                }
                            }}
                        >
                            <div className='bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 h-full flex flex-col items-center text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-[#0075de] dark:hover:border-[#0075de] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'>
                                {/* Sticker Icon Tile */}
                                <div
                                    className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-105`}
                                >
                                    {item.icon}
                                </div>

                                {/* Label */}
                                <h3 className='font-semibold text-sm sm:text-base text-[#000000] dark:text-white mb-1 tracking-[-0.125px]'>
                                    {item.label}
                                </h3>

                                {/* Subtitle description */}
                                <p className='text-xs text-[#615d59] dark:text-[#a39e98] leading-snug line-clamp-2'>
                                    {item.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                {/* App Installation CTA Banner */}
                <aside
                    className='mt-10 sm:mt-12'
                    aria-label='Mobile app promotion'
                >
                    <div className='bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='flex items-center gap-4 text-center md:text-left'>
                            <div className='w-12 h-12 rounded-xl bg-[#f6f5f4] dark:bg-[#2a2a2a] border border-[#e6e6e6] dark:border-[#383838] flex items-center justify-center text-2xl flex-shrink-0'>
                                📱
                            </div>
                            <div>
                                <h3 className='text-base sm:text-lg font-bold text-[#000000] dark:text-white tracking-[-0.2px]'>
                                    Get the Student Senior Mobile App
                                </h3>
                                <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a39e98]'>
                                    Faster access, offline reading, and real-time push notifications
                                </p>
                            </div>
                        </div>

                        {isAndroid ? (
                            <a
                                href='intent://studentsenior.com/#Intent;scheme=https;package=com.mohdrafey1.studentsenior;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior;end'
                                aria-label='Open Student Senior mobile application'
                                className='inline-flex items-center gap-2 bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] text-white font-medium text-sm py-2.5 px-5 rounded-full transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.2)] flex-shrink-0'
                            >
                                <Download className='w-4 h-4' />
                                <span>Open App</span>
                            </a>
                        ) : (
                            <button
                                onClick={handleInstall}
                                aria-label='Install Student Senior mobile application'
                                className='inline-flex items-center gap-2 bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] text-white font-medium text-sm py-2.5 px-5 rounded-full transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
                                disabled={!isInstallable}
                            >
                                <Download className='w-4 h-4' />
                                <span>
                                    {isInstallable ? 'Install App' : 'Install App'}
                                </span>
                            </button>
                        )}
                    </div>
                </aside>
            </div>

            {/* Notion-styled Interactive College Selection Dialog */}
            {visible && (
                <div
                    className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6'
                    role='dialog'
                    aria-modal='true'
                    aria-labelledby='modal-title'
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCloseModal();
                        }
                    }}
                >
                    <div
                        ref={modalRef}
                        className='bg-white dark:bg-[#202020] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150'
                    >
                        {/* Modal Header */}
                        <div className='p-5 sm:p-6 border-b border-[#e6e6e6] dark:border-[#2f2f2f] flex items-start justify-between gap-4'>
                            <div className='flex items-center gap-3'>
                                {activeItem && (
                                    <div
                                        className={`w-10 h-10 rounded-xl ${activeItem.color} flex items-center justify-center flex-shrink-0`}
                                    >
                                        {activeItem.icon}
                                    </div>
                                )}
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <h3
                                            id='modal-title'
                                            className='text-base sm:text-lg font-bold text-[#000000] dark:text-white tracking-[-0.2px]'
                                        >
                                            Select Your College
                                        </h3>
                                        {activeItem && (
                                            <span className='px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#a39e98] border border-[#e6e6e6] dark:border-[#383838]'>
                                                {activeItem.label}
                                            </span>
                                        )}
                                    </div>
                                    <p className='text-xs text-[#615d59] dark:text-[#a39e98] mt-0.5'>
                                        Choose your campus to jump directly into {activeItem?.description?.toLowerCase() || 'resources'}.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className='w-8 h-8 rounded-lg flex items-center justify-center text-[#615d59] hover:text-[#000000] dark:text-[#a39e98] dark:hover:text-white hover:bg-[#f6f5f4] dark:hover:bg-[#2a2a2a] transition-colors flex-shrink-0 cursor-pointer'
                                aria-label='Close dialog'
                            >
                                <X className='w-4 h-4' />
                            </button>
                        </div>

                        {/* Search Input Bar */}
                        <div className='p-3 sm:px-6 sm:pt-4 sm:pb-2'>
                            <div className='relative'>
                                <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]' />
                                <input
                                    ref={searchInputRef}
                                    type='text'
                                    placeholder='Search colleges by name or city...'
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className='w-full pl-9.5 pr-8 py-2.5 bg-[#f6f5f4] dark:bg-[#262626] border border-[#e6e6e6] dark:border-[#383838] rounded-xl text-sm text-[#000000] dark:text-white placeholder-[#a39e98] outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a39e98] hover:text-[#000000] dark:hover:text-white p-1 rounded-md'
                                    >
                                        <X className='w-3.5 h-3.5' />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* College List Options */}
                        <div className='flex-1 overflow-y-auto p-3 sm:px-6 sm:py-2 space-y-1.5 max-h-[320px]'>
                            {filteredColleges.length > 0 ? (
                                filteredColleges.map((college) => {
                                    const isSelected =
                                        selectedCollege === college.slug;
                                    return (
                                        <div
                                            key={college.slug}
                                            onClick={() =>
                                                setSelectedCollege(college.slug)
                                            }
                                            onDoubleClick={() =>
                                                handleNavigate(college.slug)
                                            }
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#eaf3fd] dark:bg-[#183153] border-[#0075de] dark:border-[#0075de] shadow-sm'
                                                    : 'bg-white dark:bg-[#202020] border-[#e6e6e6] dark:border-[#2f2f2f] hover:bg-[#faf9f8] dark:hover:bg-[#262626] hover:border-[#d0d0d0] dark:hover:border-[#3a3a3a]'
                                            }`}
                                        >
                                            <div className='flex items-center gap-3 min-w-0 pr-2'>
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                        isSelected
                                                            ? 'bg-[#0075de] text-white'
                                                            : 'bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#a39e98]'
                                                    }`}
                                                >
                                                    <Building2 className='w-4 h-4' />
                                                </div>
                                                <div className='min-w-0'>
                                                    <p
                                                        className={`text-sm font-semibold truncate ${
                                                            isSelected
                                                                ? 'text-[#0075de] dark:text-[#62aef0]'
                                                                : 'text-[#000000] dark:text-white'
                                                        }`}
                                                    >
                                                        {college.name}
                                                    </p>
                                                    <p className='text-[11px] text-[#a39e98]'>
                                                        /{college.slug}
                                                    </p>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className='flex items-center justify-center w-5 h-5 rounded-full bg-[#0075de] text-white flex-shrink-0'>
                                                    <Check className='w-3 h-3' strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='py-8 text-center px-4'>
                                    <Building2 className='w-8 h-8 text-[#a39e98] mx-auto mb-2 opacity-50' />
                                    <p className='text-sm font-semibold text-[#000000] dark:text-white mb-1'>
                                        No colleges found
                                    </p>
                                    <p className='text-xs text-[#615d59] dark:text-[#a39e98] mb-4'>
                                        We couldn’t find any institution matching &quot;{searchQuery}&quot;.
                                    </p>
                                    <Link
                                        href='/add-college'
                                        className='inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f6f5f4] dark:bg-[#262626] hover:bg-[#eaf3fd] dark:hover:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] text-xs font-medium transition-all'
                                    >
                                        <PlusCircle className='w-3.5 h-3.5' />
                                        <span>Add your college</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className='p-4 sm:p-6 bg-[#faf9f8] dark:bg-[#1c1c1c] border-t border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row items-center justify-between gap-3'>
                            <p className='text-xs text-[#615d59] dark:text-[#a39e98] text-center sm:text-left'>
                                Can’t find your college?{' '}
                                <Link
                                    href='/add-college'
                                    className='text-[#0075de] dark:text-[#62aef0] font-medium hover:underline'
                                >
                                    Add it here
                                </Link>
                            </p>

                            <div className='flex items-center gap-2 w-full sm:w-auto'>
                                <button
                                    type='button'
                                    onClick={handleCloseModal}
                                    className='flex-1 sm:flex-initial py-2.5 px-5 border border-[#e6e6e6] dark:border-[#383838] rounded-full text-xs font-medium text-[#615d59] dark:text-[#d3d1cb] hover:bg-[#f6f5f4] dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer'
                                    disabled={isNavigating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleNavigate()}
                                    disabled={!selectedCollege || isNavigating}
                                    className='flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 py-2.5 px-6 bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] text-white text-xs font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.2)] cursor-pointer'
                                >
                                    <span>
                                        {isNavigating
                                            ? 'Opening...'
                                            : activeItem
                                              ? `Go to ${activeItem.label}`
                                              : 'Continue'}
                                    </span>
                                    <ArrowRight className='w-3.5 h-3.5' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default QuickLinks;
