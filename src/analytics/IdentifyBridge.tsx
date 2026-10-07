'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { analytics } from './index';

export default function IdentifyBridge() {
    const id = useSelector(
        (state: RootState) => state.user.currentUser?._id || null,
    );
    useEffect(() => {
        if (id) analytics.identify(id);
        else analytics.reset();
    }, [id]);
    return null;
}
