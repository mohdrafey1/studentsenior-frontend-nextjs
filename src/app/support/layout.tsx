import type { Metadata } from 'next';

// Private conversations: never indexed.
export const metadata: Metadata = {
    title: 'Support - Student Senior',
    robots: { index: false, follow: false },
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className='min-h-[calc(100vh-140px)] bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] py-6 sm:py-10'>
            <div className='max-w-3xl mx-auto px-4 sm:px-6'>{children}</div>
        </main>
    );
}
