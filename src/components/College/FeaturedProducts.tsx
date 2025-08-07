"use client";

import React from "react";
import { Tag, Eye, ExternalLink, IndianRupee } from "lucide-react";
import { IStoreItem } from "@/utils/interface";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/formatting";

interface FeaturedProductsProps {
    products: IStoreItem[];
    collegeName: string;
}

export default function FeaturedProducts({
    products,
    collegeName,
}: FeaturedProductsProps) {
    if (!products || products.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Featured Resources
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            No resources available at the moment. Be the first
                            to share!
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400">
                        Featured Resources
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                        Access study materials, books, and academic resources
                        from your seniors
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <article
                            key={product._id}
                            className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col"
                        >
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />

                            {/* Floating Orb Effect */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />

                            {/* Image Section */}
                            <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        width={500}
                                        height={500}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <Eye className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                No Image
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
                                            product.available
                                                ? "bg-emerald-100/90 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200 border border-emerald-200/50"
                                                : "bg-red-100/90 text-red-800 dark:bg-red-900/80 dark:text-red-200 border border-red-200/50"
                                        }`}
                                    >
                                        {product.available
                                            ? "Available"
                                            : "Sold"}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="relative p-6 flex-grow flex flex-col">
                                {/* Title and Price */}
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-600 dark:group-hover:from-sky-400 dark:group-hover:to-cyan-400 transition-all duration-300 flex-1 mr-3">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-3 py-2 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                                        <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-1" />
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            {formatPrice(product.price)}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4">
                                    {product.description}
                                </p>

                                {/* Type Indicator */}
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    <Tag className="w-4 h-4" />
                                    <span>Academic Resource</span>
                                </div>

                                {/* Gradient Separator */}
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-4" />

                                {/* Footer Section */}
                                <div className="mt-auto">
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
                                                {(product.owner?.username ||
                                                    "A")[0].toUpperCase()}
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                By{" "}
                                                {product.owner?.username ||
                                                    "Anonymous"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <time className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                                {formatDate(product.createdAt)}
                                            </time>
                                        </div>
                                    </div>

                                    <Link
                                        href={`${collegeName}/store/${product.slug}`}
                                        className="group/cta relative inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02] overflow-hidden"
                                    >
                                        {/* Button Background Animation */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-500 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />

                                        <span className="relative flex items-center">
                                            View Details
                                            <ExternalLink className="w-4 h-4 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {products.length === 4 && (
                    <div className="text-center mt-8">
                        <Link
                            href="store"
                            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02]"
                        >
                            View All Resources
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
