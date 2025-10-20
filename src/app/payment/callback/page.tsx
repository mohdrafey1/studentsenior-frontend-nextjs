'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { api } from '@/config/apiUrls';

export default function PaymentCallback() {
    const searchParams = useSearchParams();

    const [status, setStatus] = useState<
        'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
    >('pending');
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const [timer, setTimer] = useState(5);
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (!orderId) {
            setStatus('cancelled');
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                const response = await fetch(api.payment.getOrder(orderId), {
                    credentials: 'include',
                });

                if (!response.ok) {
                    setStatus('cancelled');
                    return;
                }

                const data = await response.json();
                const order = data?.data;

                if (order?.metadata?.returnUrl) {
                    setRedirectUrl(order.metadata.returnUrl);
                }

                if (order?.status === 'completed') {
                    setStatus('completed');
                } else if (
                    order?.status === 'failed' ||
                    order?.status === 'cancelled'
                ) {
                    setStatus('failed');
                } else {
                    setStatus('processing');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                setStatus('cancelled');
            }
        };

        checkPaymentStatus();
    }, [orderId]);

    // Countdown timer → redirect automatically
    useEffect(() => {
        if (
            (status === 'completed' ||
                status === 'failed' ||
                status === 'cancelled') &&
            redirectUrl
        ) {
            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        window.location.href = redirectUrl;
                        clearInterval(countdown);
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [status, redirectUrl]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8 max-w-md w-full text-center'>
                {status === 'processing' && (
                    <>
                        <div className='w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <Loader2 className='w-10 h-10 text-sky-600 dark:text-sky-400 animate-spin' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                            Verifying Payment
                        </h2>
                        <p className='text-gray-600 dark:text-gray-400'>
                            Please wait while we confirm your payment...
                        </p>
                    </>
                )}

                {status === 'completed' && (
                    <>
                        <div className='w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <CheckCircle className='w-10 h-10 text-green-600 dark:text-green-400' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                            Payment Successful!
                        </h2>
                        <p className='text-gray-600 dark:text-gray-400 mb-4'>
                            Your purchase was completed successfully.
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                            Redirecting in{' '}
                            <span className='font-semibold'>{timer}</span>{' '}
                            seconds...
                        </p>
                        <button
                            onClick={() =>
                                redirectUrl &&
                                (window.location.href = redirectUrl)
                            }
                            className='inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg shadow-green-500/30'
                        >
                            Go to Product <ArrowRight className='w-4 h-4' />
                        </button>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className='w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <XCircle className='w-10 h-10 text-red-600 dark:text-red-400' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                            Payment Failed
                        </h2>
                        <p className='text-gray-600 dark:text-gray-400 mb-4'>
                            Your payment could not be processed.
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                            Redirecting in{' '}
                            <span className='font-semibold'>{timer}</span>{' '}
                            seconds...
                        </p>
                        <button
                            onClick={() =>
                                redirectUrl &&
                                (window.location.href = redirectUrl)
                            }
                            className='inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition-colors duration-200'
                        >
                            Go to Product <ArrowRight className='w-4 h-4' />
                        </button>
                    </>
                )}

                {status === 'cancelled' && (
                    <>
                        <div className='w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <XCircle className='w-10 h-10 text-gray-600 dark:text-gray-400' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                            Something Went Wrong
                        </h2>
                        <p className='text-gray-600 dark:text-gray-400 mb-4'>
                            We couldn&apos;t verify your payment status.
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                            Redirecting in{' '}
                            <span className='font-semibold'>{timer}</span>{' '}
                            seconds...
                        </p>
                        <button
                            onClick={() =>
                                redirectUrl &&
                                (window.location.href = redirectUrl)
                            }
                            className='inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors duration-200'
                        >
                            Go to Product <ArrowRight className='w-4 h-4' />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
