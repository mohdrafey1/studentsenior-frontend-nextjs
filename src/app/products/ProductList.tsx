'use client';

import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Filter, Share2, X, ShoppingCart, Tag as TagIcon } from 'lucide-react';
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
        ...new Set(initialProducts.map((p) => p.category).filter(Boolean)),
    ];

    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            const matchesSearch =
                !searchTerm.trim() ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                product.tags?.some((tag) =>
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
            text: `I found this on Student Senior: ${product.name}`,
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
                toast.success('Product link copied to clipboard!');
            } catch (error) {
                console.error('Error copying to clipboard:', error);
                toast.error('Failed to copy link');
            }
        }
    };

    return (
        <div className='w-full'>
            {/* Search & Category Filter Bar */}
            <div className='bg-white dark:bg-[#202020] p-3 sm:p-4 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-8'>
                <div className='flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between'>
                    {/* Search Input */}
                    <div className='relative flex-1 max-w-full lg:max-w-md'>
                        <Search
                            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999] dark:text-[#777]'
                            size={18}
                        />
                        <input
                            type='text'
                            placeholder='Search textbooks, scientific calculators, stationery...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg border border-[#e6e6e6] dark:border-[#383838] bg-[#fbfbfa] dark:bg-[#191919] text-[#101828] dark:text-white placeholder-[#999] dark:placeholder-[#666] text-sm focus:outline-none focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] transition-colors'
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1'
                                aria-label='Clear search'
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    {/* Category Filter Pills */}
                    <div className='flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none'>
                        <div className='hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#888] dark:text-[#777] mr-1 uppercase tracking-wider'>
                            <Filter size={14} />
                            <span>Category:</span>
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                                    selectedCategory === cat
                                        ? 'bg-[#0075de] text-white shadow-sm font-semibold'
                                        : 'bg-[#f4f3f0] dark:bg-[#2a2a2a] text-[#555] dark:text-[#bbb] hover:bg-[#eae8e4] dark:hover:bg-[#333] border border-transparent'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Count & Current Active Filters info */}
            <div className='flex items-center justify-between mb-6 text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] px-1'>
                <span>
                    Showing <strong className='text-[#101828] dark:text-white font-semibold'>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
                    {selectedCategory !== 'All' && <span> in <span className='text-[#0075de] dark:text-[#62aef0] font-medium'>{selectedCategory}</span></span>}
                    {searchTerm && <span> matching &ldquo;{searchTerm}&rdquo;</span>}
                </span>

                {(searchTerm || selectedCategory !== 'All') && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('All');
                        }}
                        className='text-[#0075de] dark:text-[#62aef0] hover:underline font-medium flex items-center gap-1'
                    >
                        Reset filters
                    </button>
                )}
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6'>
                {filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        className='group bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between'
                    >
                        <div>
                            {/* Product Image */}
                            <div className='relative aspect-[4/3] bg-[#f6f5f4] dark:bg-[#181818] overflow-hidden border-b border-[#e6e6e6] dark:border-[#2a2a2a]'>
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                                    />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center text-[#999] dark:text-[#666]'>
                                        <ShoppingCart size={32} opacity={0.4} />
                                    </div>
                                )}

                                {/* Category Tag on Image */}
                                {product.category && (
                                    <div className='absolute top-2.5 left-2.5'>
                                        <span className='px-2.5 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md text-[#101828] dark:text-white text-[11px] font-semibold rounded-md border border-black/5 dark:border-white/10 shadow-sm'>
                                            {product.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Details Content */}
                            <div className='p-4 sm:p-5'>
                                <h3 className='font-semibold text-base sm:text-lg text-[#101828] dark:text-white line-clamp-2 leading-snug group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors mb-2'>
                                    {product.name}
                                </h3>

                                <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a8a5a0] line-clamp-2 leading-relaxed mb-3 min-h-[2.5rem]'>
                                    {product.description || 'Verified student essential recommended for your course.'}
                                </p>

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div className='flex flex-wrap gap-1.5 mb-2'>
                                        {product.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className='inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-[#f4f3f0] dark:bg-[#282828] text-[#73716d] dark:text-[#9e9c97] font-medium'
                                            >
                                                <TagIcon size={10} />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer / Buy & Share Actions */}
                        <div className='p-4 sm:p-5 pt-3 border-t border-[#f0eee9] dark:border-[#2a2a2a] bg-[#fbfbfa]/50 dark:bg-[#1c1c1c]/50 flex items-center justify-between gap-3'>
                            <div className='flex flex-col'>
                                <span className='text-[10px] uppercase font-semibold text-[#8c8883] dark:text-[#787672] tracking-wider'>
                                    Price
                                </span>
                                <span className='text-lg sm:text-xl font-bold text-[#101828] dark:text-white tracking-tight'>
                                    ₹{product.price.toLocaleString('en-IN')}
                                </span>
                            </div>

                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => handleShare(product)}
                                    className='p-2 text-[#73716d] hover:text-[#0075de] dark:text-[#9e9c97] dark:hover:text-[#62aef0] hover:bg-white dark:hover:bg-[#282828] rounded-lg border border-transparent hover:border-[#e6e6e6] dark:hover:border-[#383838] transition-all'
                                    title='Share Product'
                                    aria-label='Share Product'
                                >
                                    <Share2 size={17} />
                                </button>

                                <a
                                    href={product.buyLink}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    onClick={() => handleProductClick(product._id)}
                                    className='inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white rounded-lg transition-all font-semibold text-xs sm:text-sm shadow-sm hover:shadow active:scale-[0.98]'
                                >
                                    <span>Buy Now</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 px-4 bg-[#fbfbfa] dark:bg-[#1f1f1f] rounded-2xl border border-dashed border-[#e6e6e6] dark:border-[#333] text-center my-6'>
                    <div className='w-14 h-14 bg-white dark:bg-[#2a2a2a] rounded-full flex items-center justify-center shadow-sm border border-[#e6e6e6] dark:border-[#383838] mb-4 text-[#888]'>
                        <Search size={24} />
                    </div>
                    <h3 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white mb-1.5'>
                        No products found
                    </h3>
                    <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] max-w-sm mb-5 leading-relaxed'>
                        We couldn&apos;t find any products matching your search or selected category.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('All');
                        }}
                        className='px-4 py-2 rounded-lg bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm'
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}

