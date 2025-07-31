import { IOpportunity } from "@/utils/interface";
import {
    Mail,
    Phone,
    Link as LinkIcon,
    Edit2,
    Trash2,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";

export const OpportunityCard = ({
    opportunity,
    openModal,
    handleDeleteRequest,
    ownerId,
    collegeName,
}: {
    opportunity: IOpportunity;
    openModal: (opportunity: IOpportunity) => void;
    handleDeleteRequest: (opportunityId: string) => void;
    ownerId: string;
    collegeName: string;
}) => (
    <article
        className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-2xl transition-all duration-500 p-0 flex flex-col h-full overflow-hidden backdrop-blur-sm"
        aria-label={opportunity.name}
    >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />

        {/* Floating Orb Effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />

        {/* Header Section */}
        <div className="relative p-6">
            <div className="flex items-start justify-between">
                <Link
                    href={`/${collegeName}/opportunities/${opportunity.slug}`}
                    className="block group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-all duration-300 flex-1 mr-3"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-600 dark:group-hover:from-sky-400 dark:group-hover:to-cyan-400 transition-all duration-300">
                        {opportunity.name}
                    </h2>
                </Link>
                {ownerId === opportunity.owner?._id && (
                    <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={() => openModal(opportunity)}
                            className="p-2 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                            aria-label={`Edit opportunity: ${opportunity.name}`}
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteRequest(opportunity._id)}
                            className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                            aria-label={`Delete opportunity: ${opportunity.name}`}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                {opportunity.description}
            </p>
        </div>

        {/* Contact Information Section */}
        <div className="relative px-6 flex-grow">
            <div className="space-y-3">
                {opportunity.email && (
                    <a
                        href={`mailto:${opportunity.email}`}
                        className="flex items-center group/contact p-3 rounded-xl bg-gray-50/50 hover:bg-sky-50 dark:bg-gray-800/50 dark:hover:bg-sky-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                    >
                        <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/40 group-hover/contact:bg-sky-200 dark:group-hover/contact:bg-sky-800/60 transition-colors duration-200">
                            <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        </div>
                        <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover/contact:text-sky-700 dark:group-hover/contact:text-sky-300 transition-colors duration-200 truncate font-medium">
                            {opportunity.email}
                        </span>
                    </a>
                )}
                {opportunity.whatsapp && (
                    <a
                        href={`https://wa.me/${opportunity.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center group/contact p-3 rounded-xl bg-gray-50/50 hover:bg-green-50 dark:bg-gray-800/50 dark:hover:bg-green-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                    >
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40 group-hover/contact:bg-green-200 dark:group-hover/contact:bg-green-800/60 transition-colors duration-200">
                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover/contact:text-green-700 dark:group-hover/contact:text-green-300 transition-colors duration-200 truncate font-medium">
                            {opportunity.whatsapp}
                        </span>
                    </a>
                )}
                {opportunity.link && (
                    <a
                        href={opportunity.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center group/contact p-3 rounded-xl bg-gray-50/50 hover:bg-blue-50 dark:bg-gray-800/50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                    >
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 group-hover/contact:bg-blue-200 dark:group-hover/contact:bg-blue-800/60 transition-colors duration-200">
                            <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover/contact:text-blue-700 dark:group-hover/contact:text-blue-300 transition-colors duration-200 truncate font-medium">
                            View External Link
                        </span>
                    </a>
                )}
            </div>
        </div>

        {/* Footer Section */}
        <div className="relative mt-auto">
            {/* Gradient Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-4" />

            <div className="px-6 pb-6">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
                            {(opportunity.owner?.username ||
                                "A")[0].toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Posted By
                        </span>
                        <span className="font-medium">
                            {opportunity.owner?.username || "Anonymous"}
                        </span>
                    </div>
                    <time className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                        {new Date(opportunity.createdAt).toLocaleDateString()}
                    </time>
                </div>

                <Link
                    href={`/${collegeName}/opportunities/${opportunity.slug}`}
                    className="group/cta relative inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02] overflow-hidden"
                >
                    {/* Button Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-500 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />

                    <span className="relative flex items-center">
                        View Details
                        <ExternalLink className="w-4 h-4 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300" />
                    </span>
                </Link>
            </div>
        </div>
    </article>
);
