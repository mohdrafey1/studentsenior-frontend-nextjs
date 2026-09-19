import React from 'react';
import Link from 'next/link';
import {
    Scale,
    UserCheck,
    FileText,
    CreditCard,
    Ban,
    ShieldAlert,
    Lock,
    Gavel,
    RefreshCw,
    HelpCircle,
    CheckCircle2,
    Sparkles,
    Mail,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    Clock,
} from 'lucide-react';

export const metadata = {
    title: 'Terms and Conditions - Student Senior',
    description:
        'Read the terms and conditions governing your use of Student Senior.',
};

export default function TermsAndConditions() {
    const tableOfContents = [
        { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle2, count: '01' },
        { id: 'usage', title: 'Use of the Website', icon: FileText, count: '02' },
        { id: 'registration', title: 'Account Registration', icon: UserCheck, count: '03' },
        { id: 'content', title: 'User Content', icon: FileText, count: '04' },
        { id: 'payments', title: 'Payments & Purchases', icon: CreditCard, count: '05' },
        { id: 'termination', title: 'Termination', icon: Ban, count: '06' },
        { id: 'liability', title: 'Limitation of Liability', icon: ShieldAlert, count: '07' },
        { id: 'privacy', title: 'Privacy', icon: Lock, count: '08' },
        { id: 'law', title: 'Governing Law', icon: Gavel, count: '09' },
        { id: 'changes', title: 'Changes to Terms', icon: RefreshCw, count: '10' },
        { id: 'contact', title: 'Contact Us', icon: HelpCircle, count: '11' },
    ];

    const highlights = [
        {
            icon: ShieldCheck,
            title: 'Legal Agreement',
            description: 'Fair and transparent terms governing all platform usage.',
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        },
        {
            icon: CreditCard,
            title: 'Secure Transactions',
            description: 'Encrypted third-party payment processing for all purchases.',
            color: 'text-[#0075de] bg-[#0075de]/10 border-[#0075de]/20',
        },
        {
            icon: Gavel,
            title: 'Governing Law',
            description: 'Subject to the competent jurisdiction and laws of India.',
            color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
        },
    ];

    return (
        <div className='min-h-screen bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] transition-colors py-8 sm:py-14'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Hero Header */}
                <div className='text-center max-w-3xl mx-auto mb-12 sm:mb-16'>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#191919] dark:text-[#ececec] mb-4'>
                        Terms and Conditions
                    </h1>

                    <p className='text-base sm:text-lg text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                        Welcome to Student Senior! These terms and conditions govern your use of
                        the website. By accessing and using Student Senior, you agree to comply with
                        these terms.
                    </p>

                    {/* Quick Trust Highlights */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 text-left'>
                        {highlights.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className='p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs flex flex-col justify-between'
                                >
                                    <div className='flex items-center gap-2.5 mb-2'>
                                        <div
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${item.color}`}
                                        >
                                            <IconComponent className='w-3.5 h-3.5' />
                                        </div>
                                        <h3 className='text-xs sm:text-sm font-bold text-[#191919] dark:text-[#ececec]'>
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className='text-[11px] sm:text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Layout: Sidebar Table of Contents + Content Cards */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
                    {/* Left Sticky Navigation on Large Screens */}
                    <aside className='hidden lg:block lg:col-span-4 sticky top-8 space-y-4'>
                        <div className='p-5 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'>
                            <div className='flex items-center gap-2 pb-3 mb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <Sparkles className='w-4 h-4 text-[#0075de]' />
                                <span className='text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97]'>
                                    Table of Contents
                                </span>
                            </div>
                            <nav className='space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1'>
                                {tableOfContents.map((item) => {
                                    const IconC = item.icon;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className='flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#787774] dark:text-[#9b9a97] hover:text-[#0075de] dark:hover:text-[#0075de] hover:bg-[#faf9f8] dark:hover:bg-[#252525] transition-all group'
                                        >
                                            <div className='flex items-center gap-2.5'>
                                                <IconC className='w-3.5 h-3.5 text-[#787774] group-hover:text-[#0075de] transition-colors shrink-0' />
                                                <span className='truncate'>{item.title}</span>
                                            </div>
                                            <span className='font-mono text-[10px] text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                                {item.count}
                                            </span>
                                        </a>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Quick Contact Box */}
                        <div className='p-5 rounded-2xl border border-[#0075de]/20 bg-[#0075de]/5 dark:bg-[#0075de]/10 shadow-2xs text-left'>
                            <div className='flex items-center gap-2 mb-2'>
                                <Mail className='w-4 h-4 text-[#0075de]' />
                                <h4 className='text-xs font-bold text-[#191919] dark:text-[#ececec]'>
                                    Questions on Terms?
                                </h4>
                            </div>
                            <p className='text-[11px] text-[#787774] dark:text-[#9b9a97] leading-relaxed mb-3'>
                                If you need clarification on any of our policies, feel free to reach out.
                            </p>
                            <a
                                href='mailto:studentsenior.help@gmail.com'
                                className='inline-flex items-center gap-1.5 text-xs font-semibold text-[#0075de] hover:underline'
                            >
                                <span>studentsenior.help@gmail.com</span>
                                <ArrowRight className='w-3 h-3' />
                            </a>
                        </div>
                    </aside>

                    {/* Right Terms Sections */}
                    <main className='lg:col-span-8 space-y-6 sm:space-y-8'>
                        {/* Section 1: Acceptance of Terms */}
                        <section
                            id='acceptance'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-[#0075de] bg-[#0075de]/10 border-[#0075de]/20'>
                                        <CheckCircle2 className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        1. Acceptance of Terms
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    01
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    By accessing and using Student Senior, you agree to be bound by these terms and conditions.
                                    We may update these terms from time to time, and your continued use of the website will
                                    signify your acceptance of any updated terms.
                                </p>
                            </div>
                        </section>

                        {/* Section 2: Use of the Website */}
                        <section
                            id='usage'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'>
                                        <FileText className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        2. Use of the Website
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    02
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    You agree to use the website in accordance with all applicable laws and regulations. You may
                                    not use the website for any unlawful purpose or in a way that may damage, disable, or impair
                                    the website.
                                </p>
                            </div>
                        </section>

                        {/* Section 3: Account Registration */}
                        <section
                            id='registration'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'>
                                        <UserCheck className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        3. Account Registration
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    03
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    To access certain features of the website, you may be required to register for an account.
                                    You agree to provide accurate and complete information during the registration process and
                                    keep your account details secure.
                                </p>
                            </div>
                        </section>

                        {/* Section 4: User Content */}
                        <section
                            id='content'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20'>
                                        <FileText className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        4. User Content
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    04
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    By submitting content to the website (such as pyqs, notes, lab manuals, comments, or any
                                    resources), you grant us a non-exclusive, royalty-free, worldwide license to use, display,
                                    and distribute your content on the website.
                                </p>
                            </div>
                        </section>

                        {/* Section 5: Payments and Purchases */}
                        <section
                            id='payments'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20'>
                                        <CreditCard className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        5. Payments and Purchases
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    05
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    Any purchases made on the website, including notes or other services, are subject to
                                    applicable fees and payment terms. We reserve the right to modify prices at any time.
                                    Payments are processed securely through our third-party payment provider.
                                </p>
                            </div>
                        </section>

                        {/* Section 6: Termination */}
                        <section
                            id='termination'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'>
                                        <Ban className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        6. Termination
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    06
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    We reserve the right to suspend or terminate your account if you violate these terms and
                                    conditions. Upon termination, you will lose access to certain services, and any outstanding
                                    payments will still be due.
                                </p>
                            </div>
                        </section>

                        {/* Section 7: Limitation of Liability */}
                        <section
                            id='liability'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'>
                                        <ShieldAlert className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        7. Limitation of Liability
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    07
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    Student Senior will not be held liable for any direct, indirect, incidental, or consequential
                                    damages arising from your use of the website or any services provided, except as required by law.
                                </p>
                            </div>
                        </section>

                        {/* Section 8: Privacy */}
                        <section
                            id='privacy'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20'>
                                        <Lock className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        8. Privacy
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    08
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    Your use of the website is also governed by our{' '}
                                    <Link
                                        href='/privacy-policy'
                                        className='font-semibold text-[#0075de] hover:underline'
                                    >
                                        Privacy Policy
                                    </Link>
                                    , which explains how we collect and use your personal data.
                                </p>
                            </div>
                        </section>

                        {/* Section 9: Governing Law */}
                        <section
                            id='law'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'>
                                        <Gavel className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        9. Governing Law
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    09
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    These terms and conditions are governed by the laws of India, without regard to its conflict
                                    of law principles. Any disputes arising from these terms will be resolved in the competent
                                    courts of India.
                                </p>
                            </div>
                        </section>

                        {/* Section 10: Changes to the Terms */}
                        <section
                            id='changes'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20'>
                                        <RefreshCw className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        10. Changes to the Terms
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    10
                                </span>
                            </div>

                            <div className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    We may update these Terms and Conditions periodically. Any changes will be posted on this page,
                                    and the updated date will be reflected at the bottom of the page.
                                </p>
                            </div>
                        </section>

                        {/* Section 11: Contact Us */}
                        <section
                            id='contact'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#0075de]/30 bg-gradient-to-br from-[#0075de]/5 via-[#0075de]/10 to-transparent dark:from-[#0075de]/15 dark:via-[#0075de]/5 dark:to-transparent shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#0075de]/20'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-[#0075de] bg-[#0075de]/10 border-[#0075de]/30'>
                                        <HelpCircle className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        11. Contact Us
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#0075de] opacity-80'>11</span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#ececec]/80 leading-relaxed'>
                                <p>
                                    If you have any questions about these Terms and Conditions, please contact us at:
                                </p>

                                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-8 h-8 rounded-lg bg-[#0075de]/10 text-[#0075de] flex items-center justify-center shrink-0'>
                                            <Mail className='w-4 h-4' />
                                        </div>
                                        <div>
                                            <div className='text-xs font-semibold text-[#191919] dark:text-[#ececec]'>
                                                Official Support Email
                                            </div>
                                            <a
                                                href='mailto:studentsenior.help@gmail.com'
                                                className='text-xs font-medium text-[#0075de] hover:underline'
                                            >
                                                studentsenior.help@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                    <a
                                        href='mailto:studentsenior.help@gmail.com'
                                        className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0075de] hover:bg-[#0060b8] text-white text-xs font-medium shadow-xs transition-colors'
                                    >
                                        <span>Send Email</span>
                                        <ArrowRight className='w-3 h-3' />
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Related Policy Links */}
                        <div className='pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#787774] dark:text-[#9b9a97] border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div className='flex items-center gap-4'>
                                <Link
                                    href='/privacy-policy'
                                    className='inline-flex items-center gap-1 hover:text-[#0075de] transition-colors'
                                >
                                    <Lock className='w-3.5 h-3.5' />
                                    <span>Privacy Policy</span>
                                </Link>
                                <Link
                                    href='/refund-policy'
                                    className='inline-flex items-center gap-1 hover:text-[#0075de] transition-colors'
                                >
                                    <RefreshCw className='w-3.5 h-3.5' />
                                    <span>Refund Policy</span>
                                </Link>
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <Clock className='w-3.5 h-3.5' />
                                <span>Last updated: 18-02-2025</span>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
