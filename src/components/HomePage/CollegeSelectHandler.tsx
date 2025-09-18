'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { University } from 'lucide-react';
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
        <div className='w-full max-w-md mx-auto'>
            <div className='relative'>
                <div className='bg-white rounded-2xl border-2 border-blue-200 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-300'>
                    <div className='flex items-center space-x-4'>
                        <div className='flex-shrink-0'>
                            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center'>
                                <University className='text-white ' />
                            </div>
                        </div>

                        <div className='flex-1'>
                            <label
                                htmlFor='college-select'
                                className='block text-sm font-medium text-gray-700 mb-2'
                            >
                                Select Your College
                            </label>
                            <select
                                id='college-select'
                                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 bg-white'
                                value={selectedCollege}
                                onChange={handleChange}
                                disabled={isLoading}
                                aria-label='Choose your college from the dropdown'
                            >
                                <option value=''>
                                    Choose your institution...
                                </option>
                                {colleges.map((college) => {
                                    const displayName =
                                        college.name.length > 40
                                            ? `${college.name.substring(
                                                  0,
                                                  37
                                              )}...`
                                            : college.name;
                                    return (
                                        <option
                                            key={college.slug}
                                            value={college.slug}
                                        >
                                            {displayName}
                                        </option>
                                    );
                                })}
                            </select>

                            {isLoading && (
                                <div className='mt-2 flex items-center text-sm text-blue-600'>
                                    Loading your college...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative glow effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-xl opacity-20 -z-10 animate-pulse'></div>
            </div>

            <p className='text-sm text-gray-500 mt-3 text-center'>
                Cant find your college?{' '}
                <Link
                    href='/add-college'
                    className='text-blue-600 hover:underline'
                >
                    Click here
                </Link>{' '}
                to add it.
            </p>
        </div>
    );
}
