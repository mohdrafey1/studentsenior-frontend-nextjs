import { api } from "@/config/apiUrls";
import Image from "next/image";
import type { Metadata } from "next";

interface IUser {
  userId: string;
  username: string;
  profilePicture: string;
  totalPoints: number;
  month: number;
  points: number;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hall of Fame - Leaderboard",
    description: "Track top contributors and monthly winners!",
  };
}

export const revalidate = 300; // 5-minute revalidation

export default async function LeaderboardPage() {
  const getMonthName = (monthIndex: number) =>
    new Date(Date.UTC(2000, Math.max(0, monthIndex - 1), 1)).toLocaleString(
      "default",
      { month: "long" }
    );

  let leaderboard: IUser[] = [];
  let previousWinners: IUser[] = [];

  try {
    const res = await fetch(`${api.savedData.leaderboard}`, {
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`Fetch failed with ${res.status}`);
    const json = await res.json();
    const data = json?.data || {};
    leaderboard = data.leaderboard || [];
    previousWinners = data.previousWinners || [];
  } catch (e) {
    console.error("Error fetching leaderboard:", e);
  }

  // Split data for podium and list
  const topThree = leaderboard.slice(0, 3);
  const winner1 = topThree[0];
  const winner2 = topThree[1];
  const winner3 = topThree[2];
  const remainingRanks = leaderboard.slice(3);

  return (
    <>

      <div className="text-slate-800 dark:text-slate-200 min-h-screen pb-0 leaderboard-body">
        {/* --- Hero Section --- */}
        <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="container mx-auto max-w-6xl text-center py-16 px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Hall of Fame
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
              Earn points by contributing notes and knowledge. See who&apos;s
              leading the charge this month.
            </p>
            <div className="inline-block bg-amber-400/10 dark:bg-amber-400/20 border border-amber-500 text-amber-700 dark:text-amber-300 rounded-full px-6 py-3 font-semibold">
              ✨ Monthly Winner Reward:{" "}
              <span className="font-bold">+500 Points</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
          {leaderboard.length === 0 ? (
            // --- Empty State ---
            <section
              className="text-center bg-white dark:bg-slate-800/60 backdrop-blur-lg rounded-xl border border-slate-200 dark:border-slate-700 p-12 shadow-md"
              aria-labelledby="empty-title"
            >
              <h2
                id="empty-title"
                className="text-2xl font-semibold text-slate-800 dark:text-white mb-3"
              >
                The Race Hasn&apos;t Started Yet!
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                No leaderboard data is available for this month. Start
                contributing to be the first!
              </p>
            </section>
          ) : (
            // --- Leaderboard Content ---
            <>
              {/* --- The Podium (Top 3) --- */}
              <section className="mb-16" aria-labelledby="podium-title">
                <h2
                  id="podium-title"
                  className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10"
                >
                  This Month&apos;s Titans
                </h2>

                <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-2">
                  {/* 2nd Place */}
                  {winner2 && (
                    <div className="w-full md:w-1/4 order-2 md:order-1 bg-white dark:bg-slate-800 p-6 rounded-t-xl shadow-lg border-b-8 border-slate-400 transform md:hover:-translate-y-2 transition-transform duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <Image
                            src={winner2.profilePicture}
                            alt={winner2.username}
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-slate-400 shadow-md"
                          />
                          <span
                            className="absolute -top-2 -right-2 text-3xl"
                            aria-label="2nd Place"
                          >
                            🥈
                          </span>
                        </div>
                        <h3 className="text-xl font-bold truncate w-full">
                          {winner2.username}
                        </h3>
                        <p className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mt-2">
                          {winner2.totalPoints}{" "}
                          <span className="text-sm">Points</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {winner1 && (
                    <div className="w-full md:w-1/3 order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white dark:from-slate-800 dark:to-slate-900 p-8 rounded-t-2xl shadow-2xl border-b-8 border-amber-400 relative overflow-hidden transform md:hover:-translate-y-4 transition-transform duration-300">
                      <div className="absolute inset-0 shine-effect opacity-50 dark:opacity-30"></div>
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="relative mb-5">
                          <Image
                            src={winner1.profilePicture}
                            alt={winner1.username}
                            width={100}
                            height={100}
                            className="rounded-full border-4 border-amber-400 shadow-lg"
                          />
                          <span
                            className="absolute -top-3 -right-3 text-4xl"
                            aria-label="1st Place"
                          >
                            🥇
                          </span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-amber-900 dark:text-amber-300 truncate w-full">
                          {winner1.username}
                        </h3>
                        <p className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-2">
                          {winner1.totalPoints}{" "}
                          <span className="text-base">Points</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {winner3 && (
                    <div className="w-full md:w-1/4 order-3 md:order-3 bg-white dark:bg-slate-800 p-6 rounded-t-xl shadow-lg border-b-8 border-orange-600 transform md:hover:-translate-y-2 transition-transform duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <Image
                            src={winner3.profilePicture}
                            alt={winner3.username}
                            width={70}
                            height={70}
                            className="rounded-full border-4 border-orange-600 shadow-md"
                          />
                          <span
                            className="absolute -top-2 -right-2 text-3xl"
                            aria-label="3rd Place"
                          >
                            🥉
                          </span>
                        </div>
                        <h3 className="text-xl font-bold truncate w-full">
                          {winner3.username}
                        </h3>
                        <p className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mt-2">
                          {winner3.totalPoints}{" "}
                          <span className="text-sm">Points</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* --- Rankings List (4+) --- */}
              {remainingRanks.length > 0 && (
                <section
                  className="max-w-3xl mx-auto mb-16"
                  aria-labelledby="rankings-title"
                >
                  <h2
                    id="rankings-title"
                    className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8"
                  >
                    Top Contributors
                  </h2>
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <ul
                      role="list"
                      className="divide-y divide-slate-200 dark:divide-slate-700"
                    >
                      {remainingRanks.map((user, index) => (
                        <li
                          key={user.userId}
                          className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-lg text-slate-500 w-6 text-center">
                              {index + 4}
                            </span>
                            <Image
                              src={user.profilePicture}
                              alt={user.username}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <span className="font-semibold">
                              {user.username}
                            </span>
                          </div>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {user.totalPoints} Points
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </>
          )}

          {/* --- Previous Winners --- */}
          {previousWinners.length > 0 && (
            <section aria-labelledby="previous-winners-title" className="pt-4">
              <h2
                id="previous-winners-title"
                className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8"
              >
                Recent Champions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {previousWinners.map((winner, index) => (
                  <div
                    key={index} // Use a more stable key if available, like winner.userId + winner.month
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4 hover:shadow-lg transition-shadow"
                  >
                    <Image
                      src={winner.profilePicture}
                      alt={winner.username}
                      width={50}
                      height={50}
                      className="rounded-full h-14 w-14 object-cover border-2 border-amber-500"
                    />
                    <div>
                      <h4 className="font-semibold">{winner.username}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {getMonthName(winner.month)} Winner 🏆
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}