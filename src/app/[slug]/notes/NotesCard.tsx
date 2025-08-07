import React from "react";
import Link from "next/link";
import { INote } from "@/utils/interface";
import {
    FileText,
    Edit2,
    Trash2,
    Download,
    Lock,
    Calendar,
    BookOpen,
} from "lucide-react";
import Image from "next/image";

interface NotesCardProps {
    note: INote;
    onEdit: (note: INote) => void;
    onDelete: (noteId: string) => void;
    ownerId: string;
}

export const NotesCard: React.FC<NotesCardProps> = ({
    note,
    onEdit,
    onDelete,
    ownerId,
}) => {
    const isOwner = note.owner._id === ownerId;

    return (
        <article
            className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-emerald-300/60 dark:hover:border-emerald-600/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col"
            aria-label={note.title}
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-400/10 dark:via-teal-400/10 dark:to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />

            {/* Floating Orb Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />

            {/* Content Section */}
            <div className="flex-1 p-6 space-y-4">
                {/* Title and Description */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
                        {note.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {note.description}
                    </p>
                </div>

                {/* Subject Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="w-4 h-4" />
                    <span>{note.subject.subjectName}</span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-4 h-4" />
                        <span>Semester {note.subject.semester}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Owner Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex-shrink-0">
                        {note.owner.profilePicture ? (
                            <Image
                                src={note.owner.profilePicture}
                                alt={note.owner.username}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                {note.owner.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {note.owner.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Author
                        </p>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="flex flex-wrap gap-2">
                    {note.isPaid && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            <Lock className="w-3 h-3" />
                            {note.price} points
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 z-40">
                <div className="flex gap-2">
                    <Link
                        href={`notes/${note.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 group-hover:shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        View Note
                    </Link>

                    {isOwner && (
                        <>
                            <button
                                onClick={() => onEdit(note)}
                                aria-label="Edit Note"
                                className="p-3 rounded-lg bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 transition-colors duration-200"
                            >
                                <Edit2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            </button>
                            <button
                                onClick={() => onDelete(note._id)}
                                aria-label="Delete Note"
                                className="p-3 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition-colors duration-200"
                            >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};

export default NotesCard;
