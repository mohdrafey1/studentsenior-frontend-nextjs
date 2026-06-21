import { api } from '@/config/apiUrls';
import type { Metadata } from 'next';
import LeaderboardTabs, {
    IUser,
    IContributor,
} from './LeaderboardTabs';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Hall of Fame - Leaderboard',
        description:
            'Track top contributors, monthly winners, and the students who have shared the most notes & PYQs on Student Senior!',
    };
}

export const revalidate = 30; // 30-second revalidation for near real-time updates

export default async function LeaderboardPage() {
    let leaderboard: IUser[] = [];
    let previousWinners: IUser[] = [];
    let contributors: IContributor[] = [];

    try {
        const [leaderboardRes, contributorsRes] = await Promise.all([
            fetch(`${api.savedData.leaderboard}`, { next: { revalidate } }),
            fetch(`${api.contributors.getTopContributors(100)}`, {
                next: { revalidate },
            }),
        ]);

        if (leaderboardRes.ok) {
            const json = await leaderboardRes.json();
            const data = json?.data || {};
            leaderboard = data.leaderboard || [];
            previousWinners = data.previousWinners || [];
        }

        if (contributorsRes.ok) {
            const json = await contributorsRes.json();
            contributors = json?.data?.contributors || [];
        }
    } catch (e) {
        console.error('Error fetching leaderboard data:', e);
    }

    return (
        <div className='text-slate-800 dark:text-slate-200 min-h-screen pb-0 leaderboard-body'>
            {/* --- Hero Section --- */}
            <header className='bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm'>
                <div className='container mx-auto max-w-6xl text-center py-16 px-6'>
                    <h1 className='text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4'>
                        Hall of Fame
                    </h1>
                    <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6'>
                        Every note and PYQ here was shared by a fellow student.
                        Celebrate this month&apos;s point leaders and our
                        all-time top contributors. 💙
                    </p>
                    <div className='inline-block bg-amber-400/10 dark:bg-amber-400/20 border border-amber-500 text-amber-700 dark:text-amber-300 rounded-full px-6 py-3 font-semibold'>
                        ✨ Monthly Winner Reward:{' '}
                        <span className='font-bold'>+100 Points</span>
                    </div>
                </div>
            </header>

            <main className='container mx-auto max-w-6xl px-4 py-12 md:py-20'>
                <LeaderboardTabs
                    leaderboard={leaderboard}
                    previousWinners={previousWinners}
                    contributors={contributors}
                />
            </main>
        </div>
    );
}
