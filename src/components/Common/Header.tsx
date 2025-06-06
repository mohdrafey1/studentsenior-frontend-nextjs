"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { Moon, Sun, Menu, X } from "lucide-react";

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pathname = usePathname();
    const { currentUser } = useSelector((state: RootState) => state.user);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);

        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const menuItems: { name: string; path: string }[] = [
        { name: "Home", path: "/" },
        { name: "Collection", path: "/collections" },
        { name: "Add Your College", path: "/add-college" },
        { name: "Leaderboard", path: "/leaderboard" },
    ];

    return (
        <header className="sticky top-0 left-0 w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900  z-50 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 group"
                    >
                        <div className="relative">
                            <Image
                                src="/assets/cropped_circle_image.png"
                                alt="logo"
                                width={40}
                                height={40}
                                className="transition-transform duration-200 group-hover:scale-110 rounded-full"
                                priority
                            />
                        </div>
                        <span className="text-base sm:text-3xl font-bold text-gray-900 dark:text-white">
                            <span className="text-blue-600 dark:text-blue-400 text-3xl sm:text-4xl">
                                S
                            </span>
                            tudent
                            <span className="text-blue-500 dark:text-blue-300">
                                {" "}
                                Senior
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`px-4 py-2 rounded-lg text font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                    pathname === item.path
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-700" />
                            )}
                        </button>

                        {/* User Profile or Login */}
                        {currentUser ? (
                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
                            >
                                <Image
                                    src={
                                        currentUser.profilePicture ||
                                        "/default-avatar.png"
                                    }
                                    alt="Profile"
                                    width={36}
                                    height={36}
                                    className="rounded-full object-cover border-2 border-blue-500 dark:border-blue-400 transition-transform duration-200 group-hover:scale-105"
                                />
                                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {currentUser.username}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href={{
                                    pathname: "/sign-in",
                                    query: { from: pathname },
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-lg hover:shadow-xl"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700  transition-all duration-300 z-40 ${
                    isMenuOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-4"
                }`}
            >
                <nav className="container mx-auto px-4 py-4">
                    <div className="flex flex-col space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                                    pathname === item.path
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {currentUser && (
                            <Link
                                href="/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                            >
                                <Image
                                    src={
                                        currentUser.profilePicture ||
                                        "/assets/logo.jpg"
                                    }
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
                                />
                                <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                                    {currentUser.username}
                                </span>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
