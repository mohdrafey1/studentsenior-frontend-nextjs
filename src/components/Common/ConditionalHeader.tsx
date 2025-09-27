'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Common/Header';

const hideExactPaths = ['/test'];

const hidePrefixPaths = ['/test/'];

export default function ConditionalHeader() {
    const pathname = usePathname();

    const shouldHideHeader =
        hideExactPaths.includes(pathname) ||
        hidePrefixPaths.some((prefix) => pathname.startsWith(prefix));

    if (shouldHideHeader) return null;
    return <Header />;
}
