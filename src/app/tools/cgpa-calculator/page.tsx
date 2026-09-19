import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CGPACalculator from './CGPACalculator';
import {
    Calculator,
    CheckCircle2,
    ShieldCheck,
    Zap,
    BookOpen,
    HelpCircle,
    ArrowLeft,
    CalendarClock,
    FileText,
    ArrowRight,
    Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'CGPA & SGPA Calculator | Student Senior',
    description:
        'Calculate your semester SGPA, cumulative CGPA, target grades, and percentage accurately with our free online calculator for university students.',
    keywords:
        'cgpa calculator, sgpa calculator, gpa calculator, engineering gpa, student tools, aktu cgpa calculator, aicte cgpa to percentage',
};

export default function CGPACalculatorPage() {
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
                            CGPA & SGPA Calculator
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className='font-bold tracking-[-0.03em] leading-tight mb-2.5 text-2xl sm:text-3xl md:text-4xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                        CGPA & SGPA Calculator —{' '}
                        <span className='text-[#0075de] dark:text-[#62aef0]'>
                            Instant & Accurate
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='max-w-2xl mx-auto text-xs sm:text-sm text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-4'>
                        Calculate semester grade points (SGPA), cumulative CGPA, percentage conversions, and plan your target graduation honors on the standard 10-point university grading system.
                    </p>

                    {/* Highlight Badges */}
                    <div className='flex flex-wrap items-center justify-center gap-2 text-xs'>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474] font-medium'>
                            <Calculator className='w-3 h-3' /> SGPA & CGPA Mode
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] font-medium'>
                            <Zap className='w-3 h-3' /> CGPA ⇋ % Conversion
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fdf1e8] dark:bg-[#3d2411] text-[#dd5b00] dark:text-[#fb923c] border border-[#fbd8c1] dark:border-[#583318] font-medium'>
                            <Sparkles className='w-3 h-3' /> Target Goal Planner
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838] font-medium'>
                            <ShieldCheck className='w-3 h-3' /> 100% Client-Side Privacy
                        </span>
                    </div>
                </div>
            </section>

            {/* Calculator Main Section */}
            <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8'>
                {/* Core Interactive Calculator */}
                <CGPACalculator />

                {/* Grading Guide & Formula Card */}
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'>
                    <div className='flex items-center gap-2 pb-3 mb-5 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <BookOpen className='w-4 h-4 text-[#0075de] dark:text-[#62aef0]' />
                        <h2 className='text-xs sm:text-sm font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            University Grading Reference & Formulas
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#475467] dark:text-[#a09e9a] leading-relaxed'>
                        {/* SGPA & CGPA Formulas */}
                        <div className='space-y-3'>
                            <h3 className='font-bold text-[#101828] dark:text-white text-sm'>
                                Standard Academic Formulas
                            </h3>
                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-3'>
                                <div>
                                    <strong className='text-[#101828] dark:text-[#ededed] block mb-0.5'>
                                        1. SGPA (Semester Grade Point Average):
                                    </strong>
                                    <code className='text-[11px] block bg-white dark:bg-[#181818] p-2 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                        SGPA = Σ(Credit × Grade Point) / Σ(Total Semester Credits)
                                    </code>
                                </div>
                                <div className='border-t border-[#f0eee9] dark:border-[#2e2e2e] pt-3'>
                                    <strong className='text-[#101828] dark:text-[#ededed] block mb-0.5'>
                                        2. CGPA (Cumulative Grade Point Average):
                                    </strong>
                                    <code className='text-[11px] block bg-white dark:bg-[#181818] p-2 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                        CGPA = Σ(SGPA × Semester Credits) / Σ(Total Cumulative Credits)
                                    </code>
                                </div>
                                <div className='border-t border-[#f0eee9] dark:border-[#2e2e2e] pt-3'>
                                    <strong className='text-[#101828] dark:text-[#ededed] block mb-0.5'>
                                        3. AICTE / AKTU Percentage Conversion:
                                    </strong>
                                    <code className='text-[11px] block bg-white dark:bg-[#181818] p-2 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                        Percentage (%) = (CGPA - 0.75) × 10
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Standard 10-Point Scale Table */}
                        <div className='space-y-3'>
                            <h3 className='font-bold text-[#101828] dark:text-white text-sm'>
                                10-Point UGC / AICTE Grading System
                            </h3>
                            <div className='overflow-hidden rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <table className='w-full text-left text-xs'>
                                    <thead className='bg-[#faf9f8] dark:bg-[#222222] text-[#615d59] dark:text-[#a09e9a] border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                        <tr>
                                            <th className='p-2.5 font-semibold'>Letter Grade</th>
                                            <th className='p-2.5 font-semibold'>Grade Point</th>
                                            <th className='p-2.5 font-semibold'>Marks Range</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-[#f0eee9] dark:divide-[#2a2a2a]'>
                                        <tr>
                                            <td className='p-2.5 font-semibold text-[#0075de]'>O (Outstanding)</td>
                                            <td className='p-2.5 font-bold'>10</td>
                                            <td className='p-2.5'>90% – 100%</td>
                                        </tr>
                                        <tr>
                                            <td className='p-2.5 font-semibold text-[#1aae39]'>A+ (Excellent)</td>
                                            <td className='p-2.5 font-bold'>9</td>
                                            <td className='p-2.5'>80% – 89%</td>
                                        </tr>
                                        <tr>
                                            <td className='p-2.5 font-semibold text-[#1aae39]'>A (Very Good)</td>
                                            <td className='p-2.5 font-bold'>8</td>
                                            <td className='p-2.5'>70% – 79%</td>
                                        </tr>
                                        <tr>
                                            <td className='p-2.5 font-semibold text-[#dd5b00]'>B+ (Good)</td>
                                            <td className='p-2.5 font-bold'>7</td>
                                            <td className='p-2.5'>60% – 69%</td>
                                        </tr>
                                        <tr>
                                            <td className='p-2.5 font-semibold text-[#dd5b00]'>B (Above Average)</td>
                                            <td className='p-2.5 font-bold'>6</td>
                                            <td className='p-2.5'>50% – 59%</td>
                                        </tr>
                                        <tr>
                                            <td className='p-2.5 font-semibold text-[#615d59]'>C (Average) / P (Pass)</td>
                                            <td className='p-2.5 font-bold'>5 / 4</td>
                                            <td className='p-2.5'>40% – 49%</td>
                                        </tr>
                                        <tr>
                                            <td className='p-2.5 font-semibold text-[#e11d48]'>F (Fail / Backlog)</td>
                                            <td className='p-2.5 font-bold text-[#e11d48]'>0</td>
                                            <td className='p-2.5'>&lt; 40%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Frequently Asked Questions Card */}
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'>
                    <div className='flex items-center gap-2 pb-3 mb-5 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <HelpCircle className='w-4 h-4 text-[#0075de] dark:text-[#62aef0]' />
                        <h2 className='text-xs sm:text-sm font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm'>
                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                What is the difference between SGPA and CGPA?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                <strong>SGPA</strong> measures your academic performance in a single semester, weighted by subject credits. <strong>CGPA</strong> represents your cumulative overall score across all semesters completed till date.
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                How does an &apos;F&apos; grade (Backlog) impact my GPA?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                An &apos;F&apos; grade carries 0 grade points, but the subject&apos;s credits are still included in the total credit denominator. When you pass the carryover exam, the new grade replaces the 0 in subsequent CGPA calculations.
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                Which percentage formula should I use?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                For AKTU & most AICTE colleges, use <code>(CGPA - 0.75) × 10</code>. For CBSE and IPU students, multiplying by <code>9.5</code> is standard. Use our formula switcher above to match your university guidelines.
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                How does the Target CGPA Planner work?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                It uses weighted algebra to calculate the exact semester SGPA you need in upcoming examinations to elevate your current cumulative average to your desired target.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Explore Other Student Tools */}
                <div className='p-5 sm:p-6 rounded-2xl bg-[#faf9f8] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <div className='space-y-1 text-center sm:text-left'>
                        <h3 className='font-bold text-[#101828] dark:text-white text-sm'>
                            Looking for more student productivity utilities?
                        </h3>
                        <p className='text-xs text-[#615d59] dark:text-[#a09e9a]'>
                            Calculate safe attendance bunks or generate official assignment front cover pages in 1 click.
                        </p>
                    </div>

                    <div className='flex items-center gap-2.5'>
                        <Link
                            href='/tools/attendance-manager'
                            className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#282828] hover:bg-[#f2f2f0] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-semibold text-[#101828] dark:text-white shadow-xs transition-all'
                        >
                            <CalendarClock className='w-3.5 h-3.5 text-[#1aae39]' />
                            <span>Attendance Bunks</span>
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
