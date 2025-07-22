"use client";

import React from "react";
import { MapPin, Calendar, Users } from "lucide-react";
import { College } from "@/utils/interface";

interface CollegeAboutProps {
    college: College;
}

export default function CollegeAbout({ college }: CollegeAboutProps) {
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            About {college.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Learn more about this institution and connect with
                            the student community
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Institution Overview
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {college.description ||
                                        `${college.name} is a prestigious educational institution located in ${college.location}. 
                                        The college offers a wide range of academic programs and provides students with 
                                        excellent opportunities for learning and growth. Our community of students and 
                                        faculty work together to create an environment that fosters innovation, creativity, 
                                        and academic excellence.`}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Why Choose {college.name}?
                                </h3>
                                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>
                                            Experienced faculty and modern
                                            teaching methodologies
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>
                                            State-of-the-art facilities and
                                            infrastructure
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>
                                            Strong industry connections and
                                            placement support
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>
                                            Vibrant campus life and
                                            extracurricular activities
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm dark:shadow-gray-900/20">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Quick Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                Location
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {college.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                Established
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {new Date(
                                                    college.createdAt
                                                ).getFullYear()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                Student Community
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Active and growing
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm dark:shadow-gray-900/20">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Get Connected
                                </h3>
                                <div className="space-y-4">
                                    <button className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-medium">
                                        Join Student Community
                                    </button>
                                    <button className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 font-medium">
                                        Contact Institution
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
