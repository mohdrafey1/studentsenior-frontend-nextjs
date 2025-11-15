'use client';
import React, { useState, useEffect } from 'react';
import {
    X,
    FileText,
    BookOpen,
    DollarSign,
    TrendingUp,
    Wallet,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Gift,
} from 'lucide-react';

const EARNING_MODAL_KEY = 'earningFlowModalSeen';

interface EarningFlowModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    triggerButton?: boolean;
}

const EarningFlowModal: React.FC<EarningFlowModalProps> = ({
    isOpen: externalIsOpen,
    onClose: externalOnClose,
    triggerButton = false,
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    // Use external control if provided, otherwise use internal state
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

    useEffect(() => {
        // Only auto-show if not controlled externally and not a trigger button
        if (externalIsOpen === undefined && !triggerButton) {
            // Check if user has seen the modal before
            const hasSeenModal = sessionStorage.getItem(EARNING_MODAL_KEY);

            if (!hasSeenModal) {
                // Show modal after a short delay for better UX
                const timer = setTimeout(() => {
                    setInternalIsOpen(true);
                }, 1500);

                return () => clearTimeout(timer);
            }
        }
    }, [externalIsOpen, triggerButton]);

    const handleClose = () => {
        if (externalOnClose) {
            externalOnClose();
        } else {
            setInternalIsOpen(false);
        }
        // Mark modal as seen in sessionStorage
        sessionStorage.setItem(EARNING_MODAL_KEY, 'true');
        // Reset to first step when closing
        setActiveStep(0);
    };

    if (!isOpen) return null;

    const steps = [
        {
            id: 1,
            title: 'Upload & Earn',
            icon: <FileText className='w-8 h-8 sm:w-12 sm:h-12' />,
            color: 'from-blue-500 to-cyan-500',
            items: [
                {
                    icon: <BookOpen className='w-5 h-5 sm:w-6 sm:h-6' />,
                    label: 'Upload PYQ',
                    points: '10 Points',
                    description: 'Get 10 points for every approved PYQ',
                },
                {
                    icon: <FileText className='w-5 h-5 sm:w-6 sm:h-6' />,
                    label: 'Upload Notes',
                    points: '5 Points',
                    description: 'Earn 5 points for every approved note',
                },
            ],
        },
        {
            id: 2,
            title: 'Premium Content',
            icon: <Sparkles className='w-8 h-8 sm:w-12 sm:h-12' />,
            color: 'from-purple-500 to-pink-500',
            items: [
                {
                    icon: <DollarSign className='w-5 h-5 sm:w-6 sm:h-6' />,
                    label: 'Paid PYQs & Notes',
                    points: '70% Revenue',
                    description:
                        'Set your own price and earn 70% when someone buys',
                },
            ],
        },
        {
            id: 3,
            title: 'Redeem Money',
            icon: <Wallet className='w-8 h-8 sm:w-12 sm:h-12' />,
            color: 'from-green-500 to-emerald-500',
            items: [
                {
                    icon: <TrendingUp className='w-5 h-5 sm:w-6 sm:h-6' />,
                    label: 'Convert Points',
                    points: '5 Points = ₹1',
                    description: 'Redeem your points for real money anytime',
                },
                {
                    icon: <Gift className='w-5 h-5 sm:w-6 sm:h-6' />,
                    label: 'Withdraw',
                    points: 'To Bank',
                    description:
                        'Transfer earnings directly to your bank account',
                },
            ],
        },
    ];

    return (
        <div className='fixed inset-0 z-99999 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn'>
            <div className='relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scaleIn'>
                {/* Header */}
                <div className='relative bg-gradient-to-r from-sky-600 via-blue-600 to-purple-600 p-4 sm:p-6 md:p-8 text-white overflow-hidden'>
                    <div className='absolute inset-0 opacity-10'>
                        <div className='absolute inset-0 bg-white/5'></div>
                    </div>
                    <button
                        onClick={handleClose}
                        className='absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors'
                    >
                        <X className='w-5 h-5 sm:w-6 sm:h-6' />
                    </button>
                    <div className='relative flex items-center gap-3 sm:gap-4'>
                        <div className='p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm'>
                            <TrendingUp className='w-6 h-6 sm:w-8 sm:h-8' />
                        </div>
                        <div>
                            <h2 className='text-xl sm:text-2xl font-bold mb-1 sm:mb-2'>
                                Start Earning Today! 💰
                            </h2>
                            <p className='text-blue-100 text-sm sm:text-base md:text-lg'>
                                Share knowledge, earn points, get real money
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className='p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-200px)]'>
                    {/* Steps Navigation */}
                    <div className='flex justify-center mb-4 sm:mb-6 md:mb-8 gap-1.5 sm:gap-2'>
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(index)}
                                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                                    activeStep === index
                                        ? 'bg-gradient-to-r ' +
                                          step.color +
                                          ' text-white shadow-lg scale-105'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className='hidden xs:inline sm:inline'>
                                    Step {step.id}
                                </span>
                                <span className='xs:hidden sm:hidden'>
                                    {step.id}
                                </span>
                                {activeStep === index && (
                                    <CheckCircle className='w-3 h-3 sm:w-4 sm:h-4' />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Active Step Content */}
                    <div className='space-y-3 sm:space-y-4 md:space-y-6 animate-fadeIn'>
                        {/* Step Items */}
                        <div className='grid gap-3 sm:gap-4'>
                            {steps[activeStep].items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className='group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-sky-500 dark:hover:border-sky-500 transition-all hover:shadow-lg hover:scale-[1.02]'
                                >
                                    <div className='flex items-start gap-3 sm:gap-4'>
                                        <div
                                            className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${steps[activeStep].color} text-white shadow-md flex-shrink-0`}
                                        >
                                            {item.icon}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center justify-between gap-2 mb-1.5 sm:mb-2'>
                                                <h4 className='text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate'>
                                                    {item.label}
                                                </h4>
                                                <span
                                                    className={`px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full bg-gradient-to-r ${steps[activeStep].color} text-white font-bold text-xs sm:text-sm shadow-md whitespace-nowrap flex-shrink-0`}
                                                >
                                                    {item.points}
                                                </span>
                                            </div>
                                            <p className='text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400'>
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Decorative corner */}
                                    <div
                                        className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${steps[activeStep].color} opacity-5 rounded-bl-full`}
                                    ></div>
                                </div>
                            ))}
                        </div>

                        {/* Example Calculation */}
                        {activeStep === 2 && (
                            <div className='mt-4 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg sm:rounded-xl border-2 border-green-200 dark:border-green-700'>
                                <h4 className='text-sm sm:text-base md:text-lg font-bold text-green-900 dark:text-green-100 mb-3 sm:mb-4 flex items-center gap-2'>
                                    <Sparkles className='w-4 h-4 sm:w-5 sm:h-5' />
                                    Quick Example
                                </h4>
                                <div className='space-y-2 sm:space-y-3 text-xs sm:text-sm'>
                                    <div className='flex justify-between items-center gap-2'>
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            10 PYQs uploaded
                                        </span>
                                        <span className='font-semibold text-green-700 dark:text-green-300 whitespace-nowrap'>
                                            100 Points
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center gap-2'>
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            10 Notes uploaded
                                        </span>
                                        <span className='font-semibold text-green-700 dark:text-green-300 whitespace-nowrap'>
                                            50 Points
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center gap-2'>
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            10 Paid PYQ sold (50 points)
                                        </span>
                                        <span className='font-semibold text-green-700 dark:text-green-300 whitespace-nowrap'>
                                            350 Points
                                        </span>
                                    </div>
                                    <div className='border-t-2 border-green-300 dark:border-green-600 pt-2 sm:pt-3 mt-2 sm:mt-3'>
                                        <div className='flex justify-between items-center text-sm sm:text-base gap-2'>
                                            <span className='font-bold text-gray-900 dark:text-gray-100'>
                                                Total Points
                                            </span>
                                            <span className='font-bold text-green-700 dark:text-green-300'>
                                                500 Points
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center text-base sm:text-lg md:text-xl mt-1.5 sm:mt-2 gap-2'>
                                            <span className='font-bold text-gray-900 dark:text-gray-100'>
                                                You Can Redeem
                                            </span>
                                            <span className='font-bold text-green-600 dark:text-green-400 text-xl sm:text-2xl'>
                                                ₹100
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className='flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 gap-2 sm:gap-3'>
                        <button
                            onClick={() =>
                                setActiveStep((prev) => Math.max(0, prev - 1))
                            }
                            disabled={activeStep === 0}
                            className='px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            Previous
                        </button>

                        {activeStep < steps.length - 1 ? (
                            <button
                                onClick={() =>
                                    setActiveStep((prev) =>
                                        Math.min(steps.length - 1, prev + 1),
                                    )
                                }
                                className='flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium text-sm sm:text-base bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all'
                            >
                                <span className='hidden xs:inline'>
                                    Next Step
                                </span>
                                <span className='xs:hidden'>Next</span>
                                <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5' />
                            </button>
                        ) : (
                            <button
                                onClick={handleClose}
                                className='flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium text-sm sm:text-base bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all'
                            >
                                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5' />
                                <span className='hidden xs:inline'>
                                    Start Earning Now!
                                </span>
                                <span className='xs:hidden'>Start Now!</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default EarningFlowModal;
