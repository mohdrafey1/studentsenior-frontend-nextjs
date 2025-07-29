"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Common/Footer";

const hideOnPaths = ["/collections"];

export default function ConditionalFooter() {
    const pathname = usePathname();

    // You can adjust this logic to use startsWith if needed
    const shouldHideFooter = hideOnPaths.some((path) =>
        pathname.startsWith(path)
    );

    if (shouldHideFooter) return null;
    return <Footer />;
}
