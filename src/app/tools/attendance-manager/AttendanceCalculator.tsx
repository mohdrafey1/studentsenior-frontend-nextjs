'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';

export default function AttendanceCalculator() {
    const [totalClasses, setTotalClasses] = useState<number>(0);
    const [attendedClasses, setAttendedClasses] = useState<number>(0);
    const [targetPercentage, setTargetPercentage] = useState<number>(75);
    const [currentPercentage, setCurrentPercentage] = useState<number>(0);
    const [classesToAttend, setClassesToAttend] = useState<number>(0);
    const [classesToBunk, setClassesToBunk] = useState<number>(0);
    const [hasCalculated, setHasCalculated] = useState<boolean>(false);

    useEffect(() => {
        if (totalClasses > 0) {
            const current = (attendedClasses / totalClasses) * 100;
            setCurrentPercentage(parseFloat(current.toFixed(2)));
        } else {
            setCurrentPercentage(0);
        }
    }, [totalClasses, attendedClasses]);

    const calculate = () => {
        if (totalClasses === 0) {
            setHasCalculated(false);
            return;
        }

        const current = (attendedClasses / totalClasses) * 100;
        setCurrentPercentage(parseFloat(current.toFixed(2)));

        // Calculate classes to attend to reach target
        // Formula: (attendedClasses + x) / (totalClasses + x) = targetPercentage / 100
        // Solving for x: x = (targetPercentage * totalClasses - 100 * attendedClasses) / (100 - targetPercentage)

        if (current < targetPercentage) {
            const numerator =
                targetPercentage * totalClasses - 100 * attendedClasses;
            const denominator = 100 - targetPercentage;
            const classesNeeded = Math.ceil(numerator / denominator);
            setClassesToAttend(classesNeeded > 0 ? classesNeeded : 0);
            setClassesToBunk(0);
        } else {
            // Calculate classes that can be bunked while staying above target
            // Formula: (attendedClasses) / (totalClasses + x) = targetPercentage / 100
            // Solving for x: x = (100 * attendedClasses / targetPercentage) - totalClasses
            const maxTotalClasses = (100 * attendedClasses) / targetPercentage;
            const canBunk = Math.floor(maxTotalClasses - totalClasses);
            setClassesToBunk(canBunk > 0 ? canBunk : 0);
            setClassesToAttend(0);
        }

        setHasCalculated(true);
    };

    const reset = () => {
        setTotalClasses(0);
        setAttendedClasses(0);
        setTargetPercentage(75);
        setCurrentPercentage(0);
        setClassesToAttend(0);
        setClassesToBunk(0);
        setHasCalculated(false);
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-gray-100 dark:border-gray-700'>
            <div className='p-6 sm:p-8'>
                {/* Info Box */}
                <div className='bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 mb-6'>
                    <p className='font-semibold mb-1'>How it works:</p>
                    <p>
                        Enter your total classes conducted, classes you
                        attended, and your target attendance percentage.
                        We&apos;ll tell you how many classes you need to attend
                        or can safely bunk!
                    </p>
                </div>

                {/* Input Fields */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            Total Classes Conducted
                        </label>
                        <input
                            type='number'
                            min='0'
                            max='1000'
                            value={totalClasses}
                            onChange={(e) =>
                                setTotalClasses(parseInt(e.target.value) || 0)
                            }
                            placeholder='e.g., 100'
                            className='w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            Classes Attended
                        </label>
                        <input
                            type='number'
                            min='0'
                            max={totalClasses}
                            value={attendedClasses}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setAttendedClasses(
                                    value > totalClasses ? totalClasses : value,
                                );
                            }}
                            placeholder='e.g., 70'
                            className='w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            Target Percentage (%)
                        </label>
                        <input
                            type='number'
                            min='0'
                            max='100'
                            value={targetPercentage}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setTargetPercentage(value > 100 ? 100 : value);
                            }}
                            placeholder='e.g., 75'
                            className='w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                        />
                    </div>
                </div>

                {/* Current Attendance Display */}
                {totalClasses > 0 && (
                    <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                                Current Attendance:
                            </span>
                            <span
                                className={`text-2xl font-bold ${
                                    currentPercentage >= targetPercentage
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                }`}
                            >
                                {currentPercentage}%
                            </span>
                        </div>
                        <div className='mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    currentPercentage >= targetPercentage
                                        ? 'bg-green-600 dark:bg-green-400'
                                        : 'bg-red-600 dark:bg-red-400'
                                }`}
                                style={{
                                    width: `${Math.min(currentPercentage, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className='flex gap-4 mb-6'>
                    <button
                        onClick={calculate}
                        className='flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg active:transform active:scale-95 transition-all flex items-center justify-center gap-2'
                    >
                        <Calculator className='w-5 h-5' />
                        Calculate
                    </button>
                    <button
                        onClick={reset}
                        className='px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors flex items-center justify-center'
                    >
                        <RotateCcw className='w-5 h-5' />
                    </button>
                </div>

                {/* Results */}
                {hasCalculated && totalClasses > 0 && (
                    <div className='space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                        {currentPercentage < targetPercentage ? (
                            <div className='p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg'>
                                <div className='flex items-start gap-3'>
                                    <TrendingUp className='w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1' />
                                    <div className='flex-1'>
                                        <h3 className='text-lg font-bold text-red-900 dark:text-red-100 mb-2'>
                                            Attendance Below Target
                                        </h3>
                                        <p className='text-red-800 dark:text-red-200 mb-3'>
                                            You need to attend{' '}
                                            <span className='font-bold text-2xl'>
                                                {classesToAttend}
                                            </span>{' '}
                                            more consecutive classes to reach{' '}
                                            {targetPercentage}% attendance.
                                        </p>
                                        <p className='text-sm text-red-700 dark:text-red-300'>
                                            After attending {classesToAttend}{' '}
                                            classes, your attendance will be{' '}
                                            <span className='font-semibold'>
                                                {(
                                                    ((attendedClasses +
                                                        classesToAttend) /
                                                        (totalClasses +
                                                            classesToAttend)) *
                                                    100
                                                ).toFixed(2)}
                                                %
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg'>
                                <div className='flex items-start gap-3'>
                                    <TrendingDown className='w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1' />
                                    <div className='flex-1'>
                                        <h3 className='text-lg font-bold text-green-900 dark:text-green-100 mb-2'>
                                            Attendance On Track! 🎉
                                        </h3>
                                        {classesToBunk > 0 ? (
                                            <>
                                                <p className='text-green-800 dark:text-green-200 mb-3'>
                                                    You can bunk{' '}
                                                    <span className='font-bold text-2xl'>
                                                        {classesToBunk}
                                                    </span>{' '}
                                                    consecutive classes and
                                                    still maintain{' '}
                                                    {targetPercentage}%
                                                    attendance.
                                                </p>
                                                <p className='text-sm text-green-700 dark:text-green-300'>
                                                    After bunking{' '}
                                                    {classesToBunk} classes,
                                                    your attendance will be{' '}
                                                    <span className='font-semibold'>
                                                        {(
                                                            (attendedClasses /
                                                                (totalClasses +
                                                                    classesToBunk)) *
                                                            100
                                                        ).toFixed(2)}
                                                        %
                                                    </span>
                                                </p>
                                            </>
                                        ) : (
                                            <p className='text-green-800 dark:text-green-200'>
                                                You&apos;re exactly at{' '}
                                                {targetPercentage}% attendance.
                                                Attend the next class to have
                                                some buffer!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
