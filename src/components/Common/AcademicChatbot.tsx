'use client';

import { useState, useEffect, useRef } from 'react';
import {
    MessageCircle,
    X,
    RotateCcw,
    ChevronRight,
    BookOpen,
    FileText,
    Video,
    Copy,
    Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/config/apiUrls';

interface ChatbotPreferences {
    collegeId?: string;
    collegeName?: string;
    collegeSlug?: string;
    courseId?: string;
    courseName?: string;
    branchId?: string;
    branchName?: string;
    semester?: number;
}

interface Message {
    id: string;
    type: 'bot' | 'user';
    text: string;
    options?: Array<ChatOption>;
    links?: Array<{
        title: string;
        url: string;
        type: string;
    }>;
    timestamp: Date;
}

interface ChatOption {
    label: string;
    value: string;
    action: string;
    courseName?: string;
    branchName?: string;
    subjectName?: string;
    collegeName?: string;
    collegeSlug?: string;
}

interface College {
    _id: string;
    name: string;
    slug: string;
}

interface Course {
    _id: string;
    courseName: string;
    courseCode: string;
}

interface Branch {
    _id: string;
    branchName: string;
    branchCode: string;
}

interface Subject {
    _id: string;
    subjectName: string;
    subjectCode: string;
}

interface PYQ {
    _id: string;
    title: string;
    slug: string;
    year: number;
    semester: number;
    subject: Subject;
    examType: string;
}

interface Note {
    _id: string;
    title: string;
    slug: string;
}

interface VideoType {
    _id: string;
    title: string;
    slug: string;
    videoUrl: string;
}

const STORAGE_KEY = 'chatbot_preferences';
const SESSION_KEY = 'chatbot_session_id';
const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v2';

export default function AcademicChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [preferences, setPreferences] = useState<ChatbotPreferences>({});
    const [loading, setLoading] = useState(false);
    const [copiedLink, setCopiedLink] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Generate or retrieve session ID
    useEffect(() => {
        let storedSessionId = localStorage.getItem(SESSION_KEY);
        if (!storedSessionId) {
            storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem(SESSION_KEY, storedSessionId);
        }
        setSessionId(storedSessionId);
    }, []);

    // Track chatbot usage
    const trackUsage = async (
        action: string,
        additionalData?: {
            collegeId?: string;
            courseId?: string;
            branchId?: string;
            subjectId?: string;
            semester?: number;
            resourceType?: string;
            resourceId?: string;
            resourceLink?: string;
        },
    ) => {
        if (!sessionId) return;

        try {
            await fetch(api.chatbot.track, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    sessionId,
                    action,
                    ...additionalData,
                }),
            });
        } catch (error) {
            console.error('Failed to track usage:', error);
        }
    };

    useEffect(() => {
        // Load preferences from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setPreferences(parsed);
            } catch (e) {
                console.error('Failed to parse preferences:', e);
            }
        }
    }, []);

    useEffect(() => {
        // Save preferences to localStorage
        if (Object.keys(preferences).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        }
    }, [preferences]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            initializeChat();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const initializeChat = () => {
        if (preferences.semester && preferences.branchId) {
            // User has semester set, show reset option and ask for subject
            addBotMessage(
                `Welcome back to ${preferences.collegeName}!\n\nYou're in Semester ${preferences.semester} of ${preferences.branchName}.\n\nLet me help you find resources.`,
                [
                    {
                        label: '🔄 Reset Preferences',
                        value: 'reset',
                        action: 'reset',
                    },
                ],
            );
            if (preferences.branchId) {
                fetchSubjects(preferences.branchId, preferences.semester);
            }
        } else {
            // First time user
            addBotMessage(
                "Hi! 👋 I'm your academic assistant. I can help you find PYQs, notes, and videos.\n\nLet's start by selecting your college:",
            );
            fetchColleges();
        }
    };

    const addBotMessage = (
        text: string,
        options?: Message['options'],
        links?: Message['links'],
    ) => {
        const message: Message = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'bot',
            text,
            options,
            links,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, message]);
    };

    const addUserMessage = (text: string) => {
        const message: Message = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'user',
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, message]);
    };

    const fetchColleges = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/chatbot/colleges`);
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const options = data.data.map((college: College) => ({
                    label: college.name,
                    value: college._id,
                    action: 'select_college',
                    collegeName: college.name,
                    collegeSlug: college.slug,
                }));

                addBotMessage('Please select your college:', options);
            } else {
                addBotMessage(
                    'Sorry, no colleges are available at the moment.',
                );
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
            addBotMessage(
                'Sorry, I encountered an error fetching colleges. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async (collegeSlug?: string) => {
        const slug = collegeSlug || preferences.collegeSlug;
        if (!slug) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/chatbot/${slug}/courses`);
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const options = data.data.map((course: Course) => ({
                    label: `${course.courseName} (${course.courseCode})`,
                    value: course._id,
                    action: 'select_course',
                    courseName: course.courseName,
                }));

                addBotMessage('Please select your course:', options);
            } else {
                addBotMessage('Sorry, no courses are available at the moment.');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            addBotMessage(
                'Sorry, I encountered an error fetching courses. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async (courseId: string) => {
        if (!preferences.collegeSlug) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE}/chatbot/${preferences.collegeSlug}/courses/${courseId}/branches`,
            );
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const options = data.data.map((branch: Branch) => ({
                    label: `${branch.branchName} (${branch.branchCode})`,
                    value: branch._id,
                    action: 'select_branch',
                    branchName: branch.branchName,
                }));

                addBotMessage('Great! Now select your branch:', options);
            } else {
                addBotMessage('Sorry, no branches available for this course.');
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            addBotMessage('Error fetching branches. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSemesters = async (branchId: string) => {
        if (!preferences.collegeSlug) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE}/chatbot/${preferences.collegeSlug}/branches/${branchId}/semesters`,
            );
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const options = data.data.map((sem: number) => ({
                    label: `Semester ${sem}`,
                    value: sem.toString(),
                    action: 'select_semester',
                }));

                addBotMessage('Which semester are you in?', options);
            } else {
                addBotMessage(
                    'Sorry, no semester information available for this branch.',
                );
            }
        } catch (error) {
            console.error('Error fetching semesters:', error);
            addBotMessage('Error fetching semesters. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async (branchId: string, semester: number) => {
        if (!preferences.collegeSlug) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE}/chatbot/${preferences.collegeSlug}/branches/${branchId}/semesters/${semester}/subjects`,
            );
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const options = data.data.map((subject: Subject) => ({
                    label: `${subject.subjectName} (${subject.subjectCode})`,
                    value: subject._id,
                    action: 'select_subject',
                    subjectName: subject.subjectName,
                }));

                addBotMessage('Select your subject:', options);
            } else {
                addBotMessage(
                    'Sorry, no subjects available for this semester.',
                );
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            addBotMessage('Error fetching subjects. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPYQs = async (subjectId: string, subjectName: string) => {
        if (!preferences.collegeSlug) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE}/chatbot/${preferences.collegeSlug}/subjects/${subjectId}/pyqs`,
            );
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const links = data.data.map((pyq: PYQ) => ({
                    title: `${pyq.subject.subjectName} (${pyq.year} - ${pyq.examType})`,
                    url: `/${preferences.collegeSlug}/pyqs/${pyq.slug}`,
                    type: 'pyq',
                }));

                addBotMessage(
                    `Here are the available PYQs for ${subjectName}:`,
                    undefined,
                    links,
                );
            } else {
                addBotMessage('No PYQs found for this subject yet.');
            }
        } catch (error) {
            console.error('Error fetching PYQs:', error);
            addBotMessage('Error fetching PYQs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchNotes = async (subjectId: string, subjectName: string) => {
        if (!preferences.collegeSlug) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE}/chatbot/${preferences.collegeSlug}/subjects/${subjectId}/notes`,
            );
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const links = data.data.map((note: Note) => ({
                    title: note.title,
                    url: `/${preferences.collegeSlug}/notes/${note.slug}`,
                    type: 'notes',
                }));

                addBotMessage(
                    `Here are the available notes for ${subjectName}:`,
                    undefined,
                    links,
                );
            } else {
                addBotMessage('No notes found for this subject yet.');
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            addBotMessage('Error fetching notes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchVideos = async (subjectId: string, subjectName: string) => {
        if (!preferences.collegeSlug) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE}/chatbot/${preferences.collegeSlug}/subjects/${subjectId}/videos`,
            );
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const links = data.data.map((video: VideoType) => ({
                    title: video.title,
                    url: `/${preferences.collegeSlug}/videos/${video.slug}`,
                    type: 'video',
                }));

                addBotMessage(
                    `Here are the available videos for ${subjectName}:`,
                    undefined,
                    links,
                );
            } else {
                addBotMessage('No videos found for this subject yet.');
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            addBotMessage('Error fetching videos. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = (option: ChatOption) => {
        addUserMessage(option.label);

        switch (option.action) {
            case 'select_college':
                const selectedCollegeSlug = option.collegeSlug;
                setPreferences((prev) => ({
                    ...prev,
                    collegeId: option.value,
                    collegeName: option.collegeName,
                    collegeSlug: selectedCollegeSlug,
                }));
                trackUsage('college', { collegeId: option.value });
                fetchCourses(selectedCollegeSlug);
                break;

            case 'select_course':
                setPreferences((prev) => ({
                    ...prev,
                    courseId: option.value,
                    courseName: option.courseName,
                }));
                trackUsage('course', { courseId: option.value });
                fetchBranches(option.value);
                break;

            case 'select_branch':
                setPreferences((prev) => ({
                    ...prev,
                    branchId: option.value,
                    branchName: option.branchName,
                }));
                trackUsage('branch', { branchId: option.value });
                fetchSemesters(option.value);
                break;

            case 'select_semester':
                const semester = parseInt(option.value);
                setPreferences((prev) => ({
                    ...prev,
                    semester,
                }));
                trackUsage('semester', { semester });
                if (preferences.branchId) {
                    fetchSubjects(preferences.branchId, semester);
                }
                break;

            case 'select_subject':
                trackUsage('subject', { subjectId: option.value });
                addBotMessage(
                    `Perfect! You've selected ${option.subjectName}. What would you like to explore?`,
                    [
                        {
                            label: '📄 Past Year Questions (PYQs)',
                            value: option.value,
                            action: 'fetch_pyqs',
                            subjectName: option.subjectName,
                        },
                        {
                            label: '📚 Notes',
                            value: option.value,
                            action: 'fetch_notes',
                            subjectName: option.subjectName,
                        },
                        {
                            label: '🎥 Video Lectures',
                            value: option.value,
                            action: 'fetch_videos',
                            subjectName: option.subjectName,
                        },
                    ],
                );
                break;

            case 'fetch_pyqs':
                trackUsage('pyq', {
                    subjectId: option.value,
                    resourceType: 'pyq',
                });
                fetchPYQs(option.value, option.subjectName || '');
                break;

            case 'fetch_notes':
                trackUsage('note', {
                    subjectId: option.value,
                    resourceType: 'note',
                });
                fetchNotes(option.value, option.subjectName || '');
                break;

            case 'fetch_videos':
                trackUsage('video', {
                    subjectId: option.value,
                    resourceType: 'video',
                });
                fetchVideos(option.value, option.subjectName || '');
                break;

            case 'reset':
                handleReset();
                break;
        }
    };

    const handleReset = () => {
        setPreferences({});
        localStorage.removeItem(STORAGE_KEY);
        setMessages([]);
        addBotMessage(
            "Preferences reset! Let's start fresh.\n\nPlease select your college:",
        );
        fetchColleges();
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className='fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 group'
                    >
                        <MessageCircle className='w-6 h-6' />
                        <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping'></span>
                        <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full'></span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className='fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700'
                    >
                        {/* Header */}
                        <div className='bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
                                    <BookOpen className='w-5 h-5' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-lg'>
                                        Academic Assistant
                                    </h3>
                                    <p className='text-xs text-blue-100'>
                                        Always here to help
                                    </p>
                                </div>
                            </div>
                            <div className='flex gap-2'>
                                {Object.keys(preferences).length > 0 && (
                                    <button
                                        onClick={handleReset}
                                        className='p-2 hover:bg-white/20 rounded-lg transition-colors'
                                        title='Reset preferences'
                                    >
                                        <RotateCcw className='w-4 h-4' />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className='p-2 hover:bg-white/20 rounded-lg transition-colors'
                                >
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] ${
                                            message.type === 'user'
                                                ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm'
                                        } px-4 py-2.5`}
                                    >
                                        <p className='text-sm whitespace-pre-line'>
                                            {message.text}
                                        </p>

                                        {/* Options */}
                                        {message.options && (
                                            <div className='mt-3 space-y-2'>
                                                {message.options.map(
                                                    (option, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() =>
                                                                handleOptionClick(
                                                                    option,
                                                                )
                                                            }
                                                            className='w-full text-left px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 transition-colors flex items-center justify-between group text-sm'
                                                        >
                                                            <span>
                                                                {option.label}
                                                            </span>
                                                            <ChevronRight className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity' />
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                        {/* Links */}
                                        {message.links && (
                                            <div className='mt-3 space-y-2'>
                                                {message.links.map(
                                                    (link, idx) => {
                                                        const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${link.url}`;
                                                        const linkId = `${message.id}-${idx}`;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className='flex items-center gap-2'
                                                            >
                                                                <a
                                                                    href={
                                                                        link.url
                                                                    }
                                                                    target='_blank'
                                                                    rel='noopener noreferrer'
                                                                    onClick={() => {
                                                                        // Track resource view
                                                                        trackUsage(
                                                                            link.type,
                                                                            {
                                                                                resourceType:
                                                                                    link.type ===
                                                                                    'notes'
                                                                                        ? 'note'
                                                                                        : link.type,
                                                                                resourceLink:
                                                                                    link.url,
                                                                            },
                                                                        );
                                                                    }}
                                                                    className='flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 transition-colors group text-sm'
                                                                >
                                                                    <div className='flex items-center gap-2'>
                                                                        {link.type ===
                                                                            'pyq' && (
                                                                            <FileText className='w-4 h-4 text-blue-600' />
                                                                        )}
                                                                        {link.type ===
                                                                            'notes' && (
                                                                            <BookOpen className='w-4 h-4 text-green-600' />
                                                                        )}
                                                                        {link.type ===
                                                                            'video' && (
                                                                            <Video className='w-4 h-4 text-red-600' />
                                                                        )}
                                                                        <span className='flex-1'>
                                                                            {
                                                                                link.title
                                                                            }
                                                                        </span>
                                                                        <ChevronRight className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity' />
                                                                    </div>
                                                                </a>
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(
                                                                            fullUrl,
                                                                        );
                                                                        setCopiedLink(
                                                                            linkId,
                                                                        );
                                                                        setTimeout(
                                                                            () =>
                                                                                setCopiedLink(
                                                                                    null,
                                                                                ),
                                                                            2000,
                                                                        );
                                                                    }}
                                                                    className='p-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors'
                                                                    title='Copy link'
                                                                >
                                                                    {copiedLink ===
                                                                    linkId ? (
                                                                        <Check className='w-4 h-4 text-green-600' />
                                                                    ) : (
                                                                        <Copy className='w-4 h-4' />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className='flex justify-start'>
                                    <div className='bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3'>
                                        <div className='flex gap-2'>
                                            <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                                            <div
                                                className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                                                style={{
                                                    animationDelay: '0.2s',
                                                }}
                                            ></div>
                                            <div
                                                className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                                                style={{
                                                    animationDelay: '0.4s',
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Footer */}
                        <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                            <div className='text-xs text-center text-gray-500 dark:text-gray-400'>
                                Powered by Student Senior AI 🤖
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
