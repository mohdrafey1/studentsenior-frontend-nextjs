import { api } from '@/config/apiUrls';
import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
    params: Promise<{ 'product-slug': string }>;
}

export async function generateMetadata({
    params,
}: ProductDetailPageProps): Promise<Metadata> {
    const { 'product-slug': productSlug } = await params;
    return {
        title: `${capitalizeWords(productSlug)} - Store`,
        description: 'Product details and contact information.',
    };
}

export default async function ProductDetailPage({
    params,
}: ProductDetailPageProps) {
    const { 'product-slug': productSlug } = await params;

    let product = null;

    try {
        const url = `${api.store.getStoreBySlug(productSlug)}`;
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        product = data?.data || null;
    } catch (error) {
        console.error('Error fetching product details:', error);
    }

    if (!product) {
        return (
            <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                <div className='text-center py-12'>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        Product Not Found
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300'>
                        The product you&apos;re looking for doesn&apos;t exist
                        or has been removed.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <ProductDetailClient product={product} />
        </main>
    );
}
