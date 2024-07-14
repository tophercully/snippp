import { useState, useEffect } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { fetchStats } from "./backend/fetchStats";
import "./output.css";

const Home = () => {
  document.title = `Snippp - Snippet Organizer`;
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
    <div className="flex h-fit min-h-[100svh] w-screen flex-col items-center justify-center bg-base-50 p-2 pt-24 font-satoshi md:p-10 dark:bg-base-950">
      <Navbar />

      <div
        id="hero"
        className="box-content flex items-center justify-center border-2 border-dashed border-base-150 p-10 text-blue-600 transition-all duration-300 dark:border-base-800 dark:text-blue-700"
      >
        <h1 className="text-7xl font-extrabold md:text-9xl">SNIPPP</h1>
      </div>
      <div className="absolute inset-0 -z-10 m-[-6px] border-8 border-transparent" />

      <h3 className="mt-12 w-full max-w-96 text-center text-xl text-base-500 md:mt-24 md:text-2xl dark:text-base-400">
        UNINTERRUPTED CREATIVITY FOR CREATIVE CODERS – YOUR SNIPPET ORGANIZER
      </h3>
      <a
        href="/browse"
        className={`${stats ? "opacity-100" : "opacity-0"} group relative mt-12 flex items-center justify-center overflow-hidden rounded-sm bg-base-950 px-4 text-base-50 shadow-md duration-200 md:mt-24 dark:bg-base-50 dark:text-base-950 dark:shadow-sm dark:shadow-base-600`}
      >
        <div
          className="absolute inset-0 -translate-x-full transform bg-blue-700 transition-transform duration-300 ease-in-out group-hover:translate-x-0 dark:text-base-950"
          aria-hidden="true"
        />
        <span className="relative z-10 text-xl md:text-2xl dark:group-hover:text-base-50">
          {`BROWSE ${stats?.snippetCount ?? ""} SNIPPPETS`}
        </span>
        <img
          src="arrow-right-long.svg"
          className="relative ml-3 h-14 dark:invert dark:group-hover:invert-0"
        />
      </a>

      <div className="absolute bottom-0 w-full p-2">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
