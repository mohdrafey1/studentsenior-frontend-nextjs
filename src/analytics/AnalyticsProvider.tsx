'use client';

import { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { analytics } from './index';
import { staticSegments } from './routes';
import { routeTemplate } from './core';

export default function AnalyticsProvider() {
    const pathname = usePathname();
    const params = useParams();
    const template = routeTemplate(pathname || '/', params, staticSegments);
    useEffect(() => analytics.start(), []);
    useEffect(() => {
        analytics.screen(template, undefined, pathname);
    }, [template, pathname]);
    return null;
}
