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
} from 'lucide-react';

export const metadata = {
    title: 'About Us - Student Senior',
    description: 'Learn more about our team and mission.',
};

function AboutPage() {
    const features = [
        {
            title: 'Academic Resources',
            description:
                "Access previous year's question papers (PYQs) and comprehensive notes for simplified exam preparation.",
            icon: <BookOpen className='w-6 h-6' />,
        },
        {
            title: 'Senior Connect',
            description:
                'Connect with experienced seniors for guidance and mentorship through live chats and community forums.',
            icon: <Users className='w-6 h-6' />,
        },
        {
            title: 'Student Marketplace',
            description:
                'Buy and sell used stationery, books, and resources within your college community.',
            icon: <ShoppingBag className='w-6 h-6' />,
        },
        {
            title: 'Internship Portal',
            description:
                'Discover and apply for relevant internship opportunities based on your course.',
            icon: <Rocket className='w-6 h-6' />,
        },
        {
            title: 'College Resources',
            description:
                'Access official websites, admission information, and essential college resources effortlessly.',
            icon: <Building2 className='w-6 h-6' />,
        },
        {
            title: 'Academic Success',
            description:
                'Get comprehensive support for your academic journey with our integrated platform.',
            icon: <GraduationCap className='w-6 h-6' />,
        },
    ];

    return (
        <div className='py-12 px-4 sm:px-6 lg:px-8'>
            {/* Hero Section */}
            <div className='max-w-7xl mx-auto text-center mb-20'>
                <h1 className='text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                    About Student Senior
                </h1>
                <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
                    Empowering students with comprehensive academic resources,
                    mentorship, and opportunities for success.
                </p>
            </div>

            {/* Features Grid */}
            <div className='max-w-7xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className='relative group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700'
                        >
                            <div className='absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                            <div className='relative'>
                                <div className='inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4'>
                                    {React.cloneElement(feature.icon, {
                                        className:
                                            'w-6 h-6 text-blue-600 dark:text-blue-400',
                                    })}
                                </div>
                                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                                    {feature.title}
                                </h3>
                                <p className='text-gray-600 dark:text-gray-300'>
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission Section */}
            <div className='max-w-7xl mx-auto mt-24'>
                <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12'>
                    <div className='max-w-3xl mx-auto text-center'>
                        <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
                            Our Mission
                        </h2>
                        <p className='text-lg sm:text-xl text-white/90'>
                            To empower students by providing seamless access to
                            academic resources, meaningful connections with
                            seniors, and valuable opportunities that contribute
                            to their academic and professional success.
                        </p>
                    </div>
                </div>
            </div>

            {/* Founder Section */}
            <div className='max-w-7xl mx-auto mt-24'>
                <div className='relative overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl'>
                    {/* decorative gradient blobs */}
                    <div className='pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-3xl' />
                    <div className='pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-3xl' />

                    <div className='relative grid grid-cols-1 lg:grid-cols-5 gap-10 p-8 sm:p-12'>
                        {/* Photo + identity card */}
                        <div className='lg:col-span-2 flex flex-col items-center text-center'>
                            <div className='relative'>
                                <div className='absolute -inset-1.5 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 blur-sm opacity-70' />
                                <Image
                                    src='/assets/images/profile_photo.jpg'
                                    alt='Mohd Rafey — Founder of Student Senior'
                                    width={180}
                                    height={180}
                                    className='relative rounded-full w-[180px] h-[180px] object-cover border-4 border-white dark:border-gray-800 shadow-lg'
                                />
                                <span className='absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-md'>
                                    <Sparkles className='w-3.5 h-3.5' />
                                    Founder
                                </span>
                            </div>

                            <h3 className='mt-6 text-2xl font-bold text-gray-900 dark:text-white'>
                                Mohd Rafey
                            </h3>
                            <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                                Creator &amp; Founder, Student Senior
                            </p>
                            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                BTech CSE (2026)· Integral University, Lucknow
                            </p>

                            <div className='mt-6 inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300'>
                                <Users className='w-4 h-4' />
                                25,000+ students helped
                            </div>

                            <a
                                href='https://www.linkedin.com/in/mohdrafey1'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='mt-4 inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#004182] hover:shadow-lg'
                            >
                                <Linkedin className='w-4 h-4' />
                                Connect on LinkedIn
                            </a>
                        </div>

                        {/* Story */}
                        <div className='lg:col-span-3'>
                            <span className='inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300'>
                                <Heart className='w-4 h-4' />
                                Built by a student, for students
                            </span>

                            <h2 className='mt-4 text-3xl sm:text-4xl font-bold leading-tight text-gray-900 dark:text-white'>
                                Student Senior —
                                <br />
                                <span className='bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                                    Where College Life Gets Easier,
                                </span>
                            </h2>

                            <div className='mt-6 space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed'>
                                <p>
                                    Hey, I&apos;m Mohd Rafey — a BTech CSE
                                    student at Integral University, Lucknow.
                                    I&apos;m the creator and founder of{' '}
                                    <span className='font-semibold text-gray-900 dark:text-white'>
                                        Student Senior
                                    </span>
                                    , a growing student community that has
                                    already helped{' '}
                                    <span className='font-semibold text-blue-600 dark:text-blue-400'>
                                        25,000+ students
                                    </span>{' '}
                                    — especially the 2024–2026 graduating
                                    batches — understand the college curriculum
                                    and study smarter.
                                </p>
                                <p>
                                    What started as a small idea is now
                                    something many students rely on — something
                                    I personally wish I had when I first joined
                                    college.
                                </p>
                            </div>

                            {/* Pull quote */}
                            <div className='my-8 relative rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-[1.5px]'>
                                <div className='flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 px-6 py-5'>
                                    <Quote className='w-8 h-8 shrink-0 text-purple-500' />
                                    <p className='text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                                        Skills &gt;&gt;&gt; CGPA
                                    </p>
                                </div>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed'>
                                <p>
                                    But I also learned a harsh reality: you
                                    still need a minimum CGPA just to get
                                    shortlisted at most companies. To score
                                    well, you have to prepare with as little
                                    friction as possible — and that&apos;s
                                    exactly why{' '}
                                    <span className='font-semibold text-gray-900 dark:text-white'>
                                        PYQs matter
                                    </span>
                                    .
                                </p>
                                <p>
                                    I was the platform&apos;s most active user
                                    and contributor — I used it to lift my own
                                    CGPA, and so did my friends. It worked. And
                                    Student Senior isn&apos;t just about PYQs
                                    anymore — there&apos;s so much here now,
                                    with even more coming soon.
                                </p>
                                <p>
                                    That&apos;s exactly why I built Student
                                    Senior — not just to study more, but to
                                    study{' '}
                                    <span className='font-semibold text-gray-900 dark:text-white'>
                                        smarter, faster, and with clarity
                                    </span>
                                    . I wanted to create the platform I wished I
                                    had in my first year — a place where every
                                    IUL student can find what they need in
                                    seconds.
                                </p>
                            </div>

                            <p className='mt-8 text-lg font-semibold text-gray-900 dark:text-white'>
                                All the best 🚀
                                <span className='block mt-1 text-sm font-normal text-gray-500 dark:text-gray-400'>
                                    — Mohd Rafey, Founder
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
