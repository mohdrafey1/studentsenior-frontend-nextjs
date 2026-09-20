import React from 'react';
import Image from 'next/image';
import {
    Users,
    BookOpen,
    Rocket,
    GraduationCap,
    ShoppingBag,
    Building2,
    Quote,
    Sparkles,
    Heart,
    Linkedin,
    Target,
    CheckCircle2,
} from 'lucide-react';

export const metadata = {
    title: 'About Us - Student Senior',
    description: 'Learn more about our team, founder, and mission.',
};

function AboutPage() {
    const features = [
        {
            title: 'Academic Resources',
            description:
                "Access previous year's question papers (PYQs) and comprehensive notes for simplified exam preparation.",
            icon: BookOpen,
            color: 'text-[#0075de] bg-[#0075de]/10 border-[#0075de]/20',
        },
        {
            title: 'Senior Connect',
            description:
                'Connect with experienced seniors for guidance and mentorship through live chats and community forums.',
            icon: Users,
            color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400',
        },
        {
            title: 'Student Marketplace',
            description:
                'Buy and sell used stationery, books, and resources within your college community.',
            icon: ShoppingBag,
            color: 'text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400',
        },
        {
            title: 'Internship Portal',
            description:
                'Discover and apply for relevant internship opportunities based on your course.',
            icon: Rocket,
            color: 'text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400',
        },
        {
            title: 'College Resources',
            description:
                'Access official websites, admission information, and essential college resources effortlessly.',
            icon: Building2,
            color: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400',
        },
        {
            title: 'Academic Success',
            description:
                'Get comprehensive support for your academic journey with our integrated platform.',
            icon: GraduationCap,
            color: 'text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400',
        },
    ];

    return (
        <div className='min-h-screen bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] transition-colors py-8 sm:py-12'>
            <div className='max-w-5xl mx-auto px-4 sm:px-6'>
                {/* Top Breadcrumb & Hero */}
                <div className='text-center max-w-3xl mx-auto mb-12 sm:mb-16'>
                    {/* <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f3f2ef] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#787774] dark:text-[#9b9a97] mb-4'>
                        <Compass className='w-3.5 h-3.5 text-[#0075de]' />
                        <span>Our Mission & Community</span>
                    </div> */}

                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#191919] dark:text-[#ececec] mb-4'>
                        About Student Senior
                    </h1>

                    <p className='text-base sm:text-lg text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                        Empowering students with comprehensive academic resources,
                        mentorship, and opportunities for success.
                    </p>

                    {/* Quick Stats Pills */}
                    {/* <div className='flex flex-wrap items-center justify-center gap-2 mt-6'>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#191919] dark:text-[#ececec] shadow-2xs'>
                            <Users className='w-3.5 h-3.5 text-[#0075de]' />
                            <span>25,000+ Students Impacted</span>
                        </div>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#191919] dark:text-[#ececec] shadow-2xs'>
                            <Building2 className='w-3.5 h-3.5 text-purple-500' />
                            <span>Integral University, Lucknow</span>
                        </div>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#191919] dark:text-[#ececec] shadow-2xs'>
                            <Heart className='w-3.5 h-3.5 text-rose-500' />
                            <span>100% Student-Driven</span>
                        </div>
                    </div> */}
                </div>

                {/* Features Grid */}
                <div className='mb-14 sm:mb-18'>
                    <div className='flex items-center justify-between mb-6 pb-2'>
                        <div className='flex items-center gap-2'>
                            <Target className='w-4 h-4 text-[#0075de]' />
                            <h2 className='text-sm font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97]'>
                                What We Provide
                            </h2>
                        </div>
                        
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4'>
                        {features.map((feature, index) => {
                            const IconComp = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className='p-5 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs hover:border-[#0075de]/40 hover:shadow-xs transition-all flex flex-col justify-between group'
                                >
                                    <div>
                                        <div className='flex items-center justify-between mb-3.5'>
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center border ${feature.color}`}
                                            >
                                                <IconComp className='w-4 h-4' />
                                            </div>
                                            <span className='text-[10px] font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                                0{index + 1}
                                            </span>
                                        </div>

                                        <h3 className='text-sm sm:text-base font-bold text-[#191919] dark:text-[#ececec] mb-1.5 group-hover:text-[#0075de] transition-colors'>
                                            {feature.title}
                                        </h3>
                                        <p className='text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mission Section Callout */}
                <div className='mb-14 sm:mb-18 p-6 sm:p-8 rounded-2xl border border-[#0075de]/30 bg-gradient-to-br from-[#0075de]/5 via-[#0075de]/10 to-transparent dark:from-[#0075de]/15 dark:via-[#0075de]/5 dark:to-transparent relative overflow-hidden shadow-xs'>
                    <div className='max-w-2xl mx-auto text-center relative z-10'>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0075de] text-white shadow-2xs mb-4'>
                            <Sparkles className='w-3.5 h-3.5' />
                            <span>Our Mission</span>
                        </div>
                        <h2 className='text-xl sm:text-2xl font-bold tracking-tight text-[#191919] dark:text-[#ececec] mb-3'>
                            Frictionless Education for Every Student
                        </h2>
                        <p className='text-xs sm:text-sm text-[#787774] dark:text-[#ececec]/80 leading-relaxed font-normal'>
                            &ldquo;To empower students by providing seamless access to
                            academic resources, meaningful connections with
                            seniors, and valuable opportunities that contribute
                            to their academic and professional success.&rdquo;
                        </p>
                    </div>
                </div>

                {/* Founder Story Section */}
                <div className='rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs overflow-hidden'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#e6e6e6] dark:divide-[#2f2f2f]'>
                        {/* Profile Left Sidebar */}
                        <div className='lg:col-span-4 p-6 sm:p-8 flex flex-col items-center text-center bg-[#fbfbfa] dark:bg-[#232323]'>
                            <div className='relative mb-4'>
                                <div className='relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-white dark:border-[#2f2f2f] shadow-md'>
                                    <Image
                                        src='/assets/images/profile_photo.jpg'
                                        alt='Mohd Rafey — Founder of Student Senior'
                                        fill
                                        sizes='(max-width: 768px) 144px, 144px'
                                        className='object-cover'
                                        priority
                                    />
                                </div>
                                <span className='absolute -bottom-2 right-1/2 translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#0075de] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-xs'>
                                    <Sparkles className='w-3 h-3' />
                                    Founder
                                </span>
                            </div>

                            <h3 className='text-lg font-bold text-[#191919] dark:text-[#ececec] mt-1'>
                                Mohd Rafey
                            </h3>
                            <p className='text-xs font-medium text-[#0075de] dark:text-[#0075de] mt-0.5'>
                                Creator &amp; Founder, Student Senior
                            </p>
                            <p className='text-[11px] text-[#787774] dark:text-[#9b9a97] mt-1'>
                                BTech CSE (2026) · Integral University, Lucknow
                            </p>

                            <div className='mt-4 w-full pt-4 border-t border-[#e6e6e6] dark:border-[#2f2f2f] space-y-2'>
                                <div className='inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'>
                                    <CheckCircle2 className='w-3.5 h-3.5' />
                                    <span>25,000+ students helped</span>
                                </div>

                                <a
                                    href='https://www.linkedin.com/in/mohdrafey1'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-xs font-semibold text-white shadow-xs transition-colors'
                                >
                                    <Linkedin className='w-3.5 h-3.5' />
                                    <span>Connect on LinkedIn</span>
                                </a>
                            </div>
                        </div>

                        {/* Story Body Right */}
                        <div className='lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between'>
                            <div>
                                <div className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 mb-3'>
                                    <Heart className='w-3 h-3' />
                                    <span>Built by a student, for students</span>
                                </div>

                                <h2 className='text-xl sm:text-2xl font-bold tracking-tight text-[#191919] dark:text-[#ececec] mb-4'>
                                    Student Senior — Where College Life Gets Easier
                                </h2>

                                <div className='space-y-3 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                    <p>
                                        Hey, I&apos;m Mohd Rafey — a BTech CSE student at Integral
                                        University, Lucknow. I&apos;m the creator and founder of{' '}
                                        <strong className='font-semibold text-[#191919] dark:text-[#ececec]'>
                                            Student Senior
                                        </strong>
                                        , a growing student community that has already helped{' '}
                                        <span className='font-semibold text-[#0075de]'>
                                            25,000+ students
                                        </span>{' '}
                                        — especially the 2024–2026 graduating batches — understand
                                        the college curriculum and study smarter.
                                    </p>
                                    <p>
                                        What started as a small idea is now something many students
                                        rely on — something I personally wish I had when I first
                                        joined college.
                                    </p>
                                </div>

                                {/* Pull Quote Callout */}
                                <div className='my-5 p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#1c1c1c] flex items-center gap-3'>
                                    <Quote className='w-6 h-6 text-[#0075de] shrink-0' />
                                    <div>
                                        <div className='text-base sm:text-lg font-bold text-[#191919] dark:text-[#ececec] font-mono tracking-tight'>
                                            Skills &gt;&gt;&gt; CGPA
                                        </div>
                                        <p className='text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                                            Prioritizing practical mastery alongside academic essentials
                                        </p>
                                    </div>
                                </div>

                                <div className='space-y-3 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                                    <p>
                                        But I also learned a harsh reality: you still need a
                                        minimum CGPA just to get shortlisted at most companies. To
                                        score well, you have to prepare with as little friction as
                                        possible — and that&apos;s exactly why{' '}
                                        <strong className='font-semibold text-[#191919] dark:text-[#ececec]'>
                                            PYQs matter
                                        </strong>
                                        .
                                    </p>
                                    <p>
                                        I was the platform&apos;s most active user and contributor —
                                        I used it to lift my own CGPA, and so did my friends. It
                                        worked. And Student Senior isn&apos;t just about PYQs anymore
                                        — there&apos;s so much here now, with even more coming soon.
                                    </p>
                                    <p>
                                        That&apos;s exactly why I built Student Senior — not just to
                                        study more, but to study{' '}
                                        <strong className='font-semibold text-[#191919] dark:text-[#ececec]'>
                                            smarter, faster, and with clarity
                                        </strong>
                                        . I wanted to create the platform I wished I had in my
                                        first year — a place where every IUL student can find what
                                        they need in seconds.
                                    </p>
                                </div>
                            </div>

                            <div className='mt-6 pt-4 border-t border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-semibold text-[#191919] dark:text-[#ececec]'>
                                        All the best 🚀
                                    </p>
                                    <span className='text-xs text-[#787774] dark:text-[#9b9a97]'>
                                        — Mohd Rafey, Founder
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
