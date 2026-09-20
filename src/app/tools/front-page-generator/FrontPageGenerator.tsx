'use client';

import React, { useState, useRef } from 'react';
import {
    Printer,
    RotateCcw,
    Upload,
    Eye,
    Edit3,
    GraduationCap,
    School,
    User,
    BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

type TemplateType = 'standard' | 'lab' | 'modern' | 'formal';

interface FormData {
    collegeName: string;
    department: string;
    session: string;
    documentType: string;
    title: string;
    subjectName: string;
    subjectCode: string;
    studentName: string;
    rollNumber: string;
    semester: string;
    branch: string;
    section: string;
    facultyName: string;
    facultyDesignation: string;
    submissionDate: string;
    includeSignatures: boolean;
    logoUrl: string | null;
}

const DEFAULT_DATA: FormData = {
    collegeName: 'DR. A.P.J. ABDUL KALAM TECHNICAL UNIVERSITY',
    department: 'DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING',
    session: '2025 – 2026',
    documentType: 'LAB PRACTICAL FILE',
    title: 'DATA STRUCTURES & ALGORITHMS LAB',
    subjectName: 'Data Structures & Algorithms',
    subjectCode: 'BCS-301',
    studentName: 'Rahul Sharma',
    rollNumber: '2200970100045',
    semester: '3rd Semester',
    branch: 'B.Tech (CSE)',
    section: 'CSE-A',
    facultyName: 'Dr. Amit Verma',
    facultyDesignation: 'Assistant Professor',
    submissionDate: new Date().toISOString().split('T')[0],
    includeSignatures: true,
    logoUrl: null,
};

export default function FrontPageGenerator() {
    const [formData, setFormData] = useState<FormData>(DEFAULT_DATA);
    const [template, setTemplate] = useState<TemplateType>('standard');
    const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
    const [isPrinting, setIsPrinting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Logo image must be smaller than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
                toast.success('Logo uploaded successfully');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setFormData((prev) => ({ ...prev, logoUrl: null }));
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.success('Logo removed');
    };

    // Full-Width 1-Page A4 Print Engine
    const handlePrint = () => {
        setIsPrinting(true);
        toast.loading('Preparing full-width A4 document...', { id: 'print-toast' });

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.zIndex = '-9999';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) {
            toast.error('Print initialization failed', { id: 'print-toast' });
            setIsPrinting(false);
            return;
        }

        const printHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>${formData.title || 'Assignment Front Page'}</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }
                    html, body {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 0;
                        background: #ffffff;
                        color: #000000;
                        font-family: "Times New Roman", Times, Georgia, serif;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .print-page {
                        width: 210mm;
                        height: 297mm;
                        padding: 18mm 20mm;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        box-sizing: border-box;
                        background: #ffffff;
                    }
                    .double-border-outer {
                        position: absolute;
                        inset: 10mm;
                        border: 3px solid #000000;
                        pointer-events: none;
                    }
                    .double-border-inner {
                        position: absolute;
                        inset: 2.5mm;
                        border: 1px solid #000000;
                    }
                    .print-header {
                        text-align: center;
                        position: relative;
                        z-index: 10;
                        padding-top: 4mm;
                    }
                    .print-college-name {
                        font-size: 21pt;
                        font-weight: 900;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        line-height: 1.25;
                        margin-bottom: 3mm;
                    }
                    .print-department {
                        font-size: 11pt;
                        font-weight: bold;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-family: Arial, sans-serif;
                        color: #222222;
                        margin-bottom: 3mm;
                    }
                    .print-logo-box {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 3mm 0;
                    }
                    .print-logo {
                        max-height: 28mm;
                        width: auto;
                        object-fit: contain;
                    }
                    .print-session {
                        font-size: 11pt;
                        font-weight: bold;
                        letter-spacing: 1.5px;
                        font-family: Arial, sans-serif;
                        text-transform: uppercase;
                        color: #333333;
                        margin-top: 3mm;
                    }
                    .print-body {
                        text-align: center;
                        position: relative;
                        z-index: 10;
                        margin: 3mm 0;
                    }
                    .print-doc-type-box {
                        display: inline-block;
                        border-top: 2px solid #000000;
                        border-bottom: 2px solid #000000;
                        padding: 2mm 8mm;
                        margin-bottom: 5mm;
                    }
                    .print-doc-type {
                        font-size: 16pt;
                        font-weight: 900;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        font-family: Arial, sans-serif;
                    }
                    .print-topic-title {
                        font-size: 13pt;
                        font-weight: bold;
                        line-height: 1.5;
                        margin-bottom: 3mm;
                    }
                    .print-title-underlined {
                        font-size: 17pt;
                        font-weight: 900;
                        text-transform: uppercase;
                        text-decoration: underline;
                        text-underline-offset: 3px;
                        display: inline-block;
                        margin-top: 2mm;
                    }
                    .print-subject-code {
                        font-size: 11pt;
                        font-weight: bold;
                        font-family: Arial, sans-serif;
                        color: #333333;
                        margin-top: 2mm;
                    }
                    .print-footer {
                        position: relative;
                        z-index: 10;
                        padding-bottom: 4mm;
                    }
                    .print-submission-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15mm;
                        border-top: 1px solid #777777;
                        padding-top: 5mm;
                    }
                    .print-submitted-by {
                        text-align: left;
                    }
                    .print-submitted-to {
                        text-align: right;
                    }
                    .print-label {
                        font-size: 9.5pt;
                        font-weight: bold;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        font-family: Arial, sans-serif;
                        color: #444444;
                        margin-bottom: 1.5mm;
                    }
                    .print-name {
                        font-size: 14pt;
                        font-weight: bold;
                        margin-bottom: 1.5mm;
                    }
                    .print-detail {
                        font-size: 11pt;
                        font-family: Arial, sans-serif;
                        color: #222222;
                        line-height: 1.4;
                    }
                    .print-signatures-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15mm;
                        margin-top: 14mm;
                        font-size: 10.5pt;
                        font-family: Arial, sans-serif;
                        color: #333333;
                    }
                    .print-sig-left {
                        border-top: 1px solid #777777;
                        padding-top: 2mm;
                        text-align: left;
                    }
                    .print-sig-right {
                        border-top: 1px solid #777777;
                        padding-top: 2mm;
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <div class="print-page">
                    ${template !== 'modern' ? `
                        <div class="double-border-outer">
                            <div class="double-border-inner"></div>
                        </div>
                    ` : ''}

                    <!-- Header -->
                    <div class="print-header">
                        <h1 class="print-college-name">${formData.collegeName || 'COLLEGE / UNIVERSITY NAME'}</h1>
                        ${formData.department ? `<p class="print-department">${formData.department}</p>` : ''}
                        
                        <div class="print-logo-box">
                            ${formData.logoUrl ? `<img src="${formData.logoUrl}" class="print-logo" alt="Logo" />` : ''}
                        </div>

                        <p class="print-session">ACADEMIC SESSION: ${formData.session || '2025 – 2026'}</p>
                    </div>

                    <!-- Middle Body -->
                    <div class="print-body">
                        <div class="print-doc-type-box">
                            <h2 class="print-doc-type">${formData.documentType || 'LAB PRACTICAL FILE'}</h2>
                        </div>
                        ${formData.subjectName ? `
                            <p class="print-topic-title">
                                ON<br />
                                <span class="print-title-underlined">&ldquo;${formData.title || formData.subjectName}&rdquo;</span>
                            </p>
                        ` : ''}
                        ${formData.subjectCode ? `<p class="print-subject-code">Course Code: ${formData.subjectCode}</p>` : ''}
                    </div>

                    <!-- Footer Info -->
                    <div class="print-footer">
                        <div class="print-submission-grid">
                            <div class="print-submitted-by">
                                <p class="print-label">SUBMITTED BY:</p>
                                <p class="print-name">${formData.studentName || 'Student Name'}</p>
                                <p class="print-detail"><strong>Roll No:</strong> ${formData.rollNumber || '—'}</p>
                                <p class="print-detail"><strong>Branch:</strong> ${formData.branch || '—'}</p>
                                <p class="print-detail"><strong>Semester:</strong> ${formData.semester || '—'} (${formData.section || 'Sec'})</p>
                            </div>
                            <div class="print-submitted-to">
                                <p class="print-label">SUBMITTED TO:</p>
                                <p class="print-name">${formData.facultyName || 'Professor Name'}</p>
                                <p class="print-detail">${formData.facultyDesignation || 'Assistant Professor'}</p>
                                <p class="print-detail">${formData.department || 'Department'}</p>
                            </div>
                        </div>

                        ${formData.includeSignatures ? `
                            <div class="print-signatures-grid">
                                <div class="print-sig-left">Student Signature</div>
                                <div class="print-sig-right">Faculty Signature</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </body>
            </html>
        `;

        doc.open();
        doc.write(printHtml);
        doc.close();

        setTimeout(() => {
            toast.dismiss('print-toast');
            try {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
            } catch (err) {
                console.error(err);
            }
            setIsPrinting(false);
            setTimeout(() => {
                try {
                    document.body.removeChild(iframe);
                } catch {
                    // Ignore removal error
                }
            }, 1000);
        }, 350);
    };

    const handleReset = () => {
        setFormData(DEFAULT_DATA);
        setTemplate('standard');
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.success('Reset to default values');
    };

    return (
        <div className='space-y-6'>
            {/* Top Toolbar / Template Selector */}
            <div className='p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-4'>
                {/* Template Chips */}
                <div className='flex items-center gap-1.5 p-1 bg-[#faf9f8] dark:bg-[#242424] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] w-full md:w-auto overflow-x-auto'>
                    <button
                        onClick={() => setTemplate('standard')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            template === 'standard'
                                ? 'bg-white dark:bg-[#333] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        Standard University
                    </button>
                    <button
                        onClick={() => setTemplate('lab')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            template === 'lab'
                                ? 'bg-white dark:bg-[#333] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        Lab Practical File
                    </button>
                    <button
                        onClick={() => setTemplate('modern')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            template === 'modern'
                                ? 'bg-white dark:bg-[#333] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        Modern Project
                    </button>
                    <button
                        onClick={() => setTemplate('formal')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            template === 'formal'
                                ? 'bg-white dark:bg-[#333] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        Formal Academic
                    </button>
                </div>

                {/* Print & Action Buttons */}
                <div className='flex items-center gap-2 w-full md:w-auto justify-end'>
                    <button
                        onClick={handleReset}
                        className='p-2 sm:px-3 sm:py-2 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#615d59] dark:text-[#a09e9a] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs'
                        title='Reset form'
                    >
                        <RotateCcw className='w-3.5 h-3.5' />
                        <span className='hidden sm:inline'>Reset</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        disabled={isPrinting}
                        className='flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98] disabled:opacity-75'
                    >
                        <Printer className='w-4 h-4' />
                        <span>{isPrinting ? 'Preparing A4...' : 'Print Full A4 Page'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className='lg:hidden flex p-1 bg-[#f0eee9] dark:bg-[#242424] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                <button
                    onClick={() => setMobileTab('editor')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        mobileTab === 'editor'
                            ? 'bg-white dark:bg-[#333] text-[#101828] dark:text-white shadow-xs'
                            : 'text-[#615d59] dark:text-[#a09e9a]'
                    }`}
                >
                    <Edit3 className='w-3.5 h-3.5' />
                    <span>Edit Information</span>
                </button>
                <button
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        mobileTab === 'preview'
                            ? 'bg-white dark:bg-[#333] text-[#0075de] dark:text-[#62aef0] shadow-xs'
                            : 'text-[#615d59] dark:text-[#a09e9a]'
                    }`}
                >
                    <Eye className='w-3.5 h-3.5' />
                    <span>View A4 Preview</span>
                </button>
            </div>

            {/* Split Screen Editor & Live Responsive A4 Preview */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start'>
                {/* ---------------------------------------------------- */}
                {/* LEFT: FORM CONTROLS */}
                {/* ---------------------------------------------------- */}
                <div
                    className={`lg:col-span-5 space-y-5 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${
                        mobileTab === 'preview' ? 'hidden lg:block' : 'block'
                    }`}
                >
                    <div className='flex items-center gap-2 pb-2 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <School className='w-4 h-4 text-[#0075de]' />
                        <h2 className='text-xs font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            1. Institution & Logo
                        </h2>
                    </div>

                    <div className='space-y-3 text-xs'>
                        <div>
                            <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                College / University Name
                            </label>
                            <input
                                type='text'
                                value={formData.collegeName}
                                onChange={(e) => handleInputChange('collegeName', e.target.value)}
                                placeholder='e.g., AKTU / Galgotias / IIT'
                                className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all font-medium'
                            />
                        </div>

                        <div>
                            <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                Department / Branch
                            </label>
                            <input
                                type='text'
                                value={formData.department}
                                onChange={(e) => handleInputChange('department', e.target.value)}
                                placeholder='e.g., Department of Computer Science & Engineering'
                                className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                            />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    Academic Session
                                </label>
                                <input
                                    type='text'
                                    value={formData.session}
                                    onChange={(e) => handleInputChange('session', e.target.value)}
                                    placeholder='e.g., 2025 – 2026'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>

                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    College Emblem / Logo
                                </label>
                                <input
                                    type='file'
                                    ref={fileInputRef}
                                    onChange={handleLogoUpload}
                                    accept='image/*'
                                    className='hidden'
                                />
                                <div className='flex items-center gap-2'>
                                    <button
                                        type='button'
                                        onClick={() => fileInputRef.current?.click()}
                                        className='flex-1 px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#0075de] rounded-xl text-left text-[#615d59] dark:text-[#a09e9a] hover:text-[#0075de] flex items-center gap-1.5 transition-all truncate'
                                    >
                                        <Upload className='w-3.5 h-3.5 shrink-0' />
                                        <span className='truncate'>{formData.logoUrl ? 'Change' : 'Upload Logo'}</span>
                                    </button>
                                    {formData.logoUrl && (
                                        <button
                                            type='button'
                                            onClick={handleRemoveLogo}
                                            className='p-2 bg-[#fdf2f2] text-[#e11d48] rounded-xl'
                                            title='Remove logo'
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Assignment & Subject */}
                    <div className='flex items-center gap-2 pt-3 pb-2 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <BookOpen className='w-4 h-4 text-[#1aae39]' />
                        <h2 className='text-xs font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            2. Document & Subject Details
                        </h2>
                    </div>

                    <div className='space-y-3 text-xs'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    Document Type
                                </label>
                                <input
                                    type='text'
                                    value={formData.documentType}
                                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                                    placeholder='e.g., LAB PRACTICAL FILE / ASSIGNMENT'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all font-semibold'
                                />
                            </div>

                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    Subject Code
                                </label>
                                <input
                                    type='text'
                                    value={formData.subjectCode}
                                    onChange={(e) => handleInputChange('subjectCode', e.target.value)}
                                    placeholder='e.g., BCS-301'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                Subject Name / Course Title
                            </label>
                            <input
                                type='text'
                                value={formData.subjectName}
                                onChange={(e) => handleInputChange('subjectName', e.target.value)}
                                placeholder='e.g., Data Structures & Algorithms'
                                className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                            />
                        </div>

                        <div>
                            <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                Main Title / Topic Name
                            </label>
                            <input
                                type='text'
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder='e.g., IMPLEMENTATION OF SEARCHING & SORTING ALGORITHMS'
                                className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                            />
                        </div>
                    </div>

                    {/* Section 3: Student Details */}
                    <div className='flex items-center gap-2 pt-3 pb-2 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <User className='w-4 h-4 text-[#8a3fd6]' />
                        <h2 className='text-xs font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            3. Student Details (Submitted By)
                        </h2>
                    </div>

                    <div className='space-y-3 text-xs'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    Student Full Name
                                </label>
                                <input
                                    type='text'
                                    value={formData.studentName}
                                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                                    placeholder='e.g., Rahul Sharma'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all font-semibold'
                                />
                            </div>

                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    University Roll Number
                                </label>
                                <input
                                    type='text'
                                    value={formData.rollNumber}
                                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                                    placeholder='e.g., 2200970100045'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-3 gap-2.5'>
                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    Branch
                                </label>
                                <input
                                    type='text'
                                    value={formData.branch}
                                    onChange={(e) => handleInputChange('branch', e.target.value)}
                                    placeholder='e.g., B.Tech CSE'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>

                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    Semester
                                </label>
                                <input
                                    type='text'
                                    value={formData.semester}
                                    onChange={(e) => handleInputChange('semester', e.target.value)}
                                    placeholder='e.g., 3rd Sem'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>

                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    Section
                                </label>
                                <input
                                    type='text'
                                    value={formData.section}
                                    onChange={(e) => handleInputChange('section', e.target.value)}
                                    placeholder='e.g., CSE-A'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Faculty Details */}
                    <div className='flex items-center gap-2 pt-3 pb-2 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <GraduationCap className='w-4 h-4 text-[#dd5b00]' />
                        <h2 className='text-xs font-bold uppercase tracking-wider text-[#615d59] dark:text-[#a09e9a]'>
                            4. Faculty Details (Submitted To)
                        </h2>
                    </div>

                    <div className='space-y-3 text-xs'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    Faculty / Professor Name
                                </label>
                                <input
                                    type='text'
                                    value={formData.facultyName}
                                    onChange={(e) => handleInputChange('facultyName', e.target.value)}
                                    placeholder='e.g., Dr. Amit Verma'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all font-semibold'
                                />
                            </div>

                            <div>
                                <label className='block font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                    Designation
                                </label>
                                <input
                                    type='text'
                                    value={formData.facultyDesignation}
                                    onChange={(e) => handleInputChange('facultyDesignation', e.target.value)}
                                    placeholder='e.g., Assistant Professor'
                                    className='w-full px-3 py-2 bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-[#101828] dark:text-[#ededed] focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>
                        </div>

                        <div className='flex items-center justify-between pt-2'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={formData.includeSignatures}
                                    onChange={(e) => handleInputChange('includeSignatures', e.target.checked)}
                                    className='rounded text-[#0075de]'
                                />
                                <span className='text-xs text-[#615d59] dark:text-[#a09e9a]'>
                                    Include Signature & Date lines
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* RIGHT: LIVE FULLY RESPONSIVE A4 PREVIEW CANVAS */}
                {/* ---------------------------------------------------- */}
                <div
                    className={`lg:col-span-7 space-y-3 lg:sticky lg:top-6 ${
                        mobileTab === 'editor' ? 'hidden lg:block' : 'block'
                    }`}
                >
                    <div className='flex items-center justify-between px-2 text-xs font-semibold text-[#615d59] dark:text-[#a09e9a]'>
                        <span className='flex items-center gap-1.5'>
                            <Eye className='w-3.5 h-3.5 text-[#0075de]' /> Live Responsive Sheet Preview
                        </span>
                        <span className='text-[11px] text-[#1aae39] dark:text-[#4ade80] font-bold'>
                            ✓ 1-Page A4 Proportion
                        </span>
                    </div>

                    {/* Paper Sheet Preview Container (Smoothly scales on all screens) */}
                    <div className='p-3 sm:p-6 md:p-8 bg-[#f0eee9] dark:bg-[#111111] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] flex justify-center items-center overflow-hidden'>
                        <div
                            id='printable-frontpage'
                            className='w-full max-w-[560px] aspect-[1/1.414] bg-white text-black p-4 sm:p-7 md:p-9 shadow-2xl rounded-xs relative flex flex-col justify-between select-none font-serif transition-all'
                        >
                            {/* Outer Decorative Double Border for Standard / Lab / Formal */}
                            {template !== 'modern' && (
                                <div className='border-box-standard absolute inset-2.5 sm:inset-4 md:inset-5 border-2 sm:border-[3px] border-black pointer-events-none'>
                                    <div className='border-box-inner absolute inset-1 sm:inset-1.5 border border-black' />
                                </div>
                            )}

                            {/* Top Header: College & Department */}
                            <div className='text-center space-y-1 sm:space-y-2 z-10 pt-1'>
                                <h1 className='text-xs sm:text-base md:text-lg lg:text-xl font-black tracking-wide uppercase text-black font-serif leading-tight px-2'>
                                    {formData.collegeName || 'COLLEGE / UNIVERSITY NAME'}
                                </h1>

                                {formData.department && (
                                    <p className='text-[9px] sm:text-[11px] md:text-xs font-bold tracking-wider uppercase text-gray-800 font-sans px-2'>
                                        {formData.department}
                                    </p>
                                )}

                                {/* College Logo */}
                                <div className='py-1.5 sm:py-3 flex justify-center items-center'>
                                    {formData.logoUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={formData.logoUrl}
                                            alt='College Logo'
                                            className='h-12 sm:h-20 md:h-24 w-auto object-contain'
                                        />
                                    ) : (
                                        <div className='w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-400 p-1'>
                                            <School className='w-6 h-6 sm:w-9 sm:h-9 stroke-1' />
                                            <span className='text-[7px] sm:text-[9px] font-sans uppercase mt-0.5'>Emblem</span>
                                        </div>
                                    )}
                                </div>

                                {/* Academic Session */}
                                <p className='text-[9px] sm:text-[11px] md:text-xs font-bold tracking-widest text-gray-700 font-sans uppercase'>
                                    ACADEMIC SESSION: {formData.session || '2025 – 2026'}
                                </p>
                            </div>

                            {/* Middle Body: Document Type & Title */}
                            <div className='text-center space-y-1.5 sm:space-y-2.5 z-10 my-1 py-1'>
                                <div className='inline-block px-3 py-1 border-y sm:border-y-2 border-black'>
                                    <h2 className='text-[10px] sm:text-sm md:text-base font-black tracking-widest uppercase font-sans'>
                                        {formData.documentType || 'LAB PRACTICAL FILE'}
                                    </h2>
                                </div>

                                {formData.subjectName && (
                                    <p className='text-[9px] sm:text-xs md:text-sm font-bold text-gray-900'>
                                        ON <br />
                                        <span className='text-[10px] sm:text-sm md:text-base font-black uppercase underline decoration-1 underline-offset-2 sm:underline-offset-4'>
                                            &ldquo;{formData.title || formData.subjectName}&rdquo;
                                        </span>
                                    </p>
                                )}

                                {formData.subjectCode && (
                                    <p className='text-[8px] sm:text-[10px] md:text-xs font-bold font-sans text-gray-700'>
                                        Course Code: {formData.subjectCode}
                                    </p>
                                )}
                            </div>

                            {/* Bottom Submission Grid: Submitted By & Submitted To */}
                            <div className='z-10 pt-1.5 pb-1'>
                                <div className='grid grid-cols-2 gap-3 sm:gap-6 text-[9px] sm:text-xs md:text-sm border-t border-gray-400 pt-2 sm:pt-4'>
                                    {/* Left: Submitted By */}
                                    <div className='space-y-0.5'>
                                        <p className='font-bold uppercase tracking-wider text-gray-700 font-sans text-[8px] sm:text-[10px] mb-0.5 sm:mb-1'>
                                            SUBMITTED BY:
                                        </p>
                                        <p className='font-bold text-[10px] sm:text-sm md:text-base text-black font-serif leading-tight'>
                                            {formData.studentName || 'Student Name'}
                                        </p>
                                        <p className='text-gray-800 font-sans text-[8px] sm:text-xs'>
                                            <strong>Roll:</strong> {formData.rollNumber || '—'}
                                        </p>
                                        <p className='text-gray-800 font-sans text-[8px] sm:text-xs'>
                                            <strong>Branch:</strong> {formData.branch || '—'}
                                        </p>
                                        <p className='text-gray-800 font-sans text-[8px] sm:text-xs'>
                                            <strong>Sem:</strong> {formData.semester || '—'} ({formData.section || 'Sec'})
                                        </p>
                                    </div>

                                    {/* Right: Submitted To */}
                                    <div className='space-y-0.5 text-right'>
                                        <p className='font-bold uppercase tracking-wider text-gray-700 font-sans text-[8px] sm:text-[10px] mb-0.5 sm:mb-1'>
                                            SUBMITTED TO:
                                        </p>
                                        <p className='font-bold text-[10px] sm:text-sm md:text-base text-black font-serif leading-tight'>
                                            {formData.facultyName || 'Professor Name'}
                                        </p>
                                        <p className='text-gray-800 font-sans text-[8px] sm:text-xs'>
                                            {formData.facultyDesignation || 'Assistant Professor'}
                                        </p>
                                        <p className='text-gray-800 font-sans text-[8px] sm:text-xs'>
                                            {formData.department || 'Department'}
                                        </p>
                                    </div>
                                </div>

                                {/* Signatures Footer */}
                                {formData.includeSignatures && (
                                    <div className='grid grid-cols-2 gap-4 pt-4 sm:pt-6 md:pt-8 text-[8px] sm:text-[10px] md:text-xs font-sans text-gray-700'>
                                        <div className='border-t border-gray-400 pt-0.5 text-left'>
                                            <span>Student Signature</span>
                                        </div>
                                        <div className='border-t border-gray-400 pt-0.5 text-right'>
                                            <span>Faculty Signature</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
