import React from 'react';
import Link from 'next/link';
import {
    ArrowLeftRight,
    XCircle,
    Clock,
    CreditCard,
    Ban,
    RefreshCw,
    HelpCircle,
    CheckCircle2,
    Sparkles,
    Mail,
    ArrowRight,
    AlertTriangle,
    Shield,
    Scale,
    Lock,
} from 'lucide-react';

export const metadata = {
    title: 'Refund Policy - Student Senior',
    description:
        'Understand the refund and cancellation policies for purchases made on Student Senior.',
};

export default function RefundPolicy() {
    const tableOfContents = [
        { id: 'eligibility', title: 'Eligibility for Refunds', icon: CheckCircle2, count: '01' },
        { id: 'non-refundable', title: 'Non-Refundable Items', icon: XCircle, count: '02' },
        { id: 'request-process', title: 'Request Process', icon: ArrowLeftRight, count: '03' },
        { id: 'credit', title: 'Refund Credited', icon: CreditCard, count: '04' },
        { id: 'cancellations', title: 'Cancellations', icon: Ban, count: '05' },
        { id: 'changes', title: 'Changes to Policy', icon: RefreshCw, count: '06' },
        { id: 'contact', title: 'Contact Us', icon: HelpCircle, count: '07' },
    ];

    const highlights = [
        {
            icon: Clock,
            title: '2-Day Request Window',
            description: 'Notify our support team within 2 days of purchase to apply.',
            color: 'text-[#0075de] bg-[#0075de]/10 border-[#0075de]/20',
        },
        {
            icon: ArrowLeftRight,
            title: '3-Day Resolution',
            description: 'Requests are reviewed and resolved within 3 business days.',
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        },
        {
            icon: CreditCard,
            title: 'Direct Original Method',
            description: 'Approved refunds are credited back within 2 business days.',
            color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
        },
    ];

    return (
        <div className='min-h-screen bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] transition-colors py-8 sm:py-14'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Hero Header */}
                <div className='text-center max-w-3xl mx-auto mb-12 sm:mb-16'>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#191919] dark:text-[#ececec] mb-4'>
                        Refund Policy
                    </h1>

                    <p className='text-base sm:text-lg text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                        Thank you for choosing Student Senior! We strive to ensure a satisfying
                        experience with our services. This policy outlines our terms for refunds and
                        cancellations.
                    </p>

                    {/* Quick Highlights */}
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
                            <nav className='space-y-1'>
                                {tableOfContents.map((item) => {
                                    const IconC = item.icon;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className='flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#787774] dark:text-[#9b9a97] hover:text-[#0075de] dark:hover:text-[#0075de] hover:bg-[#faf9f8] dark:hover:bg-[#252525] transition-all group'
                                        >
                                            <div className='flex items-center gap-2.5'>
                                                <IconC className='w-3.5 h-3.5 text-[#787774] group-hover:text-[#0075de] transition-colors' />
                                                <span>{item.title}</span>
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
                                    Need Refund Help?
                                </h4>
                            </div>
                            <p className='text-[11px] text-[#787774] dark:text-[#9b9a97] leading-relaxed mb-3'>
                                Reach out with your order number to get your refund query resolved quickly.
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

                    {/* Right Policy Sections */}
                    <main className='lg:col-span-8 space-y-6 sm:space-y-8'>
                        {/* Section 1: Eligibility for Refunds */}
                        <section
                            id='eligibility'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'>
                                        <CheckCircle2 className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        1. Eligibility for Refunds
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    01
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>Refunds will be considered for the following reasons:</p>
                                <ul className='space-y-2.5 pt-1'>
                                    <li className='flex items-start gap-2.5'>
                                        <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
                                        <span>Incorrect or duplicate charges.</span>
                                    </li>
                                    <li className='flex items-start gap-2.5'>
                                        <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
                                        <span>
                                            Non-delivery of the product or service (e.g., notes, courses, etc.).
                                        </span>
                                    </li>
                                    <li className='flex items-start gap-2.5'>
                                        <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
                                        <span>
                                            Technical issues preventing access to the purchased content (e.g., PDF download failure).
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 2: Non-Refundable Items */}
                        <section
                            id='non-refundable'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'>
                                        <XCircle className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        2. Non-Refundable Items
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    02
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>Please note that the following items are non-refundable:</p>
                                <ul className='space-y-2.5 pt-1'>
                                    <li className='flex items-start gap-2.5'>
                                        <XCircle className='w-4 h-4 text-rose-500 shrink-0 mt-0.5' />
                                        <span>Products or services that have been delivered and are functioning properly.</span>
                                    </li>
                                    <li className='flex items-start gap-2.5'>
                                        <XCircle className='w-4 h-4 text-rose-500 shrink-0 mt-0.5' />
                                        <span>Content that has been downloaded or accessed in any form.</span>
                                    </li>
                                    <li className='flex items-start gap-2.5'>
                                        <XCircle className='w-4 h-4 text-rose-500 shrink-0 mt-0.5' />
                                        <span>
                                            Any subscription or membership fees that are part of an ongoing service unless specified otherwise.
                                        </span>
                                    </li>
                                </ul>

                                <div className='p-4 rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5'>
                                    <AlertTriangle className='w-4 h-4 shrink-0' />
                                    <span>There will be no return if the product is purchased.</span>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Refund Request Process */}
                        <section
                            id='request-process'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-[#0075de] bg-[#0075de]/10 border-[#0075de]/20'>
                                        <ArrowLeftRight className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        3. Refund Request Process
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    03
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    If you believe you are eligible for a refund, please follow these steps:
                                </p>

                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                                    <div className='p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#1c1c1c]'>
                                        <span className='inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#0075de]/10 text-[#0075de] mb-2'>
                                            Step 1
                                        </span>
                                        <h4 className='font-bold text-xs text-[#191919] dark:text-[#ececec] mb-1'>
                                            Within 2 Days
                                        </h4>
                                        <p className='text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                            Contact our support team within 2 days of your purchase.
                                        </p>
                                    </div>

                                    <div className='p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#1c1c1c]'>
                                        <span className='inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#0075de]/10 text-[#0075de] mb-2'>
                                            Step 2
                                        </span>
                                        <h4 className='font-bold text-xs text-[#191919] dark:text-[#ececec] mb-1'>
                                            Order Details
                                        </h4>
                                        <p className='text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                            Provide order details, including order number and reason for refund.
                                        </p>
                                    </div>

                                    <div className='p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#1c1c1c]'>
                                        <span className='inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#0075de]/10 text-[#0075de] mb-2'>
                                            Step 3
                                        </span>
                                        <h4 className='font-bold text-xs text-[#191919] dark:text-[#ececec] mb-1'>
                                            Review &amp; Resolution
                                        </h4>
                                        <p className='text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                            Our team will review and get back with a resolution within 3 business days.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Refund Credited */}
                        <section
                            id='credit'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'>
                                        <CreditCard className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        4. Refund Credited
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    04
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    If your refund request is approved, we will credit the refund within 2 business days. The
                                    refund will be issued to the original payment method, and the transaction may take additional
                                    time depending on your payment provider&apos;s policies.
                                </p>
                            </div>
                        </section>

                        {/* Section 5: Cancellations */}
                        <section
                            id='cancellations'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'>
                                        <Ban className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        5. Cancellations
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    05
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    If you wish to cancel any services or subscriptions, please contact us as soon as possible.
                                    Cancellations are subject to our refund policy and may not be applicable after certain
                                    conditions are met (such as content being accessed or downloaded).
                                </p>
                            </div>
                        </section>

                        {/* Section 6: Changes to This Refund Policy */}
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
                                        6. Changes to This Refund Policy
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    06
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    We may update this Refund Policy from time to time. Any changes will be posted on this page,
                                    and the updated date will be reflected at the bottom of the page.
                                </p>
                            </div>
                        </section>

                        {/* Section 7: Contact Us */}
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
                                        7. Contact Us
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#0075de] opacity-80'>07</span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#ececec]/80 leading-relaxed'>
                                <p>
                                    If you have any questions or concerns regarding our Refund Policy or need assistance
                                    with your refund request, please contact us at:
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
                                    href='/terms-and-conditions'
                                    className='inline-flex items-center gap-1 hover:text-[#0075de] transition-colors'
                                >
                                    <Scale className='w-3.5 h-3.5' />
                                    <span>Terms and Conditions</span>
                                </Link>
                                <Link
                                    href='/privacy-policy'
                                    className='inline-flex items-center gap-1 hover:text-[#0075de] transition-colors'
                                >
                                    <Lock className='w-3.5 h-3.5' />
                                    <span>Privacy Policy</span>
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
