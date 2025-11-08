'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Lightweight shimmer placeholder while chatbot JS loads
function ChatbotFallback() {
    return (
        <div className='fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse shadow-lg' />
    );
}

// Dynamic import WITHIN a client component to allow ssr:false
const AcademicChatbot = dynamic(() => import('./AcademicChatbot'), {
    ssr: false,
    loading: () => <ChatbotFallback />,
});

export default function AcademicChatbotLazy() {
    return <AcademicChatbot />;
}
