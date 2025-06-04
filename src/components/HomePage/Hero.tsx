import { Circle } from "lucide-react";
import React from "react";

const Hero = () => {
    return (
        <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Transform Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    {" "}
                    Academic Journey
                </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Connect with seniors, access premium study resources, and
                accelerate your college success with India&apos;s most trusted
                student platform.
            </p>

            {/* Key benefits */}
            <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center space-x-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Circle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Free PYQ Access</span>
                </div>
                <div className="flex items-center space-x-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Circle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Expert Mentorship</span>
                </div>
                <div className="flex items-center space-x-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Circle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Active Community</span>
                </div>
            </div>
        </div>
    );
};

export default Hero;
