import { UserDataState } from '@/redux/slices/userDataSlice';

interface OverviewTabProps {
    data: UserDataState;
}

export default function OverviewTab({ data }: OverviewTabProps) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    Total Earned Points
                </h3>
                <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                    {data.rewardPoints || 0}
                </p>
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    Remaining Balance
                </h3>
                <p className='text-3xl font-bold text-green-600 dark:text-green-400'>
                    {data.rewardBalance || 0}
                </p>
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    Total Redeemed
                </h3>
                <p className='text-3xl font-bold text-red-600 dark:text-red-400'>
                    {data.rewardRedeemed || 0}
                </p>
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    Total Items
                </h3>
                <p className='text-3xl font-bold text-purple-600 dark:text-purple-400'>
                    {(data.userProductAdd?.length || 0) +
                        (data.userPyqAdd?.length || 0) +
                        (data.userNoteAdd?.length || 0)}
                </p>
            </div>
        </div>
    );
}
