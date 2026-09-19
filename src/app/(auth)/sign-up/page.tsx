'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Phone,
    GraduationCap,
    Lock,
    Loader2,
    CheckCircle2,
    ArrowLeft,
    ShieldCheck,
    RefreshCw,
    ArrowRight,
} from 'lucide-react';

import OAuth from '@/components/OAuth';
import { api, API_KEY } from '@/config/apiUrls';
import toast from 'react-hot-toast';

interface FormData {
    username?: string;
    email?: string;
    college?: string;
    phone?: string;
    password?: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    phone?: string;
}

// ─── OTP Input Component ──────────────────────────────────────────────────────

const OtpInput: React.FC<{
    value: string;
    onChange: (val: string) => void;
}> = ({ value, onChange }) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const digits = value.padEnd(6, ' ').split('');

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        idx: number,
    ) => {
        if (e.key === 'Backspace') {
            const newDigits = [...digits];
            if (newDigits[idx].trim()) {
                newDigits[idx] = ' ';
            } else if (idx > 0) {
                newDigits[idx - 1] = ' ';
                inputRefs.current[idx - 1]?.focus();
            }
            onChange(newDigits.join('').trimEnd());
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        idx: number,
    ) => {
        const val = e.target.value.replace(/\D/g, '').slice(-1);
        const newDigits = [...digits];
        newDigits[idx] = val || ' ';
        const newVal = newDigits.join('').trimEnd();
        onChange(newVal);
        if (val && idx < 5) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted);
        const nextIdx = Math.min(pasted.length, 5);
        inputRefs.current[nextIdx]?.focus();
        e.preventDefault();
    };

    return (
        <div className='flex gap-2 sm:gap-3 justify-center' onPaste={handlePaste}>
            {Array.from({ length: 6 }).map((_, idx) => (
                <input
                    key={idx}
                    ref={(el) => {
                        inputRefs.current[idx] = el;
                    }}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digits[idx]?.trim() || ''}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onFocus={(e) => e.target.select()}
                    className='w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border rounded-xl
                               bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white
                               border-slate-200 dark:border-slate-700/80
                               focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                               transition-all duration-200'
                />
            ))}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SignUp: React.FC = () => {
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [formData, setFormData] = useState<FormData>({});
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordShown, setPasswordShown] = useState<boolean>(false);
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const [otp, setOtp] = useState<string>('');
    const [resendTimer, setResendTimer] = useState<number>(0);

    const router = useRouter();

    // Countdown timer for OTP resend
    useEffect(() => {
        if (resendTimer > 0) {
            const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [resendTimer]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
        if (!formData.username || !usernameRegex.test(formData.username)) {
            newErrors.username =
                'Username can only contain letters, numbers, _ and . (3–20 chars)';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (formData.phone && formData.phone.length !== 10) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculatePasswordStrength = (password: string): number => {
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (errors[id as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [id]: undefined }));
        }
        if (id === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    // ── Step 1: Send OTP ──────────────────────────────────────────────────────

    const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${api.auth.sendOtp}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY ?? '',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();

            if (data.success === false) {
                toast.error(data.message);
                return;
            }

            toast.success(`OTP sent to ${formData.email}!`);
            setOtp('');
            setResendTimer(30);
            setStep('otp');
        } catch (error) {
            console.error('Send OTP error:', error);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Verify OTP & Create Account ───────────────────────────────────

    const handleVerifyAndSignup = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        if (otp.replace(/\s/g, '').length < 6) {
            toast.error('Please enter the 6-digit OTP');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${api.auth.verifyOtpSignup}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY ?? '',
                },
                body: JSON.stringify({
                    ...formData,
                    otp: otp.replace(/\s/g, ''),
                }),
            });

            const data = await res.json();

            if (data.success === false) {
                toast.error(data.message);
                return;
            }

            toast.success('Account created successfully! Please log in.');
            router.push('/sign-in');
        } catch (error) {
            console.error('Verify OTP error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Resend OTP ────────────────────────────────────────────────────────────

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        try {
            setLoading(true);
            const res = await fetch(`${api.auth.sendOtp}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY ?? '',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();
            if (data.success === false) {
                toast.error(data.message);
                return;
            }

            setOtp('');
            setResendTimer(30);
            toast.success('New OTP sent to your email!');
        } catch {
            toast.error('Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = (strength: number): string => {
        if (strength <= 2) return 'bg-rose-500';
        if (strength <= 3) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getPasswordStrengthTextColor = (strength: number): string => {
        if (strength <= 2) return 'text-rose-500 dark:text-rose-400';
        if (strength <= 3) return 'text-amber-500 dark:text-amber-400';
        return 'text-emerald-500 dark:text-emerald-400';
    };

    const getPasswordStrengthText = (strength: number): string => {
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Medium';
        return 'Strong';
    };

    // ─── Render ───────────────────────────────────────────────────────────────

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
            <div className='relative z-10 w-full max-w-lg mx-auto py-6'>
                {/* Top Navigation Bar */}
                <div className='flex items-center justify-between mb-6 px-1'>
                    <Link
                        href='/'
                        className='inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs'
                    >
                        <ArrowLeft className='w-4 h-4 transition-transform group-hover:-translate-x-1' />
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Form Card */}
                <div className='bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl dark:shadow-2xl transition-all duration-300'>
                    
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <div className='inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25 ring-2 ring-white/20'>
                            {step === 'otp' ? (
                                <ShieldCheck className='w-7 h-7 text-white' />
                            ) : (
                                <User className='w-7 h-7 text-white' />
                            )}
                        </div>
                        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2'>
                            {step === 'otp' ? 'Verify Your Email' : 'Create Account'}
                        </h2>
                        <p className='text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto'>
                            {step === 'otp'
                                ? `OTP sent to ${formData.email}`
                                : 'Join our community and unlock curated academic resources'}
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className='flex items-center justify-center mb-8 max-w-xs mx-auto'>
                        {['Details', 'Verify'].map((label, i) => (
                            <React.Fragment key={label}>
                                <div className='flex items-center gap-2'>
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                            (i === 0 && step === 'form') ||
                                            (i === 1 && step === 'otp')
                                                ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                                                : i === 0 && step === 'otp'
                                                  ? 'bg-emerald-500 text-white'
                                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                        }`}
                                    >
                                        {i === 0 && step === 'otp' ? (
                                            <CheckCircle2 className='w-4 h-4' />
                                        ) : (
                                            i + 1
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs sm:text-sm font-semibold ${
                                            (i === 0 && step === 'form') ||
                                            (i === 1 && step === 'otp')
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-slate-500 dark:text-slate-400'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {i === 0 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-3 rounded transition-colors duration-300 ${
                                            step === 'otp'
                                                ? 'bg-emerald-500'
                                                : 'bg-slate-200 dark:bg-slate-800'
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* ── STEP 1: Form ── */}
                    {step === 'form' && (
                        <div>
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

                            <form onSubmit={handleSendOtp} className='space-y-4' noValidate>
                                {/* Username */}
                                <div className='space-y-1.5'>
                                    <label
                                        htmlFor='username'
                                        className='block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'
                                    >
                                        Username *
                                    </label>
                                    <div className='relative group'>
                                        <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors'>
                                            <User className='h-4 w-4' />
                                        </div>
                                        <input
                                            type='text'
                                            id='username'
                                            placeholder='e.g. johndoe'
                                            className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border transition-all duration-200 focus:outline-none focus:bg-white dark:focus:bg-slate-800 ${
                                                errors.username
                                                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                                                    : 'border-slate-200 dark:border-slate-700/80 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            }`}
                                            onChange={handleChange}
                                            value={formData.username || ''}
                                            autoComplete='username'
                                        />
                                    </div>
                                    {errors.username && (
                                        <p className='text-xs text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1 mt-1'>
                                            <span>•</span> {errors.username}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className='space-y-1.5'>
                                    <label
                                        htmlFor='email'
                                        className='block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'
                                    >
                                        Email Address *
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

                                {/* College */}
                                <div className='space-y-1.5'>
                                    <label
                                        htmlFor='college'
                                        className='block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'
                                    >
                                        College Name <span className='text-slate-400 lowercase font-normal'>(optional)</span>
                                    </label>
                                    <div className='relative group'>
                                        <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors'>
                                            <GraduationCap className='h-4 w-4' />
                                        </div>
                                        <input
                                            type='text'
                                            id='college'
                                            placeholder='e.g. Stanford University'
                                            className='block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/80 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 focus:outline-none focus:bg-white dark:focus:bg-slate-800'
                                            onChange={handleChange}
                                            value={formData.college || ''}
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className='space-y-1.5'>
                                    <label
                                        htmlFor='phone'
                                        className='block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'
                                    >
                                        Mobile Number <span className='text-slate-400 lowercase font-normal'>(optional)</span>
                                    </label>
                                    <div className='relative group'>
                                        <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors'>
                                            <Phone className='h-4 w-4' />
                                        </div>
                                        <input
                                            type='tel'
                                            id='phone'
                                            placeholder='10-digit mobile number'
                                            className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border transition-all duration-200 focus:outline-none focus:bg-white dark:focus:bg-slate-800 ${
                                                errors.phone
                                                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                                                    : 'border-slate-200 dark:border-slate-700/80 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            }`}
                                            onChange={handleChange}
                                            value={formData.phone || ''}
                                            maxLength={10}
                                            autoComplete='tel'
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className='text-xs text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1 mt-1'>
                                            <span>•</span> {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className='space-y-1.5'>
                                    <label
                                        htmlFor='password'
                                        className='block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'
                                    >
                                        Password *
                                    </label>
                                    <div className='relative group'>
                                        <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors'>
                                            <Lock className='h-4 w-4' />
                                        </div>
                                        <input
                                            type={passwordShown ? 'text' : 'password'}
                                            id='password'
                                            placeholder='Create a strong password'
                                            className={`block w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border transition-all duration-200 focus:outline-none focus:bg-white dark:focus:bg-slate-800 ${
                                                errors.password
                                                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                                                    : 'border-slate-200 dark:border-slate-700/80 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            }`}
                                            onChange={handleChange}
                                            value={formData.password || ''}
                                            autoComplete='new-password'
                                        />
                                        <button
                                            type='button'
                                            className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer'
                                            onClick={() =>
                                                setPasswordShown((p) => !p)
                                            }
                                            aria-label={passwordShown ? 'Hide password' : 'Show password'}
                                        >
                                            {passwordShown ? (
                                                <EyeOff className='h-4 w-4' />
                                            ) : (
                                                <Eye className='h-4 w-4' />
                                            )}
                                        </button>
                                    </div>

                                    {formData.password && (
                                        <div className='mt-2 space-y-1'>
                                            <div className='flex items-center justify-between text-xs'>
                                                <span className='text-slate-500 dark:text-slate-400'>
                                                    Password strength:
                                                </span>
                                                <span
                                                    className={`font-semibold ${getPasswordStrengthTextColor(
                                                        passwordStrength,
                                                    )}`}
                                                >
                                                    {getPasswordStrengthText(
                                                        passwordStrength,
                                                    )}
                                                </span>
                                            </div>
                                            <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden'>
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                                                    style={{
                                                        width: `${(passwordStrength / 5) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {errors.password && (
                                        <p className='text-xs text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1 mt-1'>
                                            <span>•</span> {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Submit CTA */}
                                <div className='pt-2'>
                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='w-full relative overflow-hidden flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 shadow-md hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer'
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className='w-4 h-4 animate-spin' />
                                                <span>Sending verification OTP...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Mail className='w-4 h-4' />
                                                <span>Send Verification OTP</span>
                                                <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Sign In Link */}
                            <div className='mt-6 pt-5 text-center border-t border-slate-100 dark:border-slate-800'>
                                <p className='text-sm text-slate-600 dark:text-slate-400'>
                                    Already have an account?{' '}
                                    <Link
                                        prefetch={false}
                                        href='/sign-in'
                                        className='font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-4 hover:underline transition-colors'
                                    >
                                        Sign in here →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: OTP Verification ── */}
                    {step === 'otp' && (
                        <div>
                            <form
                                onSubmit={handleVerifyAndSignup}
                                className='space-y-6'
                            >
                                {/* Illustration */}
                                <div className='text-center'>
                                    <div className='inline-flex items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-950/60 rounded-2xl mb-3 border border-blue-200/60 dark:border-blue-800/60'>
                                        <Mail className='w-7 h-7 text-blue-600 dark:text-blue-400' />
                                    </div>
                                    <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                                        We&apos;ve sent a{' '}
                                        <strong className='text-slate-900 dark:text-white font-semibold'>
                                            6-digit OTP
                                        </strong>{' '}
                                        to{' '}
                                        <strong className='text-blue-600 dark:text-blue-400 font-semibold'>
                                            {formData.email}
                                        </strong>
                                        . Check your inbox (and spam folder).
                                    </p>
                                </div>

                                {/* OTP Input */}
                                <div className='space-y-3'>
                                    <label className='block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-center'>
                                        Enter 6-Digit Code
                                    </label>
                                    <OtpInput value={otp} onChange={setOtp} />
                                </div>

                                {/* Verify Button */}
                                <button
                                    type='submit'
                                    disabled={
                                        loading ||
                                        otp.replace(/\s/g, '').length < 6
                                    }
                                    className='w-full relative overflow-hidden flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 shadow-md hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer'
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className='w-4 h-4 animate-spin' />
                                            <span>Verifying and creating account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className='w-4 h-4' />
                                            <span>Verify &amp; Create Account</span>
                                            <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                                        </>
                                    )}
                                </button>

                                {/* Resend + Back */}
                                <div className='flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800'>
                                    <button
                                        type='button'
                                        onClick={() => {
                                            setStep('form');
                                            setOtp('');
                                        }}
                                        className='flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer'
                                    >
                                        <ArrowLeft className='w-4 h-4' />
                                        <span>Back to form</span>
                                    </button>

                                    <button
                                        type='button'
                                        disabled={resendTimer > 0 || loading}
                                        onClick={handleResendOtp}
                                        className='flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
                                    >
                                        <RefreshCw
                                            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                                        />
                                        <span>
                                            {resendTimer > 0
                                                ? `Resend in ${resendTimer}s`
                                                : 'Resend OTP'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='mt-6 text-center'>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                        By creating an account, you agree to our{' '}
                        <Link
                            prefetch={false}
                            href='/terms-and-conditions'
                            className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-4 hover:underline transition-colors'
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            prefetch={false}
                            href='/privacy-policy'
                            className='text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
