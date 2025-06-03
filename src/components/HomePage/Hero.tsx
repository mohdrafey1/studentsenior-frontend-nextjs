import { Circle } from "lucide-react";
import React from "react";

const Hero = () => {
    return (
        <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {" "}
                    Academic Journey
                </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Connect with seniors, access premium study resources, and
                accelerate your college success with India's most trusted
                student platform.
            </p>

            {/* Key benefits */}
            <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center space-x-2 text-sm md:text-base text-gray-700">
                    <Circle />
                    <span>Free PYQ Access</span>
                </div>
                <div className="flex items-center space-x-2 text-sm md:text-base text-gray-700">
                    <Circle />
                    <span>Expert Mentorship</span>
                </div>
                <div className="flex items-center space-x-2 text-sm md:text-base text-gray-700">
                    <Circle />
                    <span>Active Community</span>
                </div>
            </div>
        </div>
    );
};

export default Hero;
