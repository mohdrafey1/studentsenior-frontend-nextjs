import React from 'react';
import ContactUsForm from './ContactUsForm';

export const metadata = {
    title: 'Contact Us - Student Senior',
    description: 'Get in Touch with us',
};

const ContactUs = () => {
    return (
        <div className='py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-2xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-12'>
                    <h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                        Get in Touch
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300'>
                        Have a question or feedback? We&apos;d love to hear from
                        you.
                    </p>
                </div>

                {/* Contact Form */}
                <ContactUsForm />

                {/* Contact Info */}
                <div className='mt-12 text-center'>
                    <p className='text-gray-600 dark:text-gray-300'>
                        You can also reach us at{' '}
                        <a
                            href='mailto:studentsenior.help@gmail.com'
                            className='text-blue-600 dark:text-blue-400 hover:underline'
                        >
                            studentsenior.help@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
