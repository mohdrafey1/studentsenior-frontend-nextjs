import React from 'react';
import Link from 'next/link';
import {
    Calculator,
    FileText,
    UserSquare2,
    CalendarClock,
    ArrowRight,
    Construction,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Tools | Student Senior',
    description:
        'Essential free tools for university students including CGPA Calculator, Frontpage Maker, and more.',
};

const tools = [
    {
        id: 'cgpa-calculator',
        title: 'CGPA Calculator',
        description:
            'Calculate your Semester (SGPA) and Cumulative (CGPA) grades instantly with our accurate calculator.',
        icon: Calculator,
        href: '/tools/cgpa-calculator',
        status: 'live',
        color: 'bg-blue-500',
    },
    {
        id: 'attendance-manager',
        title: 'Attendance Manager',
        description:
            'Track your daily attendance and know exactly how many classes you can afford to bunk.',
        icon: CalendarClock,
        href: '/tools/attendance-manager',
        status: 'live',
        color: 'bg-emerald-500',
    },
    {
        id: 'frontpage-maker',
        title: 'Frontpage Maker',
        description:
            'Generate professional cover pages for your assignments and lab files in seconds. No design skills needed.',
        icon: FileText,
        href: '/tools/frontpage-maker',
        status: 'coming-soon',
        color: 'bg-indigo-500',
    },
    {
        id: 'resume-builder',
        title: 'Resume Builder',
        description:
            'Create ATS-friendly resumes tailored for internships and placements using our simple builder.',
        icon: UserSquare2,
        href: '/tools/resume-builder',
        status: 'coming-soon',
        color: 'bg-purple-500',
    },
];

export default function ToolsPage() {
    return (
        <main className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            {/* Hero Section - Mobile Optimized */}
            <div className='py-5 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto'>
                    {/* Compact Header for Mobile */}
                    <div className='text-center space-y-3 sm:space-y-4'>
                        <h1 className='text-3xl sm:text-4xl md:text-5xl font-fugaz font-bold text-gray-900 dark:text-white leading-tight'>
                            Essential{' '}
                            <span className='bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent'>
                                Student Tools
                            </span>
                        </h1>
                        <p className='text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2'>
                            Boost your productivity with our collection of free
                            utilities designed for students.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className='px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16'>
                <div className='max-w-7xl mx-auto'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                        {tools.map((tool) => (
                            <div
                                key={tool.id}
                                className='group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 p-5 sm:p-6 border border-gray-100 dark:border-gray-700 overflow-hidden'
                            >
                                {/* Gradient Accent */}
                                <div
                                    className={`absolute top-0 left-0 right-0 h-1 ${
                                        tool.status === 'live'
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                />

                                {/* Background Icon */}
                                <div className='absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity'>
                                    <tool.icon className='w-32 h-32 sm:w-40 sm:h-40 text-current' />
                                </div>

                                <div className='relative z-10'>
                                    {/* Icon Container */}
                                    <div
                                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${
                                            tool.status === 'live'
                                                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                                                : 'bg-gray-100 dark:bg-gray-700'
                                        } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <tool.icon
                                            className={`w-6 h-6 sm:w-7 sm:h-7 ${
                                                tool.status === 'live'
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-500'
                                            }`}
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                                        {tool.title}
                                    </h3>

                                    {/* Description */}
                                    <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-6 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]'>
                                        {tool.description}
                                    </p>

                                    {/* Action Button/Status */}
                                    {tool.status === 'live' ? (
                                        <Link
                                            href={tool.href}
                                            className='inline-flex items-center text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group/link'
                                        >
                                            Launch Tool
                                            <ArrowRight className='w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform' />
                                        </Link>
                                    ) : (
                                        <div className='inline-flex items-center text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed'>
                                            <Construction className='w-3.5 h-3.5 mr-1.5' />
                                            Coming Soon
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
