import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css'; // or any other style

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    className = '',
}) => {
    return (
        <div className={`w-full ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                components={{
                    h1: ({ ...props }) => (
                        <h1
                            className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2'
                            {...props}
                        />
                    ),
                    h2: ({ ...props }) => (
                        <h2
                            className='text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3'
                            {...props}
                        />
                    ),
                    h3: ({ ...props }) => (
                        <h3
                            className='text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2'
                            {...props}
                        />
                    ),
                    p: ({ ...props }) => (
                        <p
                            className='text-base text-gray-700 dark:text-gray-300 leading-7 mb-4'
                            {...props}
                        />
                    ),
                    ul: ({ ...props }) => (
                        <ul
                            className='list-disc list-outside ml-6 mb-4 space-y-1 text-gray-700 dark:text-gray-300'
                            {...props}
                        />
                    ),
                    ol: ({ ...props }) => (
                        <ol
                            className='list-decimal list-outside ml-6 mb-4 space-y-1 text-gray-700 dark:text-gray-300'
                            {...props}
                        />
                    ),
                    li: ({ ...props }) => <li className='pl-1' {...props} />,
                    blockquote: ({ ...props }) => (
                        <blockquote
                            className='border-l-4 border-indigo-500 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 my-4 rounded-r-lg italic text-gray-700 dark:text-gray-300 shadow-sm'
                            {...props}
                        />
                    ),
                    code: ({
                        inline,
                        className,
                        children,
                        ...props
                    }: React.ComponentPropsWithoutRef<'code'> & {
                        inline?: boolean;
                    }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            // Block code is handled by pre, but if it falls here:
                            <code className={className} {...props}>
                                {children}
                            </code>
                        ) : (
                            <code
                                className='bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono text-sm font-medium'
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    pre: ({ ...props }) => (
                        <div className='rounded-lg overflow-hidden my-4 shadow-md border border-gray-200 dark:border-gray-700'>
                            <pre
                                className='bg-[#0d1117] p-4 overflow-x-auto text-sm text-gray-100'
                                {...props}
                            />
                        </div>
                    ),
                    table: ({ ...props }) => (
                        <div className='overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'>
                            <table
                                className='min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm'
                                {...props}
                            />
                        </div>
                    ),
                    thead: ({ ...props }) => (
                        <thead
                            className='bg-gray-50 dark:bg-gray-800'
                            {...props}
                        />
                    ),
                    tbody: ({ ...props }) => (
                        <tbody
                            className='divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900'
                            {...props}
                        />
                    ),
                    tr: ({ ...props }) => (
                        <tr
                            className='hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'
                            {...props}
                        />
                    ),
                    th: ({ ...props }) => (
                        <th
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                            {...props}
                        />
                    ),
                    td: ({ ...props }) => (
                        <td
                            className='px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300'
                            {...props}
                        />
                    ),
                    img: ({ ...props }) => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            className='rounded-lg shadow-md max-w-full h-auto my-4 mx-auto border border-gray-200 dark:border-gray-700'
                            {...props}
                            alt={props.alt || 'Markdown Image'}
                        />
                    ),
                    a: ({ ...props }) => (
                        <a
                            {...props}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline underline-offset-2 decoration-indigo-300 dark:decoration-indigo-700 transition-colors'
                        />
                    ),
                    // hr
                    hr: ({ ...props }) => (
                        <hr
                            className='my-8 border-gray-200 dark:border-gray-700'
                            {...props}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
