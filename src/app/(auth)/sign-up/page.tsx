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
    CheckCircle,
    ArrowLeft,
    ShieldCheck,
    RefreshCw,
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
        <div className='flex gap-3 justify-center' onPaste={handlePaste}>
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
                    className='w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                               border-gray-300 dark:border-gray-600
                               focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
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
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = (strength: number): string => {
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Medium';
        return 'Strong';
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 flex items-center justify-center'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-md'>
                        {step === 'otp' ? (
                            <ShieldCheck className='w-8 h-8 text-white' />
                        ) : (
                            <User className='w-8 h-8 text-white' />
                        )}
                    </div>
                    <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        {step === 'otp' ? 'Verify Your Email' : 'Create Account'}
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {step === 'otp'
                            ? `OTP sent to ${formData.email}`
                            : 'Join our community and unlock all resources'}
                    </p>
                </div>

                {/* Step indicator */}
                <div className='flex items-center mb-6'>
                    {['Details', 'Verify'].map((label, i) => (
                        <React.Fragment key={label}>
                            <div className='flex items-center gap-2'>
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                        (i === 0 && step === 'form') ||
                                        (i === 1 && step === 'otp')
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                            : i === 0 && step === 'otp'
                                              ? 'bg-green-500 text-white'
                                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                    }`}
                                >
                                    {i === 0 && step === 'otp' ? (
                                        <CheckCircle className='w-4 h-4' />
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span
                                    className={`text-sm font-medium ${
                                        (i === 0 && step === 'form') ||
                                        (i === 1 && step === 'otp')
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    {label}
                                </span>
                            </div>
                            {i === 0 && (
                                <div
                                    className={`flex-1 h-0.5 mx-3 rounded transition-colors duration-300 ${
                                        step === 'otp'
                                            ? 'bg-green-500'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* ── STEP 1: Form ── */}
                {step === 'form' && (
                    <div className='bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300'>
                        <form onSubmit={handleSendOtp} className='space-y-5'>
                            {/* Username */}
                            <div>
                                <label
                                    htmlFor='username'
                                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                                >
                                    Username *
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <User className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input
                                        type='text'
                                        id='username'
                                        placeholder='Enter your username'
                                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            errors.username
                                                ? 'border-red-500 ring-1 ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                        onChange={handleChange}
                                        value={formData.username || ''}
                                    />
                                </div>
                                {errors.username && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor='email'
                                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                                >
                                    Email Address *
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Mail className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input
                                        type='email'
                                        id='email'
                                        placeholder='Enter your email'
                                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            errors.email
                                                ? 'border-red-500 ring-1 ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                        onChange={handleChange}
                                        value={formData.email || ''}
                                    />
                                </div>
                                {errors.email && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* College */}
                            <div>
                                <label
                                    htmlFor='college'
                                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                                >
                                    College Name
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <GraduationCap className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input
                                        type='text'
                                        id='college'
                                        placeholder='Enter your college name (optional)'
                                        className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                                        onChange={handleChange}
                                        value={formData.college || ''}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor='phone'
                                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                                >
                                    Mobile Number
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Phone className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input
                                        type='tel'
                                        id='phone'
                                        placeholder='Enter 10-digit mobile number (optional)'
                                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            errors.phone
                                                ? 'border-red-500 ring-1 ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                        onChange={handleChange}
                                        value={formData.phone || ''}
                                        maxLength={10}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                                >
                                    Password *
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Lock className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input
                                        type={passwordShown ? 'text' : 'password'}
                                        id='password'
                                        placeholder='Create a strong password'
                                        className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            errors.password
                                                ? 'border-red-500 ring-1 ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                        onChange={handleChange}
                                        value={formData.password || ''}
                                    />
                                    <button
                                        type='button'
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                        onClick={() =>
                                            setPasswordShown((p) => !p)
                                        }
                                    >
                                        {passwordShown ? (
                                            <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors' />
                                        ) : (
                                            <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors' />
                                        )}
                                    </button>
                                </div>

                                {formData.password && (
                                    <div className='mt-2'>
                                        <div className='flex items-center justify-between text-sm'>
                                            <span className='text-gray-600 dark:text-gray-400'>
                                                Password strength:
                                            </span>
                                            <span
                                                className={`font-medium ${
                                                    passwordStrength <= 2
                                                        ? 'text-red-600'
                                                        : passwordStrength <= 3
                                                          ? 'text-yellow-600'
                                                          : 'text-green-600'
                                                }`}
                                            >
                                                {getPasswordStrengthText(
                                                    passwordStrength,
                                                )}
                                            </span>
                                        </div>
                                        <div className='mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5'>
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
                                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200'
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        <Mail className='w-4 h-4 mr-2' />
                                        Send Verification OTP
                                    </>
                                )}
                            </button>

                            {/* OAuth */}
                            <div className='mt-6'>
                                <div className='relative'>
                                    <div className='absolute inset-0 flex items-center'>
                                        <div className='w-full border-t border-gray-300 dark:border-gray-600' />
                                    </div>
                                    <div className='relative flex justify-center text-sm'>
                                        <span className='px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                                            Or continue with
                                        </span>
                                    </div>
                                </div>
                                <div className='mt-6'>
                                    <OAuth />
                                </div>
                            </div>
                        </form>

                        {/* Sign In Link */}
                        <div className='mt-6 text-center'>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Already have an account?{' '}
                                <Link
                                    href='/sign-in'
                                    className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200'
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: OTP Verification ── */}
                {step === 'otp' && (
                    <div className='bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300'>
                        <form
                            onSubmit={handleVerifyAndSignup}
                            className='space-y-6'
                        >
                            {/* Illustration */}
                            <div className='text-center'>
                                <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-3'>
                                    <Mail className='w-8 h-8 text-blue-600 dark:text-blue-400' />
                                </div>
                                <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                    We&apos;ve sent a{' '}
                                    <strong className='text-gray-900 dark:text-white'>
                                        6-digit OTP
                                    </strong>{' '}
                                    to{' '}
                                    <strong className='text-blue-600 dark:text-blue-400'>
                                        {formData.email}
                                    </strong>
                                    . Check your inbox (and spam folder).
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center'>
                                    Enter OTP
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
                                className='w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200'
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className='w-4 h-4 mr-2' />
                                        Verify &amp; Create Account
                                    </>
                                )}
                            </button>

                            {/* Resend + Back */}
                            <div className='flex items-center justify-between pt-1'>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setStep('form');
                                        setOtp('');
                                    }}
                                    className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
                                >
                                    <ArrowLeft className='w-4 h-4' />
                                    Back
                                </button>

                                <button
                                    type='button'
                                    disabled={resendTimer > 0 || loading}
                                    onClick={handleResendOtp}
                                    className='flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                                    />
                                    {resendTimer > 0
                                        ? `Resend in ${resendTimer}s`
                                        : 'Resend OTP'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Footer */}
                <div className='mt-6 text-center'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        By creating an account, you agree to our{' '}
                        <Link
                            prefetch={false}
                            href='/terms-and-conditions'
                            className='text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'
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
