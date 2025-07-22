import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/config/apiUrls";
import { College } from "@/utils/interface";
import { capitalizeWords } from "@/utils/formatting";
import CollegeHero from "@/components/College/CollegeHero";
import { CollegePageProps } from "@/utils/interface";
import Collegelinks from "@/components/Common/CollegeLinks";
import Collegelink2 from "@/components/Common/CollegeLink2";

// Fetch college data
async function getCollege(slug: string): Promise<College | null> {
    try {
        console.log("Fetching college with slug:", slug);
        console.log("API URL:", api.college.getCollegeBySlug(slug));

        const res = await fetch(api.college.getCollegeBySlug(slug), {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        console.log("Response status:", res.status);

        if (!res.ok) {
            console.error(
                "College not found or API error:",
                res.status,
                res.statusText
            );
            return null;
        }

        const college = await res.json();
        console.log("College data received:", college);
        return college;
    } catch (error) {
        console.error("Error fetching college:", error);
        return null;
    }
}

// // Fetch seniors data
// async function getSeniors(slug: string): Promise<Senior[]> {
//     try {
//         const res = await fetch(api.seniors.getFeaturedSeniors(slug), {
//             headers: {
//                 "x-api-key": String(API_KEY),
//             },
//             next: { revalidate: 1800 }, // Cache for 30 minutes
//         });

//         if (!res.ok) {
//             console.warn("Failed to fetch seniors:", res.status);
//             return [];
//         }

//         return await res.json();
//     } catch (error) {
//         console.error("Error fetching seniors:", error);
//         return [];
//     }
// }

// // Fetch products data
// async function getProducts(slug: string): Promise<Product[]> {
//     try {
//         const res = await fetch(api.products.getFeaturedProducts(slug), {
//             headers: {
//                 "x-api-key": String(API_KEY),
//             },
//             next: { revalidate: 1800 }, // Cache for 30 minutes
//         });

//         if (!res.ok) {
//             console.warn("Failed to fetch products:", res.status);
//             return [];
//         }

//         return await res.json();
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         return [];
//     }
// }

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    const college = await getCollege(slug);

    if (!college) {
        return {
            title: "College Not Found - Student Senior",
            description: "The requested college could not be found.",
        };
    }

    const collegeName = capitalizeWords(slug);

    return {
        title: `${collegeName} - Student Community, Seniors & Resources | Student Senior`,
        description: `Connect with seniors at ${collegeName}, access study materials, past year questions, and academic resources. Join the student community at ${college.location}.`,
        keywords: [
            collegeName,
            "college seniors",
            "student community",
            "study materials",
            "past year questions",
            "academic resources",
            college.location,
            "student mentorship",
            "college resources",
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
            url: `https://studentsenior.com/college/${slug}`,
            siteName: "Student Senior",
            title: `${collegeName} - Student Community & Resources`,
            description: `Connect with seniors, access study materials, and join the student community at ${collegeName}.`,
            images: [
                {
                    url:
                        college.image ||
                        "https://studentsenior.com/og-college-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: `${collegeName} - Student Senior Community`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${collegeName} - Student Senior Community`,
            description: `Connect with seniors and access resources at ${collegeName}.`,
            images: [
                college.image ||
                    "https://studentsenior.com/twitter-college-image.jpg",
            ],
            creator: "@studentsenior",
        },
        alternates: {
            canonical: `https://studentsenior.com/college/${slug}`,
        },
        category: "Education",
    };
}

export default async function CollegePage({ params }: CollegePageProps) {
    const { slug } = await params;
    console.log("College page requested for slug:", slug);

    const college = await getCollege(slug);

    if (!college) {
        console.log("College not found, calling notFound()");
        notFound();
    }

    console.log("College found:", college.name);

    // Fetch related data
    // const [seniors, products] = await Promise.all([
    //     getSeniors(slug),
    //     getProducts(slug),
    // ]);

    // console.log(
    //     "Fetched data - Seniors:",
    //     seniors.length,
    //     "Products:",
    //     products.length
    // );

    return (
        <main role="main" className="min-h-screen">
            {/* Hero Section */}
            <CollegeHero tagline={slug}>
                <Collegelinks />
            </CollegeHero>

            {/* Featured Seniors Section */}
            {/* <FeaturedSeniors seniors={seniors} /> */}

            {/* Divider */}
            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Featured Products Section */}
            {/* <FeaturedProducts products={products} /> */}

            {/* Divider */}
            <hr className="border-gray-200 dark:border-gray-700" />

            {/* About Section */}
            {/* <CollegeAbout college={college} /> */}

            <Collegelink2 />
        </main>
    );
}
