import React from "react";
import {
    Users,
    BookOpen,
    Rocket,
    GraduationCap,
    ShoppingBag,
    Building2,
} from "lucide-react";

export const metadata = {
    title: "About Us - Student Senior",
    description: "Learn more about our team and mission.",
};

function AboutPage() {
    const features = [
        {
            title: "Academic Resources",
            description:
                "Access previous year's question papers (PYQs) and comprehensive notes for simplified exam preparation.",
            icon: <BookOpen className="w-6 h-6" />,
        },
        {
            title: "Senior Connect",
            description:
                "Connect with experienced seniors for guidance and mentorship through live chats and community forums.",
            icon: <Users className="w-6 h-6" />,
        },
        {
            title: "Student Marketplace",
            description:
                "Buy and sell used stationery, books, and resources within your college community.",
            icon: <ShoppingBag className="w-6 h-6" />,
        },
        {
            title: "Internship Portal",
            description:
                "Discover and apply for relevant internship opportunities based on your course.",
            icon: <Rocket className="w-6 h-6" />,
        },
        {
            title: "College Resources",
            description:
                "Access official websites, admission information, and essential college resources effortlessly.",
            icon: <Building2 className="w-6 h-6" />,
        },
        {
            title: "Academic Success",
            description:
                "Get comprehensive support for your academic journey with our integrated platform.",
            icon: <GraduationCap className="w-6 h-6" />,
        },
    ];

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto text-center mb-20">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                    About Student Senior
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Empowering students with comprehensive academic resources,
                    mentorship, and opportunities for success.
                </p>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="relative group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                                    {React.cloneElement(feature.icon, {
                                        className:
                                            "w-6 h-6 text-blue-600 dark:text-blue-400",
                                    })}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto mt-24">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Our Mission
                        </h2>
                        <p className="text-lg sm:text-xl text-white/90">
                            To empower students by providing seamless access to
                            academic resources, meaningful connections with
                            seniors, and valuable opportunities that contribute
                            to their academic and professional success.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
