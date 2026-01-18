import React from 'react';
import type { Metadata } from 'next';
import CGPACalculator from './CGPACalculator';

export const metadata: Metadata = {
    title: 'CGPA & SGPA Calculator | Student Senior',
    description:
        'Calculate your SGPA and CGPA easily with our free online calculator. Designed for university students.',
    keywords:
        'cgpa calculator, sgpa calculator, gpa calculator, engineering gpa, student tools',
};

export default function CGPACalculatorPage() {
    return (
        <main className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            {/* Hero Section - Mobile Optimized */}
            <div className='py-5 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto'>
                    {/* Compact Header for Mobile */}
                    <div className='text-center space-y-3 sm:space-y-4'>
                        <h1 className='text-3xl sm:text-4xl md:text-5xl font-fugaz font-bold text-gray-900 dark:text-white leading-tight'>
                            CGPA{' '}
                            <span className='bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent'>
                                Calculator
                            </span>
                        </h1>
                        <p className='text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2'>
                            Track your academic performance effortlessly.
                            Calculate your SGPA or CGPA in seconds.
                        </p>
                    </div>
                </div>
            </div>

            {/* Calculator Component */}
            <div className='px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12'>
                <CGPACalculator />
            </div>

            {/* Additional Content / SEO Text */}
            <div className='px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
                <div className='max-w-3xl mx-auto prose dark:prose-invert'>
                    <h2 className='text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4'>
                        Why use our CGPA Calculator?
                    </h2>
                    <ul className='space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 list-disc list-inside'>
                        <li>
                            <strong>Accurate & Fast:</strong> Uses standard
                            grading points (O=10, A+=9, etc.) for precise
                            calculations.
                        </li>
                        <li>
                            <strong>SGPA Calculation:</strong> Perfect for
                            checking your score after semester results.
                        </li>
                        <li>
                            <strong>CGPA Tracking:</strong> Keep track of your
                            cumulative performance across all semesters.
                        </li>
                        <li>
                            <strong>Privacy Focused:</strong> All calculations
                            happen locally on your device. We don&apos;t store
                            your grades.
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
