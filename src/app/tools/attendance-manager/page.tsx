import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AttendanceCalculator from './AttendanceCalculator';
import {
    CalendarClock,
    CheckCircle2,
    ShieldCheck,
    Zap,
    BookOpen,
    HelpCircle,
    ArrowLeft,
    Calculator,
    FileText,
    Sparkles,
    Flame,
    AlertTriangle,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Attendance Bunk Manager & 75% Tracker | Student Senior',
    description:
        'Calculate safe bunks and track your college subject attendance accurately. Know exactly how many classes you can skip or must attend to maintain 75% criteria.',
    keywords:
        'attendance calculator, bunk calculator, 75 percent attendance rule, college attendance manager, student attendance tracker',
};

export default function AttendanceManagerPage() {
    return (
        <main className='min-h-screen bg-white dark:bg-[#191919] text-[#101828] dark:text-[#ededed]'>
            {/* Header Section */}
            <section className='relative bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden pt-6 pb-9 sm:pt-9 sm:pb-12 px-4 sm:px-6 lg:px-8'>
                {/* Notion Dot Mesh */}
                <div className='absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.12] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:24px_24px]'></div>

                <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center'>
                    {/* Breadcrumbs Navigation */}
                    <div className='flex items-center gap-2 mb-4 text-xs font-medium text-[#615d59] dark:text-[#a09e9a]'>
                        <Link
                            href='/tools'
                            className='inline-flex items-center gap-1.5 hover:text-[#0075de] dark:hover:text-[#62aef0] transition-colors py-1 px-2.5 rounded-lg hover:bg-[#eae8e4] dark:hover:bg-[#282828]'
                        >
                            <ArrowLeft className='w-3.5 h-3.5' />
                            <span>Back to Tools</span>
                        </Link>
                        <span>/</span>
                        <span className='text-[#101828] dark:text-white font-semibold'>
                            Attendance Bunk Manager
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className='font-bold tracking-[-0.03em] leading-tight mb-2.5 text-2xl sm:text-3xl md:text-4xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                        Attendance Bunk Manager —{' '}
                        <span className='text-[#1aae39] dark:text-[#4ade80]'>
                            Safe & Smart
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='max-w-2xl mx-auto text-xs sm:text-sm text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-4'>
                        Know exactly how many classes you can safely bunk or must attend to maintain 75% university criteria. Track multiple subjects with offline local storage support.
                    </p>

                    {/* Highlight Badges */}
                    <div className='flex flex-wrap items-center justify-center gap-2 text-xs'>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] font-medium'>
                            <Flame className='w-3 h-3' /> Safe Bunk Calculator
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474] font-medium'>
                            <CalendarClock className='w-3 h-3' /> Multi-Subject Tracker
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0ebf8] dark:bg-[#2b1f3d] text-[#8a3fd6] dark:text-[#c084fc] border border-[#e2d5f3] dark:border-[#3e2b58] font-medium'>
                            <Sparkles className='w-3 h-3' /> What-If Matrix
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838] font-medium'>
                            <ShieldCheck className='w-3 h-3' /> 100% Private (Local Only)
                        </span>
                    </div>
                </div>
            </section>

            {/* Calculator Main Section */}
            <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8'>
                {/* Core Interactive Calculator */}
                <AttendanceCalculator />

                {/* University Attendance Regulations & Strategy Card */}
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'>
                    <div className='flex items-center gap-2 pb-3 mb-5 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <BookOpen className='w-4 h-4 text-[#1aae39] dark:text-[#4ade80]' />
                        <h2 className='text-xs sm:text-sm font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            University Attendance Criteria & Rules Explained
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#475467] dark:text-[#a09e9a] leading-relaxed'>
                        {/* Mathematical Formulas */}
                        <div className='space-y-3'>
                            <h3 className='font-bold text-[#101828] dark:text-white text-sm'>
                                How Bunk Calculations Work
                            </h3>
                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-3'>
                                <div>
                                    <strong className='text-[#101828] dark:text-[#ededed] block mb-0.5'>
                                        1. Safe Bunks Formula (When &gt; Target %):
                                    </strong>
                                    <code className='text-[11px] block bg-white dark:bg-[#181818] p-2 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                        Can Bunk = ⌊ (100 × Attended) / Target% ⌋ - Total Conducted
                                    </code>
                                </div>
                                <div className='border-t border-[#f0eee9] dark:border-[#2e2e2e] pt-3'>
                                    <strong className='text-[#101828] dark:text-[#ededed] block mb-0.5'>
                                        2. Required Classes to Catch Up (When &lt; Target %):
                                    </strong>
                                    <code className='text-[11px] block bg-white dark:bg-[#181818] p-2 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                        Must Attend = ⌈ (Target% × Total - 100 × Attended) / (100 - Target%) ⌉
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Standard Rules & Condonation */}
                        <div className='space-y-3'>
                            <h3 className='font-bold text-[#101828] dark:text-white text-sm'>
                                Standard UGC / AICTE Regulations
                            </h3>
                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-2.5'>
                                <p>
                                    <strong className='text-[#101828] dark:text-[#ededed]'>• 75% Mandatory Attendance:</strong> Most Indian universities (AKTU, VTU, Anna Univ, IPU, Mumbai Univ) require a minimum of 75% attendance to appear in end-semester theory examinations.
                                </p>
                                <p>
                                    <strong className='text-[#101828] dark:text-[#ededed]'>• Medical Condonation (60%–75%):</strong> In cases of severe illness or verified college event duty (OD certificates), colleges often allow relaxation up to 10%–15% upon submitting valid certificates.
                                </p>
                                <p>
                                    <strong className='text-[#101828] dark:text-[#ededed]'>• Detention / Debarred List:</strong> Falling below 60% usually results in year-back or semester backlog detention without hall ticket issuance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Frequently Asked Questions Card */}
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'>
                    <div className='flex items-center gap-2 pb-3 mb-5 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <HelpCircle className='w-4 h-4 text-[#1aae39] dark:text-[#4ade80]' />
                        <h2 className='text-xs sm:text-sm font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm'>
                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                Is my subject data stored safely?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                Yes! 100% of your subject names and attendance records are stored exclusively in your browser&apos;s local storage. No data is ever transmitted to a server.
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                What if I miss a lecture when I am exactly at 75%?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                Missing a single lecture when at 75% drops your percentage immediately below threshold. You will typically need to attend 3 consecutive classes to recover back to 75%.
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                How do lab practical sessions count?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                In many universities, lab sessions count as 2 or 3 lecture hours. When tracking labs, increase the total class count accordingly to reflect credit weight.
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                How can I use the Bunk Simulation Matrix?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                Switch to the &ldquo;Bunk Matrix&rdquo; tab to see a forecast of your exact percentage if you attend or miss the next 1, 2, 3, 5, or 8 classes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Explore Other Student Tools */}
                <div className='p-5 sm:p-6 rounded-2xl bg-[#faf9f8] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <div className='space-y-1 text-center sm:text-left'>
                        <h3 className='font-bold text-[#101828] dark:text-white text-sm'>
                            Need to calculate semester GPA or generate assignment covers?
                        </h3>
                        <p className='text-xs text-[#615d59] dark:text-[#a09e9a]'>
                            Calculate SGPA/CGPA with university scales or generate assignment cover pages.
                        </p>
                    </div>

                    <div className='flex items-center gap-2.5'>
                        <Link
                            href='/tools/cgpa-calculator'
                            className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#282828] hover:bg-[#f2f2f0] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-semibold text-[#101828] dark:text-white shadow-xs transition-all'
                        >
                            <Calculator className='w-3.5 h-3.5 text-[#0075de]' />
                            <span>CGPA Calculator</span>
                        </Link>
                        <Link
                            href='/tools/front-page-generator'
                            className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#282828] hover:bg-[#f2f2f0] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-semibold text-[#101828] dark:text-white shadow-xs transition-all'
                        >
                            <FileText className='w-3.5 h-3.5 text-[#8a3fd6]' />
                            <span>Frontpage Maker</span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
