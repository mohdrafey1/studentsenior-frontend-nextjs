"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Common/Header";

const hideOnPaths = ["/collections"];

export default function ConditionalHeader() {
    const pathname = usePathname();

    // You can adjust this logic to use startsWith if needed
    const shouldHideHeader = hideOnPaths.some((path) =>
        pathname.startsWith(path)
    );

    if (shouldHideHeader) return null;
    return <Header />;
}
