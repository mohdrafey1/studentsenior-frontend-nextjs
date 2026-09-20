import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import FrontPageGenerator from './FrontPageGenerator';
import {
    Printer,
    ShieldCheck,
    Zap,
    BookOpen,
    HelpCircle,
    ArrowLeft,
    Calculator,
    CalendarClock,
    Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Assignment & Lab Frontpage Maker | Student Senior',
    description:
        'Create and print clean, professional cover pages for college assignments, lab practical files, and project reports in seconds with customizable logos.',
    keywords:
        'assignment front page maker, lab file cover page generator, college project title page, aktu front page generator, practical file front page',
};

export default function FrontPageGeneratorPage() {
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
                            Assignment Frontpage Maker
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className='font-bold tracking-[-0.03em] leading-tight mb-2.5 text-2xl sm:text-3xl md:text-4xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                        Assignment Frontpage Maker —{' '}
                        <span className='text-[#8a3fd6] dark:text-[#c084fc]'>
                            Instant & Clean
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='max-w-2xl mx-auto text-xs sm:text-sm text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-4'>
                        Generate formatted, print-ready cover pages for your laboratory files, project synopses, and term assignments in seconds. Supports custom college crests and formal double-borders.
                    </p>

                    {/* Highlight Badges */}
                    <div className='flex flex-wrap items-center justify-center gap-2 text-xs'>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0ebf8] dark:bg-[#2b1f3d] text-[#8a3fd6] dark:text-[#c084fc] border border-[#e2d5f3] dark:border-[#3e2b58] font-medium'>
                            <Printer className='w-3 h-3' /> Standard A4 Print Ready
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474] font-medium'>
                            <Zap className='w-3 h-3' /> Custom Logo Upload
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] font-medium'>
                            <Sparkles className='w-3 h-3' /> Multi-Template Styles
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838] font-medium'>
                            <ShieldCheck className='w-3 h-3' /> 100% Free & Client-Side
                        </span>
                    </div>
                </div>
            </section>

            {/* Generator Main Section */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8'>
                {/* Core Generator Component */}
                <FrontPageGenerator />

                {/* Printing Guidelines & Tips Card */}
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'>
                    <div className='flex items-center gap-2 pb-3 mb-5 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <BookOpen className='w-4 h-4 text-[#8a3fd6] dark:text-[#c084fc]' />
                        <h2 className='text-xs sm:text-sm font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            Best Printing Practices for University Submission
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm'>
                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                1. Paper Size & Margins
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                In your browser&apos;s print dialog (Ctrl+P / Cmd+P), choose <strong>A4 Paper</strong> and set <strong>Margins to &ldquo;None&rdquo; or &ldquo;Default&rdquo;</strong> to preserve the full double-border layout.
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                2. Background Graphics
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                Ensure <strong>&ldquo;Background Graphics&rdquo;</strong> is checked in print settings so your uploaded college emblem prints with sharp contrast.
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                3. Save as High-Res PDF
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                Select <strong>&ldquo;Save as PDF&rdquo;</strong> in the destination menu to store digital copies before taking physical color printouts for spiral binding.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQs Card */}
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'>
                    <div className='flex items-center gap-2 pb-3 mb-5 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <HelpCircle className='w-4 h-4 text-[#8a3fd6] dark:text-[#c084fc]' />
                        <h2 className='text-xs sm:text-sm font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm'>
                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                Which template is best for lab practical records?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                The <strong>Standard University</strong> and <strong>Lab Practical File</strong> templates are ideal for AKTU, VTU, and Anna University engineering practicals with formal signature lines.
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#222222] border border-[#f0eee6] dark:border-[#2e2e2e] space-y-1.5'>
                            <h4 className='font-bold text-[#101828] dark:text-white'>
                                Is my college logo stored online?
                            </h4>
                            <p className='text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                                No. Uploaded logos are converted to client-side data URLs and never sent to any external server, guaranteeing 100% data confidentiality.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Explore Other Student Tools */}
                <div className='p-5 sm:p-6 rounded-2xl bg-[#faf9f8] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <div className='space-y-1 text-center sm:text-left'>
                        <h3 className='font-bold text-[#101828] dark:text-white text-sm'>
                            Explore our other academic productivity utilities
                        </h3>
                        <p className='text-xs text-[#615d59] dark:text-[#a09e9a]'>
                            Track safe attendance bunks or compute semester SGPA/CGPA with official grading scales.
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
                            href='/tools/attendance-manager'
                            className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#282828] hover:bg-[#f2f2f0] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-semibold text-[#101828] dark:text-white shadow-xs transition-all'
                        >
                            <CalendarClock className='w-3.5 h-3.5 text-[#1aae39]' />
                            <span>Attendance Bunks</span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
