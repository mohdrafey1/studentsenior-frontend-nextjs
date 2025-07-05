"use client";

import React from "react";
import { GraduationCap, MapPin, Users, BookOpen } from "lucide-react";
import { College } from "@/utils/interface";

interface CollegeHeroProps {
    college: College;
    seniorsCount?: number;
    productsCount?: number;
}

export default function CollegeHero({
    college,
    seniorsCount = 0,
    productsCount = 0,
}: CollegeHeroProps) {
    return (
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 mb-4">
                        <GraduationCap className="w-8 h-8" />
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            {college.name}
                        </h1>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 mb-6">
                        <MapPin className="w-5 h-5" />
                        <p className="text-lg">{college.location}</p>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
                        {college.description ||
                            "Connect with seniors, access study materials, and explore academic resources at this college."}
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <span className="font-semibold">
                                {seniorsCount} Seniors
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="font-semibold">
                                {productsCount} Resources
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
