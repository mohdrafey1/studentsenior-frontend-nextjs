import React from 'react';
import type { Metadata } from 'next';
import AttendanceCalculator from './AttendanceCalculator';

export const metadata: Metadata = {
    title: 'Attendance Manager | Student Senior',
    description:
        'Track your attendance and know exactly how many classes you can bunk or need to attend to maintain your target percentage.',
    keywords:
        'attendance calculator, attendance tracker, class attendance, student attendance, bunk calculator',
};

export default function AttendanceManagerPage() {
    return (
        <main className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            {/* Hero Section - Mobile Optimized */}
            <div className='py-5 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto'>
                    {/* Compact Header for Mobile */}
                    <div className='text-center space-y-3 sm:space-y-4'>
                        <h1 className='text-3xl sm:text-4xl md:text-5xl font-fugaz font-bold text-gray-900 dark:text-white leading-tight'>
                            Attendance{' '}
                            <span className='bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent'>
                                Manager
                            </span>
                        </h1>
                        <p className='text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2'>
                            Know exactly how many classes you can skip or need
                            to attend to maintain your target attendance.
                        </p>
                    </div>
                </div>
            </div>

            {/* Calculator Component */}
            <div className='px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12'>
                <AttendanceCalculator />
            </div>

            {/* Additional Content / SEO Text */}
            <div className='px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
                <div className='max-w-3xl mx-auto prose dark:prose-invert'>
                    <h2 className='text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4'>
                        Why use our Attendance Manager?
                    </h2>
                    <ul className='space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 list-disc list-inside'>
                        <li>
                            <strong>Smart Calculations:</strong> Instantly know
                            how many classes you need to attend or can safely
                            bunk.
                        </li>
                        <li>
                            <strong>Target Tracking:</strong> Set your own
                            attendance target (default 75%) and track your
                            progress.
                        </li>
                        <li>
                            <strong>Visual Feedback:</strong> See your current
                            attendance percentage with color-coded indicators.
                        </li>
                        <li>
                            <strong>Plan Ahead:</strong> Make informed decisions
                            about class attendance without risking your
                            percentage.
                        </li>
                        <li>
                            <strong>Privacy First:</strong> All calculations
                            happen locally. We don&apos;t store your attendance
                            data.
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
