'use client';
import { useRef, useCallback } from 'react';
import { SearchTracker, searchTotal } from './search';
import { analytics } from './index';
export function useSearchTracker(
    scope: string,
    query: string,
    skipInitial = false,
) {
    const tracker = useRef<SearchTracker | null>(null);
    if (!tracker.current)
        tracker.current = new SearchTracker(query, skipInitial);
    tracker.current.update(query);
    return useCallback(
        (settledQuery: string, pagination?: unknown) => {
            const props = tracker.current?.settle(
                settledQuery,
                searchTotal(pagination),
            );
            if (props) analytics.track('search', { scope, ...props });
        },
        [scope],
    );
}
