import { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface UseFilterStateOptions {
    additionalFilters?: Record<string, string>;
    debounceMs?: number;
}

export const useFilterState = (options: UseFilterStateOptions = {}) => {
    const { additionalFilters = {}, debounceMs = 500 } = options;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(
        searchParams.get('search') || '',
    );
    const [searchInput, setSearchInput] = useState(
        searchParams.get('search') || '',
    );
    const [courseFilter, setCourseFilter] = useState(
        searchParams.get('course') || '',
    );
    const [branchFilter, setBranchFilter] = useState(
        searchParams.get('branch') || '',
    );
    const [semesterFilter, setSemesterFilter] = useState(
        searchParams.get('semester') || '',
    );
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [showFilters, setShowFilters] = useState(false);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchInput, debounceMs]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [courseFilter, branchFilter, semesterFilter]);

    // Memoize additional filters to prevent unnecessary re-renders
    const additionalFiltersString = useMemo(
        () => JSON.stringify(additionalFilters),
        [additionalFilters],
    );

    // URL sync effect
    useEffect(() => {
        const params = new URLSearchParams();

        // Add common filters
        if (searchTerm) params.set('search', searchTerm);
        if (courseFilter) params.set('course', courseFilter);
        if (branchFilter) params.set('branch', branchFilter);
        if (semesterFilter) params.set('semester', semesterFilter);
        if (page > 1) params.set('page', page.toString());

        // Add additional filters from pages (like yearFilter, examTypeFilter, etc.)
        Object.entries(additionalFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });

        const newUrl = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;
        router.replace(newUrl, { scroll: false });
    }, [
        searchTerm,
        courseFilter,
        branchFilter,
        semesterFilter,
        page,
        additionalFiltersString,
        pathname,
        router,
    ]);

    const clearFilters = () => {
        setSearchInput('');
        setSearchTerm('');
        setCourseFilter('');
        setBranchFilter('');
        setSemesterFilter('');
        setPage(1);
    };

    const hasActiveFilters =
        searchTerm || courseFilter || branchFilter || semesterFilter;

    return {
        searchTerm,
        setSearchTerm,
        searchInput,
        setSearchInput,
        courseFilter,
        setCourseFilter,
        branchFilter,
        setBranchFilter,
        semesterFilter,
        setSemesterFilter,
        page,
        setPage,
        showFilters,
        setShowFilters,
        clearFilters,
        hasActiveFilters,
        pathname,
        router,
    };
};
