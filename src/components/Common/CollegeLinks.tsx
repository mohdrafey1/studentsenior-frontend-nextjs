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
            icon: <Landmark size={22} />, // College
            text: "College",
        },
        {
            href: `/${slug}/resources`,
            icon: <StickyNote size={22} />, // Resources
            text: "Resources",
        },
        {
            href: `/${slug}/pyq`,
            icon: <Zap size={22} />, // PYQs
            text: "PYQs",
        },
        {
            href: `/${slug}/notes`,
            icon: <StickyNote size={22} />, // Notes
            text: "Notes",
        },
        {
            href: `/${slug}/seniors`,
            icon: <User size={22} />, // Seniors
            text: "Seniors",
        },
        {
            href: `/${slug}/store`,
            icon: <Store size={22} />, // Store
            text: "Store",
        },
        {
            href: `/${slug}/community`,
            icon: <Users size={22} />, // Community
            text: "Community",
        },
        {
            href: `/${slug}/whatsapp-group`,
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
            icon: <Compass size={22} />, // Lost/Found
            text: "Lost/Found",
        },
    ];

    return (
        <section className="hidden lg:flex justify-center items-center text-center my-10 px-4">
            <div className="bg-white border-radius-38 border-2 border-sky-500 grid grid-cols-5 xl:grid-cols-10 text-center px-2 sm:px-10 py-6 gap-10 text-base sm:gap-4 sm:text-lg md:gap-6 md:text-xl lg:gap-7 xl:gap-9">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.href}
                        className={`rounded-xl hover:bg-sky-100 w-28 px-4 py-2 transition-colors duration-300 ${
                            pathname === link.href ? "bg-sky-100" : ""
                        }`}
                    >
                        <div className="flex flex-col items-center text-base">
                            {link.icon}
                            <p>{link.text}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Collegelinks;
