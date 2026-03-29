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

    // Scroll detection for shadow
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
            {/* ── Header bar ── */}
            <header
                className={`sticky top-0 left-0 w-full z-50 transition-all duration-300
                    bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl
                    border-b border-gray-200/60 dark:border-white/[0.06]
                    ${scrolled ? 'shadow-lg shadow-black/5 dark:shadow-black/30' : ''}
                `}
            >
                <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-[64px]'>
                        {/* ── Logo ── */}
                        <Link
                            href='/'
                            className='flex items-center gap-2.5 group shrink-0'
                        >
                            <div className='relative'>
                                <div className='absolute inset-0 rounded-full bg-blue-500/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                <Image
                                    src='/assets/cropped_circle_image.png'
                                    alt='StudentSenior logo'
                                    width={38}
                                    height={38}
                                    className='relative rounded-full ring-2 ring-blue-500/20 group-hover:ring-blue-500/50 transition-all duration-300 group-hover:scale-105'
                                    priority
                                />
                            </div>
                            <span className='text-[17px] font-bold tracking-tight'>
                                <span className='bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'>
                                    Student
                                </span>
                                <span className='text-gray-800 dark:text-gray-100'>
                                    Senior
                                </span>
                            </span>
                        </Link>

                        {/* ── Desktop Nav ── */}
                        <nav className='hidden lg:flex items-center gap-1'>
                            {menuItems.map((item) => (
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
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                                        ${
                                            isActive(item.path)
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-white/[0.06]'
                                        }`}
                                >
                                    {item.name}
                                    {item.isExternal && (
                                        <span className='ml-1 text-[10px]'>
                                            ↗
                                        </span>
                                    )}
                                    {/* Active underline */}
                                    <span
                                        className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300
                                        ${isActive(item.path) ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'}
                                    `}
                                    />
                                </Link>
                            ))}
                        </nav>

                        {/* ── Right actions ── */}
                        <div className='flex items-center gap-2'>
                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                aria-label='Toggle theme'
                                className='p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all duration-200'
                            >
                                {isDarkMode ? (
                                    <Sun className='w-[18px] h-[18px] text-amber-400' />
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
                                        className='flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all duration-200 group'
                                    >
                                        <div className='relative'>
                                            <Image
                                                src={
                                                    currentUser.profilePicture ||
                                                    '/default-avatar.png'
                                                }
                                                alt='Profile'
                                                width={34}
                                                height={34}
                                                className='rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all duration-200'
                                            />
                                            <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-gray-950 rounded-full' />
                                        </div>
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[90px] truncate'>
                                            {currentUser.username}
                                        </span>
                                        <ChevronDown
                                            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Profile dropdown */}
                                    <div
                                        className={`absolute right-0 mt-2 w-52 transition-all duration-200 origin-top-right
                                        ${
                                            isProfileDropdownOpen
                                                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                                                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                        }`}
                                    >
                                        <div className='rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-gray-900 shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden'>
                                            {/* User info header */}
                                            <div className='px-4 py-3 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 border-b border-gray-100 dark:border-white/[0.06]'>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    Signed in as
                                                </p>
                                                <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                                                    {currentUser.username}
                                                </p>
                                            </div>
                                            <div className='p-1.5 flex flex-col gap-0.5'>
                                                <Link
                                                    prefetch={false}
                                                    href='/profile'
                                                    onClick={() =>
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors duration-150'
                                                >
                                                    <User className='w-4 h-4 text-blue-500' />
                                                    Profile
                                                </Link>
                                                <Link
                                                    prefetch={false}
                                                    href='/wallet'
                                                    onClick={() =>
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors duration-150'
                                                >
                                                    <Wallet className='w-4 h-4 text-violet-500' />
                                                    Wallet
                                                </Link>
                                                <div className='my-1 h-px bg-gray-100 dark:bg-white/[0.06]' />
                                                <button
                                                    onClick={() => {
                                                        handleSignOut();
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className='flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150'
                                                >
                                                    <LogOut className='w-4 h-4' />
                                                    Sign Out
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
                                            pathname: '/sign-up',
                                            query: { from: pathname },
                                        }}
                                        className='px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all duration-200'
                                    >
                                        Sign Up
                                    </Link>
                                    <Link
                                        prefetch={false}
                                        href={{
                                            pathname: '/sign-in',
                                            query: { from: pathname },
                                        }}
                                        className='flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200'
                                    >
                                        <Sparkles className='w-3.5 h-3.5' />
                                        Sign In
                                    </Link>
                                </div>
                            )}

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setIsMenuOpen((p) => !p)}
                                aria-label='Toggle menu'
                                className='lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all duration-200'
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
                    background: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(4px)',
                }}
            />

            {/* ── Mobile drawer panel ── */}
            <div
                className={`fixed top-0 right-0 bottom-0 z-50 w-72 lg:hidden flex flex-col
                    bg-white dark:bg-gray-950
                    border-l border-gray-200 dark:border-white/[0.07]
                    shadow-2xl shadow-black/20
                    transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Drawer header */}
                <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]'>
                    <Link
                        href='/'
                        onClick={() => setIsMenuOpen(false)}
                        className='flex items-center gap-2'
                    >
                        <Image
                            src='/assets/cropped_circle_image.png'
                            alt='logo'
                            width={30}
                            height={30}
                            className='rounded-full'
                        />
                        <span className='text-sm font-bold'>
                            <span className='bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'>
                                Student
                            </span>
                            <span className='text-gray-800 dark:text-gray-100'>
                                Senior
                            </span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className='p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors duration-150'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                {/* Nav links */}
                <nav className='flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1'>
                    {menuItems.map((item) => (
                        <Link
                            prefetch={false}
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                ${
                                    isActive(item.path)
                                        ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                                }`}
                        >
                            {isActive(item.path) && (
                                <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />
                            )}
                            {item.name}
                            {item.isExternal && (
                                <span className='ml-auto text-xs opacity-50'>
                                    ↗
                                </span>
                            )}
                        </Link>
                    ))}

                    {/* Divider */}
                    <div className='my-2 h-px bg-gray-100 dark:bg-white/[0.06]' />

                    {currentUser ? (
                        <>
                            {/* Profile info */}
                            <div className='flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]'>
                                <Image
                                    src={
                                        currentUser.profilePicture ||
                                        '/default-avatar.png'
                                    }
                                    alt='Profile'
                                    width={38}
                                    height={38}
                                    className='rounded-full object-cover ring-2 ring-blue-500/30'
                                />
                                <div className='min-w-0'>
                                    <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                                        {currentUser.username}
                                    </p>
                                    <p className='text-xs text-emerald-500 font-medium'>
                                        ● Online
                                    </p>
                                </div>
                            </div>
                            <Link
                                prefetch={false}
                                href='/profile'
                                onClick={() => setIsMenuOpen(false)}
                                className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors duration-150'
                            >
                                <User className='w-4 h-4 text-blue-500' />
                                My Profile
                            </Link>
                            <Link
                                prefetch={false}
                                href='/wallet'
                                onClick={() => setIsMenuOpen(false)}
                                className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors duration-150'
                            >
                                <Wallet className='w-4 h-4 text-violet-500' />
                                Wallet
                            </Link>
                            <button
                                onClick={() => {
                                    handleSignOut();
                                    setIsMenuOpen(false);
                                }}
                                className='flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150'
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
                                    pathname: '/sign-in',
                                    query: { from: pathname },
                                }}
                                onClick={() => setIsMenuOpen(false)}
                                className='flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-md shadow-blue-500/20 transition-all duration-200'
                            >
                                <Sparkles className='w-4 h-4' />
                                Sign In
                            </Link>
                            <Link
                                prefetch={false}
                                href={{
                                    pathname: '/sign-up',
                                    query: { from: pathname },
                                }}
                                onClick={() => setIsMenuOpen(false)}
                                className='flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors duration-150'
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Theme toggle at bottom */}
                <div className='px-5 py-4 border-t border-gray-100 dark:border-white/[0.06]'>
                    <button
                        onClick={toggleTheme}
                        className='flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors duration-150'
                    >
                        {isDarkMode ? (
                            <>
                                <Sun className='w-4 h-4 text-amber-400' /> Light
                                Mode
                            </>
                        ) : (
                            <>
                                <Moon className='w-4 h-4' /> Dark Mode
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Header;
