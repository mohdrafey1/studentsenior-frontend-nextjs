'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Building2, ChevronDown } from 'lucide-react';
import Link from 'next/link';

type College = {
    name: string;
    slug: string;
};

interface CollegeSelectHandlerProps {
    colleges: College[];
}

export default function CollegeSelectHandler({
    colleges,
}: CollegeSelectHandlerProps) {
    const [selectedCollege, setSelectedCollege] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCollege(value);

        if (value) {
            setIsLoading(true);
            try {
                await router.push(`/${value}`);
            } catch (error) {
                toast.error('Failed to navigate. Please try again.');
                console.log(error);
                setIsLoading(false);
            }
        } else {
            toast.error('Please select a college!');
        }
    };

    return (
        <div className='w-full max-w-lg mx-auto'>
            <div className='relative'>
                <div className='relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.03)] dark:shadow-none transition-all duration-200 hover:border-[#d0d0d0] dark:hover:border-[#404040] focus-within:border-[#0075de] focus-within:ring-3 focus-within:ring-[#0075de]/15'>
                    <div className='flex items-center w-full px-4 py-1'>
                        {/* Icon container */}
                        <div className='flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#0075de] dark:text-[#62aef0]'>
                            <Building2
                                className='h-4 w-4'
                                strokeWidth={2.2}
                            />
                        </div>

                        <div className='flex-1 ml-3'>
                            <select
                                id='college-select'
                                className='w-full bg-transparent py-3.5 outline-none focus:ring-0 appearance-none text-[#000000] dark:text-[#f0f0f0] text-[15px] font-medium cursor-pointer'
                                value={selectedCollege}
                                onChange={handleChange}
                                disabled={isLoading}
                                aria-label='Select Your College'
                            >
                                <option
                                    value=''
                                    disabled
                                    className='bg-white dark:bg-[#202020] text-[#615d59] dark:text-[#a39e98]'
                                >
                                    Select Your College...
                                </option>
                                {colleges.map((college) => {
                                    const displayName =
                                        college.name.length > 42
                                            ? `${college.name.substring(0, 40)}...`
                                            : college.name;
                                    return (
                                        <option
                                            key={college.slug}
                                            value={college.slug}
                                            className='bg-white dark:bg-[#202020] text-[#000000] dark:text-[#f0f0f0] py-2'
                                        >
                                            {displayName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Custom arrow icon */}
                        <div className='flex-shrink-0 pl-2 pointer-events-none'>
                            <ChevronDown
                                className='h-4 w-4 text-[#615d59] dark:text-[#a39e98]'
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a39e98] mt-3.5 text-center'>
                Can’t find your college?{' '}
                <Link
                    prefetch={false}
                    href='/add-college'
                    className='text-[#0075de] dark:text-[#62aef0] hover:underline font-medium'
                >
                    Click here
                </Link>{' '}
                to add it.
            </p>
        </div>
    );
}

