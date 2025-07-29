import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import ConditionalHeader from "@/components/Common/ConditionalHeader";
import ConditionalFooter from "@/components/Common/ConditionalFooter";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Student Senior",
    description: "Your Academic Companion",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <Toaster
                        position="top-center"
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
