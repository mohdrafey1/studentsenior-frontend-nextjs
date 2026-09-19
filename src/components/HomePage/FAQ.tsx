'use client';

import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    HelpCircle,
    MessageCircle,
    Mail,
    Phone,
} from 'lucide-react';
import Head from 'next/head';

import { faqs } from '@/constant';

const FAQPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = [
        'All',
        ...Array.from(new Set(faqs.map((faq) => faq.category))),
    ];

    const filteredFaqs =
        selectedCategory === 'All'
            ? faqs
            : faqs.filter((faq) => faq.category === selectedCategory);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className='bg-[#f6f5f4] dark:bg-[#191919] border-t border-[#e6e6e6] dark:border-[#2f2f2f] transition-colors duration-200'>
            {/* Hero Section */}
            <section className='pt-14 sm:pt-18 px-4 sm:px-6'>
                <div className='max-w-4xl mx-auto text-center'>
                    <div className='mb-8'>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#262626] text-[#0075de] dark:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] mb-3'>
                            <span>Knowledge Base</span>
                        </div>
                        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#000000] dark:text-white tracking-[-0.025em] mb-2.5'>
                            Frequently Asked Questions
                        </h2>
                        <p className='text-sm sm:text-base text-[#615d59] dark:text-[#a39e98] max-w-xl mx-auto'>
                            Find quick answers to common questions about Student Senior platform, resources, and mentorship.
                        </p>
                    </div>

                    {/* Category Filter Pills */}
                    <div className='flex flex-wrap justify-center gap-2 mb-10'>
                        {categories.map((category) => {
                            const isActive = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() =>
                                        setSelectedCategory(category || 'all')
                                    }
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                                        isActive
                                            ? 'bg-[#0075de] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,117,222,0.25)]'
                                            : 'bg-white dark:bg-[#202020] text-[#31302e] dark:text-[#d3d1cb] hover:bg-[#eae9e7] dark:hover:bg-[#2a2a2a] border border-[#e6e6e6] dark:border-[#383838]'
                                    }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Accordion Section */}
            <section className='pb-14 sm:pb-18 px-4 sm:px-6'>
                <div className='max-w-3xl mx-auto space-y-3'>
                    {filteredFaqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className='bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-150'
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className='w-full flex justify-between items-center p-4 sm:p-5 text-left hover:bg-[#faf9f8] dark:hover:bg-[#242424] transition-colors focus:outline-none cursor-pointer'
                                    aria-expanded={isOpen}
                                >
                                    <div className='flex items-start gap-3.5 pr-4'>
                                        <span className='w-6 h-6 rounded-md bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#a39e98] text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#e6e6e6] dark:border-[#383838]'>
                                            {index + 1}
                                        </span>
                                        <div>
                                            <h3 className='text-sm sm:text-base font-semibold text-[#000000] dark:text-white tracking-[-0.125px]'>
                                                {faq.question}
                                            </h3>
                                            {faq.category && (
                                                <span className='inline-block mt-1 px-2 py-0.5 text-[11px] font-medium bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#a39e98] rounded-md border border-[#e6e6e6] dark:border-[#383838]'>
                                                    {faq.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex-shrink-0 ml-2'>
                                        {isOpen ? (
                                            <ChevronUp className='w-4 h-4 text-[#615d59] dark:text-[#a39e98]' />
                                        ) : (
                                            <ChevronDown className='w-4 h-4 text-[#615d59] dark:text-[#a39e98]' />
                                        )}
                                    </div>
                                </button>
                                {isOpen && (
                                    <div className='px-4 sm:px-5 pb-5 pt-1 border-t border-[#f0f0f0] dark:border-[#2a2a2a]'>
                                        <div className='pl-9.5 text-xs sm:text-sm text-[#31302e] dark:text-[#d3d1cb] leading-relaxed'>
                                            {faq.answer}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Contact Section */}
            <section className='py-14 sm:py-18 px-4 sm:px-6 bg-white dark:bg-[#202020] border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                <div className='max-w-4xl mx-auto text-center'>
                    <h3 className='text-xl sm:text-2xl font-bold text-[#000000] dark:text-white tracking-[-0.2px] mb-2'>
                        Still Have Questions?
                    </h3>
                    <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a39e98] mb-8 max-w-xl mx-auto'>
                        Our support team is here to help you get the best experience on Student Senior.
                    </p>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto'>
                        {/* Email */}
                        <div className='bg-[#f6f5f4] dark:bg-[#262626] p-5 rounded-xl border border-[#e6e6e6] dark:border-[#383838] text-center'>
                            <div className='w-10 h-10 rounded-xl bg-[#eaf3fd] dark:bg-[#10243e] text-[#0075de] dark:text-[#62aef0] flex items-center justify-center mx-auto mb-3'>
                                <Mail className='w-5 h-5' strokeWidth={2.2} />
                            </div>
                            <h4 className='font-semibold text-sm text-[#000000] dark:text-white mb-1'>
                                Email Us
                            </h4>
                            <p className='text-xs text-[#615d59] dark:text-[#a39e98] font-mono'>
                                studentsenior.help@gmail.com
                            </p>
                        </div>
                        {/* Chat */}
                        <div className='bg-[#f6f5f4] dark:bg-[#262626] p-5 rounded-xl border border-[#e6e6e6] dark:border-[#383838] text-center'>
                            <div className='w-10 h-10 rounded-xl bg-[#f5edfd] dark:bg-[#2b1744] text-[#8a3fd6] dark:text-[#d6b6f6] flex items-center justify-center mx-auto mb-3'>
                                <MessageCircle className='w-5 h-5' strokeWidth={2.2} />
                            </div>
                            <h4 className='font-semibold text-sm text-[#000000] dark:text-white mb-1'>
                                Live Chat
                            </h4>
                            <p className='text-xs text-[#615d59] dark:text-[#a39e98]'>
                                Available 24/7
                            </p>
                        </div>
                        {/* Phone / Support Center */}
                        <div className='bg-[#f6f5f4] dark:bg-[#262626] p-5 rounded-xl border border-[#e6e6e6] dark:border-[#383838] text-center'>
                            <div className='w-10 h-10 rounded-xl bg-[#eaf7ec] dark:bg-[#112d1b] text-[#1aae39] dark:text-[#4ade80] flex items-center justify-center mx-auto mb-3'>
                                <Phone className='w-5 h-5' strokeWidth={2.2} />
                            </div>
                            <h4 className='font-semibold text-sm text-[#000000] dark:text-white mb-1'>
                                Support Center
                            </h4>
                            <p className='text-xs text-[#615d59] dark:text-[#a39e98]'>
                                Visit our help center
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;

