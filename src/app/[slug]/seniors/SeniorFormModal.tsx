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
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6'>
            <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col'>
                {/* Header */}
                <div className='flex items-center justify-between px-6 py-4 border-b border-[#e6e6e6] dark:border-[#2f2f2f] sticky top-0 bg-white dark:bg-[#1c1c1c] z-10'>
                    <h2 className='text-lg font-bold text-[#101828] dark:text-white'>
                        {editSenior
                            ? 'Edit Senior Profile'
                            : 'Add New Senior Profile'}
                    </h2>
                    <button
                        onClick={onClose}
                        className='p-2 rounded-lg text-[#8c8883] dark:text-[#787672] hover:bg-[#f6f5f4] dark:hover:bg-[#282828] transition-colors'
                        aria-label='Close'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className='p-6 space-y-5'
                >
                    {/* Name */}
                    <div className='space-y-1.5'>
                        <label className='block text-sm font-medium text-[#475467] dark:text-[#9ea3ae]'>
                            Full Name <span className='text-[#e11d48]'>*</span>
                        </label>
                        <input
                            type='text'
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#191919] text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] transition-all text-sm'
                            placeholder='Enter your full name'
                        />
                    </div>

                    {/* Domain */}
                    <div className='space-y-1.5'>
                        <label className='block text-sm font-medium text-[#475467] dark:text-[#9ea3ae]'>
                            Domain/Expertise
                        </label>
                        <input
                            type='text'
                            name='domain'
                            value={form.domain}
                            onChange={handleChange}
                            className='w-full px-4 py-2.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#191919] text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] transition-all text-sm'
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
                    <div className='space-y-1.5'>
                        <label className='block text-sm font-medium text-[#475467] dark:text-[#9ea3ae]'>
                            Year <span className='text-[#e11d48]'>*</span>
                        </label>
                        <select
                            name='year'
                            value={form.year}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#191919] text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] transition-all text-sm appearance-none'
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
                    <div className='space-y-1.5'>
                        <label className='block text-sm font-medium text-[#475467] dark:text-[#9ea3ae]'>
                            Profile Picture <span className='text-[#e11d48]'>*</span>
                        </label>
                        <div className='flex items-center gap-4'>
                            <label className='flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#d0ceca] dark:border-[#404040] hover:border-[#0075de] dark:hover:border-[#62aef0] bg-[#f6f5f4] dark:bg-[#191919] cursor-pointer transition-colors text-sm text-[#475467] dark:text-[#9ea3ae]'>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    className='hidden'
                                    disabled={imageLoading}
                                    required={!form.profilePicture}
                                />
                                {imageLoading ? (
                                    <>
                                        <Loader2 className='w-4 h-4 animate-spin text-[#0075de] dark:text-[#62aef0]' />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className='w-4 h-4' />
                                        <span className='truncate max-w-[200px]'>
                                            {selectedImage
                                                ? selectedImage.name
                                                : 'Choose image (Max 5MB)'}
                                        </span>
                                    </>
                                )}
                            </label>
                            {form.profilePicture && (
                                <div className='w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                    <Image
                                        src={form.profilePicture}
                                        alt='Preview'
                                        className='object-cover w-full h-full'
                                        width={56}
                                        height={56}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className='space-y-3 pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <div className='flex items-center justify-between'>
                            <label className='block text-sm font-medium text-[#475467] dark:text-[#9ea3ae]'>
                                Social Media Links
                            </label>
                            <button
                                type='button'
                                onClick={addSocialMediaLink}
                                className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0075de] dark:text-[#62aef0] bg-[#eaf3fd] dark:bg-[#183153] hover:bg-[#d2e4f9] dark:hover:bg-[#224474] rounded-lg transition-colors'
                            >
                                <Plus className='w-3.5 h-3.5' />
                                Add Link
                            </button>
                        </div>
                        <div className='space-y-2.5'>
                            {form.socialMediaLinks.map((link, index) => (
                                <div key={index} className='flex gap-2 items-start'>
                                    <select
                                        value={link.platform}
                                        onChange={(e) =>
                                            updateSocialMediaLink(
                                                index,
                                                'platform',
                                                e.target.value,
                                            )
                                        }
                                        className='w-[110px] sm:w-[130px] shrink-0 px-3 py-2.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#f6f5f4] dark:bg-[#191919] text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] transition-all text-sm appearance-none'
                                    >
                                        <option value='whatsapp'>WhatsApp</option>
                                        <option value='telegram'>Telegram</option>
                                        <option value='instagram'>Instagram</option>
                                        <option value='linkedin'>LinkedIn</option>
                                        <option value='facebook'>Facebook</option>
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
                                        placeholder='Enter URL or Username'
                                        className='flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#191919] text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] transition-all text-sm'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => removeSocialMediaLink(index)}
                                        className='p-2.5 shrink-0 text-[#8c8883] dark:text-[#787672] hover:text-[#e11d48] dark:hover:text-[#fb7185] hover:bg-[#fff1f2] dark:hover:bg-[#3b1118] rounded-lg transition-colors'
                                        aria-label='Remove Link'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className='space-y-1.5 pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <label className='block text-sm font-medium text-[#475467] dark:text-[#9ea3ae]'>
                            About You
                        </label>
                        <textarea
                            name='description'
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className='w-full px-4 py-3 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#191919] text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] transition-all text-sm resize-none'
                            placeholder='Tell us about yourself, your expertise, and how you can help others...'
                            maxLength={1000}
                        />
                        <div className='flex justify-end text-xs font-medium text-[#8c8883] dark:text-[#787672]'>
                            {form.description.length}/1000
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className='flex gap-3 pt-4 pb-2 sticky bottom-0 bg-white dark:bg-[#1c1c1c] z-10 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#475467] dark:text-[#9ea3ae] bg-[#f6f5f4] dark:bg-[#282828] hover:bg-[#eae8e4] dark:hover:bg-[#333] transition-colors border border-transparent dark:border-[#383838]'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={loading || imageLoading}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0075de] hover:bg-[#0062bd] transition-all shadow-xs active:scale-[0.98] ${
                                loading || imageLoading
                                    ? 'opacity-70 cursor-not-allowed'
                                    : ''
                            }`}
                        >
                            {loading || imageLoading ? (
                                <>
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                    {imageLoading ? 'Uploading...' : 'Submitting...'}
                                </>
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
