import React from 'react';
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    XIcon,
    TrendingUp,
} from 'lucide-react';
import { ViewToggle } from './ViewToggle';

interface ResourcePageHeaderProps {
    searchInput: string;
    setSearchInput: (value: string) => void;
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
    hasActiveFilters: boolean;
    activeFilterCount?: number;
    clearFilters: () => void;
    onAdd?: () => void;
    onShowEarning?: () => void;
    addButtonText: string;
    searchPlaceholder: string;
    viewMode: 'list' | 'grid';
    setViewMode: (mode: 'list' | 'grid') => void;
}

export const ResourcePageHeader: React.FC<ResourcePageHeaderProps> = ({
    searchInput,
    setSearchInput,
    showFilters,
    setShowFilters,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
    onAdd,
    onShowEarning,
    addButtonText,
    searchPlaceholder,
    viewMode,
    setViewMode,
}) => {
    return (
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
            <div className='flex items-center gap-2 sm:gap-3'>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#202020] hover:bg-[#f6f5f4] dark:hover:bg-[#282828] text-[#101828] dark:text-[#ededed] font-medium text-xs sm:text-sm rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-xs transition-colors'
                >
                    <FilterIcon className='w-4 h-4 text-[#615d59] dark:text-[#a09e9a]' />
                    <span>Filters</span>
                    {hasActiveFilters &&
                        activeFilterCount !== undefined &&
                        activeFilterCount > 0 && (
                            <span className='inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold bg-[#0075de] text-white rounded-full'>
                                {activeFilterCount}
                            </span>
                        )}
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className='inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#fff1f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185] border border-[#fecdd3] dark:border-[#5c2328] hover:bg-[#ffe4e6] dark:hover:bg-[#4c0519] transition-colors'
                    >
                        <XIcon className='w-3.5 h-3.5' />
                        <span>Clear</span>
                    </button>
                )}
            </div>

            <div className='relative flex-grow'>
                <div className='flex items-center gap-2.5 w-full px-3 py-2 border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg shadow-xs focus-within:ring-1 focus-within:ring-[#0075de] focus-within:border-[#0075de] bg-white dark:bg-[#202020] text-[#101828] dark:text-[#ededed] transition-all'>
                    <SearchIcon className='w-4 h-4 text-[#8c8883] dark:text-[#787672] flex-shrink-0' />
                    <input
                        type='text'
                        placeholder={searchPlaceholder}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className='w-full bg-transparent outline-none text-xs sm:text-sm text-[#101828] dark:text-white placeholder-[#8c8883] dark:placeholder-[#787672]'
                    />
                </div>
            </div>

            <div className='flex items-center gap-2'>
                {onShowEarning && (
                    <button
                        onClick={onShowEarning}
                        className='inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] hover:bg-[#d8f2dc] dark:hover:bg-[#1c472a] rounded-lg transition-colors shadow-xs'
                        title='Learn how to earn points'
                    >
                        <TrendingUp className='w-3.5 h-3.5' />
                        <span>How to Earn</span>
                    </button>
                )}

                {onAdd && (
                    <button
                        onClick={onAdd}
                        className='inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                    >
                        <PlusIcon className='w-4 h-4' />
                        <span>{addButtonText}</span>
                    </button>
                )}
                {/* View Mode Toggle */}
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
        </div>
    );
};
