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
            icon: <FileText className='w-5 h-5 sm:w-6 sm:h-6' />,
            color: 'text-[#0075de] dark:text-[#62aef0] bg-[#eaf3fd] dark:bg-[#183153] border-[#d2e4f9] dark:border-[#224474]',
            items: [
                {
                    icon: <BookOpen className='w-4 h-4' />,
                    label: 'Upload PYQ',
                    points: '10 Points',
                    description: 'Get 10 points for every approved PYQ',
                },
                {
                    icon: <FileText className='w-4 h-4' />,
                    label: 'Upload Notes',
                    points: '5 Points',
                    description: 'Earn 5 points for every approved note',
                },
            ],
        },
        {
            id: 2,
            title: 'Premium Content',
            icon: <Sparkles className='w-5 h-5 sm:w-6 sm:h-6' />,
            color: 'text-[#d97706] dark:text-[#fbbf24] bg-[#fffbeb] dark:bg-[#382606] border-[#fef08a] dark:border-[#524419]',
            items: [
                {
                    icon: <DollarSign className='w-4 h-4' />,
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
            icon: <Wallet className='w-5 h-5 sm:w-6 sm:h-6' />,
            color: 'text-[#1aae39] dark:text-[#4ade80] bg-[#eaf7ec] dark:bg-[#163821] border-[#d2f0d9] dark:border-[#205130]',
            items: [
                {
                    icon: <TrendingUp className='w-4 h-4' />,
                    label: 'Convert Points',
                    points: '5 Points = ₹1',
                    description: 'Redeem your points for real money anytime',
                },
                {
                    icon: <Gift className='w-4 h-4' />,
                    label: 'Withdraw',
                    points: 'To Bank',
                    description:
                        'Transfer earnings directly to your bank account',
                },
            ],
        },
    ];

    return (
        <div className='fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn'>
            <div className='relative w-full max-w-lg bg-white dark:bg-[#191919] rounded-xl shadow-xl max-h-[90vh] overflow-hidden border border-[#e6e6e6] dark:border-[#2f2f2f] animate-scaleIn flex flex-col'>
                {/* Header */}
                <div className='relative bg-[#fcfbf9] dark:bg-[#202020] border-b border-[#e6e6e6] dark:border-[#2f2f2f] p-5 sm:p-6 overflow-hidden flex-shrink-0'>
                    <div className='absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.12] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:20px_20px]'></div>
                    <button
                        onClick={handleClose}
                        className='absolute top-3 right-3 p-1.5 rounded-md text-[#8c8883] dark:text-[#787672] hover:text-[#101828] dark:hover:text-white hover:bg-[#e6e6e6] dark:hover:bg-[#2f2f2f] transition-colors z-10'
                    >
                        <X className='w-5 h-5' />
                    </button>
                    <div className='relative flex items-center gap-3 z-10'>
                        <div className='p-2.5 bg-white dark:bg-[#282828] rounded-xl border border-[#e6e6e6] dark:border-[#383838] shadow-xs text-[#0075de] dark:text-[#62aef0]'>
                            <TrendingUp className='w-6 h-6' />
                        </div>
                        <div>
                            <h2 className='text-lg sm:text-xl font-bold text-[#101828] dark:text-[#ededed] leading-tight'>
                                Start Earning Today! 💰
                            </h2>
                            <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] mt-0.5'>
                                Share knowledge, earn points, get real money
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className='p-5 sm:p-6 overflow-y-auto flex-1'>
                    {/* Steps Navigation */}
                    <div className='flex justify-center mb-6 gap-2'>
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(index)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs sm:text-sm border ${
                                    activeStep === index
                                        ? `border-[#0075de] bg-[#eaf3fd] text-[#0075de] dark:bg-[#183153] dark:text-[#62aef0] dark:border-[#224474]`
                                        : 'border-[#e6e6e6] bg-[#fcfbf9] text-[#615d59] hover:bg-[#f6f5f4] dark:border-[#383838] dark:bg-[#202020] dark:text-[#a09e9a] dark:hover:bg-[#282828]'
                                }`}
                            >
                                <span>Step {step.id}</span>
                                {activeStep === index && (
                                    <CheckCircle className='w-3.5 h-3.5' />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Active Step Content */}
                    <div className='space-y-4 animate-fadeIn'>
                        {/* Step Items */}
                        <div className='grid gap-3'>
                            {steps[activeStep].items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className='relative bg-white dark:bg-[#202020] p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#0075de] dark:hover:border-[#0075de] transition-colors group shadow-xs'
                                >
                                    <div className='flex items-start gap-3'>
                                        <div
                                            className={`p-2 rounded-lg border ${steps[activeStep].color} flex-shrink-0`}
                                        >
                                            {item.icon}
                                        </div>
                                        <div className='flex-1 min-w-0 pt-0.5'>
                                            <div className='flex items-center justify-between gap-2 mb-1'>
                                                <h4 className='text-sm font-semibold text-[#101828] dark:text-[#ededed] truncate'>
                                                    {item.label}
                                                </h4>
                                                <span
                                                    className={`px-2 py-0.5 rounded-md border text-[11px] font-bold whitespace-nowrap flex-shrink-0 ${steps[activeStep].color}`}
                                                >
                                                    {item.points}
                                                </span>
                                            </div>
                                            <p className='text-xs text-[#615d59] dark:text-[#a09e9a]'>
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Example Calculation */}
                        {activeStep === 2 && (
                            <div className='mt-5 p-4 bg-[#fcfbf9] dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <h4 className='text-sm font-bold text-[#101828] dark:text-[#ededed] mb-3 flex items-center gap-1.5'>
                                    <Sparkles className='w-4 h-4 text-[#d97706] dark:text-[#fbbf24]' />
                                    Quick Example
                                </h4>
                                <div className='space-y-2 text-xs'>
                                    <div className='flex justify-between items-center gap-2 text-[#615d59] dark:text-[#a09e9a]'>
                                        <span>10 PYQs uploaded</span>
                                        <span className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                            100 Points
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center gap-2 text-[#615d59] dark:text-[#a09e9a]'>
                                        <span>10 Notes uploaded</span>
                                        <span className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                            50 Points
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center gap-2 text-[#615d59] dark:text-[#a09e9a]'>
                                        <span>10 Paid PYQ sold (50 points)</span>
                                        <span className='font-semibold text-[#101828] dark:text-[#ededed]'>
                                            350 Points
                                        </span>
                                    </div>
                                    <div className='border-t border-[#e6e6e6] dark:border-[#383838] pt-2 mt-2'>
                                        <div className='flex justify-between items-center text-sm gap-2'>
                                            <span className='font-bold text-[#101828] dark:text-[#ededed]'>
                                                Total Points
                                            </span>
                                            <span className='font-bold text-[#1aae39] dark:text-[#4ade80]'>
                                                500 Points
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center mt-1 gap-2'>
                                            <span className='font-bold text-[#101828] dark:text-[#ededed]'>
                                                You Can Redeem
                                            </span>
                                            <span className='font-bold text-[#1aae39] dark:text-[#4ade80] text-lg'>
                                                ₹100
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className='flex justify-between items-center p-4 border-t border-[#f0eee9] dark:border-[#2a2a2a] bg-[#fcfbf9] dark:bg-[#1c1c1c] flex-shrink-0'>
                    <button
                        onClick={() =>
                            setActiveStep((prev) => Math.max(0, prev - 1))
                        }
                        disabled={activeStep === 0}
                        className='px-4 py-2 rounded-lg font-medium text-xs sm:text-sm text-[#101828] dark:text-[#ededed] bg-white dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] hover:bg-[#f6f5f4] dark:hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs'
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
                            className='flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-[#0075de] text-white hover:bg-[#0062bd] shadow-xs transition-all active:scale-[0.98]'
                        >
                            <span>Next Step</span>
                            <ArrowRight className='w-3.5 h-3.5' />
                        </button>
                    ) : (
                        <button
                            onClick={handleClose}
                            className='flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-[#1aae39] dark:bg-[#163821] text-white dark:text-[#4ade80] border border-transparent dark:border-[#205130] hover:bg-[#179632] dark:hover:bg-[#1c472a] shadow-xs transition-all active:scale-[0.98]'
                        >
                            <CheckCircle className='w-3.5 h-3.5' />
                            <span>Start Earning!</span>
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </div>
    );
};


export default EarningFlowModal;
