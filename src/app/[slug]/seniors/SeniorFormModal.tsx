'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ISenior, ICourse, IBranch } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import { X, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import SearchableSelect from '@/components/Common/SearchableSelect';
import Image from 'next/image';

export interface SeniorFormData {
    name: string;
    domain: string;
    branch: string;
    year: string;
    profilePicture: string;
    socialMediaLinks: { platform: string; url: string }[];
    description: string;
}

interface SeniorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SeniorFormData) => Promise<void>;
    editSenior?: ISenior | null;
    form: SeniorFormData;
    setForm: (form: SeniorFormData) => void;
    loading: boolean;
}

const SeniorFormModal: React.FC<SeniorFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editSenior,
    form,
    setForm,
    loading,
}) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const appliedPrefRef = useRef(false);

    // Fetch courses on component mount
    useEffect(() => {
        if (isOpen) {
            fetchCourses();
        }
    }, [isOpen]);

    // Fetch branches when course changes
    useEffect(() => {
        if (selectedCourse) {
            fetchBranches(selectedCourse);
        } else {
            setBranches([]);
        }
    }, [selectedCourse]);

    // Apply saved preference: set course from localStorage when modal opens
    useEffect(() => {
        if (!isOpen) {
            appliedPrefRef.current = false;
            return;
        }
        try {
            const saved = localStorage.getItem('ss:resourcePref');
            if (!saved) return;
            const pref = JSON.parse(saved) as {
                courseCode?: string;
                branchCode?: string;
            };
            if (pref.courseCode && !selectedCourse) {
                setSelectedCourse(pref.courseCode);
            }
        } catch {
            // ignore
        }
    }, [isOpen, selectedCourse]);

    // After branches load, set branch based on saved preference (apply once per open)
    useEffect(() => {
        if (
            !isOpen ||
            appliedPrefRef.current ||
            !selectedCourse ||
            branches.length === 0
        )
            return;
        try {
            const saved = localStorage.getItem('ss:resourcePref');
            if (!saved) return;
            const pref = JSON.parse(saved) as { branchCode?: string };
            if (!pref.branchCode) return;
            const match = branches.find(
                (b) => (b as IBranch).branchCode === pref.branchCode,
            );
            if (match) {
                setForm({
                    ...form,
                    branch: match._id,
                });
                appliedPrefRef.current = true;
            }
        } catch {
            // ignore
        }
    }, [branches, isOpen, selectedCourse, form, setForm]);

    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await fetch(api.resources.getCourses);
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
            const response = await fetch(api.resources.getBranches(courseCode));
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

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Reset branch when course changes
        if (name === 'course') {
            setSelectedCourse(value);
            setForm({ ...form, branch: '' });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setSelectedImage(file);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        try {
            const fileName = `public/ss-seniors/${Date.now()}-${file.name.replace(
                /[^a-zA-Z0-9.-]/g,
                '',
            )}`;
            const fileType = file.type;

            // Get presigned URL
            const presignedRes = await fetch(api.aws.presignedUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ fileName, fileType }),
            });

            if (!presignedRes.ok) {
                throw new Error('Failed to get upload URL');
            }

            const { uploadUrl, key } = await presignedRes.json();

            // Upload to S3
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': fileType },
                body: file,
            });

            if (!uploadRes.ok) {
                throw new Error('Failed to upload image');
            }

            // Return the CloudFront URL
            return `https://dixu7g0y1r80v.cloudfront.net/${key}`;
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error('Failed to upload image');
        }
    };

    const addSocialMediaLink = () => {
        setForm({
            ...form,
            socialMediaLinks: [
                ...form.socialMediaLinks,
                { platform: 'whatsapp', url: '' },
            ],
        });
    };

    const removeSocialMediaLink = (index: number) => {
        setForm({
            ...form,
            socialMediaLinks: form.socialMediaLinks.filter(
                (_, i) => i !== index,
            ),
        });
    };

    const updateSocialMediaLink = (
        index: number,
        field: 'platform' | 'url',
        value: string,
    ) => {
        const updatedLinks = [...form.socialMediaLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        setForm({ ...form, socialMediaLinks: updatedLinks });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setImageLoading(true);
            let profilePicture = form.profilePicture;

            // Upload new image if selected
            if (selectedImage) {
                const loadingToast = toast.loading('Uploading image...');
                try {
                    profilePicture = await uploadImage(selectedImage);
                    toast.dismiss(loadingToast);
                    toast.success('Image uploaded successfully');
                } catch (error) {
                    console.error('Image upload error:', error);
                    toast.dismiss(loadingToast);
                    toast.error('Failed to upload image');
                    return;
                }
            }

            // Filter out empty social media links
            const validSocialMediaLinks = form.socialMediaLinks.filter(
                (link) => link.platform && link.url,
            );

            // Submit the form with the new image URL
            await onSubmit({
                ...form,
                profilePicture,
                socialMediaLinks: validSocialMediaLinks,
            });

            // Reset form
            setSelectedImage(null);
            setSelectedCourse('');
            setForm({
                name: '',
                domain: '',
                branch: '',
                year: '',
                profilePicture: '',
                socialMediaLinks: [],
                description: '',
            });
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Failed to submit form');
        } finally {
            setImageLoading(false);
        }
    };

    // Format data for searchable selects
    const courseOptions = courses.map((course) => ({
        value: course.courseCode,
        label: course.courseName,
    }));

    const branchOptions = branches.map((branch) => ({
        value: branch._id,
        label: branch.branchName,
    }));

    return (
        <div className='fixed inset-0 bg-sky-50 dark:bg-gray-900 flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                        {editSenior
                            ? 'Edit Senior Profile'
                            : 'Add New Senior Profile'}
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors'
                    >
                        <X className='w-6 h-6' />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className='p-6 space-y-4 bg-white dark:bg-gray-800'
                >
                    {/* Name */}
                    <div>
                        <label className='block font-semibold text-sky-500 mb-2'>
                            Full Name *
                        </label>
                        <input
                            type='text'
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            required
                            className='w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100'
                            placeholder='Enter your full name'
                        />
                    </div>

                    {/* Domain */}
                    <div>
                        <label className='block font-semibold text-sky-500 mb-2'>
                            Domain/Expertise
                        </label>
                        <input
                            type='text'
                            name='domain'
                            value={form.domain}
                            onChange={handleChange}
                            className='w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100'
                            placeholder='e.g., Web Development, Machine Learning'
                        />
                    </div>

                    {/* Course */}
                    <SearchableSelect
                        options={courseOptions}
                        value={selectedCourse}
                        onChange={setSelectedCourse}
                        placeholder='Select Course'
                        label='Course'
                        loading={loadingCourses}
                        required={true}
                    />

                    {/* Branch */}
                    {selectedCourse && (
                        <SearchableSelect
                            options={branchOptions}
                            value={form.branch}
                            onChange={(value) =>
                                setForm({ ...form, branch: value })
                            }
                            placeholder='Select Branch'
                            label='Branch'
                            loading={loadingBranches}
                            required={true}
                        />
                    )}

                    {/* Year */}
                    <div>
                        <label className='block font-semibold text-sky-500 mb-2'>
                            Year *
                        </label>
                        <select
                            name='year'
                            value={form.year}
                            onChange={handleChange}
                            required
                            className='w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent appearance-none bg-white dark:bg-gray-700 dark:text-gray-100'
                        >
                            <option value=''>Select Year</option>
                            <option value='1st Year'>1st Year</option>
                            <option value='2nd Year'>2nd Year</option>
                            <option value='3rd Year'>3rd Year</option>
                            <option value='4th Year'>4th Year</option>
                            <option value='5th Year'>5th Year</option>
                            <option value='Alumni'>Alumni</option>
                        </select>
                    </div>

                    {/* Profile Picture Upload */}
                    <div>
                        <label className='block font-semibold text-sky-500 mb-2'>
                            Profile Picture *
                        </label>
                        <div className='flex items-center gap-4'>
                            <label className='flex-1 border border-gray-300 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:border-sky-400 transition-colors dark:bg-gray-700 dark:text-gray-100'>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    className='hidden'
                                    disabled={imageLoading}
                                    required={!form.profilePicture}
                                />
                                <div className='flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400'>
                                    {imageLoading ? (
                                        <>
                                            <Loader2 className='w-5 h-5 animate-spin text-sky-500' />
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className='w-5 h-5' />
                                            <span>
                                                {selectedImage
                                                    ? selectedImage.name
                                                    : 'Choose image (Max 5MB)'}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </label>
                            {form.profilePicture && (
                                <div className='w-16 h-16 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700'>
                                    <Image
                                        src={form.profilePicture}
                                        alt='Preview'
                                        className='object-cover w-full h-full'
                                        width={64}
                                        height={64}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <div className='flex items-center justify-between mb-3'>
                            <label className='block font-semibold text-sky-500'>
                                Social Media Links
                            </label>
                            <button
                                type='button'
                                onClick={addSocialMediaLink}
                                className='flex items-center gap-1 text-sky-500 hover:text-sky-600 font-medium transition-colors dark:text-sky-400 dark:hover:text-sky-500'
                            >
                                <Plus className='w-4 h-4' />
                                Add Link
                            </button>
                        </div>
                        <div className='space-y-3'>
                            {form.socialMediaLinks.map((link, index) => (
                                <div key={index} className='flex gap-2'>
                                    <select
                                        value={link.platform}
                                        onChange={(e) =>
                                            updateSocialMediaLink(
                                                index,
                                                'platform',
                                                e.target.value,
                                            )
                                        }
                                        className='w-1/3 border border-gray-300 dark:border-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent appearance-none bg-white dark:bg-gray-700 dark:text-gray-100        '
                                    >
                                        <option value='whatsapp'>
                                            WhatsApp
                                        </option>
                                        <option value='telegram'>
                                            Telegram
                                        </option>
                                        <option value='instagram'>
                                            Instagram
                                        </option>
                                        <option value='linkedin'>
                                            LinkedIn
                                        </option>
                                        <option value='facebook'>
                                            Facebook
                                        </option>
                                        <option value='twitter'>Twitter</option>
                                        <option value='youtube'>YouTube</option>
                                        <option value='github'>GitHub</option>
                                        <option value='other'>Other</option>
                                    </select>
                                    <input
                                        type='text'
                                        value={link.url}
                                        onChange={(e) =>
                                            updateSocialMediaLink(
                                                index,
                                                'url',
                                                e.target.value,
                                            )
                                        }
                                        placeholder='Enter URL...'
                                        className='flex-1 border border-gray-300 dark:border-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100'
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            removeSocialMediaLink(index)
                                        }
                                        className='p-2 text-red-500 hover:text-red-600 transition-colors dark:text-red-400 dark:hover:text-red-500'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className='block font-semibold text-sky-500 mb-2'>
                            Description
                        </label>
                        <textarea
                            name='description'
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className='w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none dark:bg-gray-700 dark:text-gray-100'
                            placeholder='Tell us about yourself, your expertise, and how you can help others...'
                            maxLength={1000}
                        />
                        <div className='text-right text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            {form.description.length}/1000
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className='flex gap-3 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={loading || imageLoading}
                            className={`flex-1 bg-sky-400 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-sky-500 transition-colors duration-200 ${
                                loading || imageLoading
                                    ? 'opacity-70 cursor-not-allowed'
                                    : ''
                            }`}
                        >
                            {loading || imageLoading ? (
                                <span className='flex items-center justify-center'>
                                    <Loader2 className='w-5 h-5 animate-spin mr-2' />
                                    {imageLoading
                                        ? 'Uploading...'
                                        : 'Submitting...'}
                                </span>
                            ) : editSenior ? (
                                'Update Profile'
                            ) : (
                                'Add Profile'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SeniorFormModal;
