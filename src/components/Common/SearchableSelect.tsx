"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

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
    label = "",
    loading = false,
    errorState = false,
    required = false,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
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
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions =
        options?.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const selectedOption = options?.find((option) => option.value === value);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && (
                <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div
                className={`relative flex items-center border ${
                    isOpen
                        ? "ring-2 ring-sky-400 border-transparent"
                        : "border-gray-300 dark:border-gray-700"
                } 
        ${errorState ? "border-red-500" : ""} 
        ${
            disabled
                ? "bg-gray-100 opacity-70 dark:bg-gray-700 dark:text-gray-100"
                : "bg-white dark:bg-gray-700 dark:text-gray-100"
        } 
        rounded-lg overflow-hidden`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex-grow p-3 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                    {selectedOption ? selectedOption.label : placeholder}
                </div>
                <div className="px-3 text-gray-400 dark:text-gray-400">
                    <Search className="w-4 h-4" />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
                        <input
                            ref={inputRef}
                            autoFocus
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Search..."
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {loading ? (
                        <div className="py-3 px-4 text-gray-500 dark:text-gray-400 text-center">
                            Loading...
                        </div>
                    ) : filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`py-3 px-4 hover:bg-sky-50 dark:hover:bg-sky-900 dark:hover:text-sky-100 cursor-pointer ${
                                    value === option.value
                                        ? "bg-sky-100 dark:bg-sky-900 dark:text-sky-100"
                                        : ""
                                }`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="py-3 px-4 text-gray-500 dark:text-gray-400 text-center">
                            No options found. Try a different search term.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
