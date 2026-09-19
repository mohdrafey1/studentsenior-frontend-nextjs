'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { RootState } from '@/redux/store';
import {
    Moon,
    Sun,
    Menu,
    X,
    User,
    LogOut,
    Wallet,
    ChevronDown,
    Sparkles,
} from 'lucide-react';
import { signOut } from '@/redux/slices/userSlice';
import { api } from '@/config/apiUrls';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.user);

    // Scroll detection for subtle elevation
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Initialize theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const handleSignOut = async () => {
        try {
            await fetch(api.auth.signout, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            dispatch(signOut());
            router.push('/');
        }
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const isHomePage = pathname === '/';
    const menuItems: { name: string; path: string; isExternal?: boolean }[] = [
        { name: 'Home', path: '/' },
        { name: 'Collection', path: '/collections' },
        ...(isHomePage ? [{ name: 'Products', path: '/products' }] : []),
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'Tools', path: '/tools' },
        ...(isHomePage
            ? [
                  {
                      name: 'Blogs',
                      path: 'https://blog.studentsenior.com',
                      isExternal: true,
                  },
              ]
            : []),
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* ── Notion Header Bar ── */}
            <header
                className={`sticky top-0 left-0 w-full z-50 transition-all duration-200
                    bg-white/95 dark:bg-[#191919]/95 backdrop-blur-md
                    border-b border-[#e6e6e6] dark:border-[#2f2f2f]
                    ${
                        scrolled
                            ? 'shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-none'
                            : ''
                    }
                `}
            >
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-[60px] sm:h-[64px]'>
                        {/* ── Logo ── */}
                        <Link
                            href='/'
                            className='flex items-center gap-2.5 group shrink-0'
                        >
                            <div className='relative'>
                                <Image
                                    src='/assets/cropped_circle_image.png'
                                    alt='StudentSenior logo'
                                    width={34}
                                    height={34}
                                    className='rounded-full ring-1 ring-[#e6e6e6] dark:ring-[#383838] transition-transform duration-200 group-hover:scale-105'
                                    priority
                                />
                            </div>
                            <span className='text-[17px] font-bold tracking-tight'>
                                <span className='text-[#000000] dark:text-white'>
                                    Student
                                </span>
                                <span className='text-[#0075de] dark:text-[#62aef0]'>
                                    Senior
                                </span>
                            </span>
                        </Link>

                        {/* ── Desktop Nav ── */}
                        <nav className='hidden lg:flex items-center gap-1'>
                            {menuItems.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        prefetch={false}
                                        key={item.path}
                                        href={item.path}
                                        target={
                                            item.isExternal ? '_blank' : undefined
                                        }
                                        rel={
                                            item.isExternal
                                                ? 'noopener noreferrer'
                                                : undefined
                                        }
                                        className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1
                                            ${
                                                active
                                                    ? 'text-[#0075de] dark:text-[#62aef0] font-semibold bg-[#eaf3fd] dark:bg-[#183153]/70 border border-[#d2e4f9]/60 dark:border-[#224474]/60'
                                                    : 'text-[#615d59] dark:text-[#a39e98] hover:text-[#000000] dark:hover:text-white hover:bg-[#f6f5f4] dark:hover:bg-[#2b2b2b]'
                                            }`}
                                    >
                                        <span>{item.name}</span>
                                        {item.isExternal && (
                                            <span className='text-[10px] text-[#a39e98]'>
                                                ↗
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* ── Right actions ── */}
                        <div className='flex items-center gap-2'>
                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                aria-label='Toggle theme'
                                className='p-2 rounded-lg text-[#615d59] dark:text-[#a39e98] hover:text-[#000000] dark:hover:text-white hover:bg-[#f6f5f4] dark:hover:bg-[#2b2b2b] transition-colors duration-150'
                                title={isDarkMode ? 'Light mode' : 'Dark mode'}
                            >
                                {isDarkMode ? (
                                    <Sun className='w-[18px] h-[18px] text-[#e58b00]' />
                                ) : (
                                    <Moon className='w-[18px] h-[18px]' />
                                )}
                            </button>

                            {/* Auth area */}
                            {currentUser ? (
                                <div
                                    className='relative hidden lg:block'
                                    ref={dropdownRef}
                                >
                                    <button
                                        onClick={() =>
                                            setIsProfileDropdownOpen((p) => !p)
                                        }
                                        className='flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-[#f6f5f4] dark:hover:bg-[#2b2b2b] border border-transparent hover:border-[#e6e6e6] dark:hover:border-[#383838] transition-all duration-150 group'
                                    >
                                        <div className='relative'>
                                            <Image
                                                src={
                                                    currentUser.profilePicture ||
                                                    '/default-avatar.png'
                                                }
                                                alt='Profile'
                                                width={32}
                                                height={32}
                                                className='rounded-full object-cover ring-1 ring-[#e6e6e6] dark:ring-[#383838]'
                                            />
                                            <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#1aae39] border-2 border-white dark:border-[#202020] rounded-full' />
                                        </div>
                                        <span className='text-sm font-semibold text-[#000000] dark:text-[#f0f0f0] max-w-[100px] truncate'>
                                            {currentUser.username}
                                        </span>
                                        <ChevronDown
                                            className={`w-3.5 h-3.5 text-[#a39e98] transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Profile dropdown */}
                                    <div
                                        className={`absolute right-0 mt-2.5 w-64 transition-all duration-200 origin-top-right z-50
                                        ${
                                            isProfileDropdownOpen
                                                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                                                : 'opacity-0 scale-95 -translate-y-1.5 pointer-events-none'
                                        }`}
                                    >
                                        <div className='rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#1f1f1f] shadow-[0_12px_36px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#f0eee6] dark:divide-[#2a2a2a]'>
                                            {/* User Profile Card Header */}
                                            <div className='p-3.5 bg-gradient-to-b from-[#faf9f8] to-white dark:from-[#242424] dark:to-[#1f1f1f]'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='relative shrink-0'>
                                                        <Image
                                                            src={
                                                                currentUser.profilePicture ||
                                                                '/default-avatar.png'
                                                            }
                                                            alt='Profile'
                                                            width={40}
                                                            height={40}
                                                            className='rounded-full object-cover ring-2 ring-[#e6e6e6] dark:ring-[#383838]'
                                                        />
                                                        <span className='absolute bottom-0 right-0 w-3 h-3 bg-[#1aae39] border-2 border-white dark:border-[#1f1f1f] rounded-full' />
                                                    </div>
                                                    <div className='min-w-0 flex-1'>
                                                        <p className='text-sm font-bold text-[#101828] dark:text-white truncate'>
                                                            {currentUser.username}
                                                        </p>
                                                        <div className='flex items-center gap-1.5 mt-0.5'>
                                                            <span className='inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474]'>
                                                                Student
                                                            </span>
                                                            <span className='text-[11px] text-[#8c8883] dark:text-[#787672] truncate'>
                                                                Active
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Navigation Items */}
                                            <div className='p-1.5 space-y-0.5'>
                                                <Link
                                                    prefetch={false}
                                                    href='/profile'
                                                    onClick={() =>
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className='flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#31302e] dark:text-[#ededed] hover:bg-[#f6f5f4] dark:hover:bg-[#282828] transition-colors group'
                                                >
                                                    <div className='flex items-center gap-2.5'>
                                                        <div className='p-1.5 rounded-lg bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] group-hover:scale-105 transition-transform'>
                                                            <User className='w-3.5 h-3.5' />
                                                        </div>
                                                        <span>My Profile</span>
                                                    </div>
                                                </Link>

                                                <Link
                                                    prefetch={false}
                                                    href='/wallet'
                                                    onClick={() =>
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className='flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#31302e] dark:text-[#ededed] hover:bg-[#f6f5f4] dark:hover:bg-[#282828] transition-colors group'
                                                >
                                                    <div className='flex items-center gap-2.5'>
                                                        <div className='p-1.5 rounded-lg bg-[#f0ebf8] dark:bg-[#2b1f3d] text-[#8a3fd6] dark:text-[#c084fc] group-hover:scale-105 transition-transform'>
                                                            <Wallet className='w-3.5 h-3.5' />
                                                        </div>
                                                        <span>Wallet & Credits</span>
                                                    </div>
                                                </Link>

                                                <Link
                                                    prefetch={false}
                                                    href='/tools'
                                                    onClick={() =>
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className='flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#31302e] dark:text-[#ededed] hover:bg-[#f6f5f4] dark:hover:bg-[#282828] transition-colors group'
                                                >
                                                    <div className='flex items-center gap-2.5'>
                                                        <div className='p-1.5 rounded-lg bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] group-hover:scale-105 transition-transform'>
                                                            <Sparkles className='w-3.5 h-3.5' />
                                                        </div>
                                                        <span>Student Tools</span>
                                                    </div>
                                                    <span className='text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80]'>
                                                        New
                                                    </span>
                                                </Link>
                                            </div>

                                            {/* Sign Out Footer */}
                                            <div className='p-1.5'>
                                                <button
                                                    onClick={() => {
                                                        handleSignOut();
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className='flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#e11d48] dark:text-[#fb7185] hover:bg-[#fdf2f2] dark:hover:bg-[#3b1118] transition-colors'
                                                >
                                                    <div className='p-1.5 rounded-lg bg-[#fdf2f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185]'>
                                                        <LogOut className='w-3.5 h-3.5' />
                                                    </div>
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='hidden lg:flex items-center gap-2'>
                                    <Link
                                        prefetch={false}
                                        href={{
                                            pathname: '/sign-in',
                                            query: { from: pathname },
                                        }}
                                        className='px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#31302e] dark:text-[#d3d1cb] hover:text-[#000000] dark:hover:text-white bg-white dark:bg-[#202020] hover:bg-[#f6f5f4] dark:hover:bg-[#2b2b2b] border border-[#e6e6e6] dark:border-[#383838] rounded-lg transition-all duration-150'
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        prefetch={false}
                                        href={{
                                            pathname: '/sign-up',
                                            query: { from: pathname },
                                        }}
                                        className='inline-flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.2)] transition-all duration-150'
                                    >
                                        <Sparkles className='w-3.5 h-3.5' />
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setIsMenuOpen((p) => !p)}
                                aria-label='Toggle menu'
                                className='lg:hidden p-2 rounded-lg text-[#615d59] dark:text-[#a39e98] hover:text-[#000000] dark:hover:text-white hover:bg-[#f6f5f4] dark:hover:bg-[#2b2b2b] transition-all duration-150'
                            >
                                {isMenuOpen ? (
                                    <X className='w-5 h-5' />
                                ) : (
                                    <Menu className='w-5 h-5' />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile drawer overlay ── */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
                style={{
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                }}
            />

            {/* ── Mobile drawer panel ── */}
            <div
                className={`fixed top-0 right-0 bottom-0 z-50 w-72 lg:hidden flex flex-col
                    bg-white dark:bg-[#202020]
                    border-l border-[#e6e6e6] dark:border-[#2f2f2f]
                    shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Drawer header */}
                <div className='flex items-center justify-between px-5 py-4 border-b border-[#f0eee6] dark:border-[#2f2f2f]'>
                    <Link
                        href='/'
                        onClick={() => setIsMenuOpen(false)}
                        className='flex items-center gap-2'
                    >
                        <Image
                            src='/assets/cropped_circle_image.png'
                            alt='logo'
                            width={28}
                            height={28}
                            className='rounded-full'
                        />
                        <span className='text-sm font-bold tracking-tight'>
                            <span className='text-[#000000] dark:text-white'>
                                Student
                            </span>
                            <span className='text-[#0075de] dark:text-[#62aef0]'>
                                Senior
                            </span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className='p-1.5 rounded-lg text-[#615d59] dark:text-[#a39e98] hover:bg-[#f6f5f4] dark:hover:bg-[#2b2b2b] transition-colors duration-150'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                {/* Nav links */}
                <nav className='flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1'>
                    {menuItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                prefetch={false}
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                                    ${
                                        active
                                            ? 'bg-[#eaf3fd] dark:bg-[#183153]/70 text-[#0075de] dark:text-[#62aef0] font-semibold border border-[#d2e4f9]/60 dark:border-[#224474]/60'
                                            : 'text-[#31302e] dark:text-[#d3d1cb] hover:bg-[#f6f5f4] dark:hover:bg-[#2a2a2a]'
                                    }`}
                            >
                                {active && (
                                    <span className='w-1.5 h-1.5 rounded-full bg-[#0075de]' />
                                )}
                                <span>{item.name}</span>
                                {item.isExternal && (
                                    <span className='ml-auto text-xs text-[#a39e98]'>
                                        ↗
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    {/* Divider */}
                    <div className='my-2 h-px bg-[#f0eee6] dark:bg-[#2f2f2f]' />

                    {currentUser ? (
                        <>
                            {/* Profile info */}
                            <div className='flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#f6f5f4] dark:bg-[#262626] border border-[#e6e6e6] dark:border-[#333333]'>
                                <Image
                                    src={
                                        currentUser.profilePicture ||
                                        '/default-avatar.png'
                                    }
                                    alt='Profile'
                                    width={36}
                                    height={36}
                                    className='rounded-full object-cover ring-1 ring-[#e6e6e6] dark:ring-[#383838]'
                                />
                                <div className='min-w-0'>
                                    <p className='text-sm font-bold text-[#000000] dark:text-white truncate'>
                                        {currentUser.username}
                                    </p>
                                    <p className='text-xs text-[#1aae39] font-medium flex items-center gap-1'>
                                        <span className='w-1.5 h-1.5 rounded-full bg-[#1aae39]' />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <Link
                                prefetch={false}
                                href='/profile'
                                onClick={() => setIsMenuOpen(false)}
                                className='flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#31302e] dark:text-[#d3d1cb] hover:bg-[#f6f5f4] dark:hover:bg-[#2a2a2a] transition-colors duration-150'
                            >
                                <User className='w-4 h-4 text-[#0075de]' />
                                My Profile
                            </Link>
                            <Link
                                prefetch={false}
                                href='/wallet'
                                onClick={() => setIsMenuOpen(false)}
                                className='flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#31302e] dark:text-[#d3d1cb] hover:bg-[#f6f5f4] dark:hover:bg-[#2a2a2a] transition-colors duration-150'
                            >
                                <Wallet className='w-4 h-4 text-[#8a3fd6]' />
                                Wallet
                            </Link>
                            <button
                                onClick={() => {
                                    handleSignOut();
                                    setIsMenuOpen(false);
                                }}
                                className='flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#e03e3e] hover:bg-[#ffebe6] dark:hover:bg-[#3d1818] transition-colors duration-150'
                            >
                                <LogOut className='w-4 h-4' />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className='flex flex-col gap-2 pt-2'>
                            <Link
                                prefetch={false}
                                href={{
                                    pathname: '/sign-up',
                                    query: { from: pathname },
                                }}
                                onClick={() => setIsMenuOpen(false)}
                                className='flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium text-white bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.2)] transition-all duration-150'
                            >
                                <Sparkles className='w-4 h-4' />
                                Sign Up
                            </Link>
                            <Link
                                prefetch={false}
                                href={{
                                    pathname: '/sign-in',
                                    query: { from: pathname },
                                }}
                                onClick={() => setIsMenuOpen(false)}
                                className='flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-[#31302e] dark:text-[#d3d1cb] bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#383838] hover:bg-[#f6f5f4] dark:hover:bg-[#2b2b2b] transition-colors duration-150'
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Theme toggle at bottom */}
                <div className='px-5 py-4 border-t border-[#f0eee6] dark:border-[#2f2f2f]'>
                    <button
                        onClick={toggleTheme}
                        className='flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-sm font-medium text-[#615d59] dark:text-[#a39e98] hover:bg-[#f6f5f4] dark:hover:bg-[#2b2b2b] transition-colors duration-150'
                    >
                        {isDarkMode ? (
                            <>
                                <Sun className='w-4 h-4 text-[#e58b00]' />
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <Moon className='w-4 h-4' />
                                <span>Dark Mode</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Header;
