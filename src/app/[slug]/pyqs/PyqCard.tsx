"use client";
import React from "react";
import { IPyq } from "@/utils/interface";
import {
    Edit,
    Trash2,
    FileText,
    GraduationCap,
    Calendar,
    Eye,
    Download,
    BookOpen,
} from "lucide-react";
import Link from "next/link";

interface PyqCardProps {
    pyq: IPyq;
    onEdit: (pyq: IPyq) => void;
    onDelete: (pyqId: string) => void;
    ownerId: string;
}

export const PyqCard: React.FC<PyqCardProps> = ({
    pyq,
    onEdit,
    onDelete,
    ownerId,
}) => {
    const isOwner = ownerId === pyq.owner._id;

    return (
        <article
            className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col"
            aria-label={pyq.subject.subjectName}
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />

            {/* Floating Orb Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />

            {/* Header Section */}

            <div className="relative ">
                {/* Owner Actions */}
                {isOwner && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={() => onEdit(pyq)}
                            className="p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors duration-200"
                            aria-label="Edit PYQ"
                        >
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                            onClick={() => onDelete(pyq._id)}
                            className="p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                            aria-label="Delete PYQ"
                        >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 space-y-4">
                {/* Title and Subject */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 line-clamp-2">
                        {pyq.subject.subjectName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <GraduationCap className="w-4 h-4" />
                        <span>{pyq.subject.branch.branchName}</span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-4 h-4" />
                        <span>{pyq.subject.semester} Semester</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{pyq.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FileText className="w-4 h-4" />
                        <span>{pyq.examType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{pyq.clickCounts} views</span>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="flex flex-wrap gap-2">
                    {pyq.solved && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Solved
                        </span>
                    )}
                    {pyq.isPaid && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            ₹{pyq.price / 5}
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0">
                <div className="flex gap-2">
                    <Link
                        href={`/pyq/${pyq.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200 group-hover:shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        View PYQ
                    </Link>
                </div>
            </div>
        </article>
    );
};
