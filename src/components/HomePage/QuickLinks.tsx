"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Download,
  X,
  Zap,
  BookOpen,
  Search,
  GraduationCap,
  ShoppingBag,
  Users,
} from "lucide-react";

type QuickAccessItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
  ariaLabel: string;
  description: string;
  color: string;
};

type College = {
  name: string;
  slug: string;
};

// Minimal typing for the BeforeInstallPromptEvent used by Chromium browsers
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const QuickLinks: React.FC<{ colleges: College[] }> = ({ colleges }) => {
  const [visible, setVisible] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [navigatePath, setNavigatePath] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const router = useRouter();

  // Capture the PWA install prompt event when available
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const bipEvent = e as BeforeInstallPromptEvent;
      setInstallPromptEvent(bipEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setIsInstallable(false);
      toast.success("App installed successfully");
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    try {
      if (!installPromptEvent) {
        toast.error("Install not available on this device/browser right now.");
        return;
      }
      await installPromptEvent.prompt();
      const choice = await installPromptEvent.userChoice;
      if (choice.outcome === "accepted") {
        toast.success("Installing app...");
      } else {
        toast("Installation dismissed");
      }
      setInstallPromptEvent(null);
      setIsInstallable(false);
    } catch (err) {
      toast.error("Failed to start installation");
      console.log(err);
    }
  }, [installPromptEvent]);

  const handleOpenModal = (path: string) => {
    setNavigatePath(path);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
    setSelectedCollege("");
    setNavigatePath("");
  };

  const handleNavigate = async () => {
    if (selectedCollege) {
      setIsNavigating(true);
      try {
        await router.push(`/${selectedCollege}/${navigatePath}`);
        setVisible(false);
      } catch (error) {
        toast.error("Navigation failed. Please try again.");
        console.log(error);
      } finally {
        setIsNavigating(false);
      }
    } else {
      toast.error("Please select a college first!");
    }
  };

  const quickAccessItems: QuickAccessItem[] = [
    {
      icon: <Zap className="text-white w-6 h-6 md:w-8 md:h-8" />,
      label: "PYQs",
      path: "pyqs",
      ariaLabel: "Access Past Year Questions and previous exam papers",
      description: "Previous year question papers",
      color:
        "from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600",
    },
    {
      icon: <BookOpen className="text-white w-6 h-6 md:w-8 md:h-8" />,
      label: "Notes",
      path: "notes",
      ariaLabel: "Access comprehensive study notes and materials",
      description: "Curated study materials",
      color:
        "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600",
    },
    {
      icon: <Search className="text-white w-6 h-6 md:w-8 md:h-8" />,
      label: "Resources",
      path: "resources",
      ariaLabel: "Browse extensive academic resources and tools",
      description: "Academic resources & tools",
      color: "from-blue-400 to-cyan-500 dark:from-blue-500 dark:to-cyan-600",
    },
    {
      icon: <GraduationCap className="text-white w-6 h-6 md:w-8 md:h-8" />,
      label: "Seniors",
      path: "seniors",
      ariaLabel: "Connect with senior students and mentors",
      description: "Connect with experienced seniors",
      color:
        "from-purple-400 to-pink-500 dark:from-purple-500 dark:to-pink-600",
    },
    {
      icon: <ShoppingBag className="text-white w-6 h-6 md:w-8 md:h-8" />,
      label: "Store",
      path: "store",
      ariaLabel: "Visit student marketplace for books and materials",
      description: "Student marketplace",
      color:
        "from-indigo-400 to-blue-500 dark:from-indigo-500 dark:to-blue-600",
    },
    {
      icon: <Users className="text-white w-6 h-6 md:w-8 md:h-8" />,
      label: "Groups",
      path: "groups",
      ariaLabel: "Join active student community discussions",
      description: "Join student discussions",
      color: "from-teal-400 to-green-500 dark:from-teal-500 dark:to-green-600",
    },
  ];

  return (
    <section
      className="py-16 bg-white dark:bg-gray-900"
      aria-labelledby="quick-access-heading"
    >
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2
            id="quick-access-heading"
            className="text-3xl font-fugaz md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Quick Access Hub
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need for academic success, just one click away
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {quickAccessItems.map((item, index) => (
            <article
              key={index}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleOpenModal(item.path)}
              role="button"
              tabIndex={0}
              aria-label={item.ariaLabel}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleOpenModal(item.path);
                }
              }}
            >
              <div
                className={`relative bg-gradient-to-br ${item.color} rounded-2xl p-6 h-32 flex flex-col items-center justify-center shadow-lg group-hover:shadow-2xl dark:shadow-gray-900/50 dark:group-hover:shadow-2xl transition-all duration-300`}
              >
                {/* Icon */}
                <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                {/* Label */}
                <h3 className="font-semibold text-white text-sm md:text-base text-center">
                  {item.label}
                </h3>

                {/* Hover description */}
                <div className="absolute inset-0 bg-black bg-opacity-80 dark:bg-black dark:bg-opacity-90 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                  <p className="text-white text-xs text-center leading-tight">
                    {item.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-white bg-opacity-30 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-white bg-opacity-20 rounded-full group-hover:scale-200 transition-transform duration-300"></div>
              </div>
            </article>
          ))}
        </div>

        {/* App Installation CTA */}
        <aside
          className="mt-16 max-w-4xl mx-auto"
          aria-label="Mobile app promotion"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-2xl p-6 md:p-8 shadow-lg dark:shadow-gray-900/20">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-center md:text-left">
                <div className="text-4xl animate-bounce">📱</div>
                <div>
                  <h3 className="text-xl font-fugaz font-bold text-gray-900 dark:text-white mb-1">
                    Get the Mobile App
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Faster access, offline reading, and push notifications
                  </p>
                </div>
              </div>

              <button
                onClick={handleInstall}
                aria-label="Install Student Senior mobile application"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                rel="noopener noreferrer"
                disabled={!isInstallable}
              >
                <Download />
                <span>{isInstallable ? "Install Now" : "Install"}</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Enhanced Modal */}
      {visible && (
        <div
          className="fixed inset-0 bg-sky-50 bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  Select Your College
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 text-xl"
                  aria-label="Close college selection dialog"
                >
                  <X />
                </button>
              </div>

              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-6 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onChange={(e) => setSelectedCollege(e.target.value)}
                value={selectedCollege}
                required
                aria-label="Select your college"
              >
                <option value="">Choose your college...</option>
                {colleges.map((college) => (
                  <option key={college.slug} value={college.slug}>
                    {college.name}
                  </option>
                ))}
              </select>

              <div className="flex space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  disabled={isNavigating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleNavigate}
                  disabled={!selectedCollege || isNavigating}
                  className="flex-1 py-2 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isNavigating ? (
                    <>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuickLinks;
