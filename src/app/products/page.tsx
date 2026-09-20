import { api } from '@/config/apiUrls';
import React from 'react';
import ProductList from './ProductList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Recommended Products - Student Senior',
    description:
        'Curated course books, study gadgets, stationery, and tools recommended by college seniors to help you ace your semester.',
    openGraph: {
        title: 'Student Store & Course Essentials - Student Senior',
        description:
            'Curated list of books, study gadgets, and tools handpicked by college seniors.',
        type: 'website',
    },
};

interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    buyLink: string;
    category: string;
    tags: string[];
    isActive: boolean;
}

async function getProducts() {
    try {
        const res = await fetch(`${api.affiliateProducts.getAll}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, data: [] };
    }
}

export default async function ProductsPage() {
    const data = await getProducts();
    const products: IProduct[] = data?.data?.data || [];

    return (
        <main className='min-h-screen bg-white dark:bg-[#191919] text-[#101828] dark:text-[#ededed]'>
            {/* Hero Section */}
            <section className='relative bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-16 px-4 sm:px-6 lg:px-8'>
                {/* Dot Mesh Pattern */}
                <div className='absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.15] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:24px_24px]'></div>

                <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center'>
                    {/* Eyebrow Badge */}
                    {/* <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#262626] text-[#0075de] dark:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] shadow-[0_1px_2px_rgba(0,0,0,0.03)] mb-5'>
                        <ShoppingBag className='w-3.5 h-3.5' />
                        <span>Curated Academic & Tech Gear</span>
                    </div> */}

                    {/* Headline */}
                    <h1 className='font-bold tracking-[-0.035em] leading-[1.12] mb-4 text-3xl sm:text-4xl md:text-5xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                        Student{' '}
                        <span className='text-[#0075de] dark:text-[#62aef0]'>
                            Store & Essentials
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className='max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-6'>
                        Handpicked course textbooks, study gadgets, lab essentials,
                        and productivity tools recommended by seniors to help you excel.
                    </p>

                    {/* Highlights Pills */}
                    {/* <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-2.5'>
                        <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474]'>
                            <Sparkles className='w-3 h-3' /> Senior Verified
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130]'>
                            <Tag className='w-3 h-3' /> Best Student Deals
                        </span>
                        <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f5edfd] dark:bg-[#321c4b] text-[#8a3fd6] dark:text-[#d6b6f6] border border-[#e8d5fc] dark:border-[#4a2673]'>
                            <ShieldCheck className='w-3 h-3' /> Direct Seller Links
                        </span>
                    </div> */}
                </div>
            </section>

            {/* Product Catalog Section */}
            <section className='max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8'>
                <ProductList initialProducts={products} />

                {/* Transparency Note */}
                <div className='mt-12 pt-6 border-t border-[#e6e6e6] dark:border-[#2f2f2f] text-center'>
                    <p className='text-xs text-[#8c8883] dark:text-[#73716d] max-w-xl mx-auto'>
                        * Disclosure: Some links are affiliate links. When you make a purchase through them,
                        we may earn a small commission at no additional cost to you, which helps support the platform.
                    </p>
                </div>
            </section>
        </main>
    );
}

