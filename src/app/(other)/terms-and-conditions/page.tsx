import React from 'react';
import {
    Scale,
    UserCheck,
    FileText,
    CreditCard,
    Ban,
    ShieldAlert,
    Lock,
    Gavel,
    RefreshCw,
    HelpCircle,
    CheckCircle2,
} from 'lucide-react';

export const metadata = {
    title: 'Terms and Conditions - Student Senior',
    description: 'Terms and Conditions',
};

const TermsAndConditions = () => {
    const sections = [
        {
            id: 'acceptance',
            title: 'Acceptance of Terms',
            icon: <CheckCircle2 className='w-6 h-6' />,
            content:
                'By accessing and using Student Senior, you agree to be bound by these terms and conditions. We may update these terms from time to time, and your continued use of the website will signify your acceptance of any updated terms.',
        },
        {
            id: 'usage',
            title: 'Use of the Website',
            icon: <FileText className='w-6 h-6' />,
            content:
                'You agree to use the website in accordance with all applicable laws and regulations. You may not use the website for any unlawful purpose or in a way that may damage, disable, or impair the website.',
        },
        {
            id: 'registration',
            title: 'Account Registration',
            icon: <UserCheck className='w-6 h-6' />,
            content:
                'To access certain features of the website, you may be required to register for an account. You agree to provide accurate and complete information during the registration process and keep your account details secure.',
        },
        {
            id: 'content',
            title: 'User Content',
            icon: <FileText className='w-6 h-6' />,
            content:
                'By submitting content to the website (such as notes, comments, or reviews), you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content on the website.',
        },
        {
            id: 'payments',
            title: 'Payments and Purchases',
            icon: <CreditCard className='w-6 h-6' />,
            content:
                'Any purchases made on the website, including notes or other services, are subject to applicable fees and payment terms. We reserve the right to modify prices at any time. Payments are processed securely through our third-party payment provider.',
        },
        {
            id: 'termination',
            title: 'Termination',
            icon: <Ban className='w-6 h-6' />,
            content:
                'We reserve the right to suspend or terminate your account if you violate these terms and conditions. Upon termination, you will lose access to certain services, and any outstanding payments will still be due.',
        },
        {
            id: 'liability',
            title: 'Limitation of Liability',
            icon: <ShieldAlert className='w-6 h-6' />,
            content:
                'Student Senior will not be held liable for any direct, indirect, incidental, or consequential damages arising from your use of the website or any services provided, except as required by law.',
        },
        {
            id: 'privacy',
            title: 'Privacy',
            icon: <Lock className='w-6 h-6' />,
            content:
                'Your use of the website is also governed by our Privacy Policy, which explains how we collect and use your personal data.',
        },
        {
            id: 'law',
            title: 'Governing Law',
            icon: <Gavel className='w-6 h-6' />,
            content:
                'These terms and conditions are governed by the laws of India, without regard to its conflict of law principles. Any disputes arising from these terms will be resolved in the competent courts of India.',
        },
        {
            id: 'changes',
            title: 'Changes to the Terms',
            icon: <RefreshCw className='w-6 h-6' />,
            content:
                'We may update these Terms and Conditions periodically. Any changes will be posted on this page, and the updated date will be reflected at the bottom of the page.',
        },
        {
            id: 'contact',
            title: 'Contact Us',
            icon: <HelpCircle className='w-6 h-6' />,
            content: (
                <>
                    If you have any questions about these Terms and Conditions,
                    please contact us at{' '}
                    <a
                        href='mailto:studentsenior.help@gmail.com'
                        className='text-blue-600 dark:text-blue-400 hover:underline'
                    >
                        studentsenior.help@gmail.com
                    </a>
                    .
                </>
            ),
        },
    ];

    return (
        <div className='py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-4xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-16'>
                    <div className='inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4'>
                        <Scale className='w-8 h-8 text-blue-600 dark:text-blue-400' />
                    </div>
                    <h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                        Terms and Conditions
                    </h1>
                    <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                        Welcome to Student Senior! These terms and conditions
                        govern your use of the website. By accessing and using
                        Student Senior, you agree to comply with these terms.
                    </p>
                </div>

                {/* Content */}
                <div className='space-y-8'>
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700'
                        >
                            <div className='flex items-start'>
                                <div className='flex-shrink-0'>
                                    <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                                        {React.cloneElement(section.icon, {
                                            className:
                                                'w-6 h-6 text-blue-600 dark:text-blue-400',
                                        })}
                                    </div>
                                </div>
                                <div className='ml-4'>
                                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                        {section.title}
                                    </h2>
                                    <div className='text-gray-600 dark:text-gray-300'>
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className='mt-12 text-center text-sm text-gray-500 dark:text-gray-400'>
                    Last updated: 18-02-2025
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
