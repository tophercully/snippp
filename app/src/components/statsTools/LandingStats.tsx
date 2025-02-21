"use client";
import { signal } from "@preact-signals/safe-react";
import { useEffect } from "@preact-signals/safe-react/react";
import api from "../../backend/api";
import { simplifyNumber } from "../../utils/simplifyNumber";
import Distribution from "./Distribution";
import StatCard from "../profile/StatCard";
import {
  ClipboardCopy,
  Divide,
  FolderOpen,
  Ruler,
  Scissors,
  User,
} from "lucide-react";
import { LoadingSpinner } from "../universal/LoadingSpinner";

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
const stats = signal<ExtendedHomepageInfo | null>();
const LandingStats = () => {
  useEffect(() => {
    const getStats = async () => {
      const result = await api.stats.getExtended();
      stats.value = result as ExtendedHomepageInfo;
    };
    getStats();
  }, []);

  const statIconSize = 16;
  if (stats.value) {
    return (
      <>
        <div className="mx-auto grid h-full w-full grid-cols-2 gap-4 p-2 md:grid-cols-4 md:gap-8 lg:grid-cols-5 xl:grid-cols-6">
          <StatCard
            title="Members"
            value={String(stats.value.totalUsers)}
            icon={<User size={statIconSize} />}
          />
          <StatCard
            title="Total Snippets"
            value={String(stats.value.totalSnippets)}
            icon={<Scissors size={statIconSize} />}
          />
          <StatCard
            title="Total Snippet Copies"
            value={simplifyNumber(stats.value.totalSnippetCopies)}
            icon={<ClipboardCopy size={statIconSize} />}
          />
          <StatCard
            title="Total Lists"
            value={String(stats.value.totalLists)}
            icon={<FolderOpen size={statIconSize} />}
          />
          <StatCard
            title="Average Snippets Per User"
            value={stats.value.averageUserSnippets.toFixed(1)}
            icon={<Divide size={statIconSize} />}
          />
          <StatCard
            title="Total Snippet Length"
            value={simplifyNumber(stats.value.totalSnippetLength)}
            icon={<Ruler size={statIconSize} />}
          />
        </div>
        <div className="grid grid-cols-1 gap-8 p-2 lg:grid-cols-2">
          <Distribution
            title="Language Distribution"
            data={stats.value.languageDistribution}
          />
          <Distribution
            title="Framework Distribution"
            data={stats.value.frameworkDistribution}
          />
        </div>
      </>
    );
  } else {
    return (
      <div>
        <LoadingSpinner />
        <p>Loading Stats</p>
      </div>
    );
  }
};

export default LandingStats;
