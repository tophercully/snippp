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
          <h1 className="text-7xl font-extrabold md:text-9xl">SNIPPP</h1>
        </div>
        <div className="absolute inset-0 -z-10 m-[-6px] border-8 border-transparent" />
      </div>
      {/* <a
        href="/browse"
        className="group relative mt-24 flex items-center overflow-hidden rounded-sm bg-base-950 p-4 text-xl text-base-50 md:text-3xl dark:bg-base-50 dark:text-base-950"
      >
        <span className="relative z-10">
          {`BROWSE ${stats?.snippetCount ?? ""} SNIPPPETS`}
        </span>
        <img
          src="arrow-right-long.svg"
          className="relative ml-3 h-10"
        />

        <div className="pointer-events-none absolute inset-0 translate-x-full transform bg-white backdrop-invert transition-transform duration-500 ease-in-out group-hover:translate-x-0"></div>
      </a> */}
      <a
        href="/browse"
        className="group relative mt-24 flex items-center overflow-hidden rounded-sm bg-base-950 p-4 text-base-50 shadow-md duration-200 hover:text-base-950 dark:bg-base-50 dark:text-base-950 dark:shadow-sm dark:shadow-base-600"
      >
        <div
          className="absolute inset-0 -translate-x-full transform bg-base-50 transition-transform duration-300 ease-in-out group-hover:translate-x-0 dark:bg-base-950 dark:text-base-950"
          aria-hidden="true"
        />
        <span className="relative z-10 text-xl md:text-3xl dark:group-hover:text-base-50">
          {`BROWSE ${stats?.snippetCount ?? ""} SNIPPPETS`}
        </span>
        <img
          src="arrow-right-long.svg"
          className="relative ml-3 h-14 group-hover:invert dark:invert dark:group-hover:invert-0"
        />
      </a>

      <div className="absolute bottom-0 w-full p-2">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
