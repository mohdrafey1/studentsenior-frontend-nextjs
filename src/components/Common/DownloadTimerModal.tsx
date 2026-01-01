import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Copy, Check, PersonStanding } from 'lucide-react';
import toast from 'react-hot-toast';

const THOUGHT_SETS = [
    // Set 1: Funny + Meme Style
    [
        'Padhne baithe ho ya notification check karne?',
        'Agar abhi nahi padhe… to kal tumhe khud roast karoge.',
        'Focus karo… phone tumhara dushman no. 1 hai.',
        'Aage badao… distractions ko door rakho.',
        'Tum padhoge, tab hi wo tumhe pyaar karegi.',
        'Bas 5 sec aur… fir dhamaka!',
    ],
    // Set 2: Alakh Sir (PW-Style) Meme Lines
    [
        'Kyun nahi ho rahi padhayi? Ab to ho jaaye!',
        'Beta, kitab kholo… dosti nibha lo thodi.',
        'Concept pakad lo… warna concept tumhe pakad lega.',
        'Shuruat hamesha mushkil hoti hai.',
        'Effort daaloge, result aaega… simple hai!',
        'Chalo bhai, padhai mode ON!',
    ],
    // Set 3: Motivational
    [
        'Small steps = Big results.',
        'Bas 30 seconds ka focus… you can do it!',
        'Winners train, losers complain.',
        'Your future self is watching.',
        'Do something today your future self will thank you for.',
        'Finish strong!',
    ],
    // Set 4: Humour + Relatable Student Vibes
    [
        'Padhai start… neend activated.',
        'Fridge trips: 0 (keep it up).',
        'Phone se door rehna… mushkil hai par mumkin hai.',
        'Aaj syllabus nahi… focus complete karo.',
        'Shabash! 20 seconds survive kar liye.',
        'Bas 5 seconds aur… hero ban jao!',
    ],
    // Set 5: Productivity / Study Habit Lines
    [
        'Breathe. Focus. Start.',
        'One distraction avoided = one win.',
        "You're building discipline right now.",
        'Stay with the task.',
        'Consistency beats motivation.',
        'Great! Time to begin.',
    ],
];

interface DownloadTimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDownload: () => Promise<void>;
}

const DownloadTimerModal: React.FC<DownloadTimerModalProps> = ({
    isOpen,
    onClose,
    onDownload,
}) => {
    const [timeLeft, setTimeLeft] = useState(30);
    const [isCopied, setIsCopied] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setTimeLeft(30);
            setProgress(0);
            setIsDownloading(false);
            setCurrentSetIndex(Math.floor(Math.random() * THOUGHT_SETS.length));

            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            const progressTimer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressTimer);
                        return 100;
                    }
                    return prev + 100 / 300; // Update every 100ms, total 300 steps for 30s
                });
            }, 100);

            return () => {
                clearInterval(timer);
                clearInterval(progressTimer);
            };
        }
    }, [isOpen]);

    const getThought = (secondsLeft: number) => {
        const elapsed = 30 - secondsLeft;
        const index = Math.min(Math.floor(elapsed / 5), 5);
        return THOUGHT_SETS[currentSetIndex][index];
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            await onDownload();
            onClose();
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to start download. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700'>
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'
                >
                    <X className='w-5 h-5' />
                </button>

                <div className='text-center mb-6'>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                        Preparing Your Download
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 text-sm'>
                        Please wait while we generate your secure download link.
                    </p>
                </div>

                {/* Animation Area */}
                <div className='relative h-40 mb-6 bg-sky-50 dark:bg-gray-900/50 rounded-xl overflow-hidden flex items-center justify-center border border-sky-100 dark:border-gray-700'>
                    {/* Running Student Animation */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                        {/* Track */}
                        <div className='absolute bottom-4 left-4 right-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                            <div
                                className='h-full bg-sky-500 transition-all duration-100 ease-linear'
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Character */}
                        <div
                            className='absolute bottom-5 transition-all duration-100 ease-linear'
                            style={{ left: `calc(${progress}% - 20px)` }}
                        >
                            <div className='relative'>
                                {/* Thought Bubble */}
                                {timeLeft > 0 && (
                                    <div className='absolute -top-25 left-1/2 -translate-x-1/2 w-48 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300'>
                                        <div className='bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md text-center relative'>
                                            <p className='text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed'>
                                                {getThought(timeLeft)}
                                            </p>
                                            {/* Bubble Tail */}
                                            <div className='absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 transform rotate-45'></div>
                                        </div>
                                    </div>
                                )}

                                <PersonStanding
                                    className={`w-10 h-10 text-sky-600 dark:text-sky-400 ${timeLeft > 0 ? 'animate-bounce' : ''}`}
                                />
                                {timeLeft > 0 && (
                                    <div className='absolute -top-6 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-sm'>
                                        {timeLeft}s
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Clouds/Decorations */}
                        {/* <div className="absolute top-4 left-10 text-gray-300 dark:text-gray-600 animate-pulse delay-75">
                            <svg width="40" height="20" viewBox="0 0 40 20" fill="currentColor">
                                <path d="M10 15a5 5 0 1 1 0-10 5 5 0 0 1 10 0 5 5 0 0 1 0 10z" />
                                <path d="M25 18a8 8 0 1 1 0-16 8 8 0 0 1 16 0 8 8 0 0 1 0 16z" />
                            </svg>
                        </div>
                        <div className="absolute top-8 right-12 text-gray-300 dark:text-gray-600 animate-pulse delay-300">
                             <svg width="30" height="15" viewBox="0 0 30 15" fill="currentColor">
                                <path d="M5 12a4 4 0 1 1 0-8 4 4 0 0 1 8 0 4 4 0 0 1 0 8z" />
                                <path d="M18 14a6 6 0 1 1 0-12 6 6 0 0 1 12 0 6 6 0 0 1 0 12z" />
                            </svg>
                        </div> */}
                    </div>
                </div>

                {/* Warning Message */}
                <div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6'>
                    <div className='flex gap-3'>
                        <div className='flex-shrink-0'>
                            <Share2 className='w-5 h-5 text-amber-600 dark:text-amber-400' />
                        </div>
                        <div>
                            <p className='text-sm font-medium text-amber-800 dark:text-amber-300 mb-1'>
                                Download is for offline use only
                            </p>
                            <p className='text-xs text-amber-700 dark:text-amber-400'>
                                Please share the link with friends instead of
                                the file to support us.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className='space-y-3'>
                    {timeLeft === 0 ? (
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className='w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-sky-500/25 animate-in slide-in-from-bottom-2 disabled:opacity-70 disabled:cursor-wait'
                        >
                            {isDownloading ? (
                                <>
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    Starting Download...
                                </>
                            ) : (
                                <>
                                    <Download className='w-5 h-5' />
                                    Download Now
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            disabled
                            className='w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-semibold py-3 px-4 rounded-xl cursor-not-allowed'
                        >
                            <div className='w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
                            Please wait {timeLeft}s...
                        </button>
                    )}

                    <button
                        onClick={handleCopyLink}
                        className='w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl transition-colors'
                    >
                        {isCopied ? (
                            <>
                                <Check className='w-4 h-4 text-green-500' />
                                <span className='text-green-600 dark:text-green-400'>
                                    Copied!
                                </span>
                            </>
                        ) : (
                            <>
                                <Copy className='w-4 h-4' />
                                <span>Copy Link to Share</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadTimerModal;
