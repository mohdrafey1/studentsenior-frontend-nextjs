import React from 'react';
import SearchableSelect from '@/components/Common/SearchableSelect';
import { ICourse, IBranch } from '@/utils/interface';

interface CommonFiltersProps {
    courseFilter: string;
    setCourseFilter: (value: string) => void;
    branchFilter: string;
    setBranchFilter: (value: string) => void;
    semesterFilter?: string;
    setSemesterFilter?: (value: string) => void;
    courses: ICourse[];
    branches: IBranch[];
    loadingCourses: boolean;
    loadingBranches: boolean;
}

export const CommonFilters: React.FC<CommonFiltersProps> = ({
    courseFilter,
    setCourseFilter,
    branchFilter,
    setBranchFilter,
    semesterFilter,
    setSemesterFilter,
    courses,
    branches,
    loadingCourses,
    loadingBranches,
}) => {
    return (
        <>
            {/* Course Filter */}
            <SearchableSelect
                value={courseFilter}
                onChange={setCourseFilter}
                options={courses.map((course) => ({
                    value: course.courseCode,
                    label: course.courseName,
                }))}
                placeholder='Select Course'
                loading={loadingCourses}
            />

            {/* Branch Filter */}
            <SearchableSelect
                value={branchFilter}
                onChange={setBranchFilter}
                options={branches.map((branch) => ({
                    value: branch.branchCode,
                    label: branch.branchName,
                }))}
                placeholder='Select Branch'
                loading={loadingBranches}
                disabled={!courseFilter}
            />

            {/* Semester Filter */}
            {setSemesterFilter && (
                <select
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value)}
                    className='w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-sm hover:border-sky-400 dark:hover:border-sky-500'
                >
                    <option value=''>All Semesters</option>
                    <option value='1'>1st Semester</option>
                    <option value='2'>2nd Semester</option>
                    <option value='3'>3rd Semester</option>
                    <option value='4'>4th Semester</option>
                    <option value='5'>5th Semester</option>
                    <option value='6'>6th Semester</option>
                    <option value='7'>7th Semester</option>
                    <option value='8'>8th Semester</option>
                    <option value='9'>9th Semester</option>
                </select>
            )}
        </>
    );
};
