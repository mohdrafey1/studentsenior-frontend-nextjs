"use client";
import React from "react";
import { ISenior } from "@/utils/interface";
import { capitalizeWords } from "@/utils/formatting";
import {
    ExternalLink,
    GraduationCap,
    Calendar,
    Globe,
    User,
    MessageCircle,
    Phone,
    MapPin,
} from "lucide-react";
import Image from "next/image";
import DetailPageNavbar from "@/components/Common/DetailPageNavbar";

interface SeniorDetailClientProps {
    senior: ISenior;
    collegeName: string;
}

const SeniorDetailClient: React.FC<SeniorDetailClientProps> = ({
    senior,
    collegeName,
}) => {
    const getSocialMediaIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "whatsapp":
                return <Phone className="w-4 h-4" />;
            case "telegram":
                return <MessageCircle className="w-4 h-4" />;
            case "instagram":
                return <ExternalLink className="w-4 h-4" />;
            case "linkedin":
                return <ExternalLink className="w-4 h-4" />;
            case "facebook":
                return <ExternalLink className="w-4 h-4" />;
            case "twitter":
                return <ExternalLink className="w-4 h-4" />;
            case "youtube":
                return <ExternalLink className="w-4 h-4" />;
            case "github":
                return <ExternalLink className="w-4 h-4" />;
            default:
                return <ExternalLink className="w-4 h-4" />;
        }
    };

    const getSocialMediaColor = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "whatsapp":
                return "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400";
            case "telegram":
                return "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400";
            case "instagram":
                return "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400";
            case "linkedin":
                return "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400";
            case "facebook":
                return "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400";
            case "twitter":
                return "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400";
            case "youtube":
                return "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400";
            case "github":
                return "bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400";
            default:
                return "bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400";
        }
    };

    const getSocialMediaUrl = (platform: string, url: string) => {
        switch (platform) {
            case "whatsapp":
                return `https://wa.me/${url}`;
            case "telegram":
                return `https://t.me/${url}`;
            default:
                return url;
        }
    };

    return (
        <>
            <DetailPageNavbar
                path="seniors"
                fullPath={`/${collegeName}/seniors`}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Content */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="relative h-64 md:h-80 bg-gradient-to-br from-sky-500 to-cyan-500">
                        {senior.profilePicture ? (
                            <Image
                                src={senior.profilePicture}
                                alt={senior.name}
                                className="w-full h-full object-cover"
                                width={800}
                                height={400}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-500">
                                <div className="text-center text-white">
                                    <User className="w-16 h-16 mx-auto mb-4 opacity-80" />
                                    <h1 className="text-2xl font-bold">
                                        {senior.name}
                                    </h1>
                                </div>
                            </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {/* Status Badge */}
                        {senior.submissionStatus !== "approved" && (
                            <div className="absolute top-4 left-4">
                                <span
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg ${
                                        senior.submissionStatus === "pending"
                                            ? "bg-amber-100/90 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 border border-amber-200/50"
                                            : "bg-red-100/90 text-red-800 dark:bg-red-900/80 dark:text-red-200 border border-red-200/50"
                                    }`}
                                >
                                    {capitalizeWords(senior.submissionStatus)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8">
                        {/* Title and Basic Info */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {senior.name}
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Branch
                                        </p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {senior.branch?.branchName ||
                                                "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Year
                                        </p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {senior.year}
                                        </p>
                                    </div>
                                </div>

                                {senior.domain && (
                                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Domain
                                            </p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {senior.domain}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {senior.description && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    About
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {senior.description}
                                </p>
                            </div>
                        )}

                        {/* Social Media Links */}
                        {senior.socialMediaLinks &&
                            senior.socialMediaLinks.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Connect
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {senior.socialMediaLinks.map(
                                            (link, index) => (
                                                <a
                                                    key={index}
                                                    href={getSocialMediaUrl(
                                                        link.platform,
                                                        link.url
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                                >
                                                    <div
                                                        className={`p-2 rounded-lg mr-3 ${getSocialMediaColor(
                                                            link.platform
                                                        )} group-hover:scale-110 transition-transform`}
                                                    >
                                                        {getSocialMediaIcon(
                                                            link.platform
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {capitalizeWords(
                                                                link.platform
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                            {link.url}
                                                        </p>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                                                </a>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Footer Info */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-4">
                                    <span>
                                        {senior.college?.name || collegeName}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {senior.clickCount || 0} views
                                    </span>
                                    <span>
                                        {new Date(
                                            senior.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SeniorDetailClient;
