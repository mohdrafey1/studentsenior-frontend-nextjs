'use client';

import React from 'react';
import { College } from '@/utils/interface';
import { Building2 } from 'lucide-react';

interface CollegeAboutProps {
    college: College;
}

export default function CollegeAbout({ college }: CollegeAboutProps) {
    return (
        <section className='py-14 sm:py-16 bg-[#f6f5f4] dark:bg-[#1f1f1f] border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#262626] text-[#0075de] dark:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] shadow-[0_1px_2px_rgba(0,0,0,0.03)] mb-4'>
                    <Building2 className='w-3.5 h-3.5' />
                    <span>Institution Overview</span>
                </div>
                <h3 className='text-2xl sm:text-3xl font-bold tracking-tight text-[#000000] dark:text-white mb-4'>
                    About {college.name}
                </h3>
                <p className='text-sm sm:text-base text-[#615d59] dark:text-[#b8b5b0] leading-relaxed max-w-3xl mx-auto'>
                    {college.description ||
                        `${college.name} is a renowned educational institution located in ${college.location || 'India'}. The college offers a wide spectrum of academic curricula and fosters an active student and senior community committed to collaborative learning and academic excellence.`}
                </p>
            </div>
        </section>
    );
}

