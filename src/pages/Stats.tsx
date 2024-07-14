import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { StatCard } from "../components/StatCard";
import { fetchExtendedStats } from "../backend/fetchStats";
import { simplifyNumber } from "../utils/simplifyNumber";
import Distribution from "../components/Distribution";

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

export const Stats = () => {
  document.title = `Stats - Snippp`;
  const [stats, setStats] = useState<ExtendedHomepageInfo>({
    totalUsers: 0,
    totalSnippets: 0,
    totalLists: 0,
    averageUserSnippets: 0,
    totalSnippetCopies: 0,
    activeUsers: 0,
    totalSnippetLength: 0,
    languageDistribution: {
      js: 0,
      ts: 0,
      css: 0,
      python: 0,
      glsl: 0,
    },
    frameworkDistribution: {
      reactjs: 0,
      reactnative: 0,
      p5: 0,
      three: 0,
    },
  });
  const {
    totalUsers,
    totalLists,
    totalSnippets,
    totalSnippetCopies,
    totalSnippetLength,
    activeUsers,
    languageDistribution,
    frameworkDistribution,
  } = stats;

  useEffect(() => {
    const getStats = async () => {
      const result = await fetchExtendedStats();
      setStats(result);
    };
    getStats();
  }, []);
  return (
    <div className="flex h-fit min-h-[100vh] w-full flex-col gap-5 bg-base-50 p-2 pt-32 md:p-10 md:pt-32 dark:bg-base-950">
      <Navbar />
      <div className="grid h-full w-full grid-cols-2 gap-4 p-2 text-base-950 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 dark:text-base-50">
        <StatCard
          name="Users:"
          value={totalUsers}
        />
        <StatCard
          name="Active Users:"
          value={activeUsers}
        />
        <StatCard
          name="Total Snippets:"
          value={totalSnippets}
        />
        <StatCard
          name="Total Lists:"
          value={totalLists}
        />
        <StatCard
          name="Total Snippet Length:"
          value={simplifyNumber(totalSnippetLength)}
        />
        <StatCard
          name="Total Snippet Copies:"
          value={simplifyNumber(totalSnippetCopies)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 p-2 lg:grid-cols-2">
        <Distribution
          title="Language Distribution"
          data={languageDistribution}
        />
        <Distribution
          title="Framework Distribution"
          data={frameworkDistribution}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full justify-self-end p-2">
        <Footer />
      </div>
    </div>
  );
};
