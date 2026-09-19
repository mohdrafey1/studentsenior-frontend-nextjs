import React from 'react';
import { Grid3X3, List } from 'lucide-react';

interface ViewToggleProps {
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
    viewMode,
    setViewMode,
}) => {
    return (
        <div className='flex justify-end'>
            <div className='flex bg-[#f6f5f4] dark:bg-[#282828] rounded-lg p-0.5 border border-[#e6e6e6] dark:border-[#383838]'>
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 rounded-md transition-all ${
                        viewMode === 'grid'
                            ? 'bg-white dark:bg-[#191919] text-[#0075de] dark:text-[#62aef0] shadow-xs'
                            : 'text-[#8c8883] dark:text-[#787672] hover:text-[#101828] dark:hover:text-white'
                    }`}
                    aria-label='Grid view'
                    title='Grid view'
                >
                    <Grid3X3 className='w-4 h-4' />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded-md transition-all ${
                        viewMode === 'list'
                            ? 'bg-white dark:bg-[#191919] text-[#0075de] dark:text-[#62aef0] shadow-xs'
                            : 'text-[#8c8883] dark:text-[#787672] hover:text-[#101828] dark:hover:text-white'
                    }`}
                    aria-label='List view'
                    title='List view'
                >
                    <List className='w-4 h-4' />
                </button>
            </div>
        </div>
    );
};
