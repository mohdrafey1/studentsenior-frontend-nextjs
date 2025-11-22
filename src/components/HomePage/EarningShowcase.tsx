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
            <section className='py-16 bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
                <div className='container mx-auto px-4'>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                            Start Earning with Student Senior 💰
                        </h2>
                        <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                            Share your knowledge, help fellow students, and earn
                            real money
                        </p>
                    </div>

                    <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
                        {/* Upload & Earn Card */}
                        <div className='group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-blue-500'>
                            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 rounded-bl-full'></div>
                            <div className='relative'>
                                <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg'>
                                    <FileText className='w-7 h-7 text-white' />
                                </div>
                                <h3 className='text-xl font-bold mb-3 text-gray-900 dark:text-white'>
                                    Upload & Earn
                                </h3>
                                <div className='space-y-2 mb-4'>
                                    <div className='flex items-center gap-2'>
                                        <BookOpen className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            <strong className='text-blue-600 dark:text-blue-400'>
                                                10 Points
                                            </strong>{' '}
                                            per PYQ
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <FileText className='w-5 h-5 text-cyan-600 dark:text-cyan-400' />
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            <strong className='text-cyan-600 dark:text-cyan-400'>
                                                5 Points
                                            </strong>{' '}
                                            per Note
                                        </span>
                                    </div>
                                </div>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>
                                    Every approved upload earns you points
                                    automatically
                                </p>
                            </div>
                        </div>

                        {/* Premium Content Card */}
                        <div className='group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-purple-500'>
                            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 rounded-bl-full'></div>
                            <div className='relative'>
                                <div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg'>
                                    <Sparkles className='w-7 h-7 text-white' />
                                </div>
                                <h3 className='text-xl font-bold mb-3 text-gray-900 dark:text-white'>
                                    Premium Content
                                </h3>
                                <div className='space-y-2 mb-4'>
                                    <div className='flex items-center gap-2'>
                                        <DollarSign className='w-5 h-5 text-purple-600 dark:text-purple-400' />
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            Set{' '}
                                            <strong className='text-purple-600 dark:text-purple-400'>
                                                Your Own Price
                                            </strong>
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <TrendingUp className='w-5 h-5 text-pink-600 dark:text-pink-400' />
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            Earn{' '}
                                            <strong className='text-pink-600 dark:text-pink-400'>
                                                70% Revenue
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>
                                    Sell premium PYQs and notes for direct
                                    earnings
                                </p>
                            </div>
                        </div>

                        {/* Redeem Money Card */}
                        <div className='group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-green-500'>
                            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 rounded-bl-full'></div>
                            <div className='relative'>
                                <div className='w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg'>
                                    <Wallet className='w-7 h-7 text-white' />
                                </div>
                                <h3 className='text-xl font-bold mb-3 text-gray-900 dark:text-white'>
                                    Redeem Money
                                </h3>
                                <div className='space-y-2 mb-4'>
                                    <div className='flex items-center gap-2'>
                                        <TrendingUp className='w-5 h-5 text-green-600 dark:text-green-400' />
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            <strong className='text-green-600 dark:text-green-400'>
                                                5 Points = ₹1
                                            </strong>
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Gift className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
                                        <span className='text-gray-700 dark:text-gray-300'>
                                            <strong className='text-emerald-600 dark:text-emerald-400'>
                                                Bank Transfer
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>
                                    Convert points to cash and withdraw anytime
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className='text-center mt-12'>
                        <button
                            onClick={() => setShowModal(true)}
                            className='group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-600 via-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105'
                        >
                            <span>Learn How to Earn</span>
                            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                        </button>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-4'>
                            Join 1000+ students already earning on Student
                            Senior
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto'>
                        <div className='text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm'>
                            <div className='text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1'>
                                10+
                            </div>
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                Points per PYQ
                            </div>
                        </div>
                        <div className='text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm'>
                            <div className='text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1'>
                                70%
                            </div>
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                Revenue Share
                            </div>
                        </div>
                        <div className='text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm'>
                            <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-1'>
                                ₹100
                            </div>
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                Per 500 Points
                            </div>
                        </div>
                        <div className='text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm'>
                            <div className='text-3xl font-bold text-sky-600 dark:text-sky-400 mb-1'>
                                24h
                            </div>
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
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
