'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserDataState, fetchUserData } from '@/redux/slices/userDataSlice';
import type { AppDispatch } from '@/redux/store';
import OverviewTab from './OverviewTab';
import ProductsTab from './ProductsTab';
import NotesTab from './NotesTab';
import PYQTab from './PYQTab';
import {
    LayoutDashboard,
    ShoppingBag,
    FileText,
    BookOpen,
    Loader2,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState<string>('overview');
    const dispatch = useDispatch<AppDispatch>();

    const userData = useSelector(
        (state: { userData: UserDataState }) => state.userData,
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'products', label: 'Products', icon: ShoppingBag, count: userData.userProductAdd?.length },
        { id: 'notes', label: 'Notes', icon: FileText, count: userData.userNoteAdd?.length },
        { id: 'pyqs', label: 'PYQs', icon: BookOpen, count: userData.userPyqAdd?.length },
    ];

    const handleRetry = () => {
        dispatch(fetchUserData());
    };

    const renderTabContent = () => {
        if (userData.loading) {
            return (
                <div className='flex items-center justify-center min-h-[220px] py-12'>
                    <div className='inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#faf9f8] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-xs'>
                        <Loader2 className='w-3.5 h-3.5 text-[#0075de] dark:text-[#62aef0] animate-spin' />
                        <span className='text-xs font-medium text-[#101828] dark:text-white'>
                            Loading Stats...
                        </span>
                    </div>
                </div>
            );
        }

        if (userData.error) {
            return (
                <div className='py-12 px-4 text-center max-w-md mx-auto space-y-4'>
                    <div className='w-12 h-12 rounded-2xl bg-[#fef2f2] dark:bg-[#351618] border border-[#fecdd3] dark:border-[#581c24] flex items-center justify-center text-[#e11d48] dark:text-[#f87171] mx-auto shadow-xs'>
                        <AlertCircle className='w-6 h-6' />
                    </div>
                    <div className='space-y-1.5'>
                        <h4 className='text-sm sm:text-base font-semibold text-[#101828] dark:text-white'>
                            Failed to load profile data
                        </h4>
                        <p className='text-xs text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                            {userData.error}
                        </p>
                    </div>
                    <button
                        onClick={handleRetry}
                        className='inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#101828] text-white dark:bg-white dark:text-[#101828] hover:bg-[#0075de] dark:hover:bg-[#0075de] dark:hover:text-white transition-all shadow-xs'
                    >
                        <RefreshCw className='w-3.5 h-3.5' />
                        <span>Retry Connection</span>
                    </button>
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                return <OverviewTab data={userData} />;
            case 'products':
                return <ProductsTab products={userData.userProductAdd || []} />;
            case 'notes':
                return <NotesTab notes={userData.userNoteAdd || []} />;
            case 'pyqs':
                return <PYQTab pyqs={userData.userPyqAdd || []} />;
            default:
                return <OverviewTab data={userData} />;
        }
    };

    return (
        <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden'>
            {/* Segmented Tab Navigation */}
            <div className='p-3 sm:p-4 border-b border-[#f0eee9] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#242424]'>
                <div className='flex items-center gap-1.5 p-1 bg-[#f0eee9] dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] overflow-x-auto'>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-3.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                                    isActive
                                        ? 'bg-white dark:bg-[#282828] text-[#101828] dark:text-white shadow-xs'
                                        : 'text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0075de] dark:text-[#62aef0]' : 'text-[#8c8883]'}`} />
                                <span>{tab.label}</span>
                                {userData.loading ? (
                                    <span className='w-4 h-3 rounded-full bg-[#e6e6e6] dark:bg-[#333333] animate-pulse inline-block' />
                                ) : (
                                    tab.count !== undefined && tab.count > 0 && (
                                        <span className='px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0]'>
                                            {tab.count}
                                        </span>
                                    )
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content Panel */}
            <div className='p-4 sm:p-6'>
                {renderTabContent()}
            </div>
        </div>
    );
}

