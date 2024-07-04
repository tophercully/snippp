import { useState, useEffect } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { fetchStats } from "./backend/fetchStats";

const Home = () => {
  const [stats, setStats] = useState<{
    snippetCount: number;
    userCount: number;
  } | null>(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const info = await fetchStats();
        setStats(info);
      } catch (error) {
        console.error("Error fetching homepage info:", error);
      }
    };

    getStats();
  }, []);

  return (
    <div className="font-satoshi flex min-h-[100svh] w-screen flex-col items-center justify-center bg-base-50 p-2 pt-24 md:p-10 dark:bg-base-900">
      <Navbar />
      <div className="relative">
        <div
          id="hero"
          className="border-base-150 box-content flex flex-col items-center justify-center border-2 border-dashed p-10 transition-all duration-200 dark:border-base-800 dark:text-base-50"
        >
          <h1 className="text-7xl md:text-9xl">SNIPPP</h1>
        </div>
        <div className="absolute inset-0 -z-10 m-[-6px] border-8 border-transparent" />
      </div>
      <a
        href="/browse"
        className="mt-24 rounded-sm bg-base-950 p-4 text-xl text-base-50 hover:bg-base-800 md:text-3xl dark:bg-base-50 dark:text-base-950 dark:hover:bg-base-200"
      >
        {`BROWSE ${stats?.snippetCount ?? ""} SNIPPPETS`}
      </a>
      <div className="absolute bottom-0 w-full p-2">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
