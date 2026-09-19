'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Calculator,
    RotateCcw,
    TrendingUp,
    TrendingDown,
    Plus,
    Trash2,
    Check,
    Copy,
    Share2,
    Info,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    ShieldAlert,
    ShieldCheck,
    Layers,
    ListFilter,
    CalendarCheck,
    Clock,
    Flame,
    Award,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SubjectAttendance {
    id: number;
    name: string;
    total: number;
    attended: number;
    target: number;
}

interface ScenarioItem {
    type: 'attend' | 'bunk';
    count: number;
    newPct: number;
    isSafe: boolean;
    diff: number;
}

type ModeType = 'QUICK' | 'MULTI_SUBJECT' | 'SIMULATION';

export default function AttendanceCalculator() {
    const [mode, setMode] = useState<ModeType>('QUICK');

    // Quick Calculator State
    const [totalClasses, setTotalClasses] = useState<number>(45);
    const [attendedClasses, setAttendedClasses] = useState<number>(38);
    const [targetPercentage, setTargetPercentage] = useState<number>(75);

    // Multi-Subject State (with localStorage persistence)
    const [subjects, setSubjects] = useState<SubjectAttendance[]>([
        { id: 1, name: 'Data Structures & Algorithms', total: 40, attended: 34, target: 75 },
        { id: 2, name: 'Operating Systems', total: 36, attended: 26, target: 75 },
        { id: 3, name: 'Computer Networks', total: 32, attended: 28, target: 75 },
        { id: 4, name: 'Database Management (DBMS)', total: 38, attended: 32, target: 75 },
    ]);

    const [copied, setCopied] = useState(false);

    // Load saved subjects from localStorage on client mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('ss_attendance_subjects');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSubjects(parsed);
                }
            }
        } catch {
            // Ignore storage errors
        }
    }, []);

    // Save subjects to localStorage
    const saveSubjects = (newSubs: SubjectAttendance[]) => {
        setSubjects(newSubs);
        try {
            localStorage.setItem('ss_attendance_subjects', JSON.stringify(newSubs));
        } catch {
            // Ignore storage errors
        }
    };

    // ----------------------------------------------------
    // QUICK CALCULATOR COMPUTATIONS
    // ----------------------------------------------------
    const quickStats = useMemo(() => {
        const total = Math.max(0, totalClasses);
        const attended = Math.min(total, Math.max(0, attendedClasses));
        const target = Math.min(100, Math.max(1, targetPercentage));

        const currentPct = total > 0 ? parseFloat(((attended / total) * 100).toFixed(2)) : 0;

        let classesToAttend = 0;
        let classesToBunk = 0;

        if (total > 0) {
            if (currentPct < target) {
                // (attended + x) / (total + x) = target / 100
                // x = (target * total - 100 * attended) / (100 - target)
                const num = target * total - 100 * attended;
                const den = 100 - target;
                classesToAttend = den > 0 ? Math.ceil(num / den) : 0;
            } else {
                // attended / (total + x) = target / 100
                // x = (100 * attended / target) - total
                const maxTotal = (100 * attended) / target;
                classesToBunk = Math.floor(maxTotal - total);
            }
        }

        const isSafe = currentPct >= target;
        const diff = parseFloat((currentPct - target).toFixed(2));

        return {
            total,
            attended,
            bunked: total - attended,
            target,
            currentPct,
            classesToAttend: Math.max(0, classesToAttend),
            classesToBunk: Math.max(0, classesToBunk),
            isSafe,
            diff,
        };
    }, [totalClasses, attendedClasses, targetPercentage]);

    // ----------------------------------------------------
    // MULTI-SUBJECT COMPUTATIONS
    // ----------------------------------------------------
    const multiStats = useMemo(() => {
        let totalConducted = 0;
        let totalAttended = 0;

        const subjectDetails = subjects.map((sub) => {
            const tot = Math.max(0, sub.total);
            const att = Math.min(tot, Math.max(0, sub.attended));
            const tgt = sub.target || 75;
            const pct = tot > 0 ? parseFloat(((att / tot) * 100).toFixed(2)) : 0;

            totalConducted += tot;
            totalAttended += att;

            let needAttend = 0;
            let canBunk = 0;

            if (tot > 0) {
                if (pct < tgt) {
                    const num = tgt * tot - 100 * att;
                    const den = 100 - tgt;
                    needAttend = den > 0 ? Math.ceil(num / den) : 0;
                } else {
                    const maxTot = (100 * att) / tgt;
                    canBunk = Math.floor(maxTot - tot);
                }
            }

            return {
                ...sub,
                pct,
                isSafe: pct >= tgt,
                needAttend: Math.max(0, needAttend),
                canBunk: Math.max(0, canBunk),
            };
        });

        const overallPct =
            totalConducted > 0
                ? parseFloat(((totalAttended / totalConducted) * 100).toFixed(2))
                : 0;

        const criticalCount = subjectDetails.filter((s) => !s.isSafe).length;
        const safeCount = subjectDetails.filter((s) => s.isSafe).length;

        return {
            subjects: subjectDetails,
            totalConducted,
            totalAttended,
            overallPct,
            criticalCount,
            safeCount,
        };
    }, [subjects]);

    // ----------------------------------------------------
    // SIMULATION PREVIEWS
    // ----------------------------------------------------
    const simulationMatrix = useMemo<{
        attendScenarios: ScenarioItem[];
        bunkScenarios: ScenarioItem[];
    }>(() => {
        const total = quickStats.total;
        const attended = quickStats.attended;
        const target = quickStats.target;

        if (total === 0) {
            return { attendScenarios: [], bunkScenarios: [] };
        }

        const attendScenarios: ScenarioItem[] = [1, 2, 3, 5, 8].map((extra) => {
            const newTot = total + extra;
            const newAtt = attended + extra;
            const newPct = parseFloat(((newAtt / newTot) * 100).toFixed(2));
            return {
                type: 'attend' as const,
                count: extra,
                newPct,
                isSafe: newPct >= target,
                diff: parseFloat((newPct - quickStats.currentPct).toFixed(2)),
            };
        });

        const bunkScenarios: ScenarioItem[] = [1, 2, 3, 5, 8].map((extra) => {
            const newTot = total + extra;
            const newAtt = attended;
            const newPct = parseFloat(((newAtt / newTot) * 100).toFixed(2));
            return {
                type: 'bunk' as const,
                count: extra,
                newPct,
                isSafe: newPct >= target,
                diff: parseFloat((newPct - quickStats.currentPct).toFixed(2)),
            };
        });

        return { attendScenarios, bunkScenarios };
    }, [quickStats]);

    // ----------------------------------------------------
    // HANDLERS
    // ----------------------------------------------------
    const handleAddSubject = () => {
        const newSub: SubjectAttendance = {
            id: Date.now(),
            name: `Subject ${subjects.length + 1}`,
            total: 30,
            attended: 25,
            target: 75,
        };
        saveSubjects([...subjects, newSub]);
        toast.success('Subject added');
    };

    const handleRemoveSubject = (id: number) => {
        if (subjects.length <= 1) {
            toast.error('You must keep at least 1 subject');
            return;
        }
        const updated = subjects.filter((s) => s.id !== id);
        saveSubjects(updated);
        toast.success('Subject removed');
    };

    const handleUpdateSubject = (
        id: number,
        field: keyof SubjectAttendance,
        val: string | number
    ) => {
        const updated = subjects.map((s) =>
            s.id === id ? { ...s, [field]: val } : s
        );
        saveSubjects(updated);
    };

    const handleQuickAction = (id: number, type: 'attended' | 'bunked') => {
        const updated = subjects.map((s) => {
            if (s.id === id) {
                if (type === 'attended') {
                    return { ...s, total: s.total + 1, attended: s.attended + 1 };
                } else {
                    return { ...s, total: s.total + 1 };
                }
            }
            return s;
        });
        saveSubjects(updated);
        toast.success(type === 'attended' ? 'Marked Present (+1)' : 'Marked Absent (+1)');
    };

    const handleResetQuick = () => {
        setTotalClasses(45);
        setAttendedClasses(38);
        setTargetPercentage(75);
        toast.success('Reset to default values');
    };

    const handleCopyReport = () => {
        let report = '';
        if (mode === 'QUICK') {
            report = `📊 Attendance Status Report\n──────────────────────\nCurrent Attendance: ${quickStats.currentPct}% (${quickStats.attended}/${quickStats.total} Classes)\nTarget Criteria: ${quickStats.target}%\nStatus: ${quickStats.isSafe ? `✅ SAFE TO BUNK ${quickStats.classesToBunk} classes` : `🚨 MUST ATTEND ${quickStats.classesToAttend} consecutive classes`}\n──────────────────────\nCalculated on Student Senior (https://studentsenior.com/tools/attendance-manager)`;
        } else {
            report = `📊 Multi-Subject Attendance Report\n──────────────────────\nOverall Average: ${multiStats.overallPct}% (${multiStats.totalAttended}/${multiStats.totalConducted} Total Classes)\n` +
                multiStats.subjects
                    .map(
                        (s) =>
                            ` • ${s.name}: ${s.pct}% (${s.attended}/${s.total}) → ${s.isSafe ? `Can bunk ${s.canBunk} classes` : `Need ${s.needAttend} classes`}`
                    )
                    .join('\n') +
                `\n──────────────────────\nCalculated on Student Senior`;
        }

        navigator.clipboard.writeText(report);
        setCopied(true);
        toast.success('Full report copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden transition-all'>
            {/* Segmented Mode Navigation Bar */}
            <div className='p-3 sm:p-4 border-b border-[#f0eee9] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#242424]'>
                <div className='grid grid-cols-3 gap-1.5 p-1 bg-[#f0eee9] dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] max-w-xl mx-auto'>
                    <button
                        onClick={() => setMode('QUICK')}
                        className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            mode === 'QUICK'
                                ? 'bg-white dark:bg-[#282828] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        <Calculator className='w-3.5 h-3.5 text-[#0075de]' />
                        <span>Quick Bunk Calc</span>
                    </button>
                    <button
                        onClick={() => setMode('MULTI_SUBJECT')}
                        className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            mode === 'MULTI_SUBJECT'
                                ? 'bg-white dark:bg-[#282828] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        <Layers className='w-3.5 h-3.5 text-[#1aae39]' />
                        <span>Multi-Subject Tracker</span>
                    </button>
                    <button
                        onClick={() => setMode('SIMULATION')}
                        className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            mode === 'SIMULATION'
                                ? 'bg-white dark:bg-[#282828] text-[#101828] dark:text-white shadow-xs'
                                : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                        }`}
                    >
                        <Sparkles className='w-3.5 h-3.5 text-[#8a3fd6]' />
                        <span>Bunk Matrix</span>
                    </button>
                </div>
            </div>

            {/* Main Interactive Work Area */}
            <div className='p-4 sm:p-7'>
                {/* ---------------------------------------------------- */}
                {/* 1. QUICK BUNK CALCULATOR */}
                {/* ---------------------------------------------------- */}
                {mode === 'QUICK' && (
                    <div className='space-y-6'>
                        {/* Status Result Hero Card */}
                        <div
                            className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-xs ${
                                quickStats.isSafe
                                    ? 'bg-gradient-to-br from-[#f8fbf8] via-[#f3f9f4] to-[#eaf7ec] dark:from-[#1b261d] dark:via-[#172219] dark:to-[#131d15] border-[#d2f0d9] dark:border-[#205130]'
                                    : 'bg-gradient-to-br from-[#fdfbfb] via-[#fdf4f4] to-[#fdf2f2] dark:from-[#2e1c1f] dark:via-[#26171a] dark:to-[#201214] border-[#fcdada] dark:border-[#601925]'
                            }`}
                        >
                            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                                <div className='space-y-1.5'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[11px] font-bold text-[#615d59] dark:text-[#9ea4b0] uppercase tracking-wider'>
                                            Current Attendance Status
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                quickStats.isSafe
                                                    ? 'bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130]'
                                                    : 'bg-[#fdf2f2] text-[#e11d48] dark:bg-[#3b1118] dark:text-[#fb7185] border border-[#fcdada] dark:border-[#601925]'
                                            }`}
                                        >
                                            {quickStats.isSafe ? (
                                                <>
                                                    <ShieldCheck className='w-3 h-3' /> Attendance Safe ({quickStats.diff >= 0 ? `+${quickStats.diff}%` : `${quickStats.diff}%`})
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldAlert className='w-3 h-3' /> Below Target ({quickStats.diff}%)
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <div className='flex items-baseline gap-3'>
                                        <span
                                            className={`text-4xl sm:text-5xl font-black tracking-tight ${
                                                quickStats.isSafe
                                                    ? 'text-[#1aae39] dark:text-[#4ade80]'
                                                    : 'text-[#e11d48] dark:text-[#fb7185]'
                                            }`}
                                        >
                                            {quickStats.currentPct}%
                                        </span>
                                        <span className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] font-medium'>
                                            ({quickStats.attended} of {quickStats.total} classes attended)
                                        </span>
                                    </div>

                                    {/* Actionable Verdict Banner */}
                                    <div className='pt-1'>
                                        {quickStats.isSafe ? (
                                            <p className='text-xs sm:text-sm text-[#166534] dark:text-[#86efac] font-semibold flex items-center gap-1.5'>
                                                <Flame className='w-4 h-4 text-[#1aae39] shrink-0' />
                                                <span>
                                                    You can safely bunk{' '}
                                                    <strong className='text-base underline decoration-2'>
                                                        {quickStats.classesToBunk}
                                                    </strong>{' '}
                                                    consecutive classes and stay above {quickStats.target}% target!
                                                </span>
                                            </p>
                                        ) : (
                                            <p className='text-xs sm:text-sm text-[#991b1b] dark:text-[#fca5a5] font-semibold flex items-center gap-1.5'>
                                                <AlertCircle className='w-4 h-4 text-[#e11d48] shrink-0' />
                                                <span>
                                                    You need to attend{' '}
                                                    <strong className='text-base underline decoration-2'>
                                                        {quickStats.classesToAttend}
                                                    </strong>{' '}
                                                    consecutive classes without missing to reach {quickStats.target}%.
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className='flex items-center gap-2 w-full md:w-auto justify-end'>
                                    <button
                                        onClick={handleCopyReport}
                                        className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#282828] hover:bg-[#f2f2f0] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-semibold text-[#101828] dark:text-[#ededed] shadow-xs active:scale-[0.97] transition-all'
                                    >
                                        {copied ? <Check className='w-3.5 h-3.5 text-[#1aae39]' /> : <Share2 className='w-3.5 h-3.5 text-[#615d59]' />}
                                        <span>Copy Status</span>
                                    </button>
                                </div>
                            </div>

                            {/* Progress Gauge with 75% Target Marker */}
                            <div className='mt-5 pt-3 border-t border-[#e2ece3] dark:border-[#243728]'>
                                <div className='flex justify-between text-[11px] text-[#615d59] dark:text-[#9ea4b0] mb-1 font-medium'>
                                    <span>0% (Detained)</span>
                                    <span className='font-bold text-[#0075de] dark:text-[#62aef0]'>
                                        🎯 Target: {quickStats.target}%
                                    </span>
                                    <span>100% (Perfect)</span>
                                </div>
                                <div className='relative h-3 w-full bg-[#e6e6e6] dark:bg-[#141b24] rounded-full overflow-hidden p-0.5 border border-[#d2f0d9] dark:border-[#205130]'>
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            quickStats.isSafe ? 'bg-[#1aae39]' : 'bg-[#e11d48]'
                                        }`}
                                        style={{ width: `${Math.min(100, Math.max(3, quickStats.currentPct))}%` }}
                                    />
                                    {/* Target Line */}
                                    <div
                                        className='absolute top-0 bottom-0 w-0.5 bg-black dark:bg-white z-10 opacity-70'
                                        style={{ left: `${quickStats.target}%` }}
                                        title={`Target: ${quickStats.target}%`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Interactive Input Fields */}
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5'>
                                <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider'>
                                    Total Classes Conducted
                                </label>
                                <input
                                    type='number'
                                    min='1'
                                    max='500'
                                    value={totalClasses || ''}
                                    onChange={(e) => setTotalClasses(parseInt(e.target.value) || 0)}
                                    placeholder='e.g., 45'
                                    className='w-full px-3 py-2 text-lg font-bold bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all text-center'
                                />
                            </div>

                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5'>
                                <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider'>
                                    Classes Attended (Present)
                                </label>
                                <input
                                    type='number'
                                    min='0'
                                    max={totalClasses}
                                    value={attendedClasses === 0 ? '0' : attendedClasses || ''}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setAttendedClasses(val > totalClasses ? totalClasses : val);
                                    }}
                                    placeholder='e.g., 38'
                                    className='w-full px-3 py-2 text-lg font-bold bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all text-center'
                                />
                            </div>

                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-1.5'>
                                <div className='flex items-center justify-between'>
                                    <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider'>
                                        Target Criteria (%)
                                    </label>
                                    <div className='flex gap-1'>
                                        {[70, 75, 80].map((t) => (
                                            <button
                                                key={t}
                                                type='button'
                                                onClick={() => setTargetPercentage(t)}
                                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                                                    targetPercentage === t
                                                        ? 'bg-[#0075de] text-white'
                                                        : 'bg-[#e6e6e6] dark:bg-[#333] text-[#615d59] dark:text-[#a09e9a]'
                                                }`}
                                            >
                                                {t}%
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <input
                                    type='number'
                                    min='1'
                                    max='100'
                                    value={targetPercentage || ''}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setTargetPercentage(val > 100 ? 100 : val);
                                    }}
                                    placeholder='e.g., 75'
                                    className='w-full px-3 py-2 text-lg font-bold bg-white dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#0075de] dark:text-[#62aef0] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all text-center'
                                />
                            </div>
                        </div>

                        {/* Reset and Quick increment buttons */}
                        <div className='flex items-center justify-between gap-3 pt-2'>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => {
                                        setTotalClasses((prev) => prev + 1);
                                        setAttendedClasses((prev) => prev + 1);
                                    }}
                                    className='px-3 py-1.5 rounded-xl bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130] text-xs font-semibold hover:bg-[#d8f2dc] transition-all'
                                >
                                    + Attended 1 Class
                                </button>
                                <button
                                    onClick={() => {
                                        setTotalClasses((prev) => prev + 1);
                                    }}
                                    className='px-3 py-1.5 rounded-xl bg-[#fdf2f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185] border border-[#fcdada] dark:border-[#601925] text-xs font-semibold hover:bg-[#fbdada] transition-all'
                                >
                                    + Bunked 1 Class
                                </button>
                            </div>

                            <button
                                onClick={handleResetQuick}
                                className='px-3.5 py-1.5 rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#615d59] dark:text-[#a09e9a] text-xs font-semibold transition-all flex items-center gap-1.5'
                            >
                                <RotateCcw className='w-3.5 h-3.5' />
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* 2. MULTI-SUBJECT TRACKER */}
                {/* ---------------------------------------------------- */}
                {mode === 'MULTI_SUBJECT' && (
                    <div className='space-y-6'>
                        {/* Overall Multi-Subject Scorecard */}
                        <div className='p-4 sm:p-5 rounded-2xl bg-[#faf9f8] dark:bg-[#222222] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-xs'>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                                <div>
                                    <span className='text-[11px] font-bold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider block mb-1'>
                                        Overall Combined Attendance
                                    </span>
                                    <div className='flex items-baseline gap-2.5'>
                                        <span
                                            className={`text-3xl sm:text-4xl font-black tracking-tight ${
                                                multiStats.overallPct >= 75
                                                    ? 'text-[#1aae39] dark:text-[#4ade80]'
                                                    : 'text-[#e11d48] dark:text-[#fb7185]'
                                            }`}
                                        >
                                            {multiStats.overallPct}%
                                        </span>
                                        <span className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a]'>
                                            ({multiStats.totalAttended} / {multiStats.totalConducted} classes)
                                        </span>
                                    </div>
                                    <div className='mt-2 flex items-center gap-2'>
                                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80] border border-[#d2f0d9] dark:border-[#205130]'>
                                            <CheckCircle2 className='w-3 h-3' /> {multiStats.safeCount} Safe Subjects
                                        </span>
                                        {multiStats.criticalCount > 0 && (
                                            <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fdf2f2] text-[#e11d48] dark:bg-[#3b1118] dark:text-[#fb7185] border border-[#fcdada] dark:border-[#601925]'>
                                                <AlertCircle className='w-3 h-3' /> {multiStats.criticalCount} Below Target
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
                                    <button
                                        onClick={handleCopyReport}
                                        className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#282828] hover:bg-[#f2f2f0] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-semibold text-[#101828] dark:text-[#ededed] shadow-xs active:scale-[0.97] transition-all'
                                    >
                                        <Share2 className='w-3.5 h-3.5' />
                                        <span>Copy Multi-Report</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subject Cards List */}
                        <div className='space-y-3'>
                            {multiStats.subjects.map((sub) => (
                                <div
                                    key={sub.id}
                                    className={`p-4 rounded-xl border transition-all ${
                                        sub.isSafe
                                            ? 'bg-white dark:bg-[#1f1f1f] border-[#e6e6e6] dark:border-[#2f2f2f]'
                                            : 'bg-[#fdfbfb] dark:bg-[#261b1e] border-[#fcdada] dark:border-[#521c24]'
                                    }`}
                                >
                                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                                        <div className='flex-1 w-full'>
                                            <div className='flex items-center justify-between sm:justify-start gap-2 mb-1.5'>
                                                <input
                                                    type='text'
                                                    value={sub.name}
                                                    onChange={(e) =>
                                                        handleUpdateSubject(sub.id, 'name', e.target.value)
                                                    }
                                                    className='font-bold text-xs sm:text-sm text-[#101828] dark:text-white bg-transparent border-b border-transparent hover:border-[#e6e6e6] focus:border-[#0075de] focus:outline-none transition-all px-0.5'
                                                />
                                                <span
                                                    className={`text-xs font-black px-2 py-0.5 rounded-full ${
                                                        sub.isSafe
                                                            ? 'bg-[#eaf7ec] text-[#1aae39] dark:bg-[#163821] dark:text-[#4ade80]'
                                                            : 'bg-[#fdf2f2] text-[#e11d48] dark:bg-[#3b1118] dark:text-[#fb7185]'
                                                    }`}
                                                >
                                                    {sub.pct}%
                                                </span>
                                            </div>

                                            {/* Status verdict pill */}
                                            <p className='text-xs text-[#615d59] dark:text-[#a09e9a] flex items-center gap-1.5'>
                                                {sub.isSafe ? (
                                                    <span className='text-[#166534] dark:text-[#86efac] font-medium'>
                                                        ✨ Can safely bunk <strong>{sub.canBunk}</strong> classes
                                                    </span>
                                                ) : (
                                                    <span className='text-[#991b1b] dark:text-[#fca5a5] font-medium'>
                                                        ⚠️ Must attend <strong>{sub.needAttend}</strong> consecutive classes
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Input fields & Fast Counters */}
                                        <div className='flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end'>
                                            <div className='flex items-center gap-1.5 text-xs'>
                                                <div className='text-center'>
                                                    <span className='text-[10px] text-[#8c8883] block'>Attended</span>
                                                    <input
                                                        type='number'
                                                        min='0'
                                                        value={sub.attended}
                                                        onChange={(e) =>
                                                            handleUpdateSubject(
                                                                sub.id,
                                                                'attended',
                                                                parseInt(e.target.value) || 0
                                                            )
                                                        }
                                                        className='w-14 px-2 py-1 text-xs font-bold text-center bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg'
                                                    />
                                                </div>
                                                <span className='text-[#8c8883] mt-3'>/</span>
                                                <div className='text-center'>
                                                    <span className='text-[10px] text-[#8c8883] block'>Total</span>
                                                    <input
                                                        type='number'
                                                        min='1'
                                                        value={sub.total}
                                                        onChange={(e) =>
                                                            handleUpdateSubject(
                                                                sub.id,
                                                                'total',
                                                                parseInt(e.target.value) || 0
                                                            )
                                                        }
                                                        className='w-14 px-2 py-1 text-xs font-bold text-center bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg'
                                                    />
                                                </div>
                                            </div>

                                            {/* Fast Action Buttons */}
                                            <div className='flex items-center gap-1 pl-2'>
                                                <button
                                                    onClick={() => handleQuickAction(sub.id, 'attended')}
                                                    className='p-1.5 px-2 bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] rounded-lg text-xs font-bold hover:bg-[#d5f0db] transition-all'
                                                    title='Mark Present (+1)'
                                                >
                                                    + Present
                                                </button>
                                                <button
                                                    onClick={() => handleQuickAction(sub.id, 'bunked')}
                                                    className='p-1.5 px-2 bg-[#fdf2f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185] rounded-lg text-xs font-bold hover:bg-[#fcdada] transition-all'
                                                    title='Mark Absent (+1)'
                                                >
                                                    + Absent
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveSubject(sub.id)}
                                                    className='p-1.5 text-[#8c8883] hover:text-[#e11d48] rounded-lg transition-colors'
                                                    title='Delete subject'
                                                >
                                                    <Trash2 className='w-3.5 h-3.5' />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Subject Button */}
                        <button
                            onClick={handleAddSubject}
                            className='w-full py-2.5 border-2 border-dashed border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#1aae39] dark:hover:border-[#4ade80] rounded-xl text-xs sm:text-sm font-semibold text-[#615d59] dark:text-[#a09e9a] hover:text-[#1aae39] dark:hover:text-[#4ade80] bg-[#faf9f8] dark:bg-[#181818] hover:bg-[#f6f5f4] dark:hover:bg-[#202020] transition-all flex items-center justify-center gap-2 active:scale-[0.99]'
                        >
                            <Plus className='w-4 h-4' />
                            <span>Add Another Subject</span>
                        </button>
                    </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* 3. BUNK SIMULATION MATRIX */}
                {/* ---------------------------------------------------- */}
                {mode === 'SIMULATION' && (
                    <div className='space-y-6 max-w-2xl mx-auto py-2'>
                        <div className='flex items-start gap-2.5 p-3.5 rounded-xl bg-[#f0ebf8]/60 dark:bg-[#2b1f3d]/40 border border-[#e2d5f3] dark:border-[#3e2b58] text-xs text-[#8a3fd6] dark:text-[#c084fc]'>
                            <Sparkles className='w-4 h-4 shrink-0 mt-0.5' />
                            <p className='leading-relaxed'>
                                <strong>What-If Simulation Matrix:</strong> Instant projection of your attendance percentage based on your current stats ({quickStats.attended}/{quickStats.total} classes = {quickStats.currentPct}%).
                            </p>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* If You Attend Scenarios */}
                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-2.5'>
                                <h4 className='font-bold text-xs sm:text-sm text-[#101828] dark:text-white flex items-center gap-1.5'>
                                    <TrendingUp className='w-4 h-4 text-[#1aae39]' />
                                    <span>If you attend next...</span>
                                </h4>
                                <div className='space-y-1.5'>
                                    {simulationMatrix.attendScenarios.map((item) => (
                                        <div
                                            key={item.count}
                                            className='flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#1c1c1c] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs'
                                        >
                                            <span className='font-medium text-[#615d59] dark:text-[#ededed]'>
                                                +{item.count} Classes
                                            </span>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-bold text-[#1aae39] dark:text-[#4ade80]'>
                                                    {item.newPct}%
                                                </span>
                                                <span className='text-[10px] text-[#166534] dark:text-[#86efac] font-semibold'>
                                                    (+{item.diff}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* If You Bunk Scenarios */}
                            <div className='p-4 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] space-y-2.5'>
                                <h4 className='font-bold text-xs sm:text-sm text-[#101828] dark:text-white flex items-center gap-1.5'>
                                    <TrendingDown className='w-4 h-4 text-[#e11d48]' />
                                    <span>If you bunk next...</span>
                                </h4>
                                <div className='space-y-1.5'>
                                    {simulationMatrix.bunkScenarios.map((item) => (
                                        <div
                                            key={item.count}
                                            className='flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#1c1c1c] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs'
                                        >
                                            <span className='font-medium text-[#615d59] dark:text-[#ededed]'>
                                                +{item.count} Bunks
                                            </span>
                                            <div className='flex items-center gap-2'>
                                                <span
                                                    className={`font-bold ${
                                                        item.isSafe
                                                            ? 'text-[#1aae39] dark:text-[#4ade80]'
                                                            : 'text-[#e11d48] dark:text-[#fb7185]'
                                                    }`}
                                                >
                                                    {item.newPct}%
                                                </span>
                                                <span className='text-[10px] text-[#e11d48] dark:text-[#fb7185] font-semibold'>
                                                    ({item.diff}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
