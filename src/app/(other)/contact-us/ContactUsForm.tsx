"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Mail, MessageSquare, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/config/apiUrls";

interface FormData {
    email: string;
    subject: string;
    description: string;
}

const ContactUsForm = () => {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        subject: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(api.contactus.createContactus, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            setFormData({ email: "", subject: "", description: "" });
            toast.success("Message sent successfully!");
        } catch (error) {
            console.log("Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                </div>

                {/* Subject Input */}
                <div className="relative">
                    <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Subject
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="subject"
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="What's this about?"
                            required
                        />
                    </div>
                </div>

                {/* Description Input */}
                <div className="relative">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Message
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Tell us what's on your mind..."
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="-ml-1 mr-2 h-5 w-5" />
                            Send Message
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactUsForm;
