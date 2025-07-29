import React from "react";
import { Shield, Users, Lock, Bell, FileText, HelpCircle } from "lucide-react";

export const metadata = {
    title: "Privacy Policy - Student Senior",
    description: "Privacy Policy",
};

const PrivacyPolicy = () => {
    const sections = [
        {
            id: "collection",
            title: "Information We Collect",
            icon: <Users className="w-6 h-6" />,
            content:
                "We may collect personal information that you provide to us, such as your name, email address, college details, and any other information you choose to provide. Additionally, we collect technical information such as IP address, browser type, and usage data for analytics purposes.",
        },
        {
            id: "usage",
            title: "How We Use Your Information",
            icon: <FileText className="w-6 h-6" />,
            content:
                "We use your information to improve your experience on Student Senior, manage user accounts, and provide services such as connecting seniors and juniors. We may also use your information to improve our website, analyze site traffic, and send updates about new features.",
        },
        {
            id: "sharing",
            title: "Sharing of Information",
            icon: <Bell className="w-6 h-6" />,
            content:
                "We do not share your personal information with third parties, except when necessary to operate the website, comply with legal obligations, or protect our rights. We may share anonymous data for analytics and marketing purposes.",
        },
        {
            id: "security",
            title: "Security",
            icon: <Lock className="w-6 h-6" />,
            content:
                "We take reasonable steps to protect your personal information from unauthorized access or disclosure. However, please be aware that no internet transmission is entirely secure.",
        },
        {
            id: "rights",
            title: "Your Rights",
            icon: <Shield className="w-6 h-6" />,
            content:
                "You have the right to access, update, or delete your personal information. If you would like to exercise these rights, please contact us through our support channels.",
        },
        {
            id: "contact",
            title: "Contact Us",
            icon: <HelpCircle className="w-6 h-6" />,
            content: (
                <>
                    If you have any questions about our Privacy Policy, please
                    contact us at{" "}
                    <a
                        href="mailto:studentsenior.help@gmail.com"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        studentsenior.help@gmail.com
                    </a>
                    .
                </>
            ),
        },
    ];

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                        <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Welcome to Student Senior! This privacy policy explains
                        how we collect, use, and protect your personal
                        information when you visit our website.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        {React.cloneElement(section.icon, {
                                            className:
                                                "w-6 h-6 text-blue-600 dark:text-blue-400",
                                        })}
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {section.title}
                                    </h2>
                                    <div className="text-gray-600 dark:text-gray-300">
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    Last updated: 06-11-2024
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
