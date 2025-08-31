import {
  FileText,
  Users,
  ShoppingBag,
  TrendingUp,
  Award,
  BookOpen,
  Target,
} from "lucide-react";

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
      title: "PYQ Access",
      icon: <FileText className="w-8 h-8" />,
      description:
        "Access comprehensive past year question papers, analyze trends, and develop winning exam strategies with our curated collection.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Senior Mentorship",
      icon: <Users className="w-8 h-8" />,
      description:
        "Connect with experienced seniors for personalized academic guidance, career advice, and valuable insights into your field.",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Student Store",
      icon: <ShoppingBag className="w-8 h-8" />,
      description:
        "Discover essential academic supplies and sell your own items in our dedicated student marketplace community.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const achievements: Achievement[] = [
    {
      id: 1,
      title: "PYQs Available",
      icon: <BookOpen className="w-6 h-6" />,
      count: 1100,
      color: "from-blue-500 to-blue-600",
      suffix: "+",
    },
    {
      id: 2,
      title: "Senior Guides",
      icon: <Award className="w-6 h-6" />,
      count: 40,
      color: "from-purple-500 to-purple-600",
      suffix: "+",
    },
    {
      id: 3,
      title: "Products Sold",
      icon: <Target className="w-6 h-6" />,
      count: 15,
      color: "from-green-500 to-green-600",
      suffix: "+",
    },
    {
      id: 4,
      title: "Active Users",
      icon: <TrendingUp className="w-6 h-6" />,
      count: 5000,
      color: "from-orange-500 to-red-500",
      suffix: "+",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Achievements Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-fugaz md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Thousands
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Join our thriving community of students who are transforming their
              academic journey through collaboration and shared knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((item) => (
              <div key={item.id} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 text-center border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-r ${item.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-4xl md:text-5xl font-fugaz font-bold text-gray-900 dark:text-white">
                      {item.count} {item.suffix}
                    </h3>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
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
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-fugaz md:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Features
              </span>
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-12px] h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover the powerful tools and resources that make your academic
              journey smoother and more successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="group">
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 h-full border border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300 group-hover:shadow-2xl">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-fugaz font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
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
