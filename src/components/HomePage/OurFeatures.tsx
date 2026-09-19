import {
    FileText,
    Users,
    ShoppingBag,
    TrendingUp,
    Award,
    BookOpen,
    Target,
} from 'lucide-react';

interface Feature {
    id: number;
    title: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}

interface Achievement {
    id: number;
    title: string;
    icon: React.ReactNode;
    count: number;
    color: string;
    suffix?: string;
}

const OurFeatures: React.FC = () => {
    const features: Feature[] = [
        {
            id: 1,
            title: 'PYQ Access',
            icon: <FileText className='w-6 h-6 text-[#0075de]' strokeWidth={2.2} />,
            description:
                'Access comprehensive past year question papers, analyze trends, and develop winning exam strategies with our curated collection.',
            color: 'bg-[#eaf3fd] dark:bg-[#10243e]',
        },
        {
            id: 2,
            title: 'Senior Mentorship',
            icon: <Users className='w-6 h-6 text-[#8a3fd6]' strokeWidth={2.2} />,
            description:
                'Connect with experienced seniors for personalized academic guidance, career advice, and valuable insights into your field.',
            color: 'bg-[#f5edfd] dark:bg-[#2b1744]',
        },
        {
            id: 3,
            title: 'Student Store',
            icon: <ShoppingBag className='w-6 h-6 text-[#1aae39]' strokeWidth={2.2} />,
            description:
                'Discover essential academic supplies and sell your own items in our dedicated student marketplace community.',
            color: 'bg-[#eaf7ec] dark:bg-[#112d1b]',
        },
    ];

    const achievements: Achievement[] = [
        {
            id: 1,
            title: 'PYQs Available',
            icon: <BookOpen className='w-5 h-5 text-[#0075de]' strokeWidth={2.2} />,
            count: 1500,
            color: 'bg-[#eaf3fd] dark:bg-[#10243e]',
            suffix: '+',
        },
        {
            id: 2,
            title: 'Senior Guides',
            icon: <Award className='w-5 h-5 text-[#8a3fd6]' strokeWidth={2.2} />,
            count: 50,
            color: 'bg-[#f5edfd] dark:bg-[#2b1744]',
            suffix: '+',
        },
        {
            id: 3,
            title: 'Products Sold',
            icon: <Target className='w-5 h-5 text-[#1aae39]' strokeWidth={2.2} />,
            count: 15,
            color: 'bg-[#eaf7ec] dark:bg-[#112d1b]',
            suffix: '+',
        },
        {
            id: 4,
            title: 'Active Users',
            icon: <TrendingUp className='w-5 h-5 text-[#dd5b00]' strokeWidth={2.2} />,
            count: 10000,
            color: 'bg-[#fdf1e8] dark:bg-[#381e0f]',
            suffix: '+',
        },
    ];

    return (
        <div className='bg-[#f6f5f4] dark:bg-[#191919] border-t border-[#e6e6e6] dark:border-[#2f2f2f] transition-colors duration-200'>
            {/* Achievements Section */}
            <section className='py-14 sm:py-18 px-4 sm:px-6'>
                <div className='max-w-6xl mx-auto'>
                    <div className='text-center mb-10'>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#262626] text-[#0075de] dark:text-[#62aef0] border border-[#e6e6e6] dark:border-[#383838] mb-3'>
                            <span>Community Impact</span>
                        </div>
                        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#000000] dark:text-white tracking-[-0.025em] mb-2.5'>
                            Trusted by Thousands
                        </h2>
                        <p className='text-sm sm:text-base text-[#615d59] dark:text-[#a39e98] max-w-2xl mx-auto'>
                            Join our thriving community of students who are transforming their academic journey through collaboration and shared knowledge.
                        </p>
                    </div>

                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
                        {achievements.map((item) => (
                            <div key={item.id} className='group'>
                                <div className='bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 text-center transition-all duration-200 hover:border-[#0075de] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'>
                                    <div
                                        className={`w-10 h-10 mx-auto mb-3.5 flex items-center justify-center rounded-xl ${item.color}`}
                                    >
                                        {item.icon}
                                    </div>
                                    <div className='space-y-1'>
                                        <h3 className='text-2xl sm:text-3xl font-bold text-[#000000] dark:text-white tracking-tight'>
                                            {item.count.toLocaleString()}{item.suffix}
                                        </h3>
                                        <p className='text-xs font-medium text-[#615d59] dark:text-[#a39e98]'>
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className='py-14 sm:py-18 px-4 sm:px-6 bg-white dark:bg-[#202020] border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                <div className='max-w-6xl mx-auto'>
                    <div className='text-center mb-12'>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf3fd] dark:bg-[#10243e] text-[#0075de] dark:text-[#62aef0] border border-[#d0e5fb] dark:border-[#1a3860] mb-3'>
                            <span>Core Features</span>
                        </div>
                        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#000000] dark:text-white tracking-[-0.025em] mb-2.5'>
                            Our Features
                        </h2>
                        <p className='text-sm sm:text-base text-[#615d59] dark:text-[#a39e98] max-w-2xl mx-auto'>
                            Discover the powerful tools and resources that make your academic journey smoother and more successful.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        {features.map((feature) => (
                            <div key={feature.id} className='group'>
                                <div className='bg-[#f6f5f4] dark:bg-[#262626] rounded-2xl border border-[#e6e6e6] dark:border-[#383838] p-6 h-full transition-all duration-200 hover:border-[#0075de] dark:hover:border-[#0075de] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 flex flex-col justify-between'>
                                    <div>
                                        <div
                                            className={`w-12 h-12 mb-4 flex items-center justify-center rounded-xl ${feature.color}`}
                                        >
                                            {feature.icon}
                                        </div>
                                        <h3 className='text-lg font-bold text-[#000000] dark:text-white mb-2 tracking-[-0.2px]'>
                                            {feature.title}
                                        </h3>
                                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a39e98] leading-relaxed'>
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OurFeatures;

