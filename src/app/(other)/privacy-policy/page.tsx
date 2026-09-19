import React from 'react';
import Link from 'next/link';
import {
    Shield,
    Users,
    Lock,
    Bell,
    FileText,
    HelpCircle,
    CheckCircle2,
    Database,
    EyeOff,
    Sparkles,
    Mail,
    ArrowRight,
    Scale,
    Clock,
    RefreshCw,
} from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy - Student Senior',
    description:
        'Learn how Student Senior collects, uses, and safeguards your personal information.',
};

export default function PrivacyPolicy() {
    const tableOfContents = [
        { id: 'collection', title: 'Information We Collect', icon: Users, count: '01' },
        { id: 'usage', title: 'How We Use Information', icon: FileText, count: '02' },
        { id: 'sharing', title: 'Sharing of Information', icon: Bell, count: '03' },
        { id: 'security', title: 'Data Security', icon: Lock, count: '04' },
        { id: 'rights', title: 'Your Rights & Choices', icon: Shield, count: '05' },
        { id: 'contact', title: 'Contact Us', icon: HelpCircle, count: '06' },
    ];

    const highlights = [
        {
            icon: EyeOff,
            title: 'No Data Selling',
            description: 'We do not sell your personal information to third parties.',
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        },
        {
            icon: Lock,
            title: 'Proactive Security',
            description: 'Reasonable industry safeguards to prevent unauthorized access.',
            color: 'text-[#0075de] bg-[#0075de]/10 border-[#0075de]/20',
        },
        {
            icon: CheckCircle2,
            title: 'You are in Control',
            description: 'Easily access, update, or request deletion of your data anytime.',
            color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
        },
    ];

    return (
        <div className='min-h-screen bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] transition-colors py-8 sm:py-14'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Hero Header */}
                <div className='text-center max-w-3xl mx-auto mb-12 sm:mb-16'>
                  

                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#191919] dark:text-[#ececec] mb-4'>
                        Privacy Policy
                    </h1>

                    <p className='text-base sm:text-lg text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                        Welcome to Student Senior! This privacy policy explains how we collect,
                        use, and protect your personal information when you visit and use our website.
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
                                    Privacy Questions?
                                </h4>
                            </div>
                            <p className='text-[11px] text-[#787774] dark:text-[#9b9a97] leading-relaxed mb-3'>
                                Have questions regarding our data practices? Reach out directly to our support team.
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
                        {/* Section 1: Information We Collect */}
                        <section
                            id='collection'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-[#0075de] bg-[#0075de]/10 border-[#0075de]/20'>
                                        <Users className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        1. Information We Collect
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    01
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    We may collect personal information that you provide to us, such as
                                    your <strong className='font-semibold text-[#191919] dark:text-[#ececec]'>name</strong>,{' '}
                                    <strong className='font-semibold text-[#191919] dark:text-[#ececec]'>email address</strong>,{' '}
                                    <strong className='font-semibold text-[#191919] dark:text-[#ececec]'>college details</strong>, and
                                    any other information you choose to provide.
                                </p>

                                <div className='p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#1c1c1c] space-y-2'>
                                    <div className='flex items-center gap-2 text-[#191919] dark:text-[#ececec] font-semibold text-xs'>
                                        <Database className='w-3.5 h-3.5 text-[#0075de]' />
                                        <span>Technical &amp; Analytics Information</span>
                                    </div>
                                    <p className='text-xs text-[#787774] dark:text-[#9b9a97]'>
                                        Additionally, we collect technical information such as IP address, browser type,
                                        and usage data for analytics purposes to help improve our platform reliability.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: How We Use Your Information */}
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
                                        2. How We Use Your Information
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    02
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    We use your information to improve your experience on Student Senior, manage user accounts,
                                    and provide services such as connecting seniors and juniors.
                                </p>
                                <ul className='space-y-2.5 pt-1'>
                                    <li className='flex items-start gap-2.5'>
                                        <CheckCircle2 className='w-4 h-4 text-[#0075de] shrink-0 mt-0.5' />
                                        <span>Manage user accounts and provide seamless peer-to-peer connectivity.</span>
                                    </li>
                                    <li className='flex items-start gap-2.5'>
                                        <CheckCircle2 className='w-4 h-4 text-[#0075de] shrink-0 mt-0.5' />
                                        <span>Improve website features, optimize usability, and analyze site traffic.</span>
                                    </li>
                                    <li className='flex items-start gap-2.5'>
                                        <CheckCircle2 className='w-4 h-4 text-[#0075de] shrink-0 mt-0.5' />
                                        <span>Send updates about new features.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3: Sharing of Information */}
                        <section
                            id='sharing'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'>
                                        <Bell className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        3. Sharing of Information
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    03
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    <strong className='font-semibold text-[#191919] dark:text-[#ececec]'>
                                        We do not share your personal information with third parties
                                    </strong>
                                    , except when necessary to operate the website, comply with legal obligations, or
                                    protect our rights.
                                </p>

                                <div className='p-4 rounded-xl border border-purple-200 dark:border-purple-800/40 bg-purple-50/50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-200 text-xs'>
                                    We may share anonymous data for analytics and marketing purposes.
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Security */}
                        <section
                            id='security'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'>
                                        <Lock className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        4. Security
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    04
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    We take reasonable steps to protect your personal information from unauthorized access
                                    or disclosure.
                                </p>
                                <div className='p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#1c1c1c] text-xs text-[#787774] dark:text-[#9b9a97]'>
                                    However, please be aware that no internet transmission is entirely secure.
                                </div>
                            </div>
                        </section>

                        {/* Section 5: Your Rights */}
                        <section
                            id='rights'
                            className='scroll-mt-8 p-6 sm:p-8 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs'
                        >
                            <div className='flex items-center justify-between mb-4 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center border text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'>
                                        <Shield className='w-4 h-4' />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                                        5. Your Rights
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                    05
                                </span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                <p>
                                    You have the right to access, update, or delete your personal information. If you would like
                                    to exercise these rights, please contact us through our support channels.
                                </p>
                            </div>
                        </section>

                        {/* Section 6: Contact Us */}
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
                                        6. Contact Us
                                    </h2>
                                </div>
                                <span className='text-xs font-mono text-[#0075de] opacity-80'>06</span>
                            </div>

                            <div className='space-y-4 text-xs sm:text-sm text-[#787774] dark:text-[#ececec]/80 leading-relaxed'>
                                <p>
                                    If you have any questions about our Privacy Policy, please contact us at:
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
                                    href='/refund-policy'
                                    className='inline-flex items-center gap-1 hover:text-[#0075de] transition-colors'
                                >
                                    <RefreshCw className='w-3.5 h-3.5' />
                                    <span>Refund Policy</span>
                                </Link>
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <Clock className='w-3.5 h-3.5' />
                                <span>Last updated: 06-11-2024</span>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
