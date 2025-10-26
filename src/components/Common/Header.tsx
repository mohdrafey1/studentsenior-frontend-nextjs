'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { RootState } from '@/redux/store';
import { Moon, Sun, Menu, X, User, LogOut, Wallet } from 'lucide-react';
import { signOut } from '@/redux/slices/userSlice';
import { api } from '@/config/apiUrls';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.user);

    // Initialize theme from localStorage or system preference
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
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            dispatch(signOut());
            router.push('/');
        }
    };

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const toggleProfileDropdown = () =>
        setIsProfileDropdownOpen((prev) => !prev);

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

    const menuItems: { name: string; path: string; isExternal?: boolean }[] = [
        { name: 'Home', path: '/' },
        { name: 'Collection', path: '/collections' },
        { name: 'Leaderboard', path: '/leaderboard' },
        {
            name: 'Blogs',
            path: 'https://blog.studentsenior.com',
            isExternal: true,
        },
        {
            name: 'Course',
            path: 'https://course.studentsenior.com',
            isExternal: true,
        },
    ];

    return (
        <header className='sticky top-0 left-0 w-full bg-white dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-all duration-300'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <Link
                        href='/'
                        className='flex items-center space-x-2 group'
                    >
                        <div className='relative'>
                            <Image
                                src='/assets/cropped_circle_image.png'
                                alt='logo'
                                width={40}
                                height={40}
                                className='transition-transform duration-300 group-hover:scale-110 rounded-full'
                                priority
                            />
                        </div>
                        <span className='text-xl font-bold text-gray-900 dark:text-white tracking-tight'>
                            <span className='text-blue-600 dark:text-blue-400'>
                                Student
                            </span>
                            <span className='text-gray-700 dark:text-gray-300'>
                                Senior
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden lg:flex items-center space-x-1'>
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.isExternal ? item.path : item.path}
                                target={item.isExternal ? '_blank' : undefined}
                                rel={
                                    item.isExternal
                                        ? 'noopener noreferrer'
                                        : undefined
                                }
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 ${
                                    pathname === item.path
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                            >
                                {item.name}
                                {item.isExternal && (
                                    <span className='ml-1 text-xs opacity-70'>
                                        ↗
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side actions */}
                    <div className='flex items-center space-x-3'>
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className='p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
                            aria-label='Toggle theme'
                        >
                            {isDarkMode ? (
                                <Sun className='w-5 h-5 text-yellow-500' />
                            ) : (
                                <Moon className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                            )}
                        </button>

                        {/* User Profile or Login */}
                        {currentUser ? (
                            <div className='relative'>
                                <button
                                    onClick={toggleProfileDropdown}
                                    className='hidden lg:flex items-center space-x-2 p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group'
                                >
                                    <Image
                                        src={
                                            currentUser.profilePicture ||
                                            '/default-avatar.png'
                                        }
                                        alt='Profile'
                                        width={36}
                                        height={36}
                                        className='rounded-full h-9 object-cover border-2 border-white dark:border-gray-800 shadow-sm transition-transform duration-200 group-hover:scale-105'
                                    />
                                    {/* <span className='hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        {currentUser.username}
                                    </span> */}
                                    {/* <ChevronDown
                                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                            isProfileDropdownOpen
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    /> */}
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileDropdownOpen && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-99999'>
                                        <Link
                                            href='/profile'
                                            className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                                            onClick={() =>
                                                setIsProfileDropdownOpen(false)
                                            }
                                        >
                                            <User className='w-4 h-4 mr-2' />
                                            Profile
                                        </Link>
                                        <Link
                                            href='/wallet'
                                            className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                                            onClick={() =>
                                                setIsProfileDropdownOpen(false)
                                            }
                                        >
                                            <Wallet className='w-4 h-4 mr-2' />
                                            Wallet
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className='flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                                        >
                                            <LogOut className='w-4 h-4 mr-2' />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='flex items-center space-x-2'>
                                <Link
                                    href={{
                                        pathname: '/sign-up',
                                        query: { from: pathname },
                                    }}
                                    className='hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    href={{
                                        pathname: '/sign-in',
                                        query: { from: pathname },
                                    }}
                                    className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md'
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className='lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
                            aria-label='Toggle menu'
                        >
                            {isMenuOpen ? (
                                <X className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                            ) : (
                                <Menu className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`lg:hidden fixed py-3 inset-x-0 top-0 min-h-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-50 ${
                    isMenuOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-4'
                }`}
            >
                <p
                    className='w-full flex justify-end px-8 pt-6'
                    onClick={() => setIsMenuOpen(false)}
                >
                    <X className='w-8 h-8 bg-red-500 p-2 cursor-pointer rounded-3xl text-white hover:text-gray-900 dark:text-gray-300' />
                </p>
                <nav className='container mx-auto px-2 py-4 flex flex-col items-center justify-center text-center'>
                    <div className='flex flex-col space-y-1 my-auto min-w-3/4'>
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-8 py-3 rounded-md text-base font-medium transition-all duration-200 flex items-center ${
                                    pathname === item.path
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 bg-blue-900/10 dark:hover:bg-gray-800'
                                }`}
                            >
                                {item.name}
                                {item.isExternal && (
                                    <span className='ml-2 text-xs opacity-70'>
                                        ↗
                                    </span>
                                )}
                            </Link>
                        ))}

                        {!currentUser ? (
                            <div className='flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-2'>
                                <Link
                                    href={{
                                        pathname: '/sign-in',
                                        query: { from: pathname },
                                    }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className='px-4 py-3 text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors duration-200'
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={{
                                        pathname: '/sign-up',
                                        query: { from: pathname },
                                    }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className='px-4 py-3 text-center text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-md transition-colors duration-200'
                                >
                                    Create Account
                                </Link>
                            </div>
                        ) : (
                            <div className='flex flex-col space-y-1 pt-4 border-t border-gray-200 dark:border-gray-700 mt-2'>
                                <Link
                                    href='/profile'
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-8 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 bg-blue-900/10 dark:hover:bg-gray-800`}
                                >
                                    <Image
                                        src={
                                            currentUser.profilePicture ||
                                            '/default-avatar.png'
                                        }
                                        alt='Profile'
                                        width={30}
                                        height={30}
                                        className='rounded-full h-9 object-cover mr-3 border-2 border-white dark:border-gray-800'
                                    />
                                    {currentUser.username}
                                </Link>
                                <Link
                                    href='/wallet'
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-8 py-3 rounded-md text-base font-medium transition-all duration-200 flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 bg-blue-900/10 dark:hover:bg-gray-800`}
                                >
                                    <Wallet className='w-5 h-5 mr-3' />
                                    Wallet
                                </Link>
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        setIsMenuOpen(false);
                                    }}
                                    className={`px-8 py-3 rounded-md text-base font-medium transition-all duration-200 flex items-center w-full text-red-600 dark:text-red-400 hover:bg-gray-50 bg-blue-900/10 dark:hover:bg-gray-800`}
                                >
                                    <LogOut className='w-5 h-5 mr-3' />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Backdrop for mobile menu */}
            {isMenuOpen && (
                <div
                    className='fixed inset-0 bg-black/20 dark:bg-black/40 z-30 lg:hidden'
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default Header;
