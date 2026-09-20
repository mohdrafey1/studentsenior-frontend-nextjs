import React from 'react';
import Link from 'next/link';
import {
    Calculator,
    FileText,
    UserSquare2,
    CalendarClock,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Zap,
    HelpCircle,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Productivity Tools | Student Senior',
    description:
        'Essential free utilities for university students: CGPA & SGPA Calculator, Attendance Manager, Frontpage Lab Cover Generator, and more.',
};

interface ToolItem {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    status: 'live' | 'coming-soon';
    tag: string;
    badgeColor: string;
    iconBg: string;
    iconColor: string;
}

const tools: ToolItem[] = [
    {
        id: 'cgpa-calculator',
        title: 'CGPA & SGPA Calculator',
        description:
            'Calculate your semester grade points (SGPA) and cumulative grade point average (CGPA) accurately with university grading scales.',
        icon: Calculator,
        href: '/tools/cgpa-calculator',
        status: 'live',
        tag: 'Academic',
        badgeColor: 'bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border-[#d2e4f9] dark:border-[#224474]',
        iconBg: 'bg-[#eaf3fd] dark:bg-[#183153]/70 border-[#d2e4f9]/60 dark:border-[#224474]/60',
        iconColor: 'text-[#0075de] dark:text-[#62aef0]',
    },
    {
        id: 'attendance-manager',
        title: 'Attendance Bunk Manager',
        description:
            'Track your daily subject attendance, calculate safe bunks, and know exactly how many classes you must attend to maintain 75%.',
        icon: CalendarClock,
        href: '/tools/attendance-manager',
        status: 'live',
        tag: 'Attendance',
        badgeColor: 'bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border-[#d2f0d9] dark:border-[#205130]',
        iconBg: 'bg-[#eaf7ec] dark:bg-[#163821]/70 border-[#d2f0d9]/60 dark:border-[#205130]/60',
        iconColor: 'text-[#1aae39] dark:text-[#4ade80]',
    },
    {
        id: 'frontpage-maker',
        title: 'Assignment Frontpage Maker',
        description:
            'Generate clean, professional cover pages for your assignments, lab practical files, and project reports in seconds with customizable logos.',
        icon: FileText,
        href: '/tools/front-page-generator',
        status: 'live',
        tag: 'Documents',
        badgeColor: 'bg-[#f0ebf8] dark:bg-[#2b1f3d] text-[#8a3fd6] dark:text-[#c084fc] border-[#e2d5f3] dark:border-[#3e2b58]',
        iconBg: 'bg-[#f0ebf8] dark:bg-[#2b1f3d]/70 border-[#e2d5f3]/60 dark:border-[#3e2b58]/60',
        iconColor: 'text-[#8a3fd6] dark:text-[#c084fc]',
    },
    {
        id: 'resume-builder',
        title: 'Student Resume Builder',
        description:
            'Craft clean, ATS-friendly resumes tailored for college internships, tech roles, and on-campus placement drives.',
        icon: UserSquare2,
        href: '/tools/resume-builder',
        status: 'coming-soon',
        tag: 'Career',
        badgeColor: 'bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] border-[#e6e6e6] dark:border-[#383838]',
        iconBg: 'bg-[#f6f5f4] dark:bg-[#282828] border-[#e6e6e6] dark:border-[#383838]',
        iconColor: 'text-[#8c8883] dark:text-[#787672]',
    },
];

export default function ToolsPage() {
    return (
        <main className='min-h-screen bg-white dark:bg-[#191919] text-[#101828] dark:text-[#ededed]'>
            {/* Header Section */}
            <section className='relative bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden pt-8 pb-9 sm:pt-11 sm:pb-12 px-4 sm:px-6 lg:px-8'>
                {/* Notion Dot Mesh */}
                <div className='absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.12] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:24px_24px]'></div>

                <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center'>
                    {/* Main Headline */}
                    <h1 className='font-bold tracking-[-0.03em] leading-tight mb-2 text-2xl sm:text-3xl md:text-4xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                        Essential Student Tools —{' '}
                        <span className='text-[#0075de] dark:text-[#62aef0]'>
                            Free & Instant
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='max-w-2xl mx-auto text-xs sm:text-sm text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-4'>
                        Boost your academic workflow and productivity with our suite of free utilities built specifically for university students.
                    </p>

                    {/* Highlight Badges */}
                    <div className='flex flex-wrap items-center justify-center gap-2 text-xs'>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474] font-medium'>
                            <Zap className='w-3 h-3' /> Instant Calculation
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] font-medium'>
                            <ShieldCheck className='w-3 h-3' /> 100% Free & Client-Side
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fdf1e8] dark:bg-[#3d2411] text-[#dd5b00] dark:text-[#fb923c] border border-[#fbd8c1] dark:border-[#583318] font-medium'>
                            <Sparkles className='w-3 h-3' /> No Sign-Up Required
                        </span>
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'>
                    {tools.map((tool) => {
                        const IconComponent = tool.icon;
                        const isLive = tool.status === 'live';

                        return (
                            <article
                                key={tool.id}
                                className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#d0ceca] dark:hover:border-[#383838] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group'
                            >
                                {/* Top Content */}
                                <div>
                                    {/* Header Row: Icon and Tag Badge */}
                                    <div className='flex items-center justify-between gap-3 mb-4'>
                                        <div
                                            className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${tool.iconBg}`}
                                        >
                                            <IconComponent
                                                className={`w-5 h-5 ${tool.iconColor}`}
                                            />
                                        </div>

                                        <div className='flex items-center gap-1.5'>
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-md border ${tool.badgeColor}`}
                                            >
                                                {tool.tag}
                                            </span>
                                            {isLive ? (
                                                <span className='inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130]'>
                                                    <span className='w-1.5 h-1.5 rounded-full bg-[#1aae39] animate-pulse'></span>
                                                    <span>Live</span>
                                                </span>
                                            ) : (
                                                <span className='inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#f6f5f4] text-[#615d59] dark:bg-[#282828] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838]'>
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tool Title */}
                                    <h2 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors mb-2'>
                                        {tool.title}
                                    </h2>

                                    {/* Description */}
                                    <p className='text-xs sm:text-sm text-[#475467] dark:text-[#a09e9a] leading-relaxed mb-6'>
                                        {tool.description}
                                    </p>
                                </div>

                                {/* Bottom Action */}
                                <div className='pt-2 mt-auto'>
                                    {isLive ? (
                                        <Link
                                            href={tool.href}
                                            prefetch={false}
                                            className='inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98] group/btn'
                                        >
                                            <span>Launch Tool</span>
                                            <ArrowRight className='w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform' />
                                        </Link>
                                    ) : (
                                        <div className='inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-[#f6f5f4] dark:bg-[#242424] text-[#8c8883] dark:text-[#787672] text-xs sm:text-sm font-medium rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] cursor-not-allowed select-none'>
                                            <span>Under Development</span>
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Bottom Productivity Note / Callout */}
                <div className='mt-10 sm:mt-12 p-5 sm:p-6 rounded-2xl bg-[#faf9f8] dark:bg-[#1c1c1c] border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div className='flex items-start sm:items-center gap-3.5'>
                        <div className='w-9 h-9 rounded-xl bg-[#eaf3fd] dark:bg-[#183153] border border-[#d2e4f9] dark:border-[#224474] text-[#0075de] dark:text-[#62aef0] flex items-center justify-center shrink-0'>
                            <HelpCircle className='w-5 h-5' />
                        </div>
                        <div>
                            <h3 className='text-xs sm:text-sm font-bold text-[#101828] dark:text-white'>
                                Need a specific student tool or calculator?
                            </h3>
                            <p className='text-xs text-[#615d59] dark:text-[#a09e9a] mt-0.5'>
                                We continuously add new utilities. Let us know what you need for your semester.
                            </p>
                        </div>
                    </div>

                    <a
                        href='mailto:support@studentsenior.com?subject=Tool%20Suggestion'
                        className='inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#282828] hover:bg-[#f6f5f4] dark:hover:bg-[#333] text-[#101828] dark:text-[#ededed] border border-[#e6e6e6] dark:border-[#383838] text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98] shrink-0'
                    >
                        <span>Suggest a Tool</span>
                    </a>
                </div>
            </div>
        </main>
    );
}

