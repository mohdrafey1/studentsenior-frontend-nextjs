'use client';
import React from 'react';
import { IStoreItem } from '@/utils/interface';
import {
    MessageCircle,
    Eye,
    IndianRupee,
    CheckCircle,
    ShoppingBag,
    XCircle,
} from 'lucide-react';
import Image from 'next/image';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';

interface ProductDetailClientProps {
    product: IStoreItem;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
    product,
}) => {
    return (
        <>
            <DetailPageNavbar path='store' />
            <div className='max-w-6xl mx-auto px-4 py-8'>
                <div className='bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-4 sm:p-8 mb-6 sm:mb-8'>
                    <div className='flex flex-col lg:flex-row gap-6 sm:gap-8'>
                        {/* Image Section */}
                        <div className='w-full lg:w-1/3 flex-shrink-0'>
                            <div className='aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60'>
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        className='object-cover w-full h-full'
                                        width={600}
                                        height={600}
                                    />
                                ) : (
                                    <div className='w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500'>
                                        <ShoppingBag className='w-12 h-12 mb-3' />
                                        <span className='text-sm font-medium'>
                                            No Image Available
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className='flex-1 flex flex-col'>
                            <div className='flex justify-between items-start mb-2'>
                                <p className='text-sm font-medium text-sky-600 dark:text-sky-400'>
                                    Sold by @{product.owner?.username || 'Anonymous'}
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                                            product.available
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-200'
                                        }`}
                                    >
                                        {product.available ? (
                                            <CheckCircle className='w-3.5 h-3.5' />
                                        ) : (
                                            <XCircle className='w-3.5 h-3.5' />
                                        )}
                                        {product.available ? 'Available' : 'Sold Out'}
                                    </span>
                                </div>
                            </div>

                            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-fugaz font-bold text-gray-900 dark:text-white mb-6 leading-tight'>
                                {product.name}
                            </h1>

                            {/* Details Grid */}
                            <div className='grid grid-cols-2 gap-4 sm:gap-6 mb-8'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center shrink-0'>
                                        <IndianRupee className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
                                    </div>
                                    <div>
                                        <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                                            Price
                                        </p>
                                        <p className='font-bold text-base sm:text-lg text-gray-900 dark:text-white'>
                                            {product.price}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center shrink-0'>
                                        <Eye className='w-5 h-5 text-orange-600 dark:text-orange-400' />
                                    </div>
                                    <div>
                                        <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                                            Views
                                        </p>
                                        <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-white'>
                                            {product.clickCount || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className='mb-8 flex-grow'>
                                <h2 className='text-lg font-bold text-gray-900 dark:text-white mb-3'>
                                    About this item
                                </h2>
                                <p className='text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base'>
                                    {product.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Contact Section */}
                            <div className='pt-6 border-t border-gray-100 dark:border-gray-700/60'>
                                <div className='flex flex-col sm:flex-row gap-3'>
                                    {product.whatsapp && (
                                        <a
                                            href={`https://wa.me/91${product.whatsapp}?text=${encodeURIComponent(`Hey! I came from StudentSenior. I want to know about the "${product.name}" listed on StudentSenior.`)}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200'
                                        >
                                            <MessageCircle className='w-5 h-5' />
                                            WhatsApp
                                        </a>
                                    )}
                                    {product.telegram && (
                                        <a
                                            href={`https://t.me/${product.telegram}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl transition-colors duration-200'
                                        >
                                            <MessageCircle className='w-5 h-5' />
                                            Telegram
                                        </a>
                                    )}
                                    {!product.whatsapp && !product.telegram && (
                                        <div className='w-full p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl text-center border border-gray-100 dark:border-gray-700/60'>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                No contact information provided.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailClient;
