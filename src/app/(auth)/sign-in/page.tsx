'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    LogIn,
    Loader2,
    ArrowRight,
    ArrowLeft,
    GraduationCap,
    BookOpen,
    Users,
    CheckCircle2,
    Star,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '@/components/OAuth';
import { api, API_KEY } from '@/config/apiUrls';
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';

interface FormData {
    email?: string;
    password?: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const SignIn: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({});
    const [errors, setErrors] = useState<FormErrors>({});
    const [passwordShown, setPasswordShown] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(true);

    const { loading } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    // Get redirect path from URL params
    let from = searchParams.get('from') || '/';
    if (from === '/sign-in' || from === '/sign-up') {
        from = '/';
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password || formData.password.length < 1) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));

        if (errors[id as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [id]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            dispatch(signInStart());

            const res = await fetch(`${api.auth.login}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY ?? '',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false) {
                dispatch(signInFailure(data));
                toast.error(data.message || 'Invalid credentials');
                return;
            }

            dispatch(signInSuccess(data.data));
            toast.success('Welcome back! Sign in successful');

            setTimeout(() => {
                router.push(from);
            }, 100);
        } catch (error) {
            console.error('Sign in error:', error);
            dispatch(signInFailure(error));
            toast.error('Sign in failed. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordShown((prev) => !prev);
    };

    return (
        <div className='relative min-h-screen w-full bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden font-sans selection:bg-blue-500 selection:text-white'>
            {/* Ambient Background Glows & Patterns */}
            <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                <div className='absolute -top-40 -left-40 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-3xl' />
                <div className='absolute top-1/3 -right-32 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl' />
                <div className='absolute -bottom-40 left-1/3 w-[500px] h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl' />
                
                {/* Subtle Grid overlay */}
                <div 
                    className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
                    style={{
                        backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />
            </div>

            {/* Main Outer Container */}
            <div className='relative z-10 w-full max-w-6xl mx-auto'>
                {/* Top Navigation Bar */}
                <div className='flex items-center justify-between mb-6 px-2 sm:px-4'>
                    <Link
                        href='/'
                        className='inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs'
                    >
                        <ArrowLeft className='w-4 h-4 transition-transform group-hover:-translate-x-1' />
                        <span>Back to Home</span>
                    </Link>

                    {/* <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 text-xs font-semibold text-blue-600 dark:text-blue-400'>
                        <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                        <span>Academic Network 2.0</span>
                    </div> */}
                </div>

                {/* Split Bento Card */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch'>
                    
                    {/* Left Column: Visual Showcase & Community Stats (Desktop) */}
                    <div className='hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-8 xl:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0d1527] to-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden'>
                        {/* Decorative background effects */}
                        <div className='absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none' />
                        <div className='absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none' />

                        {/* Top Branding Section */}
                        <div className='relative z-10 space-y-6'>
                            <div className='flex items-center gap-3'>
                                <div className='relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/20 bg-slate-800 flex items-center justify-center'>
                                    <Image
                                        src='/assets/logo.jpg'
                                        alt='Student Senior Logo'
                                        fill
                                        className='object-cover'
                                        priority
                                    />
                                </div>
                                <div>
                                    <h3 className='text-xl font-bold tracking-tight text-white flex items-center gap-2'>
                                        StudentSenior
                                        {/* <Sparkles className='w-4 h-4 text-amber-400' /> */}
                                    </h3>
                                    <p className='text-xs text-slate-400'>Empowering Students & Seniors Together</p>
                                </div>
                            </div>

                            <div className='space-y-3 pt-4'>
                                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-medium text-blue-200 border border-white/10'>
                                    <GraduationCap className='w-3.5 h-3.5 text-blue-300' />
                                    Campus Resource Sharing
                                </div>
                                <h1 className='text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight'>
                                    Master your academics with pyq, notes and guidance.
                                </h1>
                                <p className='text-slate-300 text-sm xl:text-base leading-relaxed max-w-lg'>
                                    Access verified notes, previous year question, mentors, and real-time guidance from seniors in your stream.
                                </p>
                            </div>
                        </div>

                        {/* Middle Bento Highlights */}
                        <div className='relative z-10 grid grid-cols-2 gap-3.5 my-8'>
                            <div className='p-4.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 group'>
                                <div className='w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5 group-hover:scale-110 transition-transform'>
                                    <BookOpen className='w-5 h-5' />
                                </div>
                                <h4 className='text-sm font-semibold text-white'>2,000+ PYQs</h4>
                                <p className='text-xs text-slate-400 mt-1'>Curated by college toppers & verified seniors</p>
                            </div>

                            <div className='p-4.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 group'>
                                <div className='w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5 group-hover:scale-110 transition-transform'>
                                    <Users className='w-5 h-5' />
                                </div>
                                <h4 className='text-sm font-semibold text-white'>25+ Seniors</h4>
                                <p className='text-xs text-slate-400 mt-1'>Connect with seniors for guidance from your stream</p>
                            </div>
                        </div>

                        {/* Bottom Student Testimonial / Community Card */}
                        <div className='relative z-10 p-4 rounded-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-md border border-white/15'>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex -space-x-4 overflow-hidden items-center'>
                                        <div className='inline-flex h-8 w-8 rounded-full bg-blue-500 text-[11px] font-bold text-white items-center justify-center text-center'>
                                            AK
                                        </div>
                                        <div className='inline-flex h-8 w-8 rounded-full bg-red-500 text-[11px] shadow-lg font-bold text-white items-center justify-center text-center'>
                                            SV
                                        </div>
                                        <div className='inline-flex h-8 w-8 rounded-full bg-blue-500 text-[11px] shadow-lg font-bold text-white items-center justify-center text-center'>
                                            RS
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-1 text-amber-400'>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className='w-3 h-3 fill-amber-400 text-amber-400' />
                                            ))}
                                            <span className='text-xs font-bold text-white ml-1'>4.9/5</span>
                                        </div>
                                        <p className='text-[11px] text-slate-300'>Joined by 10,000+ active learners</p>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <span className='text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1'>
                                        <CheckCircle2 className='w-3.5 h-3.5' /> Verified
                                    </span>
                                    <span className='text-[10px] text-slate-400'>SSL 256-bit Auth</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sign In Form Card */}
                    <div className='col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-center'>
                        <div className='bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl dark:shadow-2xl transition-all duration-300'>
                            
                            {/* Mobile Logo / Brand Header */}
                            <div className='lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800'>
                                <div className='relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-blue-500/20'>
                                    <Image
                                        src='/assets/logo.jpg'
                                        alt='Student Senior Logo'
                                        fill
                                        className='object-cover'
                                        priority
                                    />
                                </div>
                                <div>
                                    <h2 className='text-lg font-bold text-slate-900 dark:text-white'>StudentSenior</h2>
                                    <p className='text-xs text-slate-500 dark:text-slate-400'>Sign in to your account</p>
                                </div>
                            </div>

                            {/* Form Header */}
                            <div className='space-y-2 mb-6'>
                                <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
                                    Welcome back 👋
                                </h2>
                                <p className='text-sm text-slate-600 dark:text-slate-400'>
                                    Enter your credentials to access your student portal.
                                </p>
                            </div>

                            {/* Social Logins */}
                            <div className='space-y-4 mb-6'>
                                <OAuth />

                                <div className='relative flex items-center justify-center'>
                                    <div className='w-full border-t border-slate-200 dark:border-slate-800' />
                                    <span className='absolute bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-400 uppercase tracking-wider'>
                                        or continue with email
                                    </span>
                                </div>
                            </div>

                            {/* Sign In Form */}
                            <form onSubmit={handleSubmit} className='space-y-4' noValidate>
                                {/* Email Field */}
                                <div className='space-y-1.5'>
                                    <label
                                        htmlFor='email'
                                        className='block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'
                                    >
                                        Email Address
                                    </label>
                                    <div className='relative group'>
                                        <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors'>
                                            <Mail className='h-4 w-4' />
                                        </div>
                                        <input
                                            type='email'
                                            id='email'
                                            placeholder='name@college.edu'
                                            className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border transition-all duration-200 focus:outline-none focus:bg-white dark:focus:bg-slate-800 ${
                                                errors.email
                                                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                                                    : 'border-slate-200 dark:border-slate-700/80 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            }`}
                                            onChange={handleChange}
                                            value={formData.email || ''}
                                            autoComplete='email'
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className='text-xs text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1 mt-1'>
                                            <span>•</span> {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className='space-y-1.5'>
                                    <div className='flex items-center justify-between'>
                                        <label
                                            htmlFor='password'
                                            className='block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'
                                        >
                                            Password
                                        </label>
                                    </div>
                                    <div className='relative group'>
                                        <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors'>
                                            <Lock className='h-4 w-4' />
                                        </div>
                                        <input
                                            type={passwordShown ? 'text' : 'password'}
                                            id='password'
                                            placeholder='••••••••••••'
                                            className={`block w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border transition-all duration-200 focus:outline-none focus:bg-white dark:focus:bg-slate-800 ${
                                                errors.password
                                                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                                                    : 'border-slate-200 dark:border-slate-700/80 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            }`}
                                            onChange={handleChange}
                                            value={formData.password || ''}
                                            autoComplete='current-password'
                                        />
                                        <button
                                            type='button'
                                            className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer'
                                            onClick={togglePasswordVisibility}
                                            aria-label={passwordShown ? 'Hide password' : 'Show password'}
                                        >
                                            {passwordShown ? (
                                                <EyeOff className='h-4 w-4' />
                                            ) : (
                                                <Eye className='h-4 w-4' />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className='text-xs text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1 mt-1'>
                                            <span>•</span> {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember Me */}
                                <div className='flex items-center justify-between pt-1'>
                                    <label className='flex items-center gap-2 cursor-pointer select-none'>
                                        <input
                                            type='checkbox'
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className='w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer'
                                        />
                                        <span className='text-xs text-slate-600 dark:text-slate-400 font-medium'>
                                            Remember me for 30 days
                                        </span>
                                    </label>
                                </div>

                                {/* Submit CTA Button */}
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full relative overflow-hidden flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 shadow-md hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer'
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className='w-4 h-4 animate-spin' />
                                            <span>Signing in securely...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className='w-4 h-4' />
                                            <span>Sign In to StudentSenior</span>
                                            <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Sign Up Redirect Link */}
                            <div className='mt-6 pt-5 text-center border-t border-slate-100 dark:border-slate-800'>
                                <p className='text-sm text-slate-600 dark:text-slate-400'>
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        prefetch={false}
                                        href='/sign-up'
                                        className='font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-4 hover:underline transition-colors'
                                    >
                                        Create free account →
                                    </Link>
                                </p>
                            </div>

                            {/* Security Footer */}
                            {/* <div className='mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500'>
                                <ShieldCheck className='w-3.5 h-3.5 text-emerald-500' />
                                <span>End-to-end encrypted session • 256-bit SSL</span>
                            </div> */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignIn;
