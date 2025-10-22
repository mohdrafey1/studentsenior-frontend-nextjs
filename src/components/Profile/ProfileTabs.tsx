'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserDataState } from '@/redux/slices/userDataSlice';
import OverviewTab from './OverviewTab';
import ProductsTab from './ProductsTab';
import NotesTab from './NotesTab';
import PYQTab from './PYQTab';

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState<string>('overview');

    const userData = useSelector(
        (state: { userData: UserDataState }) => state.userData,
    );

    console.log(userData);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'products', label: 'Products', icon: '🛍️' },
        { id: 'notes', label: 'Notes', icon: '📝' },
        { id: 'pyqs', label: 'PYQs', icon: '📋' },
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
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md'>
            {/* Tab Navigation */}
            <div className='border-b border-gray-200 dark:border-gray-700'>
                <nav className='flex flex-wrap space-x-8 px-6 pt-6'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className='p-6'>{renderTabContent()}</div>
        </div>
    );
}
