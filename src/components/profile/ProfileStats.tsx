import { useEffect, useState } from "react";
import { StatCardSmall } from "../statsTools/StatCard";
import { simplifyNumber } from "../../utils/simplifyNumber";
import { UserStats, fetchUserStats } from "../../backend/user/userFunctions";
import { LoadingSpinner } from "../LoadingSpinner";
import { useParams } from "react-router-dom";
import Distribution from "../statsTools/Distribution";

export const ProfileStats = () => {
  const { userid } = useParams();
  const [stats, setStats] = useState<UserStats | null>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getStats = async () => {
      setIsLoading(true);
      const result = await fetchUserStats(userid ? userid : "");
      console.log(result);
      setIsLoading(false);
      setStats(result);
    };
    getStats();
  }, []);

  return (
    <div className="flex max-h-full w-full flex-col gap-8 text-base-950 lg:w-1/3 dark:text-base-50">
      {!isLoading && (
        <>
          <div className="grid h-fit w-full grid-cols-2 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            <StatCardSmall
              name="Snippets"
              value={stats?.totalSnippets || "null"}
            />
            <StatCardSmall
              name="Copies Received"
              value={simplifyNumber(stats?.totalSnippetCopies)}
            />
            <StatCardSmall
              name="Likes Received"
              value={simplifyNumber(stats?.totalFavorites)}
            />
          </div>
          <div>
            {Object.keys(stats?.languageDistribution as any).length != 0 && (
              <Distribution
                small={true}
                data={stats?.languageDistribution as { [key: string]: number }}
                title="Language Distribution"
              />
            )}
            {Object.keys(stats?.frameworkDistribution as any).length != 0 && (
              <Distribution
                small={true}
                data={stats?.frameworkDistribution as { [key: string]: number }}
                title="Framework Distribution"
              />
            )}
          </div>
        </>
      )}
      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};