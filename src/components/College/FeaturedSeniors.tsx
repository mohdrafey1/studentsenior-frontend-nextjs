"use client";

import React from "react";
import { Star, User, GraduationCap } from "lucide-react";
import { Senior } from "@/utils/interface";
import Image from "next/image";

interface FeaturedSeniorsProps {
    seniors: Senior[];
}

export default function FeaturedSeniors({ seniors }: FeaturedSeniorsProps) {
    if (!seniors || seniors.length === 0) {
        return (
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Featured Seniors
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            No seniors available at the moment. Be the first to
                            join!
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Seniors
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Connect with experienced seniors who can guide you
                        through your academic journey
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {seniors.slice(0, 6).map((senior) => (
                        <div
                            key={senior._id}
                            className="bg-white dark:bg-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/20 p-6 hover:shadow-md dark:hover:shadow-gray-900/30 transition-shadow duration-200"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    {senior.image ? (
                                        <Image
                                            src={senior.image}
                                            alt={senior.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                            width={500}
                                            height={500}
                                        />
                                    ) : (
                                        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {senior.name}
                                    </h3>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                        <GraduationCap className="w-4 h-4" />
                                        <span>
                                            {senior.branch} • Year {senior.year}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {senior.bio && (
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                    {senior.bio}
                                </p>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {senior.rating || 0} (
                                        {senior.totalReviews || 0} reviews)
                                    </span>
                                </div>
                                {senior.isVerified && (
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                                        Verified
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {seniors.length > 6 && (
                    <div className="text-center mt-8">
                        <button className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200">
                            View All Seniors
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
