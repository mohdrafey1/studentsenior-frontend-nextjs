import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useFilterState = () => {
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
