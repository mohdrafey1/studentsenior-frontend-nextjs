import React from 'react';
import ContactUsForm from './ContactUsForm';
import { Mail, Clock } from 'lucide-react';

export const metadata = {
    title: 'Contact Us - Student Senior',
    description: 'Get in touch with the Student Senior team for support, feedback, and questions.',
};

const ContactUs = () => {
    return (
        <div className='w-full h-auto lg:min-h-[calc(100vh-140px)] bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] transition-colors py-6 sm:py-10 lg:py-12 flex flex-col justify-center'>
            <div className='max-w-2xl mx-auto px-4 sm:px-6'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#191919] dark:text-[#ececec] mb-2.5'>
                        Get in Touch
                    </h1>
                    <p className='text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] max-w-lg mx-auto leading-relaxed'>
                        Have a question, feedback, or need help? Send us a message and our team will get back to you shortly.
                    </p>
                </div>

                {/* Quick Info Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6'>
                    <a
                        href='mailto:studentsenior.help@gmail.com'
                        className='p-3 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs hover:border-[#0075de]/40 hover:shadow-xs transition-all flex items-center gap-3 group'
                    >
                        <div className='w-8 h-8 rounded-lg bg-[#0075de]/10 text-[#0075de] dark:bg-[#0075de]/20 flex items-center justify-center shrink-0'>
                            <Mail className='w-4 h-4' />
                        </div>
                        <div className='min-w-0'>
                            <div className='text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97]'>
                                Direct Email
                            </div>
                            <div className='text-xs font-medium text-[#191919] dark:text-[#ececec] group-hover:text-[#0075de] transition-colors truncate'>
                                studentsenior.help@gmail.com
                            </div>
                        </div>
                    </a>

                    <div className='p-3 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0'>
                            <Clock className='w-4 h-4' />
                        </div>
                        <div className='min-w-0'>
                            <div className='text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97]'>
                                Response Time
                            </div>
                            <div className='text-xs font-medium text-[#191919] dark:text-[#ececec]'>
                                Usually within 24 hours
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <ContactUsForm />
            </div>
        </div>
    );
};

export default ContactUs;
