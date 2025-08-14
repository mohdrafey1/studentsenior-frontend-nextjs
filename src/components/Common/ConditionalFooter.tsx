"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Common/Footer";

// Exact paths you want to hide footer on
const hideExactPaths = [
    "/integral-university/pyqs",
    "/integral-university/notes",
    "/integral-university/seniors",
    "/integral-university/lost-found",
    "/integral-university/opportunities",
    "/integral-university/store",
    "/integral-university/groups",
    "/profile",
];

// Prefix paths (hide all subpages under these)
const hidePrefixPaths = ["/integral-university/resources"];

export default function ConditionalFooter() {
    const pathname = usePathname();

    const shouldHideFooter =
        hideExactPaths.includes(pathname) ||
        hidePrefixPaths.some((prefix) => pathname.startsWith(prefix));

    if (shouldHideFooter) return null;

    return <Footer />;
}
