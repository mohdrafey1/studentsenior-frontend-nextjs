"use client";

import React, { useState } from "react";
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
    Menu,
    X,
} from "lucide-react";

const Collegelink2 = () => {
    const { slug } = useParams();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleMore = () => {
        setIsOpen(!isOpen);
    };

    const mainLinks = [
        {
            href: `/${slug}`,
            icon: <Landmark size={22} />, // College
            text: "College",
        },
        {
            href: `/${slug}/resources`,
            icon: <Zap size={22} />, // Resources
            text: "Resources",
        },
        {
            href: `/${slug}/store`,
            icon: <Store size={22} />, // Store
            text: "Store",
        },
        {
            href: `/${slug}/pyq`,
            icon: <StickyNote size={22} />, // PYQs
            text: "PYQs",
        },
    ];

    const moreLinks = [
        {
            href: `/${slug}/seniors`,
            icon: <User size={22} />, // Seniors
            text: "Seniors",
        },
        {
            href: `/${slug}/groups`,
            icon: <MessageCircle size={22} />, // Groups
            text: "Groups",
        },
        {
            href: `/${slug}/opportunities`,
            icon: <Search size={22} />, // Opportunity
            text: "Opportunity",
        },
        {
            href: `/${slug}/lost-found`,
            icon: <Compass size={22} />, // Lost Found
            text: "Lost Found",
        },
        {
            href: `/${slug}/community`,
            icon: <Users size={22} />, // Community
            text: "Community",
        },
        {
            href: `/${slug}/notes`,
            icon: <StickyNote size={22} />, // Notes
            text: "Notes",
        },
    ];

    return (
        <section className="lg:hidden min-w-full flex justify-center items-center text-center my-7`">
            {/* Fixed Bottom Navigation Bar */}
            <div className="fixed z-30 bottom-0 rounded-t-2xl bg-sky-300 dark:bg-gray-900 inline-flex justify-around items-center text-center w-full py-2">
                {mainLinks.map((link, index) => (
                    <Link
                        key={index}
                        href={link.href}
                        className={`rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900 px-3 py-2 ${
                            pathname === link.href
                                ? "bg-sky-100 dark:bg-sky-900"
                                : ""
                        }`}
                    >
                        <div className="flex flex-col items-center min-w-full text-sm">
                            {link.icon}
                            <p className="text-gray-700 dark:text-white">
                                {link.text}
                            </p>
                        </div>
                    </Link>
                ))}
                {/* More Button */}
                <div
                    onClick={handleMore}
                    className="rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900 px-3 py-2 cursor-pointer"
                >
                    <div className="flex flex-col items-center text-sm">
                        {isOpen ? (
                            <X
                                size={22}
                                className="text-gray-700 dark:text-white"
                            />
                        ) : (
                            <Menu
                                size={22}
                                className="text-gray-700 dark:text-white"
                            />
                        )}
                        <p className="text-gray-700 dark:text-white">
                            {isOpen ? "Close" : "More"}
                        </p>
                    </div>
                </div>
            </div>

            {/* More Menu (Overlay) */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-20 bg-opacity-75 dark:bg-opacity-90">
                    <ul
                        className={`bg-sky-300 dark:bg-gray-900 rounded-b-2xl absolute right-0.5 top-0 z-20 py-3 w-full transition-all duration-700 ease-in-out transform ${
                            isOpen
                                ? "opacity-100 translate-y-0"
                                : "max-h-0 opacity-0 -translate-y-10"
                        }`}
                    >
                        {moreLinks.map((link, index) => (
                            <li
                                key={index}
                                className="flex justify-center mb-2"
                            >
                                <Link
                                    href={link.href}
                                    className={`rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900 px-4 py-2 text-center w-11/12 ${
                                        pathname === link.href
                                            ? "bg-sky-100 dark:bg-sky-900"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-center space-x-2 text-base font-medium">
                                        {link.icon}
                                        <p className="text-gray-700 dark:text-white">
                                            {link.text}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default Collegelink2;
