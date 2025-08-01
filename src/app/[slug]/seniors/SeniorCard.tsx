"use client";
import React from "react";
import { ISenior } from "@/utils/interface";
import { capitalizeWords, formatDate } from "@/utils/formatting";
import {
    Edit,
    Trash2,
    User,
    ExternalLink,
    GraduationCap,
    Calendar,
    Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SeniorCardProps {
    senior: ISenior;
    onEdit: (senior: ISenior) => void;
    onDelete: (seniorId: string) => void;
    ownerId: string;
}

export const SeniorCard: React.FC<SeniorCardProps> = ({
    senior,
    onEdit,
    onDelete,
    ownerId,
}) => {
    const formatSocialMediaLink = (platform: string, url: string) => {
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
        <article
            className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col"
            aria-label={senior.name}
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />

            {/* Floating Orb Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />

            {/* Profile Picture Section */}
            <div className="relative h-52 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 overflow-hidden flex items-center justify-center">
                {/* Decorative Pattern Background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-sky-200 dark:bg-sky-700 rounded-full"></div>
                    <div className="absolute top-8 right-6 w-1 h-1 bg-cyan-200 dark:bg-cyan-700 rounded-full"></div>
                    <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-blue-200 dark:bg-blue-700 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-sky-200 dark:bg-sky-700 rounded-full"></div>
                </div>

                {senior.profilePicture ? (
                    <div className="relative z-10">
                        {/* Image Container with Enhanced Styling */}
                        <div className="relative w-48 h-48 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-xl group-hover:ring-sky-200 dark:group-hover:ring-sky-700 transition-all duration-500">
                            <Image
                                src={senior.profilePicture}
                                alt={senior.name}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                width={200}
                                height={200}
                            />
                            {/* Image Overlay Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-sky-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Decorative Ring */}
                        <div className="absolute -inset-2 rounded-full border border-sky-200/50 dark:border-sky-700/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    </div>
                ) : (
                    <div className="relative z-10 text-center">
                        {/* Enhanced No Photo State */}
                        <div className="relative w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-xl group-hover:ring-sky-200 dark:group-hover:ring-sky-700 transition-all duration-500">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>

                            {/* Decorative Ring */}
                            <div className="absolute -inset-2 rounded-full border border-gray-200/50 dark:border-gray-600/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full backdrop-blur-sm">
                            No Photo
                        </span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Submission Status Badge */}
                {senior.submissionStatus !== "approved" && (
                    <div className="absolute top-3 left-3 z-20">
                        <span
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
                                senior.submissionStatus === "pending"
                                    ? "bg-amber-100/90 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 border border-amber-200/50"
                                    : "bg-red-100/90 text-red-800 dark:bg-red-900/80 dark:text-red-200 border border-red-200/50"
                            }`}
                        >
                            {capitalizeWords(senior.submissionStatus)}
                        </span>
                    </div>
                )}

                {/* Edit/Delete Controls for Owner */}
                {ownerId === senior.owner._id && (
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <button
                            onClick={() => onEdit(senior)}
                            className="p-2 rounded-full bg-amber-50/90 text-amber-600 hover:bg-amber-100/90 dark:bg-amber-900/40 dark:text-amber-400 dark:hover:bg-amber-900/60 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md backdrop-blur-sm"
                            aria-label={`Edit senior: ${senior.name}`}
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(senior._id)}
                            className="p-2 rounded-full bg-red-50/90 text-red-600 hover:bg-red-100/90 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md backdrop-blur-sm"
                            aria-label={`Delete senior: ${senior.name}`}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="relative p-6 flex-grow flex flex-col">
                {/* Name and Year */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-600 dark:group-hover:from-sky-400 dark:group-hover:to-cyan-400 transition-all duration-300 flex-1 mr-3">
                        {senior.name}
                    </h3>
                    <div className="flex items-center bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-3 py-2 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                        <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-1" />
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {senior.year}
                        </span>
                    </div>
                </div>

                {/* Branch and Domain */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                            {senior.branch?.branchName || "Branch"}
                        </span>
                    </div>
                    {senior.domain && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Globe className="w-4 h-4 mr-2" />
                            <span className="text-sm">{senior.domain}</span>
                        </div>
                    )}
                </div>

                {/* Social Media Links */}
                {senior.socialMediaLinks &&
                    senior.socialMediaLinks.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {senior.socialMediaLinks
                                .slice(0, 2)
                                .map((link, index) => (
                                    <a
                                        key={index}
                                        href={formatSocialMediaLink(
                                            link.platform,
                                            link.url
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center group/contact p-2 rounded-lg bg-gray-50/50 hover:bg-sky-50 dark:bg-gray-800/50 dark:hover:bg-sky-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                                    >
                                        <div className="p-1.5 rounded-md bg-sky-100 dark:bg-sky-900/40 group-hover/contact:bg-sky-200 dark:group-hover/contact:bg-sky-800/60 transition-colors duration-200">
                                            <ExternalLink className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                                        </div>
                                        <span className="ml-2 text-xs text-gray-700 dark:text-gray-300 group-hover/contact:text-sky-700 dark:group-hover/contact:text-sky-300 transition-colors duration-200 font-medium">
                                            {capitalizeWords(link.platform)}
                                        </span>
                                    </a>
                                ))}
                            {senior.socialMediaLinks.length > 2 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    +{senior.socialMediaLinks.length - 2} more
                                    links
                                </div>
                            )}
                        </div>
                    )}

                {/* Gradient Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-4" />

                {/* Footer Section */}
                <div className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-2 text-xs">
                            <time className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                Joined on {formatDate(senior.createdAt)}
                            </time>
                        </div>
                    </div>

                    <Link
                        href={`seniors/${senior.slug}`}
                        className="group/cta relative inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02] overflow-hidden"
                    >
                        {/* Button Background Animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-500 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />

                        <span className="relative flex items-center">
                            View Profile
                            <ExternalLink className="w-4 h-4 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300" />
                        </span>
                    </Link>
                </div>
            </div>
        </article>
    );
};
