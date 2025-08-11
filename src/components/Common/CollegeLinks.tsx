"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
    Landmark,
    StickyNote,
    Zap,
    User,
    Store,
    Users,
    MessageCircle,
    Search,
    Compass,
} from "lucide-react";

const Collegelinks = () => {
    const { slug } = useParams();
    const pathname = usePathname();

    const links = [
        {
            href: `/${slug}`,
            icon: <Landmark size={20} />,
            text: "College",
        },

        {
            href: `/${slug}/pyqs`,
            icon: <Zap size={20} />,
            text: "PYQs",
        },
        {
            href: `/${slug}/notes`,
            icon: <StickyNote size={20} />,
            text: "Notes",
        },
        {
            href: `/${slug}/store`,
            icon: <Store size={20} />,
            text: "Store",
        },
        {
            href: `/${slug}/seniors`,
            icon: <User size={20} />,
            text: "Seniors",
        },

        {
            href: `/${slug}/resources`,
            icon: <StickyNote size={20} />,
            text: "Resources",
        },
        {
            href: `/${slug}/community`,
            icon: <Users size={20} />,
            text: "Community",
        },
        {
            href: `/${slug}/groups`,
            icon: <MessageCircle size={20} />,
            text: "Groups",
        },
        {
            href: `/${slug}/opportunities`,
            icon: <Search size={20} />,
            text: "Opportunity",
        },
        {
            href: `/${slug}/lost-found`,
            icon: <Compass size={20} />,
            text: "Lost/Found",
        },
    ];

    return (
        <div className="hidden lg:flex sticky top-16 z-20 w-full bg-white dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <nav className="py-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 xl:grid-cols-10 gap-1 sm:gap-2">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className={`group flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                                    pathname === link.href
                                        ? "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400"
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="transition-colors duration-200">
                                        {link.icon}
                                    </span>
                                    <span className="text-sm font-medium hidden sm:inline">
                                        {link.text}
                                    </span>
                                    <span className="text-xs font-medium sm:hidden">
                                        {link.text}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Collegelinks;
