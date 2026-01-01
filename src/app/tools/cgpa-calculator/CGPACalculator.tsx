'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Calculator, RotateCcw } from 'lucide-react';

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
    O: '90-100%',
    'A+': '80-89%',
    A: '70-79%',
    'B+': '60-69%',
    B: '50-59%',
    C: '40-49%',
    P: '35-39%',
    F: '<35%',
};

const GRADES = Object.keys(GRADE_POINTS) as Grade[];

export default function CGPACalculator() {
    const [mode, setMode] = useState<'SGPA' | 'CGPA' | 'PERCENTAGE'>('SGPA');

    // SGPA State
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: 1, name: '', credit: 4, grade: 'O' },
        { id: 2, name: '', credit: 4, grade: 'A+' },
        { id: 3, name: '', credit: 3, grade: 'A' },
        { id: 4, name: '', credit: 3, grade: 'B+' },
    ]);
    const [sgpaResult, setSgpaResult] = useState<number | null>(null);

    // CGPA State
    const [semesters, setSemesters] = useState<Semester[]>([
        { id: 1, sgpa: 0, credit: 20 },
        { id: 2, sgpa: 0, credit: 20 },
    ]);
    const [cgpaResult, setCgpaResult] = useState<number | null>(null);

    // CGPA to Percentage State
    const [cgpaInput, setCgpaInput] = useState<number>(0);
    const [percentageResult, setPercentageResult] = useState<number | null>(
        null,
    );

    // Handlers for SGPA
    const handleSubjectChange = (
        id: number,
        field: keyof Subject,
        value: string | number,
    ) => {
        setSubjects((prev) =>
            prev.map((sub) =>
                sub.id === id ? { ...sub, [field]: value } : sub,
            ),
        );
    };

    const addSubject = () => {
        setSubjects((prev) => [
            ...prev,
            { id: Date.now(), name: '', credit: 3, grade: 'A' },
        ]);
    };

    const removeSubject = (id: number) => {
        setSubjects((prev) => prev.filter((sub) => sub.id !== id));
    };

    const calculateSGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;

        subjects.forEach((sub) => {
            totalPoints += sub.credit * GRADE_POINTS[sub.grade];
            totalCredits += Number(sub.credit);
        });

        const result = totalCredits > 0 ? totalPoints / totalCredits : 0;
        setSgpaResult(parseFloat(result.toFixed(2)));
    };

    // Handlers for CGPA
    const handleSemesterChange = (
        id: number,
        field: keyof Semester,
        value: number,
    ) => {
        setSemesters((prev) =>
            prev.map((sem) =>
                sem.id === id ? { ...sem, [field]: value } : sem,
            ),
        );
    };

    const addSemester = () => {
        setSemesters((prev) => [
            ...prev,
            { id: Date.now(), sgpa: 0, credit: 20 },
        ]);
    };

    const removeSemester = (id: number) => {
        setSemesters((prev) => prev.filter((sem) => sem.id !== id));
    };

    const calculateCGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;

        semesters.forEach((sem) => {
            totalPoints += sem.sgpa * sem.credit;
            totalCredits += Number(sem.credit);
        });

        const result = totalCredits > 0 ? totalPoints / totalCredits : 0;
        setCgpaResult(parseFloat(result.toFixed(2)));
    };

    const calculatePercentage = () => {
        // Common formula: Percentage = (CGPA - 0.75) * 10
        // Alternative formula: Percentage = CGPA * 9.5
        const result = (cgpaInput - 0.75) * 10;
        setPercentageResult(parseFloat(result.toFixed(2)));
    };

    const reset = () => {
        if (mode === 'SGPA') {
            setSubjects([
                { id: 1, name: '', credit: 4, grade: 'O' },
                { id: 2, name: '', credit: 4, grade: 'A+' },
                { id: 3, name: '', credit: 3, grade: 'A' },
                { id: 4, name: '', credit: 3, grade: 'B+' },
            ]);
            setSgpaResult(null);
        } else if (mode === 'CGPA') {
            setSemesters([
                { id: 1, sgpa: 0, credit: 20 },
                { id: 2, sgpa: 0, credit: 20 },
            ]);
            setCgpaResult(null);
        } else {
            setCgpaInput(0);
            setPercentageResult(null);
        }
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-gray-100 dark:border-gray-700'>
            {/* Header / Tabs */}
            <div className='flex border-b border-gray-200 dark:border-gray-700'>
                <button
                    onClick={() => setMode('SGPA')}
                    className={`flex-1 py-3 sm:py-4 text-center font-bold text-sm sm:text-base md:text-lg transition-colors ${
                        mode === 'SGPA'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    SGPA
                </button>
                <button
                    onClick={() => setMode('CGPA')}
                    className={`flex-1 py-3 sm:py-4 text-center font-bold text-sm sm:text-base md:text-lg transition-colors ${
                        mode === 'CGPA'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    CGPA
                </button>
                <button
                    onClick={() => setMode('PERCENTAGE')}
                    className={`flex-1 py-3 sm:py-4 text-center font-bold text-sm sm:text-base md:text-lg transition-colors ${
                        mode === 'PERCENTAGE'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    CGPA to %
                </button>
            </div>

            <div className='p-6 sm:p-8'>
                {mode === 'SGPA' ? (
                    <div className='space-y-6'>
                        <div className='bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 mb-6'>
                            <p className='font-semibold mb-1'>
                                How SGPA is calculated:
                            </p>
                            <p>
                                SGPA (Semester Grade Point Average) is the
                                weighted average of grade points secured in all
                                subjects. Formula: Σ(Credit × Grade Point) /
                                Σ(Credit)
                            </p>
                        </div>

                        <div className='hidden sm:grid grid-cols-12 gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2'>
                            <div className='col-span-5'>Subject (Optional)</div>
                            <div className='col-span-3'>Credit</div>
                            <div className='col-span-3'>Grade</div>
                            <div className='col-span-1'></div>
                        </div>

                        <div className='space-y-3'>
                            {subjects.map((sub, index) => (
                                <div
                                    key={sub.id}
                                    className='grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg sm:bg-transparent sm:dark:bg-transparent sm:p-0'
                                >
                                    <div className='col-span-5'>
                                        <input
                                            type='text'
                                            placeholder={`Subject ${index + 1}`}
                                            value={sub.name}
                                            onChange={(e) =>
                                                handleSubjectChange(
                                                    sub.id,
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow'
                                        />
                                    </div>
                                    <div className='col-span-3 flex items-center space-x-2'>
                                        <span className='sm:hidden text-gray-500'>
                                            Credit:
                                        </span>
                                        <input
                                            type='number'
                                            min='1'
                                            max='10'
                                            value={sub.credit}
                                            onChange={(e) =>
                                                handleSubjectChange(
                                                    sub.id,
                                                    'credit',
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow'
                                        />
                                    </div>
                                    <div className='col-span-3 flex items-center space-x-2'>
                                        <span className='sm:hidden text-gray-500'>
                                            Grade:
                                        </span>
                                        <select
                                            value={sub.grade}
                                            onChange={(e) =>
                                                handleSubjectChange(
                                                    sub.id,
                                                    'grade',
                                                    e.target.value as Grade,
                                                )
                                            }
                                            className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow cursor-pointer'
                                        >
                                            {GRADES.map((g) => (
                                                <option key={g} value={g}>
                                                    {g} ({GRADE_POINTS[g]}) -{' '}
                                                    {GRADE_RANGES[g]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='col-span-1 text-right'>
                                        <button
                                            onClick={() =>
                                                removeSubject(sub.id)
                                            }
                                            className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors'
                                            disabled={subjects.length === 1}
                                        >
                                            <Trash2 className='w-5 h-5' />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addSubject}
                            className='w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 font-semibold hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2'
                        >
                            <Plus className='w-5 h-5' />
                            Add Subject
                        </button>
                    </div>
                ) : mode === 'CGPA' ? (
                    <div className='space-y-6'>
                        <div className='bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 mb-6'>
                            <p className='font-semibold mb-1'>
                                How CGPA is calculated:
                            </p>
                            <p>
                                CGPA (Cumulative Grade Point Average) is
                                calculated using the credit-weighted average of
                                SGPA for all semesters.
                            </p>
                        </div>

                        <div className='hidden sm:grid grid-cols-12 gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2'>
                            <div className='col-span-2'>Semester</div>
                            <div className='col-span-5'>SGPA</div>
                            <div className='col-span-4'>Total Credits</div>
                            <div className='col-span-1'></div>
                        </div>

                        <div className='space-y-3'>
                            {semesters.map((sem, index) => (
                                <div
                                    key={sem.id}
                                    className='grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg sm:bg-transparent sm:dark:bg-transparent sm:p-0'
                                >
                                    <div className='col-span-2 font-medium text-gray-700 dark:text-gray-300'>
                                        Sem {index + 1}
                                    </div>
                                    <div className='col-span-5 flex items-center space-x-2'>
                                        <span className='sm:hidden text-gray-500'>
                                            SGPA:
                                        </span>
                                        <input
                                            type='number'
                                            min='0'
                                            max='10'
                                            step='0.01'
                                            value={sem.sgpa}
                                            onChange={(e) =>
                                                handleSemesterChange(
                                                    sem.id,
                                                    'sgpa',
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                            className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow'
                                        />
                                    </div>
                                    <div className='col-span-4 flex items-center space-x-2'>
                                        <span className='sm:hidden text-gray-500'>
                                            Credits:
                                        </span>
                                        <input
                                            type='number'
                                            min='1'
                                            value={sem.credit}
                                            onChange={(e) =>
                                                handleSemesterChange(
                                                    sem.id,
                                                    'credit',
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow'
                                        />
                                    </div>
                                    <div className='col-span-1 text-right'>
                                        <button
                                            onClick={() =>
                                                removeSemester(sem.id)
                                            }
                                            className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors'
                                            disabled={semesters.length === 1}
                                        >
                                            <Trash2 className='w-5 h-5' />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addSemester}
                            className='w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 font-semibold hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2'
                        >
                            <Plus className='w-5 h-5' />
                            Add Semester
                        </button>
                    </div>
                ) : mode === 'PERCENTAGE' ? (
                    <div className='space-y-6'>
                        <div className='bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 mb-6'>
                            <p className='font-semibold mb-1'>
                                How CGPA to Percentage is calculated:
                            </p>
                            <p>
                                The most common formula used is:{' '}
                                <strong>Percentage = (CGPA - 0.75) × 10</strong>
                            </p>
                            <p className='text-xs mt-2 opacity-80'>
                                Note: Different universities may use different
                                conversion formulas. Please verify with your
                                institution.
                            </p>
                        </div>

                        <div className='max-w-md mx-auto'>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                Enter your CGPA (0-10)
                            </label>
                            <input
                                type='number'
                                min='0'
                                max='10'
                                step='0.01'
                                value={cgpaInput}
                                onChange={(e) =>
                                    setCgpaInput(
                                        parseFloat(e.target.value) || 0,
                                    )
                                }
                                placeholder='e.g., 8.5'
                                className='w-full px-6 py-4 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                            />
                        </div>

                        <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
                            <p>Formula: (CGPA - 0.75) × 10</p>
                            {cgpaInput > 0 && (
                                <p className='mt-1'>
                                    ({cgpaInput} - 0.75) × 10 ={' '}
                                    {((cgpaInput - 0.75) * 10).toFixed(2)}%
                                </p>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Actions & Result */}
                <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6'>
                    <div className='flex gap-4 w-full sm:w-auto'>
                        <button
                            onClick={
                                mode === 'SGPA'
                                    ? calculateSGPA
                                    : mode === 'CGPA'
                                      ? calculateCGPA
                                      : calculatePercentage
                            }
                            className='flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg active:transform active:scale-95 transition-all flex items-center justify-center gap-2'
                        >
                            <Calculator className='w-5 h-5' />
                            Calculate{' '}
                            {mode === 'PERCENTAGE' ? 'Percentage' : mode}
                        </button>
                        <button
                            onClick={reset}
                            className='px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors flex items-center justify-center'
                        >
                            <RotateCcw className='w-5 h-5' />
                        </button>
                    </div>

                    {(sgpaResult !== null ||
                        cgpaResult !== null ||
                        percentageResult !== null) && (
                        <div className='w-full sm:w-auto text-center sm:text-right animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                Your{' '}
                                {mode === 'PERCENTAGE' ? 'Percentage' : mode} is
                            </p>
                            <p className='text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300'>
                                {mode === 'SGPA'
                                    ? sgpaResult
                                    : mode === 'CGPA'
                                      ? cgpaResult
                                      : percentageResult !== null
                                        ? `${percentageResult}%`
                                        : null}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
