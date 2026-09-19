'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Mail,
    Phone,
    ArrowUpRight,
    GraduationCap,
    Heart,
    ShieldCheck,
    BookOpen,
    Users,
    Sparkles,
    ChevronRight,
} from 'lucide-react';

const Footer: React.FC = () => {
    const [isAndroid, setIsAndroid] = useState<boolean>(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/android/i.test(userAgent)) {
            setIsAndroid(true);
        }
    }, []);

    const socialLinks = [
        {
            name: 'Telegram',
            href: 'https://t.me/studentsenior12',
            hoverBg: 'hover:bg-[#229ED9]/15 hover:text-[#229ED9] hover:border-[#229ED9]/40',
            icon: (
                <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.845-1.359 5.593-.168.74-.319 1.4-.466 2.043-.147.643-.245 1.062-.319 1.257-.074.195-.171.354-.294.477-.171.172-.379.215-.624.129-.208-.073-.419-.17-.633-.29-.214-.12-1.012-.625-1.157-.718-.911-.586-1.753-1.146-2.526-1.682-.193-.134-.375-.271-.545-.411-.17-.14-.327-.283-.472-.428-.145-.145-.275-.294-.39-.447-.115-.153-.205-.311-.27-.474-.065-.163-.097-.332-.097-.507 0-.175.049-.354.146-.537.097-.183.245-.372.444-.567.199-.195.454-.396.765-.603.311-.207.679-.42 1.105-.64.426-.22.909-.446 1.45-.679.541-.233 1.139-.472 1.794-.718.655-.246 1.366-.497 2.134-.753.277-.098.464-.159.56-.184.096-.025.151-.037.165-.037.111 0 .209.037.294.11.085.073.146.177.183.312.037.135.049.294.037.477-.012.183-.043.391-.092.624z' />
                </svg>
            ),
        },
        {
            name: 'LinkedIn',
            href: 'https://www.linkedin.com/company/student-senior',
            hoverBg: 'hover:bg-[#0077B5]/15 hover:text-[#0077B5] hover:border-[#0077B5]/40',
            icon: (
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            href: 'https://www.instagram.com/studentsenior12?igsh=c2NkZWRpNm9pdTVy',
            hoverBg: 'hover:bg-[#E1306C]/15 hover:text-[#E1306C] hover:border-[#E1306C]/40',
            icon: (
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
            ),
        },
        {
            name: 'YouTube',
            href: 'https://youtube.com/extraelements',
            hoverBg: 'hover:bg-[#FF0000]/15 hover:text-[#FF0000] hover:border-[#FF0000]/40',
            icon: (
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                </svg>
            ),
        },
        {
            name: 'WhatsApp',
            href: 'https://api.whatsapp.com/send?phone=919455346151',
            hoverBg: 'hover:bg-[#25D366]/15 hover:text-[#25D366] hover:border-[#25D366]/40',
            icon: (
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                </svg>
            ),
        },
    ];

    const legalLinks = [
        { to: '/about-us', text: 'About Us' },
        { to: '/contact-us', text: 'Contact Us' },
        { to: '/privacy-policy', text: 'Privacy Policy' },
        { to: '/terms-and-conditions', text: 'Terms & Conditions' },
        { to: '/refund-policy', text: 'Refund Policy' },
    ];

    const resourceLinks = [
        { to: '/', text: 'Previous Year Questions (PYQs)' },
        { to: '/', text: 'Verified Senior Notes' },
        { to: '/', text: 'Mentor Guidance Network' },
        { to: '/sign-up', text: 'Create Free Account' },
        { to: '/sign-in', text: 'Student Portal Login' },
    ];

    return (
        <footer className='relative bg-[#070b14] text-slate-300 font-sans border-t border-slate-800/80 overflow-hidden'>
            {/* Ambient Background Glows */}
            <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                <div className='absolute -top-32 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl' />
                <div className='absolute bottom-0 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl' />
                <div 
                    className='absolute inset-0 opacity-[0.03]'
                    style={{
                        backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />
            </div>

            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12'>
                {/* Top Bento Banner: Community & App Highlight */}
                <div className='mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-indigo-950/40 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6'>
                    <div className='space-y-2 text-center lg:text-left'>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400'>
                            <Sparkles className='w-3.5 h-3.5' />
                            <span>Empowering Next-Gen Students</span>
                        </div>
                        <h3 className='text-xl sm:text-2xl font-bold text-white tracking-tight'>
                            Join 10,000+ students excelling in academics
                        </h3>
                        <p className='text-sm text-slate-400 max-w-xl'>
                            Get seamless access to verified study material, previous year question papers, and direct senior mentorship.
                        </p>
                    </div>

                    <div className='flex flex-wrap items-center gap-3.5'>
                        <a
                            href='https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md group'
                        >
                            <svg
                                className="w-5 h-5 flex-shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3.6 2.3C3.22 2.7 3 3.32 3 4.12v15.76c0 .8.22 1.42.6 1.82L3.7 21.8 14.25 12 3.7 2.2l-.1.1Z"
                                    fill="#00A0FF"
                                />
                                <path
                                    d="M17.75 15.25 14.25 12 3.7 21.8c.4.42 1.05.47 1.78.06l12.27-6.61Z"
                                    fill="#00D66F"
                                />
                                <path
                                    d="m17.75 8.75-12.27-6.61C4.75 1.73 4.1 1.78 3.7 2.2L14.25 12l3.5-3.25Z"
                                    fill="#FFD500"
                                />
                                <path
                                    d="m17.75 8.75-3.5 3.25 3.5 3.25 4.1-2.21c1.15-.62 1.15-1.46 0-2.08l-4.1-2.21Z"
                                    fill="#FF3B30"
                                />
                            </svg>
                            <div className='text-left'>
                                <p className='text-[10px] uppercase font-medium text-slate-300 leading-none'>Get it on</p>
                                <p className='text-xs font-bold leading-tight'>Google Play</p>
                            </div>
                        </a>

                        <Link
                            href='/sign-up'
                            className='inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]'
                        >
                            <span>Get Started Free</span>
                            <ArrowUpRight className='w-4 h-4' />
                        </Link>
                    </div>
                </div>

                {/* Main 4-Column Footer Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14'>
                    {/* Brand Section */}
                    <div className='lg:col-span-4 space-y-5'>
                        <div className='flex items-center gap-3'>
                            <div className='relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/15 bg-slate-800 shadow-md'>
                                <Image
                                    src='/assets/logo.jpg'
                                    alt='Student Senior Logo'
                                    fill
                                    className='object-cover'
                                />
                            </div>
                            <div>
                                <span className='text-xl font-bold tracking-tight text-white'>
                                    StudentSenior
                                </span>
                                <p className='text-xs text-slate-400'>Empowering Students &amp; Seniors</p>
                            </div>
                        </div>

                        <p className='text-sm text-slate-400 leading-relaxed max-w-sm'>
                            The unified academic platform connecting students with seniors for authentic guidance, verified previous year papers, and curated study notes.
                        </p>

                        {/* Contact Info Pills */}
                        <div className='space-y-2.5 pt-2'>
                            <a
                                href='mailto:studentsenior.help@gmail.com'
                                className='inline-flex items-center gap-2.5 text-xs text-slate-300 hover:text-blue-400 transition-colors p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30'
                            >
                                <Mail className='w-4 h-4 text-blue-400 flex-shrink-0' />
                                <span>studentsenior.help@gmail.com</span>
                            </a>
                            <div className='flex items-center gap-2'>
                                <a
                                    href='https://api.whatsapp.com/send?phone=919455346151'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-2.5 text-xs text-slate-300 hover:text-emerald-400 transition-colors p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30'
                                >
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                              <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                            </svg>                                    <span>+91 9455346151</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Resources */}
                    {/* <div className='lg:col-span-3 space-y-4'>
                        <h4 className='text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2'>
                            <BookOpen className='w-4 h-4 text-blue-400' />
                            <span>Resources</span>
                        </h4>
                        <ul className='space-y-2.5'>
                            {resourceLinks.map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        prefetch={false}
                                        href={item.to}
                                        className='text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group'
                                    >
                                        <ChevronRight className='w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5' />
                                        <span>{item.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div> */}

                    {/* Quick & Legal Links */}
                    <div className='lg:col-span-2 space-y-4'>
                        <h4 className='text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2'>
                            <ShieldCheck className='w-4 h-4 text-emerald-400' />
                            <span>Useful Links</span>
                        </h4>
                        <ul className='space-y-2.5'>
                            {legalLinks.map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        prefetch={false}
                                        href={item.to}
                                        className='text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group'
                                    >
                                        <ChevronRight className='w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5' />
                                        <span>{item.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect & Socials */}
                    <div className='lg:col-span-3 space-y-4'>
                        <h4 className='text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2'>
                            <Users className='w-4 h-4 text-indigo-400' />
                            <span>Connect With Us</span>
                        </h4>
                        <p className='text-xs text-slate-400 leading-relaxed'>
                            Follow our community channels for latest exam updates, study materials, and senior mentorship sessions.
                        </p>

                        <div className='flex flex-wrap gap-2 pt-2'>
                            {socialLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    aria-label={link.name}
                                    className={`w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-200 hover:scale-105 active:scale-95 ${link.hoverBg}`}
                                    title={link.name}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar & Copyright */}
                <div className='pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <p className='text-xs text-slate-500 text-center sm:text-left'>
                        &copy; {new Date().getFullYear()} Student Senior. All rights reserved.
                    </p>

                    <div className='flex items-center gap-4 text-xs text-slate-400'>
                        <span className='inline-flex items-center gap-1.5'>
                            Made with <Heart className='w-3.5 h-3.5 text-rose-500 fill-rose-500' /> for students
                        </span>
                       </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

