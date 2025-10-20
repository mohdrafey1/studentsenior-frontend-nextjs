'use client';

import { useState, useEffect } from 'react';
import { X, Wallet, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/config/apiUrls';
import Link from 'next/link';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceType: 'pyq' | 'notes';
    resourceId: string;
    price: number;
    title: string;
    metadata?: {
        college?: string;
        course?: string;
        branch?: string;
        subject?: string;
        examType?: string;
        year?: string;
    };
    onSuccess?: () => void;
}

export default function PaymentModal({
    isOpen,
    onClose,
    resourceType,
    resourceId,
    price,
    title,
    metadata,
    onSuccess,
}: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'points' | 'online'>(
        'points',
    );
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch wallet balance
    useEffect(() => {
        if (isOpen) {
            fetchBalance();
        }
    }, [isOpen]);

    const fetchBalance = async () => {
        setIsLoadingBalance(true);
        try {
            const response = await fetch(api.payment.getBalance, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch balance');
            }

            const data = await response.json();
            setWalletBalance(data.data.wallet.currentBalance || 0);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setWalletBalance(0);
        } finally {
            setIsLoadingBalance(false);
        }
    };

    const handlePurchase = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Calculate amount based on payment method
            // For points: use the price as is (in points)
            // For online: convert to rupees (1 rupee = 5 points)
            const amount =
                paymentMethod === 'points' ? price : Math.ceil(price / 5);

            // Step 1: Create order
            const orderResponse = await fetch(api.payment.createOrder, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    orderType:
                        resourceType === 'pyq'
                            ? 'pyq_purchase'
                            : 'note_purchase',
                    paymentMethod,
                    amount,
                    resourceId,
                    returnUrl: window.location.href, // Store current page URL for redirect after payment
                    metadata: {
                        ...(resourceType === 'pyq'
                            ? { pyqTitle: title }
                            : { notesTitle: title }),
                        ...metadata,
                    },
                }),
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.message || 'Failed to create order');
            }

            const orderData = await orderResponse.json();
            const orderId = orderData.data.orderId;

            // Step 2: Process payment based on method
            if (paymentMethod === 'points') {
                // Pay with points (instant)
                const paymentResponse = await fetch(
                    api.payment.payWithPoints(orderId),
                    {
                        method: 'POST',
                        credentials: 'include',
                    },
                );

                if (!paymentResponse.ok) {
                    const errorData = await paymentResponse.json();
                    throw new Error(errorData.message || 'Payment failed');
                }

                // Success! Reload page to show purchased content
                if (onSuccess) {
                    onSuccess();
                } else {
                    window.location.reload();
                }
            } else {
                // Pay online - redirect to payment gateway
                const paymentResponse = await fetch(api.payment.payOnline, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        orderId,
                        gateway: 'phonepe',
                        returnUrl: `${window.location.origin}/payment/callback?orderId=${orderId}`,
                    }),
                });

                if (!paymentResponse.ok) {
                    const errorData = await paymentResponse.json();
                    throw new Error(
                        errorData.message || 'Failed to initiate payment',
                    );
                }

                const paymentData = await paymentResponse.json();

                // Redirect to PhonePe
                window.location.href = paymentData.data.paymentUrl;
            }
        } catch (error) {
            console.error('Purchase error:', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.',
            );
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const insufficientBalance =
        paymentMethod === 'points' && walletBalance < price;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200/60 dark:border-gray-700/60 overflow-hidden'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                        Complete Purchase
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                    >
                        <X className='w-5 h-5 text-gray-500' />
                    </button>
                </div>

                {/* Content */}
                <div className='p-6 space-y-6'>
                    {/* Item Info */}
                    <div className='bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 border border-sky-200 dark:border-sky-700'>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                            {resourceType === 'pyq' ? 'PYQ' : 'Notes'}
                        </p>
                        <h3 className='font-semibold text-gray-900 dark:text-white line-clamp-2'>
                            {title}
                        </h3>
                        <div className='mt-3 flex items-baseline gap-2'>
                            <span className='text-3xl font-bold text-sky-600 dark:text-sky-400'>
                                {price}
                            </span>
                            <span className='text-gray-600 dark:text-gray-400'>
                                points
                            </span>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className='space-y-3'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Choose Payment Method
                        </label>

                        {/* Pay with Points */}
                        <button
                            onClick={() => setPaymentMethod('points')}
                            disabled={isLoading}
                            className={`w-full p-4 rounded-xl border-2 transition-all ${
                                paymentMethod === 'points'
                                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-sky-300'
                            }`}
                        >
                            <div className='flex items-center gap-3'>
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        paymentMethod === 'points'
                                            ? 'border-sky-500'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    {paymentMethod === 'points' && (
                                        <div className='w-3 h-3 rounded-full bg-sky-500' />
                                    )}
                                </div>
                                <Wallet className='w-5 h-5 text-sky-600 dark:text-sky-400' />
                                <div className='flex-1 text-left'>
                                    <p className='font-medium text-gray-900 dark:text-white'>
                                        Pay with Points
                                    </p>
                                    {isLoadingBalance ? (
                                        <p className='text-sm text-gray-500'>
                                            Loading balance...
                                        </p>
                                    ) : (
                                        <p
                                            className={`text-sm ${
                                                walletBalance >= price
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}
                                        >
                                            Balance: {walletBalance} points
                                        </p>
                                    )}
                                </div>
                                <Link
                                    href='/wallet'
                                    className='bg-gray-200/50 hover:bg-gray-300/70 dark:bg-gray-700/50 dark:hover:bg-gray-600/70 text-sm px-3 py-1 rounded-lg font-medium transition-colors'
                                >
                                    Add Points
                                </Link>
                            </div>
                        </button>

                        {/* Pay Online */}
                        <button
                            onClick={() => setPaymentMethod('online')}
                            disabled={isLoading}
                            className={`w-full p-4 rounded-xl border-2 transition-all ${
                                paymentMethod === 'online'
                                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-sky-300'
                            }`}
                        >
                            <div className='flex items-center gap-3'>
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        paymentMethod === 'online'
                                            ? 'border-sky-500'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    {paymentMethod === 'online' && (
                                        <div className='w-3 h-3 rounded-full bg-sky-500' />
                                    )}
                                </div>
                                <CreditCard className='w-5 h-5 text-sky-600 dark:text-sky-400' />
                                <div className='flex-1 text-left'>
                                    <p className='font-medium text-gray-900 dark:text-white'>
                                        Pay Online (PhonePe)
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        Pay ₹{Math.ceil(price / 5)} via PhonePe
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className='flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700'>
                            <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' />
                            <p className='text-sm text-red-600 dark:text-red-400'>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Insufficient Balance Warning */}
                    {insufficientBalance && !error && (
                        <div className='flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700'>
                            <AlertCircle className='w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5' />
                            <div className='text-sm text-amber-600 dark:text-amber-400'>
                                <p className='font-medium mb-1'>
                                    Insufficient Balance
                                </p>
                                <p>
                                    You need {price - walletBalance} more
                                    points. Please choose online payment or add
                                    points to your wallet.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700'>
                    <button
                        onClick={handlePurchase}
                        disabled={isLoading || insufficientBalance}
                        className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                            isLoading || insufficientBalance
                                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-500/30'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className='w-5 h-5 animate-spin' />
                                Processing...
                            </>
                        ) : (
                            <>
                                {paymentMethod === 'points' ? (
                                    <>Pay {price} Points</>
                                ) : (
                                    <>Pay ₹{Math.ceil(price / 5)}</>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
