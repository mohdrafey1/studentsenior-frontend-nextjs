import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import { ICourse, IBranch } from '@/utils/interface';

export const useCoursesAndBranches = (courseFilter?: string) => {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);
    // Courses and branches belong to the college in the URL.
    const params = useParams<{ slug?: string }>();
    const collegeSlug = typeof params?.slug === 'string' ? params.slug : undefined;

    // Fetch courses on mount
    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collegeSlug]);

    // Fetch branches when course filter changes
    useEffect(() => {
        if (courseFilter) {
            fetchBranches(courseFilter);
        } else {
            setBranches([]);
        }
    }, [courseFilter]);

    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await fetch(api.resources.coursesOf(collegeSlug));
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch courses');
            }

            setCourses(data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
        } finally {
            setLoadingCourses(false);
        }
    };

    const fetchBranches = async (courseCode: string) => {
        setLoadingBranches(true);
        try {
            const response = await fetch(api.resources.getBranches(courseCode, collegeSlug));
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch branches');
            }

            setBranches(data.data || []);
        } catch (error) {
            console.error('Error fetching branches:', error);
            toast.error('Failed to fetch branches');
        } finally {
            setLoadingBranches(false);
        }
    };

    return {
        courses,
        branches,
        loadingCourses,
        loadingBranches,
        fetchBranches,
    };
};
