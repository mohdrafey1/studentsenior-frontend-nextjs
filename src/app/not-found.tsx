'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
            <div className='relative'>
                {/* Background Pattern */}
                <div className='absolute inset-0 bg-grid-gray-100/[0.05] dark:bg-grid-gray-700/[0.05] bg-[size:20px_20px] [mask-image:linear-gradient(0deg,transparent,white,transparent)]' />

                {/* Content */}
                <div className='relative max-w-2xl mx-auto px-4 py-8 text-center'>
                    {/* 404 Text */}
                    <h1 className='relative'>
                        <span
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-gray-100 dark:text-gray-800 select-none'
                            style={{ fontSize: '240px' }}
                        >
                            404
                        </span>
                        <span className='relative text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                            404
                        </span>
                    </h1>

                    {/* Message */}
                    <h2 className='mt-8 text-3xl font-semibold text-gray-900 dark:text-white'>
                        Page Not Found
                    </h2>
                    <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
                        Oops! The page you&apos;re looking for seems to have
                        wandered off into the digital wilderness.
                    </p>

                    {/* Search Icon Animation */}
                    <div className='mt-8 flex justify-center'>
                        <div className='relative'>
                            <Search className='w-16 h-16 text-gray-400 dark:text-gray-500 animate-bounce' />
                            <div className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping' />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='mt-12 flex flex-col sm:flex-row items-center justify-center gap-4'>
                        <Link
                            href='/'
                            className='inline-flex items-center px-6 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl'
                        >
                            <Home className='w-5 h-5 mr-2' />
                            Back to Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className='inline-flex items-center px-6 py-3 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl'
                        >
                            <ArrowLeft className='w-5 h-5 mr-2' />
                            Go Back
                        </button>
                    </div>

                    {/* Additional Help */}
                    <div className='mt-12 text-gray-600 dark:text-gray-400'>
                        <p>
                            Need help? Contact us at{' '}
                            <a
                                href='mailto:studentsenior.help@gmail.com'
                                className='text-blue-600 dark:text-blue-400 hover:underline'
                            >
                                studentsenior.help@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
