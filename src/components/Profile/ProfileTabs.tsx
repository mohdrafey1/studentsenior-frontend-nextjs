'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserDataState } from '@/redux/slices/userDataSlice';
import OverviewTab from './OverviewTab';
import ProductsTab from './ProductsTab';
import NotesTab from './NotesTab';
import PYQTab from './PYQTab';
import {
    LayoutDashboard,
    ShoppingBag,
    FileText,
    BookOpen,
} from 'lucide-react';

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState<string>('overview');

    const userData = useSelector(
        (state: { userData: UserDataState }) => state.userData,
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'products', label: 'Products', icon: ShoppingBag, count: userData.userProductAdd?.length },
        { id: 'notes', label: 'Notes', icon: FileText, count: userData.userNoteAdd?.length },
        { id: 'pyqs', label: 'PYQs', icon: BookOpen, count: userData.userPyqAdd?.length },
    ];

    const renderTabContent = () => {
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
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className='px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0]'>
                                        {tab.count}
                                    </span>
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
