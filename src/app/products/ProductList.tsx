'use client';

import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Filter, Share2, X } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/config/apiUrls';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

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

export default function ProductList({
    initialProducts,
}: {
    initialProducts: IProduct[];
}) {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract unique categories
    const categories = [
        'All',
        ...new Set(initialProducts.map((p) => p.category)),
    ];

    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                product.tags.some((tag) =>
                    tag.toLowerCase().includes(searchTerm.toLowerCase()),
                );
            const matchesCategory =
                selectedCategory === 'All' ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [initialProducts, searchTerm, selectedCategory]);

    const handleProductClick = async (productId: string) => {
        try {
            await fetch(`${api.affiliateProducts.trackClick(productId)}`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Error tracking click:', error);
        }
    };

    const handleShare = async (product: IProduct) => {
        const shareUrl = `${window.location.origin}/products?search=${encodeURIComponent(
            product.name,
        )}`;
        const shareData = {
            title: `Check out ${product.name} on Student Senior`,
            text: `I found this amazing product: ${product.name}`,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Link copied to clipboard!');
            } catch (error) {
                console.error('Error copying to clipboard:', error);
                toast.error('Failed to copy link');
            }
        }
    };

    return (
        <div>
            {/* Filters */}
            <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8'>
                <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                    <div className='relative w-full md:max-w-md'>
                        <Search
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                            size={20}
                        />
                        <input
                            type='text'
                            placeholder='Search books, gadgets...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <div className='flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0'>
                        <Filter
                            size={18}
                            className='text-gray-500 hidden md:block'
                        />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                    selectedCategory === cat
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        className='group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 transform hover:-translate-y-1'
                    >
                        {/* Image */}
                        <div className='relative aspect-[4/3] bg-gray-100 dark:bg-gray-900 overflow-hidden'>
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className='object-cover transition-transform duration-500 group-hover:scale-110'
                                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                            />
                            <div className='absolute top-3 left-3'>
                                <span className='px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-md'>
                                    {product.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className='p-5'>
                            <div className='flex items-start justify-between gap-3 mb-2'>
                                <h3 className='font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                                    {product.name}
                                </h3>
                            </div>

                            <p className='text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 h-10'>
                                {product.description}
                            </p>

                            <div className='flex flex-wrap gap-2 mb-4'>
                                {product.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className='text-xs text-gray-400'
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className='flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto'>
                                <div className='flex flex-col'>
                                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                                        Price
                                    </span>
                                    <span className='text-xl font-bold text-gray-900 dark:text-white'>
                                        ₹{product.price}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button
                                        onClick={() => handleShare(product)}
                                        className='p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all'
                                        title='Share'
                                    >
                                        <Share2 size={20} />
                                    </button>
                                    <a
                                        href={product.buyLink}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        onClick={() =>
                                            handleProductClick(product._id)
                                        }
                                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-md shadow-blue-600/20'
                                    >
                                        Buy Now
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                    <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4'>
                        <Search className='text-gray-400' size={32} />
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                        No products found
                    </h3>
                    <p className='text-gray-500 dark:text-gray-400 max-w-sm'>
                        We couldn&apos;t find any products matching your search
                        criteria. Try different keywords or filters.
                    </p>
                </div>
            )}
        </div>
    );
}
