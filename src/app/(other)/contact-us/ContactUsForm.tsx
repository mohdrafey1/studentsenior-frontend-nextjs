'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, MessageSquare, Send, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/config/apiUrls';

interface FormData {
    email: string;
    subject: string;
    description: string;
}

const ContactUsForm = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        subject: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(api.contactus.createContactus, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setFormData({ email: '', subject: '', description: '' });
            toast.success('Message sent successfully! We will get back to you soon.');
        } catch (error) {
            console.error('Contact submit error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl p-5 sm:p-7 shadow-xs'>
            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5'>
                {/* Email Input */}
                <div>
                    <label
                        htmlFor='email'
                        className='block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97] mb-1.5'
                    >
                        Your Email
                    </label>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787774] dark:text-[#9b9a97]'>
                            <Mail className='h-4 w-4' />
                        </div>
                        <input
                            id='email'
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='block w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] placeholder-[#9b9a97] focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/20 transition-all'
                            placeholder='name@example.com'
                            required
                        />
                    </div>
                </div>

                {/* Subject Input */}
                <div>
                    <label
                        htmlFor='subject'
                        className='block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97] mb-1.5'
                    >
                        Subject
                    </label>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787774] dark:text-[#9b9a97]'>
                            <MessageSquare className='h-4 w-4' />
                        </div>
                        <input
                            id='subject'
                            type='text'
                            name='subject'
                            value={formData.subject}
                            onChange={handleChange}
                            className='block w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] placeholder-[#9b9a97] focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/20 transition-all'
                            placeholder='What is this regarding?'
                            required
                        />
                    </div>
                </div>

                {/* Message Input */}
                <div>
                    <label
                        htmlFor='description'
                        className='block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97] mb-1.5'
                    >
                        Message
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className='block w-full p-3 text-xs sm:text-sm border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] placeholder-[#9b9a97] focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/20 transition-all resize-y'
                        placeholder='Tell us how we can help you...'
                        required
                    />
                </div>

                {/* Privacy note */}
                <div className='flex items-center gap-1.5 text-[11px] text-[#787774] dark:text-[#9b9a97] pt-1'>
                    <ShieldCheck className='w-3.5 h-3.5 text-emerald-600 shrink-0' />
                    <span>We respect your privacy and will reply directly to your email.</span>
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={loading}
                    className='w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg text-white bg-[#0075de] hover:bg-[#0060b9] shadow-2xs focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                    {loading ? (
                        <>
                            <Loader2 className='animate-spin h-4 w-4' />
                            <span>Sending message...</span>
                        </>
                    ) : (
                        <>
                            <Send className='h-4 w-4' />
                            <span>Send Message</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactUsForm;
