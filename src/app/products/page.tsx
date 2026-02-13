import { api } from '@/config/apiUrls';
import React from 'react';
import ProductList from './ProductList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Recommended Products - Student Senior',
    description:
        'Curated list of books, gadgets, and tools for students. Handpicked by seniors.',
    openGraph: {
        title: 'Recommended Products - Student Senior',
        description: 'Curated list of books, gadgets, and tools for students.',
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
        <main className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
                <header className='text-center mb-12'>
                    <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-fugaz'>
                        Student Store
                    </h1>
                    <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                        Essentials specific to your course. Books, gadgets, and
                        tools recommended by seniors to help you ace your exams.
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-4 italic'>
                        * Some links are affiliate links. We may earn a
                        commission if you buy through them.
                    </p>
                </header>

                <ProductList initialProducts={products} />
            </div>
        </main>
    );
}
