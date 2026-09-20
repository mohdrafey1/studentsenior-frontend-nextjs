'use client';

import { useState, useEffect, useRef } from 'react';
import {
    X,
    RotateCcw,
    ChevronRight,
    BookOpen,
    FileText,
    Video,
    Copy,
    Check,
    Sparkles,
    Bot,
    ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
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
    subjectCode?: string;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                `Welcome back to ${preferences.collegeName || 'Student Senior'}!\n\nYou're viewing Semester ${preferences.semester} of ${preferences.branchName || 'your branch'}.\n\nHow can I assist your study session today?`,
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
                "Hi there! 👋 I'm your Student Senior Academic Assistant.\n\nI can help you find PYQs, study notes, videos, syllabus, and quick notes.\n\nLet's get started by choosing your college:",
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

                addBotMessage('Which semester are you currently in?', options);
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
                    subjectCode: subject.subjectCode,
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
                        {
                            label: '📝 Syllabus',
                            value: option.value,
                            action: 'redirect_syllabus',
                            subjectName: option.subjectName,
                            subjectCode: option.subjectCode,
                        },
                        {
                            label: '⚡ Quick Notes',
                            value: option.value,
                            action: 'redirect_quicknotes',
                            subjectName: option.subjectName,
                            subjectCode: option.subjectCode,
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

            case 'redirect_syllabus':
                if (
                    preferences.collegeSlug &&
                    option.subjectName &&
                    option.subjectCode
                ) {
                    const cleanSubjectName = option.subjectName
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, '-');
                    const cleanSubjectCode = option.subjectCode
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, '-');

                    const syllabusSlug = `${cleanSubjectName}-${cleanSubjectCode}`;

                    window.open(
                        `/${preferences.collegeSlug}/syllabus/${syllabusSlug}`,
                        '_blank',
                    );
                } else {
                    toast.error('Missing data for syllabus redirection');
                }
                break;

            case 'redirect_quicknotes':
                if (preferences.collegeSlug && option.subjectCode) {
                    window.open(
                        `/${preferences.collegeSlug}/quicknotes/${option.subjectCode}`,
                        '_blank',
                    );
                }
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
            {/* Floating Trigger Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, y: 10 }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setIsOpen(true)}
                        className='fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3.5 bg-[#0075de] hover:bg-[#0066c4] text-white rounded-full shadow-lg shadow-[#0075de]/30 hover:shadow-xl hover:shadow-[#0075de]/40 border border-white/20 transition-all group'
                        aria-label='Open Academic Assistant'
                    >
                        <div className='relative flex items-center justify-center'>
                            <Sparkles className='w-5 h-5 group-hover:rotate-12 transition-transform duration-300' />
                            <span className='absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0075de] animate-pulse'></span>
                        </div>
                        <span className='text-xs font-semibold tracking-wide pr-1 hidden sm:inline-block'>
                            AI Assistant
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.95 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className='fixed bottom-6 right-6 z-50 w-[380px] sm:w-[400px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-3rem)] bg-white dark:bg-[#1c1c1c] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#e6e6e6] dark:border-[#2f2f2f]'
                    >
                        {/* Header */}
                        <div className='px-5 py-4 bg-white dark:bg-[#202020] border-b border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0075de] to-[#00a6ff] text-white flex items-center justify-center shadow-xs'>
                                    <Bot className='w-5 h-5' />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-bold text-sm text-[#191919] dark:text-[#ececec]'>
                                            Academic Assistant
                                        </h3>
                                        <span className='inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'>
                                            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                                            Online
                                        </span>
                                    </div>
                                    <p className='text-[11px] text-[#787774] dark:text-[#9b9a97] truncate max-w-[200px]'>
                                        {preferences.collegeName
                                            ? preferences.collegeName
                                            : 'Student Senior Smart AI'}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center gap-1'>
                                {Object.keys(preferences).length > 0 && (
                                    <button
                                        onClick={handleReset}
                                        className='p-2 rounded-xl text-[#787774] dark:text-[#9b9a97] hover:text-[#0075de] dark:hover:text-[#0075de] hover:bg-[#faf9f8] dark:hover:bg-[#282828] transition-colors'
                                        title='Reset preferences'
                                        aria-label='Reset preferences'
                                    >
                                        <RotateCcw className='w-4 h-4' />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className='p-2 rounded-xl text-[#787774] dark:text-[#9b9a97] hover:text-[#191919] dark:hover:text-white hover:bg-[#faf9f8] dark:hover:bg-[#282828] transition-colors'
                                    aria-label='Close Chat'
                                >
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className='flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#faf9f8] dark:bg-[#161616]'>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-start gap-2.5 ${
                                        message.type === 'user'
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    {message.type === 'bot' && (
                                        <div className='w-7 h-7 rounded-xl bg-[#0075de]/10 text-[#0075de] border border-[#0075de]/20 flex items-center justify-center shrink-0 mt-0.5'>
                                            <Sparkles className='w-3.5 h-3.5' />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[85%] ${
                                            message.type === 'user'
                                                ? 'bg-[#0075de] text-white rounded-2xl rounded-tr-xs shadow-xs font-medium'
                                                : 'bg-white dark:bg-[#202020] text-[#191919] dark:text-[#ececec] rounded-2xl rounded-tl-xs border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-2xs'
                                        } px-4 py-3`}
                                    >
                                        <p className='text-xs sm:text-sm whitespace-pre-line leading-relaxed'>
                                            {message.text}
                                        </p>

                                        {/* Options Grid */}
                                        {message.options && (
                                            <div className='mt-3 space-y-1.5'>
                                                {message.options.map(
                                                    (option, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() =>
                                                                handleOptionClick(
                                                                    option,
                                                                )
                                                            }
                                                            className='w-full text-left px-3.5 py-2.5 bg-[#faf9f8] dark:bg-[#252525] hover:bg-[#0075de]/5 dark:hover:bg-[#0075de]/15 hover:border-[#0075de]/40 text-[#191919] dark:text-[#ececec] rounded-xl border border-[#e6e6e6] dark:border-[#333333] transition-all flex items-center justify-between group text-xs font-medium active:scale-[0.99]'
                                                        >
                                                            <span className='truncate pr-2'>
                                                                {option.label}
                                                            </span>
                                                            <ChevronRight className='w-3.5 h-3.5 text-[#787774] dark:text-[#9b9a97] group-hover:text-[#0075de] group-hover:translate-x-0.5 transition-all shrink-0' />
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                        {/* Links Resource Cards */}
                                        {message.links && (
                                            <div className='mt-3 space-y-2'>
                                                {message.links.map(
                                                    (link, idx) => {
                                                        const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${link.url}`;
                                                        const linkId = `${message.id}-${idx}`;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className='flex items-center gap-1.5'
                                                            >
                                                                <a
                                                                    href={
                                                                        link.url
                                                                    }
                                                                    target='_blank'
                                                                    rel='noopener noreferrer'
                                                                    onClick={() => {
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
                                                                    className='flex-1 px-3.5 py-2.5 bg-[#faf9f8] dark:bg-[#252525] hover:bg-[#0075de]/5 dark:hover:bg-[#0075de]/15 hover:border-[#0075de]/40 text-[#191919] dark:text-[#ececec] rounded-xl border border-[#e6e6e6] dark:border-[#333333] transition-all group text-xs font-medium flex items-center justify-between overflow-hidden'
                                                                >
                                                                    <div className='flex items-center gap-2.5 truncate'>
                                                                        {link.type ===
                                                                            'pyq' && (
                                                                            <div className='w-6 h-6 rounded-lg bg-[#0075de]/10 text-[#0075de] flex items-center justify-center shrink-0'>
                                                                                <FileText className='w-3.5 h-3.5' />
                                                                            </div>
                                                                        )}
                                                                        {link.type ===
                                                                            'notes' && (
                                                                            <div className='w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0'>
                                                                                <BookOpen className='w-3.5 h-3.5' />
                                                                            </div>
                                                                        )}
                                                                        {link.type ===
                                                                            'video' && (
                                                                            <div className='w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0'>
                                                                                <Video className='w-3.5 h-3.5' />
                                                                            </div>
                                                                        )}
                                                                        <span className='truncate'>
                                                                            {
                                                                                link.title
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <ExternalLink className='w-3.5 h-3.5 text-[#787774] dark:text-[#9b9a97] group-hover:text-[#0075de] opacity-70 group-hover:opacity-100 transition-all shrink-0 ml-1.5' />
                                                                </a>

                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(
                                                                            fullUrl,
                                                                        );
                                                                        setCopiedLink(
                                                                            linkId,
                                                                        );
                                                                        toast.success(
                                                                            'Link copied!',
                                                                        );
                                                                        setTimeout(
                                                                            () =>
                                                                                setCopiedLink(
                                                                                    null,
                                                                                ),
                                                                            2000,
                                                                        );
                                                                    }}
                                                                    className='p-2.5 bg-[#faf9f8] dark:bg-[#252525] hover:bg-gray-200 dark:hover:bg-[#333333] text-[#787774] dark:text-[#9b9a97] rounded-xl border border-[#e6e6e6] dark:border-[#333333] transition-colors shrink-0'
                                                                    title='Copy link'
                                                                    aria-label='Copy link'
                                                                >
                                                                    {copiedLink ===
                                                                    linkId ? (
                                                                        <Check className='w-3.5 h-3.5 text-emerald-600' />
                                                                    ) : (
                                                                        <Copy className='w-3.5 h-3.5' />
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

                            {/* Typing Indicator */}
                            {loading && (
                                <div className='flex items-start gap-2.5 justify-start'>
                                    <div className='w-7 h-7 rounded-xl bg-[#0075de]/10 text-[#0075de] border border-[#0075de]/20 flex items-center justify-center shrink-0'>
                                        <Sparkles className='w-3.5 h-3.5' />
                                    </div>
                                    <div className='bg-white dark:bg-[#202020] rounded-2xl rounded-tl-xs px-4 py-3 border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-2xs'>
                                        <div className='flex items-center gap-1.5'>
                                            <div className='w-2 h-2 bg-[#0075de] rounded-full animate-bounce'></div>
                                            <div
                                                className='w-2 h-2 bg-[#0075de] rounded-full animate-bounce'
                                                style={{
                                                    animationDelay: '0.15s',
                                                }}
                                            ></div>
                                            <div
                                                className='w-2 h-2 bg-[#0075de] rounded-full animate-bounce'
                                                style={{
                                                    animationDelay: '0.3s',
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Footer */}
                        <div className='px-4 py-3 bg-white dark:bg-[#202020] border-t border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-between'>
                            {/* <div className='inline-flex items-center gap-1.5 text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                                <Zap className='w-3.5 h-3.5 text-[#0075de]' />
                                <span>Student Senior AI</span>
                            </div> */}
                            <span className='text-[10px] font-mono text-[#787774] dark:text-[#9b9a97] opacity-60'>
                                v2.0
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
