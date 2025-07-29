export default function OtherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-gray-100/[0.05] dark:bg-grid-gray-700/[0.05] bg-[size:20px_20px] [mask-image:linear-gradient(0deg,transparent,white,transparent)]" />

                {/* Content */}
                <div className="relative">{children}</div>
            </div>
        </div>
    );
}
