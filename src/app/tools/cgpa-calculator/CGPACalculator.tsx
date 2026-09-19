'use client';

import React, { useState, useMemo } from 'react';
import {
    Plus,
    Trash2,
    Calculator,
    RotateCcw,
    Check,
    Copy,
    Info,
    Award,
    TrendingUp,
    Percent,
    Target,
    BookOpen,
    HelpCircle,
    Sparkles,
    ChevronDown,
    ArrowRightLeft,
    CheckCircle2,
    AlertCircle,
    Share2,
    SlidersHorizontal,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Grade = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';

interface Subject {
    id: number;
    name: string;
    credit: number;
    grade: Grade;
}

interface Semester {
    id: number;
    sgpa: number;
    credit: number;
}

type ModeType = 'SGPA' | 'CGPA' | 'PERCENTAGE' | 'TARGET';
type FormulaType = 'aicte' | 'cbse' | 'direct' | 'mumbai' | 'custom';

const GRADE_POINTS: Record<Grade, number> = {
    O: 10,
    'A+': 9,
    A: 8,
    'B+': 7,
    B: 6,
    C: 5,
    P: 4,
    F: 0,
};

const GRADE_RANGES: Record<Grade, string> = {
    O: '90–100%',
    'A+': '80–89%',
    A: '70–79%',
    'B+': '60–69%',
    B: '50–59%',
    C: '40–49%',
    P: '35–39%',
    F: '<35%',
};

const GRADES = Object.keys(GRADE_POINTS) as Grade[];

export default function CGPACalculator() {
    const [mode, setMode] = useState<ModeType>('SGPA');

    // SGPA State
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: 1, name: 'Subject 1', credit: 4, grade: 'O' },
        { id: 2, name: 'Subject 2', credit: 4, grade: 'A+' },
        { id: 3, name: 'Subject 3', credit: 3, grade: 'A' },
        { id: 4, name: 'Subject 4', credit: 3, grade: 'B+' },
        { id: 5, name: 'Subject 5', credit: 2, grade: 'A' },
    ]);

    // CGPA State
    const [semesters, setSemesters] = useState<Semester[]>([
        { id: 1, sgpa: 8.5, credit: 20 },
        { id: 2, sgpa: 8.2, credit: 22 },
        { id: 3, sgpa: 8.7, credit: 21 },
    ]);

    // CGPA ⇋ Percentage State
    const [conversionDirection, setConversionDirection] = useState<'cgpaToPct' | 'pctToCgpa'>('cgpaToPct');
    const [formula, setFormula] = useState<FormulaType>('aicte');
    const [customMultiplier, setCustomMultiplier] = useState<number>(9.5);
    const [convInput, setConvInput] = useState<string>('8.5');

    // Target CGPA Planner State
    const [currentCgpa, setCurrentCgpa] = useState<string>('7.8');
    const [completedCredits, setCompletedCredits] = useState<string>('60');
    const [targetCgpa, setTargetCgpa] = useState<string>('8.5');
    const [upcomingCredits, setUpcomingCredits] = useState<string>('20');

    // Copy Feedback
    const [copied, setCopied] = useState(false);

    // ----------------------------------------------------
    // LIVE COMPUTED VALUES
    // ----------------------------------------------------

    // 1. SGPA Calculation
    const sgpaStats = useMemo(() => {
        let totalPoints = 0;
        let totalCredits = 0;

        subjects.forEach((sub) => {
            const creditVal = Math.max(0, Number(sub.credit) || 0);
            totalPoints += creditVal * (GRADE_POINTS[sub.grade] ?? 0);
            totalCredits += creditVal;
        });

        const sgpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
        return {
            sgpa,
            totalPoints,
            totalCredits,
            subjectCount: subjects.length,
        };
    }, [subjects]);

    // 2. CGPA Calculation
    const cgpaStats = useMemo(() => {
        let totalPoints = 0;
        let totalCredits = 0;

        semesters.forEach((sem) => {
            const creditVal = Math.max(0, Number(sem.credit) || 0);
            const sgpaVal = Math.max(0, Math.min(10, Number(sem.sgpa) || 0));
            totalPoints += sgpaVal * creditVal;
            totalCredits += creditVal;
        });

        const cgpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
        return {
            cgpa,
            totalPoints,
            totalCredits,
            semesterCount: semesters.length,
        };
    }, [semesters]);

    // 3. Percentage Calculation
    const conversionResult = useMemo(() => {
        const val = parseFloat(convInput);
        if (isNaN(val) || val < 0) return null;

        if (conversionDirection === 'cgpaToPct') {
            if (val > 10) return null;
            let pct = 0;
            switch (formula) {
                case 'aicte': // (CGPA - 0.75) * 10
                    pct = Math.max(0, (val - 0.75) * 10);
                    break;
                case 'cbse': // CGPA * 9.5
                    pct = val * 9.5;
                    break;
                case 'direct': // CGPA * 10
                    pct = val * 10;
                    break;
                case 'mumbai': // 7.25 * CGPA + 11 (for >=7) or 7.1 * CGPA + 12
                    pct = val >= 7 ? 7.25 * val + 11 : 7.1 * val + 12;
                    break;
                case 'custom':
                    pct = val * (customMultiplier || 10);
                    break;
            }
            return {
                type: 'percentage',
                value: parseFloat(pct.toFixed(2)),
                input: val,
            };
        } else {
            // Pct to CGPA
            if (val > 100) return null;
            let cg = 0;
            switch (formula) {
                case 'aicte':
                    cg = val / 10 + 0.75;
                    break;
                case 'cbse':
                    cg = val / 9.5;
                    break;
                case 'direct':
                    cg = val / 10;
                    break;
                case 'mumbai':
                    cg = (val - 11) / 7.25;
                    break;
                case 'custom':
                    cg = val / (customMultiplier || 10);
                    break;
            }
            return {
                type: 'cgpa',
                value: parseFloat(Math.min(10, Math.max(0, cg)).toFixed(2)),
                input: val,
            };
        }
    }, [convInput, conversionDirection, formula, customMultiplier]);

    // 4. Target Planner Calculation
    const targetPlanResult = useMemo(() => {
        const curCgpa = parseFloat(currentCgpa);
        const compCredits = parseFloat(completedCredits);
        const tgtCgpa = parseFloat(targetCgpa);
        const upCredits = parseFloat(upcomingCredits);

        if (
            isNaN(curCgpa) ||
            isNaN(compCredits) ||
            isNaN(tgtCgpa) ||
            isNaN(upCredits) ||
            compCredits <= 0 ||
            upCredits <= 0 ||
            tgtCgpa <= 0
        ) {
            return null;
        }

        const totalCreditsRequired = compCredits + upCredits;
        const totalPointsNeeded = tgtCgpa * totalCreditsRequired;
        const currentPoints = curCgpa * compCredits;
        const pointsNeededInUpcoming = totalPointsNeeded - currentPoints;
        const requiredSgpa = parseFloat((pointsNeededInUpcoming / upCredits).toFixed(2));

        let status: 'achievable' | 'impossible' | 'exceeded' | 'hard' = 'achievable';
        let message = '';

        if (requiredSgpa <= 0) {
            status = 'exceeded';
            message = 'You have already reached or exceeded your target CGPA!';
        } else if (requiredSgpa > 10) {
            status = 'impossible';
            message = `Mathematically impossible with ${upCredits} credits (Requires ${requiredSgpa} SGPA, max possible is 10.0). Consider planning across more semesters.`;
        } else if (requiredSgpa >= 9.0) {
            status = 'hard';
            message = `Challenging goal! You need near-perfect grades (SGPA ${requiredSgpa}) in all upcoming subjects.`;
        } else {
            status = 'achievable';
            message = `Well within reach! Secure an SGPA of ${requiredSgpa} or higher in the next semester.`;
        }

        return {
            requiredSgpa,
            status,
            message,
            totalCreditsRequired,
        };
    }, [currentCgpa, completedCredits, targetCgpa, upcomingCredits]);

    // ----------------------------------------------------
    // HANDLERS
    // ----------------------------------------------------

    // SGPA Handlers
    const handleSubjectChange = (id: number, field: keyof Subject, value: string | number) => {
        setSubjects((prev) =>
            prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
        );
    };

    const addSubject = () => {
        setSubjects((prev) => [
            ...prev,
            { id: Date.now(), name: `Subject ${prev.length + 1}`, credit: 3, grade: 'A' },
        ]);
    };

    const removeSubject = (id: number) => {
        if (subjects.length <= 1) {
            toast.error('You must keep at least 1 subject');
            return;
        }
        setSubjects((prev) => prev.filter((sub) => sub.id !== id));
    };

    // CGPA Handlers
    const handleSemesterChange = (id: number, field: keyof Semester, value: number) => {
        setSemesters((prev) =>
            prev.map((sem) => (sem.id === id ? { ...sem, [field]: value } : sem))
        );
    };

    const addSemester = () => {
        setSemesters((prev) => [
            ...prev,
            { id: Date.now(), sgpa: 8.0, credit: 20 },
        ]);
    };

    const removeSemester = (id: number) => {
        if (semesters.length <= 1) {
            toast.error('You must keep at least 1 semester');
            return;
        }
        setSemesters((prev) => prev.filter((sem) => sem.id !== id));
    };

    // Reset Handlers
    const resetCurrent = () => {
        if (mode === 'SGPA') {
            setSubjects([
                { id: 1, name: 'Subject 1', credit: 4, grade: 'O' },
                { id: 2, name: 'Subject 2', credit: 4, grade: 'A+' },
                { id: 3, name: 'Subject 3', credit: 3, grade: 'A' },
                { id: 4, name: 'Subject 4', credit: 3, grade: 'B+' },
            ]);
            toast.success('SGPA subjects reset');
        } else if (mode === 'CGPA') {
            setSemesters([
                { id: 1, sgpa: 8.5, credit: 20 },
                { id: 2, sgpa: 8.2, credit: 22 },
                { id: 3, sgpa: 8.7, credit: 21 },
            ]);
            toast.success('Semesters reset');
        } else if (mode === 'PERCENTAGE') {
            setConvInput('8.5');
            toast.success('Percentage calculator reset');
        } else {
            setCurrentCgpa('7.8');
            setCompletedCredits('60');
            setTargetCgpa('8.5');
            setUpcomingCredits('20');
            toast.success('Planner reset');
        }
    };

    const handleCopy = (text: string, label = 'Result') => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(`${label} copied to clipboard!`);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareReport = () => {
        let report = '';
        if (mode === 'SGPA') {
            report = `🎓 My Semester SGPA Report\n──────────────────────\nCalculated SGPA: ${sgpaStats.sgpa} / 10.0\nTotal Credits: ${sgpaStats.totalCredits}\nSubjects (${subjects.length}):\n` +
                subjects.map((s) => ` • ${s.name}: ${s.grade} (${GRADE_POINTS[s.grade]} pts, ${s.credit} cr)`).join('\n') +
                `\n──────────────────────\nCalculated on Student Senior (https://studentsenior.com/tools/cgpa-calculator)`;
        } else if (mode === 'CGPA') {
            report = `🎓 My Cumulative CGPA Report\n──────────────────────\nOverall CGPA: ${cgpaStats.cgpa} / 10.0\nTotal Credits: ${cgpaStats.totalCredits}\nSemesters (${semesters.length}):\n` +
                semesters.map((s, i) => ` • Sem ${i + 1}: ${s.sgpa} SGPA (${s.credit} cr)`).join('\n') +
                `\n──────────────────────\nCalculated on Student Senior (https://studentsenior.com/tools/cgpa-calculator)`;
        } else if (mode === 'PERCENTAGE' && conversionResult) {
            report = `🎓 CGPA & Percentage Conversion\n──────────────────────\n${conversionDirection === 'cgpaToPct' ? `CGPA: ${conversionResult.input} → ${conversionResult.value}%` : `Percentage: ${conversionResult.input}% → ${conversionResult.value} CGPA`}\nFormula: ${formula.toUpperCase()}\n──────────────────────\nCalculated on Student Senior`;
        } else if (mode === 'TARGET' && targetPlanResult) {
            report = `🎯 Target CGPA Roadmap\n──────────────────────\nCurrent CGPA: ${currentCgpa} (${completedCredits} cr)\nTarget CGPA: ${targetCgpa}\nUpcoming Credits: ${upcomingCredits} cr\nRequired SGPA: ${targetPlanResult.requiredSgpa} / 10.0\n──────────────────────\nStudent Senior Planner`;
        }

        if (report) {
            handleCopy(report, 'Full Summary Report');
        }
    };

    const getClassification = (score: number) => {
        if (score >= 9.0) {
            return {
                label: 'Outstanding (First Class with Distinction)',
                badge: 'bg-[#eaf3fd] text-[#0075de] dark:bg-[#183153] dark:text-[#62aef0] border-[#d2e4f9] dark:border-[#224474]',
                barColor: 'bg-[#0075de]',
                desc: 'Top-tier academic excellence. Eligible for university gold medals and high-tier scholarships.',
            };
        }
        if (score >= 8.0) {
            return {
                label: 'First Class with Distinction',
                badge: 'bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80] border-[#d2f0d9] dark:border-[#205130]',
                barColor: 'bg-[#1aae39]',
                desc: 'Excellent performance. Meets criteria for all tier-1 campus placement drives and masters programs.',
            };
        }
        if (score >= 6.5) {
            return {
                label: 'First Division',
                badge: 'bg-[#eaf3fd] text-[#0075de] dark:bg-[#183153] dark:text-[#62aef0] border-[#d2e4f9] dark:border-[#224474]',
                barColor: 'bg-[#0075de]',
                desc: 'Good standing. Meets eligibility for majority of corporate job profiles (60%+ criteria).',
            };
        }
        if (score >= 5.0) {
            return {
                label: 'Second Division',
                badge: 'bg-[#fdf1e8] text-[#dd5b00] dark:bg-[#3d2411] dark:text-[#fb923c] border-[#fbd8c1] dark:border-[#583318]',
                barColor: 'bg-[#dd5b00]',
                desc: 'Satisfactory score. Aim to boost upcoming semester grades to cross 6.5+ for broader job eligibility.',
            };
        }
        if (score >= 4.0) {
            return {
                label: 'Pass Class',
                badge: 'bg-[#f6f5f4] text-[#615d59] dark:bg-[#282828] dark:text-[#a09e9a] border-[#e6e6e6] dark:border-[#383838]',
                barColor: 'bg-[#8c8883]',
                desc: 'Passing standard. Highly recommend focusing on high-credit core subjects in future semesters.',
            };
        }
        return {
            label: 'Fail / Requires Improvement',
            badge: 'bg-[#fdf2f2] text-[#e11d48] dark:bg-[#3b1118] dark:text-[#fb7185] border-[#fcdada] dark:border-[#601925]',
            barColor: 'bg-[#e11d48]',
            desc: 'Score below passing threshold. Needs cleared backlog examinations.',
        };
    };

    return (
        <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden transition-all'>
            {/* Segmented Mode Navigation Bar */}
            <div className='p-3 sm:p-4 border-b border-[#f0eee9] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#242424]'>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#f0eee9] dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] max-w-2xl mx-auto'>
                    <button
                        onClick={() => setMode('SGPA')}
                        className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            mode === 'SGPA'
                                ? 'bg-white dark:bg-[#282828] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        <Calculator className='w-3.5 h-3.5 text-[#0075de]' />
                        <span>SGPA</span>
                    </button>
                    <button
                        onClick={() => setMode('CGPA')}
                        className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            mode === 'CGPA'
                                ? 'bg-white dark:bg-[#282828] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        <TrendingUp className='w-3.5 h-3.5 text-[#1aae39]' />
                        <span>CGPA</span>
                    </button>
                    <button
                        onClick={() => setMode('PERCENTAGE')}
                        className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            mode === 'PERCENTAGE'
                                ? 'bg-white dark:bg-[#282828] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        <Percent className='w-3.5 h-3.5 text-[#8a3fd6]' />
                        <span>CGPA ⇋ %</span>
                    </button>
                    <button
                        onClick={() => setMode('TARGET')}
                        className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            mode === 'TARGET'
                                ? 'bg-white dark:bg-[#282828] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        <Target className='w-3.5 h-3.5 text-[#dd5b00]' />
                        <span>Target Goal</span>
                    </button>
                </div>
            </div>

            {/* Main Interactive Work Area */}
            <div className='p-4 sm:p-7'>
                {/* ---------------------------------------------------- */}
                {/* 1. SGPA CALCULATOR MODE */}
                {/* ---------------------------------------------------- */}
                {mode === 'SGPA' && (
                    <div className='space-y-6'>
                        {/* Live Scorecard Banner */}
                        <div className='p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#f8fafc] via-[#f4f7fb] to-[#eef4fd] dark:from-[#20252e] dark:via-[#1c222b] dark:to-[#17202d] border border-[#d8e4f5] dark:border-[#22354e] shadow-xs'>
                            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                                <div>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <span className='text-[11px] font-bold text-[#615d59] dark:text-[#9ea4b0] uppercase tracking-wider'>
                                            Live Semester SGPA
                                        </span>
                                        <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eaf3fd] text-[#0075de] dark:bg-[#183153] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474]'>
                                            {sgpaStats.subjectCount} Subjects • {sgpaStats.totalCredits} Total Credits
                                        </span>
                                    </div>
                                    <div className='flex items-baseline gap-2.5'>
                                        <span className='text-3xl sm:text-4xl font-black tracking-tight text-[#0075de] dark:text-[#62aef0]'>
                                            {sgpaStats.sgpa.toFixed(2)}
                                        </span>
                                        <span className='text-sm sm:text-base font-semibold text-[#8c8883] dark:text-[#787672]'>
                                            / 10.00
                                        </span>
                                    </div>
                                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getClassification(sgpaStats.sgpa).badge}`}>
                                            <Award className='w-3 h-3' /> {getClassification(sgpaStats.sgpa).label}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2 w-full md:w-auto justify-end'>
                                    <button
                                        onClick={() => handleCopy(String(sgpaStats.sgpa), 'SGPA')}
                                        className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#282828] hover:bg-[#f2f2f0] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-semibold text-[#101828] dark:text-[#ededed] shadow-xs active:scale-[0.97] transition-all'
                                        title='Copy SGPA'
                                    >
                                        {copied ? <Check className='w-3.5 h-3.5 text-[#1aae39]' /> : <Copy className='w-3.5 h-3.5 text-[#615d59]' />}
                                        <span>Copy SGPA</span>
                                    </button>
                                    <button
                                        onClick={handleShareReport}
                                        className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0075de] hover:bg-[#0062bd] text-white text-xs font-semibold shadow-xs active:scale-[0.97] transition-all'
                                        title='Export Summary Report'
                                    >
                                        <Share2 className='w-3.5 h-3.5' />
                                        <span>Copy Report</span>
                                    </button>
                                </div>
                            </div>

                            {/* Visual Progress Bar */}
                            <div className='mt-4 pt-3 border-t border-[#e2ecf9] dark:border-[#253952]'>
                                <div className='flex justify-between text-[11px] text-[#615d59] dark:text-[#9ea4b0] mb-1 font-medium'>
                                    <span>Scale: 0.0 (Fail)</span>
                                    <span>5.0 (Average)</span>
                                    <span>8.0 (Distinction)</span>
                                    <span>10.0 (Outstanding)</span>
                                </div>
                                <div className='h-2.5 w-full bg-[#e6e6e6] dark:bg-[#141b24] rounded-full overflow-hidden p-0.5 border border-[#d8e4f5] dark:border-[#253850]'>
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${getClassification(sgpaStats.sgpa).barColor}`}
                                        style={{ width: `${Math.min(100, Math.max(5, (sgpaStats.sgpa / 10) * 100))}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Subject Rows Table / Cards */}
                        <div>
                            {/* Table Header */}
                            <div className='hidden sm:grid grid-cols-12 gap-3 text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider px-3 pb-2 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                                <div className='col-span-5'>Subject / Paper Name</div>
                                <div className='col-span-3'>Credits (1–10)</div>
                                <div className='col-span-3'>Letter Grade Secured</div>
                                <div className='col-span-1 text-center'>Action</div>
                            </div>

                            {/* Rows */}
                            <div className='space-y-2.5 pt-2'>
                                {subjects.map((sub, index) => (
                                    <div
                                        key={sub.id}
                                        className='grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 sm:p-2 bg-[#faf9f8] dark:bg-[#222222] sm:bg-transparent sm:dark:bg-transparent rounded-xl border sm:border-0 border-[#f0eee6] dark:border-[#2a2a2a] hover:bg-[#faf9f8] dark:hover:bg-[#232323] transition-colors'
                                    >
                                        <div className='col-span-5'>
                                            <input
                                                type='text'
                                                placeholder={`Subject ${index + 1}`}
                                                value={sub.name}
                                                onChange={(e) =>
                                                    handleSubjectChange(sub.id, 'name', e.target.value)
                                                }
                                                className='w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                            />
                                        </div>
                                        <div className='col-span-3 flex items-center gap-2'>
                                            <span className='sm:hidden text-xs font-medium text-[#615d59] dark:text-[#a09e9a] w-16 shrink-0'>
                                                Credits:
                                            </span>
                                            <input
                                                type='number'
                                                min='1'
                                                max='10'
                                                value={sub.credit || ''}
                                                onChange={(e) =>
                                                    handleSubjectChange(
                                                        sub.id,
                                                        'credit',
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                                className='w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all text-center'
                                            />
                                        </div>
                                        <div className='col-span-3 flex items-center gap-2'>
                                            <span className='sm:hidden text-xs font-medium text-[#615d59] dark:text-[#a09e9a] w-16 shrink-0'>
                                                Grade:
                                            </span>
                                            <select
                                                value={sub.grade}
                                                onChange={(e) =>
                                                    handleSubjectChange(
                                                        sub.id,
                                                        'grade',
                                                        e.target.value as Grade
                                                    )
                                                }
                                                className='w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all cursor-pointer font-medium'
                                            >
                                                {GRADES.map((g) => (
                                                    <option key={g} value={g}>
                                                        {g} ({GRADE_POINTS[g]} pts) — {GRADE_RANGES[g]}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='col-span-1 flex justify-end sm:justify-center'>
                                            <button
                                                onClick={() => removeSubject(sub.id)}
                                                className='p-2 text-[#8c8883] hover:text-[#e11d48] dark:hover:text-[#fb7185] hover:bg-[#fdf2f2] dark:hover:bg-[#3b1118] rounded-lg transition-colors'
                                                title='Remove subject'
                                                aria-label='Remove subject'
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Subject & Action Buttons */}
                            <div className='mt-4 flex flex-col sm:flex-row items-center gap-3'>
                                <button
                                    onClick={addSubject}
                                    className='w-full sm:flex-1 py-2.5 border-2 border-dashed border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#0075de] dark:hover:border-[#62aef0] rounded-xl text-xs sm:text-sm font-semibold text-[#615d59] dark:text-[#a09e9a] hover:text-[#0075de] dark:hover:text-[#62aef0] bg-[#faf9f8] dark:bg-[#181818] hover:bg-[#f6f5f4] dark:hover:bg-[#202020] transition-all flex items-center justify-center gap-2 active:scale-[0.99]'
                                >
                                    <Plus className='w-4 h-4' />
                                    <span>Add Another Subject</span>
                                </button>
                                <button
                                    onClick={resetCurrent}
                                    className='w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#615d59] dark:text-[#a09e9a] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5'
                                >
                                    <RotateCcw className='w-3.5 h-3.5' />
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* 2. CGPA CALCULATOR MODE */}
                {/* ---------------------------------------------------- */}
                {mode === 'CGPA' && (
                    <div className='space-y-6'>
                        {/* Live Scorecard Banner */}
                        <div className='p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#f8fafc] via-[#f3f9f4] to-[#eaf7ec] dark:from-[#1d2720] dark:via-[#19231c] dark:to-[#142017] border border-[#d2f0d9] dark:border-[#205130] shadow-xs'>
                            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                                <div>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <span className='text-[11px] font-bold text-[#615d59] dark:text-[#9ea4b0] uppercase tracking-wider'>
                                            Live Cumulative CGPA
                                        </span>
                                        <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130]'>
                                            {cgpaStats.semesterCount} Semesters • {cgpaStats.totalCredits} Cumulative Credits
                                        </span>
                                    </div>
                                    <div className='flex items-baseline gap-2.5'>
                                        <span className='text-3xl sm:text-4xl font-black tracking-tight text-[#1aae39] dark:text-[#4ade80]'>
                                            {cgpaStats.cgpa.toFixed(2)}
                                        </span>
                                        <span className='text-sm sm:text-base font-semibold text-[#8c8883] dark:text-[#787672]'>
                                            / 10.00
                                        </span>
                                    </div>
                                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getClassification(cgpaStats.cgpa).badge}`}>
                                            <Award className='w-3 h-3' /> {getClassification(cgpaStats.cgpa).label}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2 w-full md:w-auto justify-end'>
                                    <button
                                        onClick={() => handleCopy(String(cgpaStats.cgpa), 'CGPA')}
                                        className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#282828] hover:bg-[#f2f2f0] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-semibold text-[#101828] dark:text-[#ededed] shadow-xs active:scale-[0.97] transition-all'
                                        title='Copy CGPA'
                                    >
                                        {copied ? <Check className='w-3.5 h-3.5 text-[#1aae39]' /> : <Copy className='w-3.5 h-3.5 text-[#615d59]' />}
                                        <span>Copy CGPA</span>
                                    </button>
                                    <button
                                        onClick={handleShareReport}
                                        className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1aae39] hover:bg-[#169430] text-white text-xs font-semibold shadow-xs active:scale-[0.97] transition-all'
                                        title='Export Summary Report'
                                    >
                                        <Share2 className='w-3.5 h-3.5' />
                                        <span>Copy Report</span>
                                    </button>
                                </div>
                            </div>

                            {/* Visual Progress Bar */}
                            <div className='mt-4 pt-3 border-t border-[#d5ecdc] dark:border-[#22442d]'>
                                <div className='flex justify-between text-[11px] text-[#615d59] dark:text-[#9ea4b0] mb-1 font-medium'>
                                    <span>Scale: 0.0</span>
                                    <span>5.0 (Passing)</span>
                                    <span>7.5 (Good)</span>
                                    <span>10.0 (Max)</span>
                                </div>
                                <div className='h-2.5 w-full bg-[#e6e6e6] dark:bg-[#141b24] rounded-full overflow-hidden p-0.5 border border-[#d2f0d9] dark:border-[#205130]'>
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${getClassification(cgpaStats.cgpa).barColor}`}
                                        style={{ width: `${Math.min(100, Math.max(5, (cgpaStats.cgpa / 10) * 100))}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Semesters Table */}
                        <div>
                            <div className='hidden sm:grid grid-cols-12 gap-3 text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider px-3 pb-2 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                                <div className='col-span-3'>Semester</div>
                                <div className='col-span-4'>Semester SGPA (0.00 – 10.00)</div>
                                <div className='col-span-4'>Semester Credits</div>
                                <div className='col-span-1 text-center'>Action</div>
                            </div>

                            <div className='space-y-2.5 pt-2'>
                                {semesters.map((sem, index) => (
                                    <div
                                        key={sem.id}
                                        className='grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 sm:p-2 bg-[#faf9f8] dark:bg-[#222222] sm:bg-transparent sm:dark:bg-transparent rounded-xl border sm:border-0 border-[#f0eee6] dark:border-[#2a2a2a] hover:bg-[#faf9f8] dark:hover:bg-[#232323] transition-colors'
                                    >
                                        <div className='col-span-3 font-semibold text-xs sm:text-sm text-[#101828] dark:text-white flex items-center gap-1.5'>
                                            <span className='w-6 h-6 rounded-full bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] flex items-center justify-center text-xs font-bold'>
                                                {index + 1}
                                            </span>
                                            <span>Semester {index + 1}</span>
                                        </div>
                                        <div className='col-span-4 flex items-center gap-2'>
                                            <span className='sm:hidden text-xs font-medium text-[#615d59] dark:text-[#a09e9a] w-16 shrink-0'>
                                                SGPA:
                                            </span>
                                            <input
                                                type='number'
                                                min='0'
                                                max='10'
                                                step='0.01'
                                                value={sem.sgpa || ''}
                                                onChange={(e) =>
                                                    handleSemesterChange(
                                                        sem.id,
                                                        'sgpa',
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                                placeholder='e.g., 8.25'
                                                className='w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all text-center font-medium'
                                            />
                                        </div>
                                        <div className='col-span-4 flex items-center gap-2'>
                                            <span className='sm:hidden text-xs font-medium text-[#615d59] dark:text-[#a09e9a] w-16 shrink-0'>
                                                Credits:
                                            </span>
                                            <input
                                                type='number'
                                                min='1'
                                                value={sem.credit || ''}
                                                onChange={(e) =>
                                                    handleSemesterChange(
                                                        sem.id,
                                                        'credit',
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                                placeholder='e.g., 20'
                                                className='w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all text-center'
                                            />
                                        </div>
                                        <div className='col-span-1 flex justify-end sm:justify-center'>
                                            <button
                                                onClick={() => removeSemester(sem.id)}
                                                className='p-2 text-[#8c8883] hover:text-[#e11d48] dark:hover:text-[#fb7185] hover:bg-[#fdf2f2] dark:hover:bg-[#3b1118] rounded-lg transition-colors'
                                                title='Remove semester'
                                                aria-label='Remove semester'
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Semester & Action Buttons */}
                            <div className='mt-4 flex flex-col sm:flex-row items-center gap-3'>
                                <button
                                    onClick={addSemester}
                                    className='w-full sm:flex-1 py-2.5 border-2 border-dashed border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#1aae39] dark:hover:border-[#4ade80] rounded-xl text-xs sm:text-sm font-semibold text-[#615d59] dark:text-[#a09e9a] hover:text-[#1aae39] dark:hover:text-[#4ade80] bg-[#faf9f8] dark:bg-[#181818] hover:bg-[#f6f5f4] dark:hover:bg-[#202020] transition-all flex items-center justify-center gap-2 active:scale-[0.99]'
                                >
                                    <Plus className='w-4 h-4' />
                                    <span>Add Next Semester</span>
                                </button>
                                <button
                                    onClick={resetCurrent}
                                    className='w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#615d59] dark:text-[#a09e9a] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5'
                                >
                                    <RotateCcw className='w-3.5 h-3.5' />
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* 3. CGPA ⇋ PERCENTAGE CONVERTER MODE */}
                {/* ---------------------------------------------------- */}
                {mode === 'PERCENTAGE' && (
                    <div className='space-y-6 max-w-2xl mx-auto py-2'>
                        {/* Direction Switcher */}
                        <div className='flex items-center justify-center gap-3'>
                            <button
                                onClick={() => {
                                    setConversionDirection('cgpaToPct');
                                    setConvInput('8.5');
                                }}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                                    conversionDirection === 'cgpaToPct'
                                        ? 'bg-[#0075de] text-white shadow-xs'
                                        : 'bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#a09e9a]'
                                }`}
                            >
                                <span>CGPA to Percentage (%)</span>
                            </button>
                            <button
                                onClick={() => {
                                    setConversionDirection('pctToCgpa');
                                    setConvInput('77.5');
                                }}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                                    conversionDirection === 'pctToCgpa'
                                        ? 'bg-[#8a3fd6] text-white shadow-xs'
                                        : 'bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#a09e9a]'
                                }`}
                            >
                                <span>Percentage (%) to CGPA</span>
                            </button>
                        </div>

                        {/* University Formula Selector */}
                        <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-3'>
                            <div className='flex items-center justify-between text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider'>
                                <span className='flex items-center gap-1.5'>
                                    <SlidersHorizontal className='w-3.5 h-3.5' /> University Conversion Formula
                                </span>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
                                <label
                                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                        formula === 'aicte'
                                            ? 'bg-white dark:bg-[#2e2e2e] border-[#0075de] text-[#0075de] dark:text-[#62aef0] font-bold shadow-xs'
                                            : 'border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#a09e9a]'
                                    }`}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            name='formula'
                                            checked={formula === 'aicte'}
                                            onChange={() => setFormula('aicte')}
                                            className='text-[#0075de]'
                                        />
                                        <span>AICTE / AKTU / UGC</span>
                                    </div>
                                    <code className='text-[10px] opacity-75'>(CGPA - 0.75) × 10</code>
                                </label>

                                <label
                                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                        formula === 'cbse'
                                            ? 'bg-white dark:bg-[#2e2e2e] border-[#0075de] text-[#0075de] dark:text-[#62aef0] font-bold shadow-xs'
                                            : 'border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#a09e9a]'
                                    }`}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            name='formula'
                                            checked={formula === 'cbse'}
                                            onChange={() => setFormula('cbse')}
                                            className='text-[#0075de]'
                                        />
                                        <span>CBSE / IPU / Standard</span>
                                    </div>
                                    <code className='text-[10px] opacity-75'>CGPA × 9.5</code>
                                </label>

                                <label
                                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                        formula === 'direct'
                                            ? 'bg-white dark:bg-[#2e2e2e] border-[#0075de] text-[#0075de] dark:text-[#62aef0] font-bold shadow-xs'
                                            : 'border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#a09e9a]'
                                    }`}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            name='formula'
                                            checked={formula === 'direct'}
                                            onChange={() => setFormula('direct')}
                                            className='text-[#0075de]'
                                        />
                                        <span>Direct 10x Scale</span>
                                    </div>
                                    <code className='text-[10px] opacity-75'>CGPA × 10</code>
                                </label>

                                <label
                                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                        formula === 'mumbai'
                                            ? 'bg-white dark:bg-[#2e2e2e] border-[#0075de] text-[#0075de] dark:text-[#62aef0] font-bold shadow-xs'
                                            : 'border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#a09e9a]'
                                    }`}
                                >
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            name='formula'
                                            checked={formula === 'mumbai'}
                                            onChange={() => setFormula('mumbai')}
                                            className='text-[#0075de]'
                                        />
                                        <span>Mumbai University</span>
                                    </div>
                                    <code className='text-[10px] opacity-75'>7.25 × CGPA + 11</code>
                                </label>
                            </div>
                        </div>

                        {/* Value Input */}
                        <div>
                            <label className='block text-xs font-bold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider mb-2 text-center'>
                                {conversionDirection === 'cgpaToPct'
                                    ? 'Enter Cumulative CGPA (0.00 – 10.00)'
                                    : 'Enter Percentage Marks (0% – 100%)'}
                            </label>
                            <input
                                type='number'
                                min='0'
                                max={conversionDirection === 'cgpaToPct' ? '10' : '100'}
                                step='0.01'
                                value={convInput}
                                onChange={(e) => setConvInput(e.target.value)}
                                placeholder={conversionDirection === 'cgpaToPct' ? 'e.g., 8.25' : 'e.g., 78.5'}
                                className='w-full max-w-xs mx-auto block px-4 py-3 text-2xl font-black bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] rounded-2xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all text-center'
                            />
                        </div>

                        {/* Conversion Result Card */}
                        {conversionResult && (
                            <div className='p-6 rounded-2xl bg-gradient-to-br from-[#f8fafc] via-[#f7f4fb] to-[#f0ebf8] dark:from-[#211b2e] dark:via-[#1c1827] dark:to-[#171321] border border-[#e2d5f3] dark:border-[#3e2b58] text-center space-y-2 animate-in fade-in duration-300'>
                                <p className='text-xs font-bold text-[#8a3fd6] dark:text-[#c084fc] uppercase tracking-wider'>
                                    Converted {conversionResult.type === 'percentage' ? 'Percentage' : 'CGPA Score'}
                                </p>
                                <div className='flex items-baseline justify-center gap-2'>
                                    <span className='text-4xl sm:text-5xl font-black text-[#8a3fd6] dark:text-[#c084fc] tracking-tight'>
                                        {conversionResult.value}
                                        {conversionResult.type === 'percentage' ? '%' : ''}
                                    </span>
                                </div>
                                <p className='text-xs text-[#615d59] dark:text-[#a09e9a]'>
                                    Based on {formula.toUpperCase()} formula for {conversionResult.input} {conversionDirection === 'cgpaToPct' ? 'CGPA' : '% marks'}.
                                </p>
                                <div className='pt-2 flex justify-center gap-2'>
                                    <button
                                        onClick={() =>
                                            handleCopy(
                                                `${conversionResult.value}${conversionResult.type === 'percentage' ? '%' : ''}`,
                                                'Converted value'
                                            )
                                        }
                                        className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#2b1f3d] hover:bg-[#f4effa] dark:hover:bg-[#382650] border border-[#e2d5f3] dark:border-[#4d346d] text-xs font-semibold text-[#8a3fd6] dark:text-[#c084fc] shadow-xs transition-all'
                                    >
                                        <Copy className='w-3.5 h-3.5' />
                                        <span>Copy Value</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* 4. TARGET CGPA PLANNER MODE */}
                {/* ---------------------------------------------------- */}
                {mode === 'TARGET' && (
                    <div className='space-y-6 max-w-2xl mx-auto py-2'>
                        {/* Info Header */}
                        <div className='flex items-start gap-2.5 p-3.5 rounded-xl bg-[#fdf1e8]/60 dark:bg-[#3d2411]/40 border border-[#fbd8c1] dark:border-[#583318] text-xs text-[#dd5b00] dark:text-[#fb923c]'>
                            <Target className='w-4 h-4 shrink-0 mt-0.5' />
                            <p className='leading-relaxed'>
                                <strong>Target CGPA Planner:</strong> Plan your upcoming semester study targets. Calculate exactly what SGPA you need to achieve your desired graduation honors or job eligibility threshold.
                            </p>
                        </div>

                        {/* 4-Input Grid */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5'>
                                <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider'>
                                    Current Cumulative CGPA
                                </label>
                                <input
                                    type='number'
                                    min='0'
                                    max='10'
                                    step='0.01'
                                    value={currentCgpa}
                                    onChange={(e) => setCurrentCgpa(e.target.value)}
                                    placeholder='e.g., 7.80'
                                    className='w-full px-3 py-2 text-base font-bold bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>

                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5'>
                                <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider'>
                                    Total Completed Credits
                                </label>
                                <input
                                    type='number'
                                    min='1'
                                    value={completedCredits}
                                    onChange={(e) => setCompletedCredits(e.target.value)}
                                    placeholder='e.g., 60'
                                    className='w-full px-3 py-2 text-base font-bold bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>

                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5'>
                                <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider'>
                                    Target Dream CGPA
                                </label>
                                <input
                                    type='number'
                                    min='0'
                                    max='10'
                                    step='0.01'
                                    value={targetCgpa}
                                    onChange={(e) => setTargetCgpa(e.target.value)}
                                    placeholder='e.g., 8.50'
                                    className='w-full px-3 py-2 text-base font-bold bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#0075de] dark:text-[#62aef0] rounded-xl focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>

                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5'>
                                <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider'>
                                    Upcoming Semester Credits
                                </label>
                                <input
                                    type='number'
                                    min='1'
                                    value={upcomingCredits}
                                    onChange={(e) => setUpcomingCredits(e.target.value)}
                                    placeholder='e.g., 20'
                                    className='w-full px-3 py-2 text-base font-bold bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] transition-all'
                                />
                            </div>
                        </div>

                        {/* Plan Result Card */}
                        {targetPlanResult && (
                            <div
                                className={`p-6 rounded-2xl border text-center space-y-3 animate-in fade-in duration-300 ${
                                    targetPlanResult.status === 'impossible'
                                        ? 'bg-[#fdf2f2] dark:bg-[#3b1118]/40 border-[#fcdada] dark:border-[#601925]'
                                        : targetPlanResult.status === 'exceeded'
                                          ? 'bg-[#eaf7ec] dark:bg-[#163821]/40 border-[#d2f0d9] dark:border-[#205130]'
                                          : 'bg-gradient-to-br from-[#fef8f4] via-[#fdf2ea] to-[#fbf0e6] dark:from-[#332014] dark:via-[#2a1a10] dark:to-[#22140a] border-[#fbd8c1] dark:border-[#583318]'
                                }`}
                            >
                                <p className='text-xs font-bold text-[#dd5b00] dark:text-[#fb923c] uppercase tracking-wider'>
                                    Required SGPA in Next {upcomingCredits} Credits
                                </p>
                                <div className='flex items-baseline justify-center gap-2'>
                                    <span
                                        className={`text-4xl sm:text-5xl font-black tracking-tight ${
                                            targetPlanResult.status === 'impossible'
                                                ? 'text-[#e11d48] dark:text-[#fb7185]'
                                                : targetPlanResult.status === 'exceeded'
                                                  ? 'text-[#1aae39] dark:text-[#4ade80]'
                                                  : 'text-[#dd5b00] dark:text-[#fb923c]'
                                        }`}
                                    >
                                        {targetPlanResult.requiredSgpa <= 0 ? '0.00' : targetPlanResult.requiredSgpa}
                                    </span>
                                    <span className='text-base font-semibold text-[#8c8883]'>
                                        / 10.00
                                    </span>
                                </div>
                                <p
                                    className={`text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto ${
                                        targetPlanResult.status === 'impossible'
                                            ? 'text-[#be123c] dark:text-[#fda4af]'
                                            : 'text-[#615d59] dark:text-[#c4bdb5]'
                                    }`}
                                >
                                    {targetPlanResult.message}
                                </p>

                                <div className='pt-2 flex justify-center gap-2'>
                                    <button
                                        onClick={handleShareReport}
                                        className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#2e1d11] hover:bg-[#faeae0] dark:hover:bg-[#3d2411] border border-[#fbd8c1] dark:border-[#6a3b17] text-xs font-semibold text-[#dd5b00] dark:text-[#fb923c] shadow-xs transition-all'
                                    >
                                        <Share2 className='w-3.5 h-3.5' />
                                        <span>Copy Roadmap Summary</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
