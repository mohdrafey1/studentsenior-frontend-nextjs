"use client";
import React from "react";
import { IStoreItem } from "@/utils/interface";
import {
    Phone,
    MessageCircle,
    Eye,
    ArrowLeft,
    IndianRupee,
    CheckCircle,
    Clock,
    ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductDetailClientProps {
    product: IStoreItem;
    collegeName: string;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
    product,
    collegeName,
}) => {
    console.log(product);
    return (
        <>
            <div className="max-w-6xl mx-auto px-4">
                {/* Floating Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-sky-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400/5 to-sky-400/5 rounded-full blur-3xl"></div>
                </div>

                {/* Back Button */}
                <div className="mb-8 relative z-10">
                    <Link
                        href={`/${collegeName}/store`}
                        className="group inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5 text-sky-600 dark:text-sky-400 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
                            Back to Store
                        </span>
                    </Link>
                </div>

                {/* Main Content Card */}
                <article className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-2xl overflow-hidden">
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10"></div>

                    <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative p-8 xl:p-12">
                            <div className="group relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden shadow-xl">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        width={500}
                                        height={500}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <div className="text-center">
                                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <ShoppingBag className="w-12 h-12 text-gray-400" />
                                            </div>
                                            <span className="text-xl font-medium">
                                                No Image Available
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Status Badge */}
                                <div className="absolute top-6 right-6">
                                    <span
                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-2xl backdrop-blur-md shadow-xl transition-all duration-300 ${
                                            product.available
                                                ? "bg-emerald-100/90 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200 border border-emerald-200/50"
                                                : "bg-red-100/90 text-red-800 dark:bg-red-900/80 dark:text-red-200 border border-red-200/50"
                                        }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                product.available
                                                    ? "bg-emerald-500 animate-pulse"
                                                    : "bg-red-500"
                                            }`}
                                        ></div>
                                        {product.available
                                            ? "Available"
                                            : "Sold"}
                                    </span>
                                </div>

                                {/* Submission Status Badge */}
                                {product.submissionStatus !== "approved" && (
                                    <div className="absolute top-6 left-6">
                                        <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-amber-100/90 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 rounded-2xl backdrop-blur-md shadow-xl border border-amber-200/50">
                                            <Clock className="w-3 h-3" />
                                            Pending Approval
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Status Section */}
                            <div className="mt-auto">
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-6"></div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center p-4 bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-xl border border-sky-200/30 dark:border-sky-700/30">
                                        <div className="flex items-center justify-center mb-2">
                                            {product.submissionStatus ===
                                            "approved" ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Status
                                        </p>
                                        <p
                                            className={`font-semibold ${
                                                product.submissionStatus ===
                                                "approved"
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-amber-600 dark:text-amber-400"
                                            }`}
                                        >
                                            {product.submissionStatus ===
                                            "approved"
                                                ? "Approved"
                                                : "Pending"}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-xl border border-sky-200/30 dark:border-sky-700/30">
                                        <div className="flex items-center justify-center mb-2">
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    product.available
                                                        ? "bg-emerald-500 animate-pulse"
                                                        : "bg-red-500"
                                                }`}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Availability
                                        </p>
                                        <p
                                            className={`font-semibold ${
                                                product.available
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            {product.available
                                                ? "Available"
                                                : "Sold"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="relative p-8 xl:p-12 flex flex-col">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="xl:text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-tight bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text ">
                                    {product.name}
                                </h1>
                                <div className="flex items-center bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-6 py-4 rounded-2xl border border-emerald-200/30 dark:border-emerald-700/30 shadow-lg">
                                    <IndianRupee className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mr-3" />
                                    <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {product.price}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-cyan-500 rounded-full"></div>
                                    Description
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200/30 dark:border-gray-700/30">
                                    {product.description}
                                </p>
                            </div>

                            {/* Seller Info */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-2xl border border-sky-200/30 dark:border-sky-700/30">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                            {(product.owner?.username ||
                                                "A")[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Seller
                                            </p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {product.owner?.username ||
                                                    "Anonymous"}
                                            </p>
                                        </div>
                                    </div>
                                    {product.clickCount > 0 && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md">
                                            <Eye className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {product.clickCount} views
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="mb-8 flex-grow">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-cyan-500 rounded-full"></div>
                                    Contact Seller
                                </h2>
                                <div className="space-y-4">
                                    {product.whatsapp && (
                                        <a
                                            href={`https://wa.me/91${product.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/contact flex items-center gap-4 w-full p-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            <div className="p-3 bg-white/20 rounded-xl group-hover/contact:bg-white/30 transition-colors duration-300">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <span className="text-lg font-semibold">
                                                Contact on WhatsApp
                                            </span>
                                        </a>
                                    )}
                                    {product.telegram && (
                                        <a
                                            href={`https://t.me/${product.telegram}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/contact flex items-center gap-4 w-full p-6 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            <div className="p-3 bg-white/20 rounded-xl group-hover/contact:bg-white/30 transition-colors duration-300">
                                                <MessageCircle className="w-6 h-6" />
                                            </div>
                                            <span className="text-lg font-semibold">
                                                Contact on Telegram
                                            </span>
                                        </a>
                                    )}
                                    {!product.whatsapp && !product.telegram && (
                                        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 text-center">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                No contact information available
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
};

export default ProductDetailClient;
