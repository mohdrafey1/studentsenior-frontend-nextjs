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
    title: `Leaderboard`,
    description: "Leaderboard",
  };
}

export const revalidate = 300;

export default async function LeaderboardPage() {
  // Get current month name
  const getMonthName = (monthIndex: number) => {
    return new Date(
      Date.UTC(2000, Math.max(0, monthIndex - 1), 1)
    ).toLocaleString("default", { month: "long" });
  };

  let leaderboard = [];
  let previousWinners = [];

  try {
    const url = `${api.savedData.leaderboard}`;
    const res = await fetch(url, { next: { revalidate } });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const json = await res.json();
    const data = json?.data || {};
    leaderboard = data.leaderboard || [];
    previousWinners = data.previousWinners || [];
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }

  return (
    <div className="bg-sky-50 dark:bg-gray-900 min-h-screen min-w-full pb-4">
      {/* Information About Rewards */}
      <div className="bg-sky-50 dark:bg-gray-800 p-6 rounded-lg lg:mx-20 mx-0 shadow-md dark:shadow-sm  text-center border border-sky-100 dark:border-gray-700">
        <h2 className="text-xl font-fugaz font-bold text-sky-800 dark:text-sky-300 mb-2">
          How to Win?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          The user who earns the most points in a month wins!
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          ⭐ Upload PYQs, Notes to earn points.
        </p>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          🎁 Monthly Winner Reward:{" "}
          <span className="text-green-600 dark:text-green-400">
            +500 Points
          </span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-5">
        {leaderboard.length === 0 ? (
          <div className="max-w-xl mx-auto text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm mt-6">
            <p className="text-gray-700 dark:text-gray-200 font-medium">
              No leaderboard data yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Start contributing to climb the leaderboard!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto lg:w-4/5 mx-auto mt-6">
            <h2 className="sm:text-2xl font-fugaz font-bold text-center text-sky-800 dark:text-sky-300 mb-4">
              Current Month Leaderboard
            </h2>
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
              <thead className="bg-sky-600 text-white dark:bg-sky-700">
                <tr>
                  <th className="px-6 py-3 text-left">Rank</th>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 9).map((user: IUser, index: number) => (
                  <tr
                    key={user.userId}
                    className={`${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-900/40"
                        : "bg-white dark:bg-gray-900/20"
                    } hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200 ">
                      <div className="flex items-center gap-4">
                        <Image
                          src={user.profilePicture}
                          alt={user.username}
                          className="rounded-full"
                          width={40}
                          height={40}
                        />
                        <p className="truncate">{user.username}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {user.totalPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Previous Winners Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-fugaz font-bold text-center text-sky-800 dark:text-sky-300 mb-6">
            Previous 3 Month Winners
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {previousWinners.map((winner: IUser, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {getMonthName(winner.month)}
                </p>
                <div className="flex flex-col justify-center items-center gap-4">
                  <Image
                    src={winner.profilePicture}
                    alt={winner.username}
                    className="rounded-full"
                    width={40}
                    height={40}
                  />
                  <p className="text-gray-800 dark:text-gray-200">
                    {winner.username}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  🏆 {winner.points} Points
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
