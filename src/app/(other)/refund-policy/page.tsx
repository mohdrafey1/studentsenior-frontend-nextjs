import React from 'react';
import {
    ArrowLeftRight,
    XCircle,
    Clock,
    CreditCard,
    Ban,
    RefreshCw,
    HelpCircle,
    CheckCircle2,
} from 'lucide-react';

export const metadata = {
    title: 'Refund Policy - Student Senior',
    description: 'Refund Policy',
};

const RefundPolicy = () => {
    const sections = [
        {
            id: 'eligibility',
            title: 'Eligibility for Refunds',
            icon: <CheckCircle2 className='w-6 h-6' />,
            content: (
                <div className='space-y-2'>
                    <p>Refunds will be considered for the following reasons:</p>
                    <ul className='list-disc pl-6 space-y-1'>
                        <li>Incorrect or duplicate charges.</li>
                        <li>
                            Non-delivery of the product or service (e.g., notes,
                            courses, etc.).
                        </li>
                        <li>
                            Technical issues preventing access to the purchased
                            content (e.g., PDF download failure).
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'non-refundable',
            title: 'Non-Refundable Items',
            icon: <XCircle className='w-6 h-6' />,
            content: (
                <div className='space-y-2'>
                    <p>
                        Please note that the following items are non-refundable:
                    </p>
                    <ul className='list-disc pl-6 space-y-1'>
                        <li>
                            Products or services that have been delivered and
                            are functioning properly.
                        </li>
                        <li>
                            Content that has been downloaded or accessed in any
                            form.
                        </li>
                        <li>
                            Any subscription or membership fees that are part of
                            an ongoing service unless specified otherwise.
                        </li>
                        <li className='font-semibold text-red-600 dark:text-red-400'>
                            There will be no return if the product is purchased.
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'request-process',
            title: 'Refund Request Process',
            icon: <ArrowLeftRight className='w-6 h-6' />,
            content: (
                <div className='space-y-2'>
                    <p>
                        If you believe you are eligible for a refund, please
                        follow these steps:
                    </p>
                    <ul className='list-disc pl-6 space-y-1'>
                        <li>
                            Contact our support team within 2 days of purchase.
                        </li>
                        <li>
                            Provide your order details, including your order
                            number and reason for the refund request.
                        </li>
                        <li>
                            Our team will review your request and get back to
                            you with a resolution within 3 business days.
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'credit',
            title: 'Refund Credited',
            icon: <CreditCard className='w-6 h-6' />,
            content:
                "If your refund request is approved, we will credit the refund within 2 business days. The refund will be issued to the original payment method, and the transaction may take additional time depending on your payment provider's policies.",
        },
        {
            id: 'cancellations',
            title: 'Cancellations',
            icon: <Ban className='w-6 h-6' />,
            content:
                'If you wish to cancel any services or subscriptions, please contact us as soon as possible. Cancellations are subject to our refund policy and may not be applicable after certain conditions are met (such as content being accessed or downloaded).',
        },
        {
            id: 'changes',
            title: 'Changes to This Refund Policy',
            icon: <RefreshCw className='w-6 h-6' />,
            content:
                'We may update this Refund Policy from time to time. Any changes will be posted on this page, and the updated date will be reflected at the bottom of the page.',
        },
        {
            id: 'contact',
            title: 'Contact Us',
            icon: <HelpCircle className='w-6 h-6' />,
            content: (
                <>
                    If you have any questions or concerns regarding our Refund
                    Policy or need assistance with your refund request, please
                    contact us at{' '}
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
                        <Clock className='w-8 h-8 text-blue-600 dark:text-blue-400' />
                    </div>
                    <h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                        Refund Policy
                    </h1>
                    <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                        Thank you for choosing Student Senior! We strive to
                        ensure a satisfying experience with our services. This
                        policy outlines our terms for refunds and cancellations.
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

export default RefundPolicy;
