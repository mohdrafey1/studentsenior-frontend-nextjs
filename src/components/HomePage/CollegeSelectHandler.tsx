'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Building2, ChevronDown, University } from 'lucide-react';
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
        <div className='relative bg-white dark:bg-gray-700 rounded-full border border-blue-300 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40'>
          <div className='flex items-center w-full px-4'>
            {/* Icon container - Updated to use Lucide */}
            <div className='flex-shrink-0'>
              <Building2 className='h-5 w-5 text-blue-500' strokeWidth={2} />
            </div>

            <div className='flex-1 ml-3'>
              <select
                id='college-select'
                className='w-full bg-transparent py-4 outline-none focus:ring-0 appearance-none dark:text-white text-gray-700 font-medium'
                value={selectedCollege}
                onChange={handleChange}
                disabled={isLoading}
                aria-label='Select Your College'
              >
                <option value='' disabled className='bg-white dark:bg-gray-700 text-gray-800 dark:text-white'>
                  Select Your College
                </option>
                {colleges.map((college) => {
                  const displayName =
                    college.name.length > 40
                      ? `${college.name.substring(0, 37)}...`
                      : college.name;
                  return (
                    <option 
                     key={college.slug} 
                     value={college.slug}
                     className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-4 hover:bg-blue-50 hover:text-blue-700 border-b border-gray-100 last:border-b-0"
                     >
                      {displayName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Custom arrow icon - Updated to use Lucide */}
            <div className='flex-shrink-0'>
              <ChevronDown
                className='h-5 w-5 text-gray-400'
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        <div className='absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-xl opacity-30 -z-10'></div>
      </div>

      <p className='text-sm text-gray-500 mt-4 text-center'>
        Can’t find your college?{' '}
        <a href='/add-college' className='text-blue-600 hover:underline'>
          Click here
        </a>{' '}
        to add it.
      </p>
    </div>
    );
}
