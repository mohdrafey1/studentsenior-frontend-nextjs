'use client';
import React from 'react';
import { IStoreItem } from '@/utils/interface';
import {
    MessageCircle,
    Eye,
    IndianRupee,
    CheckCircle,
    Clock,
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
            {/* Reduced overall page padding */}
            <div className='min-h-full w-full dark:bg-gray-950 py-6 sm:py-10'>
                <div className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-8'>
                    <article className='relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl sm:shadow-2xl overflow-hidden'>
                        <div className='grid grid-cols-1 lg:grid-cols-5 gap-0'>
                            {/* Column 1: Image Gallery - Tighter padding */}
                            <div className='lg:col-span-2 relative p-4 sm:p-5'>
                                <div className='group relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl'>
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            className='object-cover w-full h-full group-hover:scale-110 transition-transform duration-700'
                                            width={600}
                                            height={600}
                                        />
                                    ) : (
                                        <div className='w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
                                            <div className='text-center'>
                                                <div className='w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                                                    <ShoppingBag className='w-8 h-8 lg:w-12 lg:h-12 text-gray-400' />
                                                </div>
                                                <span className='text-lg lg:text-xl font-medium'>
                                                    No Image Available
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                </div>
                            </div>

                            {/* Column 2: Product Details - Tighter padding & margins */}
                            <div className='lg:col-span-3 relative p-4 sm:p-5 lg:p-6 flex flex-col'>
                                {/* Header: Seller & Title */}
                                <div className='mb-3'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <p className='text-sm font-medium text-sky-600 dark:text-sky-400'>
                                            Sold by @
                                            {product.owner?.username ||
                                                'Anonymous'}
                                        </p>
                                        {product.clickCount > 0 && (
                                            <div className='flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400'>
                                                <Eye className='w-4 h-4' />
                                                <span>
                                                    {product.clickCount} views
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight'>
                                        {product.name}
                                    </h1>

                                    {/* Status Badges */}
                                    <div className='flex flex-wrap gap-2'>
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full ${
                                                product.available
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-200'
                                            }`}
                                        >
                                            {product.available ? (
                                                <CheckCircle className='w-4 h-4' />
                                            ) : (
                                                <XCircle className='w-4 h-4' />
                                            )}
                                            {product.available
                                                ? 'Available'
                                                : 'Sold Out'}
                                        </span>

                                        {product.submissionStatus !==
                                            'approved' && (
                                            <span className='inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 rounded-full'>
                                                <Clock className='w-4 h-4' />
                                                Pending Approval
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Price - Reduced margin */}
                                <div className='my-0'>
                                    <div className='bg-gray-100 dark:bg-gray-800/60 p-4 rounded-2xl'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                            Price
                                        </p>
                                        <div className='flex items-center'>
                                            <IndianRupee className='w-4 h-4 sm:w-4 sm:h-4 text-gray-800 dark:text-white mr-1' />
                                            <span className='text-2xl sm:text-2xl font-extrabold text-gray-900 dark:text-white'>
                                                {product.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description - Reduced margin */}
                                <div className='mb-6'>
                                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                                        About this item
                                    </h2>
                                    <p className='text-base text-gray-600 dark:text-gray-300 leading-relaxed'>
                                        {product.description}
                                    </p>
                                </div>

                                {/* Contact CTA - Reduced padding */}
                                <div className='mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/60'>
                                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                                        Contact Seller
                                    </h2>
                                    <div className='space-y-3'>
                                        {product.whatsapp && (
                                            <a
                                                href={`https://wa.me/91${product.whatsapp}?text=${encodeURIComponent(`Hey! I came from StudentSenior. I want to know about the "${product.name}" listed on StudentSenior.`)}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='group/contact flex items-center gap-3 w-full p-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02]'
                                            >
                                                <div className='p-2 bg-white/20 rounded-lg group-hover/contact:bg-white/30 transition-colors duration-300'>
                                                    <MessageCircle className='w-5 h-5' />
                                                </div>
                                                <span className='text-base font-semibold'>
                                                    Contact on WhatsApp
                                                </span>
                                            </a>
                                        )}
                                        {product.telegram && (
                                            <a
                                                href={`https://t.me/${product.telegram}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='group/contact flex items-center gap-3 w-full p-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-sky-500/30 transition-all duration-300 hover:scale-[1.02]'
                                            >
                                                <div className='p-2 bg-white/20 rounded-lg group-hover/contact:bg-white/30 transition-colors duration-300'>
                                                    <MessageCircle className='w-5 h-5' />
                                                </div>
                                                <span className='text-base font-semibold'>
                                                    Contact on Telegram
                                                </span>
                                            </a>
                                        )}
                                        {!product.whatsapp &&
                                            !product.telegram && (
                                                <div className='p-4 bg-gray-100 dark:bg-gray-800/60 rounded-xl text-center'>
                                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                        No contact information
                                                        provided.
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
};

export default ProductDetailClient;
