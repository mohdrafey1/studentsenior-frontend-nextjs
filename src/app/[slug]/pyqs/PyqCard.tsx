"use client";
import React, { useEffect, useState } from "react";
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
import { useSaveResource } from "@/hooks/useSaveResource";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
    const { saveResource, unsaveResource } = useSaveResource();
    const [isSaved, setIsSaved] = useState(false);

    const { savedPYQs } = useSelector(
        (state: RootState) => state.savedCollection
    );

    useEffect(() => {
        const isSavedEntry = savedPYQs.some((entry) =>
            typeof entry.pyqId === "string"
                ? entry.pyqId === pyq._id
                : entry.pyqId._id === pyq._id
        );
        setIsSaved(isSavedEntry);
    }, [savedPYQs, pyq._id]);

    const handleSave = async () => {
        await saveResource("pyq", pyq._id);
    };

    const handleUnsave = async () => {
        await unsaveResource("pyq", pyq._id);
    };

    return (
        <article
            className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col"
            aria-label={pyq.subject.subjectName}
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />

            {/* Floating Orb Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />

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
            <div className="p-6 pt-0 z-40">
                <div className="flex gap-2">
                    <Link
                        href={`pyqs/${pyq.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200 group-hover:shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        View PYQ
                    </Link>
                    <button
                        className="w-1/6 h-10 flex items-center justify-center py-2 px-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm hover:shadow"
                        onClick={() => {
                            if (isSaved) {
                                handleUnsave();
                            } else {
                                handleSave();
                            }
                        }}
                        title={isSaved ? "Unsave this PYQ" : "Save this PYQ"}
                        aria-label={
                            isSaved ? "Unsave this PYQ" : "Save this PYQ"
                        }
                    >
                        <svg
                            className="w-5 h-5"
                            fill={isSaved ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                color: isSaved ? "#3B82F6" : "#9CA3AF",
                            }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            ></path>
                        </svg>
                    </button>

                    {isOwner && (
                        <>
                            {pyq.solved && (
                                <button
                                    onClick={() => onEdit(pyq)}
                                    aria-label="Edit PYQ"
                                    className="p-3 rounded-lg bg-yellow-200 text-white dark:bg-yellow-900"
                                >
                                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(pyq._id)}
                                aria-label="Delete PYQ"
                                className="p-3 rounded-lg bg-red-200 text-white dark:bg-red-900"
                            >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                        </>
                    )}
                </div>

                {/* Owner Actions */}
            </div>
        </article>
    );
};
