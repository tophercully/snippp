"use client";
import { useEffect, useState } from "react";
import { Navbar } from "../src/components/nav/Navbar";
import { StatCard } from "../src/components/statsTools/StatCard";
import { simplifyNumber } from "../src/utils/simplifyNumber";
import Distribution from "../src/components/statsTools/Distribution";
import { Footer } from "../src/components/nav/Footer";
import api from "../src/backend/api";

// import { AnalyticsInfo, fetchAnalytics } from "../backend/fetchAnalytics";

interface CategoryCount {
  [key: string]: number;
}
interface ExtendedHomepageInfo {
  totalUsers: number;
  totalSnippets: number;
  totalLists: number;
  averageUserSnippets: number;
  totalSnippetCopies: number;
  activeUsers: number;
  totalSnippetLength: number;
  languageDistribution: CategoryCount;
  frameworkDistribution: CategoryCount;
}

const Stats = () => {
  const [stats, setStats] = useState<ExtendedHomepageInfo | null>(null);
  // const [analyticsReport, setAnalyticsReport] = useState<AnalyticsInfo | null>(
  //   null,
  // );
  // console.log(analyticsReport);
  useEffect(() => {
    const getStats = async () => {
      const result = await api.stats.getExtended();
      setStats(result);
    };
    // const getAnalytics = async () => {
    //   const result = await fetchAnalytics();
    //   console.log(result);
    //   setAnalyticsReport(result);
    // };
    getStats();
    // getAnalytics();
  }, []);
  return (
      <div className="flex h-fit min-h-screen w-full flex-col gap-8 bg-base-50 p-2 pt-32 md:p-10 md:pt-32 dark:bg-base-950">
        <Navbar />
        {stats ?
          <div className="grid h-full w-full grid-cols-2 gap-8 p-2 text-base-950 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 dark:text-base-50">
            <StatCard
              name="Members:"
              value={stats.totalUsers}
            />
            <StatCard
              name="Average Snippets/User:"
              value={stats.averageUserSnippets.toFixed(1)}
            />
            <StatCard
              name="Total Snippets:"
              value={stats.totalSnippets}
            />
            <StatCard
              name="Total Lists:"
              value={stats.totalLists}
            />
            <StatCard
              name="Total Snippet Length:"
              value={simplifyNumber(stats.totalSnippetLength)}
            />
            <StatCard
              name="Total Snippet Copies:"
              value={simplifyNumber(stats.totalSnippetCopies)}
            />
          </div>
        : <div className="flex h-full w-full items-center justify-center">
            <svg
              className="mt-32 aspect-square h-32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                className="animate-dash"
                x="0"
                y="0"
                width="100%"
                height="100%"
              />
            </svg>
          </div>
        }
        {stats && (
          <div className="grid grid-cols-1 gap-8 p-2 lg:grid-cols-2">
            <Distribution
              title="Language Distribution"
              data={stats.languageDistribution}
            />
            <Distribution
              title="Framework Distribution"
              data={stats.frameworkDistribution}
            />
          </div>
        )}
        <div className="w-full justify-self-end p-2">
          <Footer />
        </div>
      </div>

  );
};

export default Stats;
