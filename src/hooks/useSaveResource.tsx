import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { api } from '@/config/apiUrls';
import { fetchSavedCollection } from '@/redux/slices/savedCollectionSlice';
import type { AppDispatch } from '@/redux/store';

export const useSaveResource = () => {
    const dispatch = useDispatch<AppDispatch>();

    const saveResource = async (resourceType: string, resourceId: string) => {
        try {
            const endpoint =
                resourceType === 'pyq'
                    ? `${api.savedData.savePyq}/${resourceId}`
                    : `${api.savedData.saveNote}/${resourceId}`;

            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            toast.success(
                data.message + ', You can view it in your collection',
            );
            dispatch(fetchSavedCollection());
        } catch (err) {
            console.error(`Error saving ${resourceType}:`, err);
            toast.error(`Failed to save ${resourceType}`);
        }
    };

    const unsaveResource = async (resourceType: string, resourceId: string) => {
        try {
            const endpoint =
                resourceType === 'pyq'
                    ? `${api.savedData.unsavePyq}/${resourceId}`
                    : `${api.savedData.unsaveNote}/${resourceId}`;

            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            toast.success(data.message + ', removed from your collection');
            dispatch(fetchSavedCollection());
        } catch (err) {
            console.error(`Error unsaving ${resourceType}:`, err);
            toast.error(`Failed to unsave ${resourceType}`);
        }
    };

    return { saveResource, unsaveResource };
};
