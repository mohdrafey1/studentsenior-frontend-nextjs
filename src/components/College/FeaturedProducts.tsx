"use client";

import React from "react";
import { BookOpen, Tag, Clock } from "lucide-react";
import { Product } from "@/utils/interface";

interface FeaturedProductsProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    if (!products || products.length === 0) {
        return (
            <section className="py-16 bg-white dark:bg-gray-900">
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
        }).format(price);
    };

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case "new":
                return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
            case "like-new":
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
            case "used":
                return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
            default:
                return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
        }
    };

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Resources
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Access study materials, books, and academic resources
                        from your seniors
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.slice(0, 6).map((product) => (
                        <div
                            key={product._id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/30 transition-shadow duration-200"
                        >
                            {product.images && product.images.length > 0 && (
                                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                                        {product.title}
                                    </h3>
                                    <div
                                        className={`text-xs px-2 py-1 rounded-full ${getConditionColor(
                                            product.condition
                                        )}`}
                                    >
                                        {product.condition}
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                        <Tag className="w-4 h-4" />
                                        <span>{product.category}</span>
                                    </div>
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {formatPrice(product.price)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                            {new Date(
                                                product.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length > 6 && (
                    <div className="text-center mt-8">
                        <button className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200">
                            View All Resources
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
