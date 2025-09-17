'use client';

import React from 'react';
import { College } from '@/utils/interface';

interface CollegeAboutProps {
    college: College;
}

export default function CollegeAbout({ college }: CollegeAboutProps) {
    return (
        <section className='py-16 '>
            <div className='container mx-auto px-4'>
                <div className='max-w-4xl mx-auto'>
                    <div className='space-y-6'>
                        <div>
                            <h3 className='text-xl font-fugaz text-center font-semibold text-gray-900 dark:text-white mb-4'>
                                Institution Overview
                            </h3>
                            <p className='text-gray-600 text-center dark:text-gray-300 leading-relaxed'>
                                {college.description ||
                                    `${college.name} is a prestigious educational institution located in ${college.location}. 
                                        The college offers a wide range of academic programs and provides students with 
                                        excellent opportunities for learning and growth. Our community of students and 
                                        faculty work together to create an environment that fosters innovation, creativity, 
                                        and academic excellence.`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
