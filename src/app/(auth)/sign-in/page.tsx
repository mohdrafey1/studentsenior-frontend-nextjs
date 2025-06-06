"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    LogIn,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "@/components/OAuth";
import { api, API_KEY } from "@/config/apiUrls";
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";

interface FormData {
    email?: string;
    password?: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const SignIn: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({});
    const [errors, setErrors] = useState<FormErrors>({});
    const [passwordShown, setPasswordShown] = useState<boolean>(false);

    const { loading } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    // Get redirect path from URL params
    const from = searchParams.get("from") || "/";

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!formData.password || formData.password.length < 1) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));

        // Clear error when user starts typing
        if (errors[id as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [id]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            dispatch(signInStart());

            const res = await fetch(`${api.auth.login}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY ?? "",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false) {
                dispatch(signInFailure(data));
                toast.error(data.message);
                return;
            }

            dispatch(signInSuccess(data));
            toast.success("Welcome back! Sign in successful");

            // Redirect to the original page or dashboard
            setTimeout(() => {
                router.push(from);
            }, 100);
        } catch (error) {
            console.error("Sign in error:", error);
            dispatch(signInFailure(error));
            toast.error("Sign in failed. Please try again.");
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordShown((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left Side - Form */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
                    <div className="max-w-md w-full space-y-6">
                        {/* Header */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                                <Image
                                    src="/assets/logo.jpg"
                                    alt="Student Senior Logo"
                                    width={60}
                                    height={60}
                                    className="rounded-full"
                                    priority
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Please enter your details to sign in
                            </p>
                        </div>

                        {/* Form Container */}
                        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                                errors.email
                                                    ? "border-red-500"
                                                    : "border-gray-300 dark:border-gray-600"
                                            }`}
                                            onChange={handleChange}
                                            value={formData.email || ""}
                                            autoComplete="email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={
                                                passwordShown
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="password"
                                            placeholder="Enter your password"
                                            className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                                errors.password
                                                    ? "border-red-500"
                                                    : "border-gray-300 dark:border-gray-600"
                                            }`}
                                            onChange={handleChange}
                                            value={formData.password || ""}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {passwordShown ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Sign In
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                        </>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                                Or continue with
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <OAuth />
                                    </div>
                                </div>
                            </form>

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Dont have an account?{" "}
                                    <Link
                                        href="/sign-up"
                                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                    >
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Protected by industry-standard encryption
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Illustration */}
                <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="grid grid-cols-12 gap-4 h-full p-8">
                                {[...Array(144)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-full animate-pulse"
                                        style={{
                                            animationDelay: `${i * 0.1}s`,
                                            animationDuration: "3s",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
                        <div className="text-center space-y-6">
                            <h1 className="text-4xl font-bold mb-4">
                                Join Our Learning Community
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 max-w-md">
                                Connect with fellow students, access resources,
                                and excel in your academic journey.
                            </p>

                            {/* Illustration Container */}
                            <div className="relative w-96 h-96 mx-auto">
                                <Image
                                    src="/assets/images/illustration1.png"
                                    alt="Students learning together"
                                    fill
                                    className="object-contain drop-shadow-2xl rounded-4xl"
                                    priority
                                />
                            </div>

                            {/* Feature List */}
                            <div className="grid grid-cols-1 gap-4 mt-8 text-left">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <span className="text-blue-100">
                                        Access to premium resources
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <span className="text-blue-100">
                                        Connect with study groups
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <span className="text-blue-100">
                                        Track your progress
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <span className="text-blue-100">
                                        Get expert guidance
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
