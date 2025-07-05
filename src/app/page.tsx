import Hero from "@/components/HomePage/Hero";
import CollegeSelectHandler from "@/components/HomePage/CollegeSelectHandler";
import QuickLinks from "@/components/HomePage/QuickLinks";
import { api } from "@/config/apiUrls";
import type { Metadata } from "next";
import Image from "next/image";
import { File, GraduationCap, User } from "lucide-react";
import FAQPage from "@/components/HomePage/FAQ";
import OurFeatures from "@/components/HomePage/OurFeatures";
import { IApiResponse } from "@/utils/interface";

type College = {
    name: string;
    slug: string;
};

async function getColleges(): Promise<IApiResponse<College[]>> {
    try {
        const res = await fetch(api.college.getColleges, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed fetching colleges:", errorText);
            throw new Error("Failed to fetch colleges");
        }

        return await res.json();
    } catch (e) {
        console.error("Fetch error:", e);
        return {
            status: false,
            message: "Failed to fetch colleges",
            data: [],
        };
    }
}

// Enhanced SEO metadata
export const metadata: Metadata = {
    title: "Student Senior - Academic Mentorship, PYQs & Student Resources Platform",
    description:
        "Connect with college seniors, access past year questions (PYQs), study notes, and academic resources. Join India's leading student community platform for academic success.",
    keywords: [
        "college mentorship",
        "past year questions",
        "PYQ papers",
        "student community",
        "academic resources",
        "study notes",
        "college seniors",
        "student marketplace",
        "university resources",
        "exam preparation",
    ].join(", "),
    authors: [{ name: "Student Senior Team" }],
    creator: "Student Senior",
    publisher: "Student Senior",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: "https://studentsenior.com",
        siteName: "Student Senior",
        title: "Student Senior - Your Academic Success Partner",
        description:
            "Access mentorship, PYQs, study materials, and connect with seniors. Boost your academic journey with our comprehensive student platform.",
        images: [
            {
                url: "https://studentsenior.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Student Senior - Academic Platform for College Students",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Student Senior - Academic Mentorship Platform",
        description:
            "Get mentorship, PYQs, notes, and connect with college seniors for academic success.",
        images: ["https://studentsenior.com/twitter-image.jpg"],
        creator: "@studentsenior",
    },
    alternates: {
        canonical: "https://studentsenior.com",
    },
    category: "Education",
};

export default async function HomePage() {
    const AllColleges = await getColleges();
    const colleges = AllColleges.data || [];

    return (
        <>
            <main role="main">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen flex items-center">
                    <div className="mx-auto md:p-10 px-4 py-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <Hero />
                                <CollegeSelectHandler colleges={colleges} />
                            </div>
                            <div className="hidden lg:block">
                                <div className="relative">
                                    <Image
                                        src="/assets/images/illustration1.png"
                                        alt="Students collaborating and studying together"
                                        className="w-full h-auto max-w-lg mx-auto rounded-4xl"
                                        loading="eager"
                                        width={500}
                                        height={400}
                                    />

                                    {/* Decorative elements */}
                                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-60 animate-pulse"></div>
                                    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full opacity-40 animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Access Section */}
                <QuickLinks colleges={colleges} />

                {/* Features Section for SEO */}
                <section className="py-16 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Why Choose Student Senior?
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Your one-stop platform for academic success and
                                peer connection
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm dark:shadow-gray-900/20">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    Expert Mentorship
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Connect with experienced seniors and get
                                    personalized academic guidance
                                </p>
                            </div>
                            <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm dark:shadow-gray-900/20">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <File className="text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    Comprehensive Resources
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Access past year questions, study notes, and
                                    curated academic materials
                                </p>
                            </div>
                            <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm dark:shadow-gray-900/20">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    Active Community
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Join thousands of students sharing knowledge
                                    and supporting each other
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <OurFeatures />

                <FAQPage />
            </main>
        </>
    );
}
