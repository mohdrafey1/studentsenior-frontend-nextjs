"use client";

import React, { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    HelpCircle,
    MessageCircle,
    Mail,
    Phone,
} from "lucide-react";
import Head from "next/head";

import { faqs } from "@/constant";

const FAQPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = [
        "All",
        ...Array.from(new Set(faqs.map((faq) => faq.category))),
    ];

    const filteredFaqs =
        selectedCategory === "All"
            ? faqs
            : faqs.filter((faq) => faq.category === selectedCategory);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Head>
                <title>FAQ - Student Senior | Frequently Asked Questions</title>
                <meta name="description" content="Find answers..." />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                {/* Hero Section */}
                <section className="pt-10 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 shadow-lg">
                                <HelpCircle className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                                Frequently Asked{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                    Questions
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                Find quick answers to common questions about
                                Student Senior...
                            </p>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-2 mb-12">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        setSelectedCategory(category || "all")
                                    }
                                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                        selectedCategory === category
                                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="pb-16 px-4">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                                                {faq.question}
                                            </h3>
                                            {faq.category && (
                                                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                                    {faq.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        {openIndex === index ? (
                                            <ChevronUp className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                        )}
                                    </div>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-6 pt-2">
                                        <div className="pl-14">
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-16 px-4 bg-white dark:bg-gray-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Still Have Questions?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Our support team is here to help...
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            {/* Email */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl border border-blue-100 dark:border-gray-600">
                                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Email Us
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    studentsenior.help@gmail.com
                                </p>
                            </div>
                            {/* Chat */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl border border-purple-100 dark:border-gray-600">
                                <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Live Chat
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Available 24/7
                                </p>
                            </div>
                            {/* Phone */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl border border-green-100 dark:border-gray-600">
                                <Phone className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-4" />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Support Center
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Visit our help center
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default FAQPage;
