import type { Metadata } from 'next';
import { PT_Serif, Geist_Mono, Quicksand } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';
import ConditionalHeader from '@/components/Common/ConditionalHeader';
import ConditionalFooter from '@/components/Common/ConditionalFooter';
import Script from 'next/script';

const quicksand = Quicksand({
    weight: '400', // only available weight
    variable: '--font-quicksand',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const fugazOne = PT_Serif({
    weight: ['700'],
    style: ['normal', 'italic'], // if you want italics
    subsets: ['latin'],
    variable: '--font-pt-serif',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Student Senior',
    description:
        'Your Academic Companion for Notes, PYQs, and College Resources',
    manifest: '/manifest.json',
    themeColor: '#ffffff',
    icons: [
        {
            rel: 'icon',
            url: '/icons/favicon.webp',
        },
        {
            rel: 'icon',
            url: '/icons/image192.png',
            sizes: '192x192',
        },
        {
            rel: 'icon',
            url: '/icons/image512.png',
            sizes: '512x512',
        },
        {
            rel: 'apple-touch-icon',
            url: '/icons/image192.png',
            sizes: '192x192',
        },
        {
            rel: 'apple-touch-icon',
            url: '/icons/image512.png',
            sizes: '512x512',
        },
    ],
    keywords: [
        'student',
        'college',
        'notes',
        'PYQs',
        'study',
        'academic companion',
        'integral university',
    ],
    authors: [
        {
            name: 'Student Senior',
            url: 'https://www.studentsenior.com/',
        },
    ],
    openGraph: {
        title: 'Student Senior',
        description:
            'Your Academic Companion for Notes, PYQs, and College Resources',
        url: 'https://www.studentsenior.com/',
        siteName: 'Student Senior',
        type: 'website',
        images: [
            {
                url: '/icons/image512.png',
                width: 512,
                height: 512,
                alt: 'Student Senior Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Student Senior',
        description:
            'Your Academic Companion for Notes, PYQs, and College Resources',
        siteId: '@studentsenior',
        creator: '@studentsenior',
        images: ['/icons/image512.png'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='en'>
            <head>
                <link rel='icon' href='./favicon.webp' />
                {/* Google AdSense */}
                <Script
                    async
                    src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4435788387381825'
                    crossOrigin='anonymous'
                    strategy='afterInteractive'
                />
                {/* Google Tag Manager */}
                <Script
                    src='https://www.googletagmanager.com/gtag/js?id=G-SQLNKSP4K7'
                    strategy='afterInteractive'
                />
                <Script id='google-analytics' strategy='afterInteractive'>
                    {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SQLNKSP4K7');
        `}
                </Script>
            </head>
            <body
                className={`${quicksand.variable} ${geistMono.variable} ${fugazOne.variable} antialiased`}
            >
                <Providers>
                    <Toaster
                        position='top-center'
                        toastOptions={{
                            duration: 3000,
                        }}
                    />
                    <ConditionalHeader />
                    {children}
                    <ConditionalFooter />
                </Providers>
            </body>
        </html>
    );
}
