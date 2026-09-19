'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

interface SearchableSelectProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label?: string;
    loading?: boolean;
    errorState?: boolean;
    required?: boolean;
    disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder,
    label = '',
    loading = false,
    errorState = false,
    required = false,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions =
        options?.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || [];

    const selectedOption = options?.find((option) => option.value === value);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className='relative w-full' ref={dropdownRef}>
            {label && (
                <label className='block text-xs font-semibold text-[#0075de] dark:text-[#62aef0] mb-1'>
                    {label}{' '}
                    {required && <span className='text-red-500'>*</span>}
                </label>
            )}

            <div
                className={`relative flex items-center border text-sm ${
                    isOpen
                        ? 'ring-1 ring-[#0075de] border-[#0075de]'
                        : 'border-[#e6e6e6] dark:border-[#383838]'
                } 
        ${errorState ? 'border-red-500' : ''} 
        ${
            disabled
                ? 'bg-[#f6f5f4] opacity-70 cursor-not-allowed dark:bg-[#282828] text-[#8c8883]'
                : 'bg-white dark:bg-[#191919] text-[#101828] dark:text-[#ededed] hover:border-[#0075de]'
        } 
        rounded-lg shadow-xs transition-all`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className='flex-grow px-3 py-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm'>
                    {selectedOption ? (
                        <span className='text-[#101828] dark:text-[#ededed] font-medium'>
                            {selectedOption.label}
                        </span>
                    ) : (
                        <span className='text-[#8c8883] dark:text-[#787672]'>
                            {placeholder}
                        </span>
                    )}
                </div>
                <div className='px-2.5 text-[#8c8883] dark:text-[#787672]'>
                    <Search className='w-3.5 h-3.5' />
                </div>
            </div>

            {isOpen && (
                <div className='absolute z-30 mt-1 w-full bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#383838] rounded-lg shadow-lg max-h-60 overflow-y-auto text-xs sm:text-sm'>
                    <div className='sticky top-0 bg-white dark:bg-[#202020] p-2 border-b border-[#e6e6e6] dark:border-[#383838]'>
                        <input
                            ref={inputRef}
                            autoFocus
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-2.5 py-1.5 border border-[#e6e6e6] dark:border-[#383838] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0075de] bg-[#fcfbf9] dark:bg-[#191919] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] text-xs'
                            placeholder='Search...'
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {loading ? (
                        <div className='py-3 px-3 text-[#8c8883] dark:text-[#787672] text-center text-xs'>
                            Loading...
                        </div>
                    ) : filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`py-2 px-3 hover:bg-[#f6f5f4] dark:hover:bg-[#282828] cursor-pointer transition-colors text-xs sm:text-sm ${
                                    value === option.value
                                        ? 'bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] font-semibold'
                                        : 'text-[#101828] dark:text-[#ededed]'
                                }`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className='py-3 px-3 text-[#8c8883] dark:text-[#787672] text-center text-xs'>
                            No options found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
