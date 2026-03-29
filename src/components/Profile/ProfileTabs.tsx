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
        <div 
            
            
            
            className='bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/20 dark:border-white/10 overflow-hidden'
        >
            {/* Tab Navigation */}
            <div className='border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20'>
                <nav className='flex overflow-x-auto hide-scrollbar space-x-2 sm:space-x-4 p-4'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-full font-medium text-sm sm:text-base transition-colors whitespace-nowrap z-10 ${
                                activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                        >
                            {activeTab === tab.id && (
                                <div
                                    
                                    className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full -z-10 shadow-lg shadow-blue-500/30"
                                    
                                />
                            )}
                            <span className="relative z-10">{tab.icon}</span>
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className='p-6'>
                
                    <div
                        key={activeTab}
                        
                        
                        
                        
                    >
                        {renderTabContent()}
                    </div>
                
            </div>
        </div>
    );
}
