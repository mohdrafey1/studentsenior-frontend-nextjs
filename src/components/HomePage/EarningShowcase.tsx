'use client';
import React, { useState } from 'react';
import {
    FileText,
    BookOpen,
    DollarSign,
    TrendingUp,
    Wallet,
    Sparkles,
    Gift,
    ArrowRight,
} from 'lucide-react';
import EarningFlowModal from '@/components/Common/EarningFlowModal';

const EarningShowcase = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <section className='py-10 sm:py-18 bg-white dark:bg-[#191919]'>
                <div className='container mx-auto px-4 sm:px-6 max-w-6xl'>
                    <div className='text-center mb-12'>
                        {/* <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf7ec] dark:bg-[#112d1b] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#1e482b] mb-3'>
                            <span>Monetization & Rewards</span>
                        </div> */}
                        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#000000] dark:text-white tracking-[-0.025em] mb-2.5'>
                            Start Earning with Student Senior 💰
                        </h2>
                        <p className='text-sm sm:text-base text-[#615d59] dark:text-[#a39e98] max-w-xl mx-auto'>
                            Share your knowledge, help fellow students, and earn real money
                        </p>
                    </div>

                    <div className='grid md:grid-cols-3 gap-5 max-w-5xl mx-auto'>
                        {/* Upload & Earn Card */}
                        <div className='bg-[#ffffff] dark:bg-[#202020] p-6 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none transition-all duration-200 hover:border-[#0075de] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 flex flex-col justify-between'>
                            <div>
                                <div className='w-11 h-11 bg-[#eaf3fd] dark:bg-[#10243e] text-[#0075de] dark:text-[#62aef0] rounded-xl flex items-center justify-center mb-4 flex-shrink-0'>
                                    <FileText className='w-5 h-5' strokeWidth={2.2} />
                                </div>
                                <h3 className='text-lg font-bold mb-2 text-[#000000] dark:text-white tracking-[-0.2px]'>
                                    Upload & Earn
                                </h3>
                                <p className='text-xs text-[#615d59] dark:text-[#a39e98] mb-4'>
                                    Every approved upload earns you points automatically
                                </p>
                            </div>

                            <div className='space-y-2 pt-3 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center justify-between text-xs sm:text-sm'>
                                    <span className='flex items-center gap-2 text-[#615d59] dark:text-[#a39e98]'>
                                        <BookOpen className='w-4 h-4 text-[#0075de]' />
                                        Past Year Questions
                                    </span>
                                    <strong className='text-[#0075de] dark:text-[#62aef0] font-semibold bg-[#eaf3fd] dark:bg-[#10243e] px-2 py-0.5 rounded-md'>
                                        10 Points
                                    </strong>
                                </div>
                                <div className='flex items-center justify-between text-xs sm:text-sm'>
                                    <span className='flex items-center gap-2 text-[#615d59] dark:text-[#a39e98]'>
                                        <FileText className='w-4 h-4 text-[#2a9d99]' />
                                        Study Notes
                                    </span>
                                    <strong className='text-[#2a9d99] dark:text-[#5ce1dc] font-semibold bg-[#eaf6f6] dark:bg-[#122c2c] px-2 py-0.5 rounded-md'>
                                        5 Points
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Premium Content Card */}
                        <div className='bg-[#ffffff] dark:bg-[#202020] p-6 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none transition-all duration-200 hover:border-[#8a3fd6] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 flex flex-col justify-between'>
                            <div>
                                <div className='w-11 h-11 bg-[#f5edfd] dark:bg-[#2b1744] text-[#8a3fd6] dark:text-[#d6b6f6] rounded-xl flex items-center justify-center mb-4 flex-shrink-0'>
                                    <Sparkles className='w-5 h-5' strokeWidth={2.2} />
                                </div>
                                <h3 className='text-lg font-bold mb-2 text-[#000000] dark:text-white tracking-[-0.2px]'>
                                    Premium Content
                                </h3>
                                <p className='text-xs text-[#615d59] dark:text-[#a39e98] mb-4'>
                                    Sell premium PYQs and notes for direct earnings
                                </p>
                            </div>

                            <div className='space-y-2 pt-3 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center justify-between text-xs sm:text-sm'>
                                    <span className='flex items-center gap-2 text-[#615d59] dark:text-[#a39e98]'>
                                        <DollarSign className='w-4 h-4 text-[#8a3fd6]' />
                                        Pricing Control
                                    </span>
                                    <strong className='text-[#8a3fd6] dark:text-[#d6b6f6] font-semibold bg-[#f5edfd] dark:bg-[#2b1744] px-2 py-0.5 rounded-md'>
                                        Your Own Price
                                    </strong>
                                </div>
                                <div className='flex items-center justify-between text-xs sm:text-sm'>
                                    <span className='flex items-center gap-2 text-[#615d59] dark:text-[#a39e98]'>
                                        <TrendingUp className='w-4 h-4 text-[#ff64c8]' />
                                        Earnings Share
                                    </span>
                                    <strong className='text-[#ff64c8] font-semibold bg-[#fdeaf5] dark:bg-[#3d132e] px-2 py-0.5 rounded-md'>
                                        70% Revenue
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Redeem Money Card */}
                        <div className='bg-[#ffffff] dark:bg-[#202020] p-6 rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none transition-all duration-200 hover:border-[#1aae39] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 flex flex-col justify-between'>
                            <div>
                                <div className='w-11 h-11 bg-[#eaf7ec] dark:bg-[#112d1b] text-[#1aae39] dark:text-[#4ade80] rounded-xl flex items-center justify-center mb-4 flex-shrink-0'>
                                    <Wallet className='w-5 h-5' strokeWidth={2.2} />
                                </div>
                                <h3 className='text-lg font-bold mb-2 text-[#000000] dark:text-white tracking-[-0.2px]'>
                                    Redeem Money
                                </h3>
                                <p className='text-xs text-[#615d59] dark:text-[#a39e98] mb-4'>
                                    Convert points to cash and withdraw anytime
                                </p>
                            </div>

                            <div className='space-y-2 pt-3 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-center justify-between text-xs sm:text-sm'>
                                    <span className='flex items-center gap-2 text-[#615d59] dark:text-[#a39e98]'>
                                        <TrendingUp className='w-4 h-4 text-[#1aae39]' />
                                        Conversion
                                    </span>
                                    <strong className='text-[#1aae39] dark:text-[#4ade80] font-semibold bg-[#eaf7ec] dark:bg-[#112d1b] px-2 py-0.5 rounded-md'>
                                        5 Points = ₹1
                                    </strong>
                                </div>
                                <div className='flex items-center justify-between text-xs sm:text-sm'>
                                    <span className='flex items-center gap-2 text-[#615d59] dark:text-[#a39e98]'>
                                        <Gift className='w-4 h-4 text-[#2a9d99]' />
                                        Payout Method
                                    </span>
                                    <strong className='text-[#2a9d99] dark:text-[#5ce1dc] font-semibold bg-[#eaf6f6] dark:bg-[#122c2c] px-2 py-0.5 rounded-md'>
                                        Bank Transfer
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className='text-center mt-10'>
                        <button
                            onClick={() => setShowModal(true)}
                            className='inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] text-white font-medium text-sm transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.25)]'
                        >
                            <span>Learn How to Earn</span>
                            <ArrowRight className='w-4 h-4' />
                        </button>
                        <p className='text-xs text-[#615d59] dark:text-[#a39e98] mt-3'>
                            Join 1000+ students already earning on Student Senior
                        </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className='mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto'>
                        <div className='text-center p-4 bg-[#f6f5f4] dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div className='text-2xl sm:text-3xl font-bold text-[#0075de] dark:text-[#62aef0] mb-0.5 tracking-tight'>
                                10+
                            </div>
                            <div className='text-xs font-medium text-[#615d59] dark:text-[#a39e98]'>
                                Points per PYQ
                            </div>
                        </div>
                        <div className='text-center p-4 bg-[#f6f5f4] dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div className='text-2xl sm:text-3xl font-bold text-[#8a3fd6] dark:text-[#d6b6f6] mb-0.5 tracking-tight'>
                                70%
                            </div>
                            <div className='text-xs font-medium text-[#615d59] dark:text-[#a39e98]'>
                                Revenue Share
                            </div>
                        </div>
                        <div className='text-center p-4 bg-[#f6f5f4] dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div className='text-2xl sm:text-3xl font-bold text-[#1aae39] dark:text-[#4ade80] mb-0.5 tracking-tight'>
                                ₹100
                            </div>
                            <div className='text-xs font-medium text-[#615d59] dark:text-[#a39e98]'>
                                Per 500 Points
                            </div>
                        </div>
                        <div className='text-center p-4 bg-[#f6f5f4] dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div className='text-2xl sm:text-3xl font-bold text-[#2a9d99] dark:text-[#5ce1dc] mb-0.5 tracking-tight'>
                                24h
                            </div>
                            <div className='text-xs font-medium text-[#615d59] dark:text-[#a39e98]'>
                                Quick Payouts
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Earning Flow Modal */}
            <EarningFlowModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                triggerButton={true}
            />
        </>
    );
};

export default EarningShowcase;

