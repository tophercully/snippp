import { useState, useEffect } from "react";
import { Footer } from "./components/nav/Footer";
import { Navbar } from "./components/nav/Navbar";
import { fetchStats } from "./backend/fetchStats";
import "./output.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  document.title = `Snippp - Snippet Organizer`;
  const navigate = useNavigate();
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
    <div className="relative flex h-fit min-h-[100svh] w-[99svw] flex-col items-center justify-center bg-base-50 p-2 pb-32 pt-32 font-satoshi md:p-10 dark:bg-base-950">
      <Navbar />

      <div className="flex w-full flex-col items-center justify-around gap-8 lg:mt-24">
        <div
          id="hero"
          className="box-content flex h-fit items-center justify-center self-center border-2 border-dashed border-base-150 p-10 text-blue-600 transition-all dark:border-base-800 dark:text-blue-700"
        >
          <img src="/snippp.svg" />
        </div>
        <div className="absolute inset-0 -z-10 m-[-6px] border-8 border-transparent" />

        <div className="flex w-fit max-w-[60ch] flex-col gap-4 text-left text-sm md:mt-24 md:text-2xl dark:text-base-400">
          <h2 className="max-w-[40ch] text-lg font-medium text-base-950 dark:text-base-50">
            Simplify Your Tool Management
          </h2>
          <p className="text-base">
            Maximize your coding efficiency with Snippp.io. Quickly create,
            organize, and share code snippets with ease.
          </p>
          <p className="text-base">
            Our lightweight tool ensures you spend less time searching and more
            time coding.
          </p>
          {/* <h2 className="max-w-[80ch] text-2xl font-bold text-base-950 dark:text-base-50">
            Get in, Get Out, Get Back to Coding{" "}
          </h2> */}

          {/* <p>Create. Organize. Share. Discover.</p> */}
          {/* <p className="">Streamline your workflow with:</p> */}

          {/* <ul className="flex flex-col gap-2 text-base font-light text-base-950 dark:text-base-50">
            <li>
              <span className="mr-2 font-medium">
                Lightning-fast Navigation:
              </span>
              Quickly find and use the code you need.
            </li>
            <li>
              <span className="mr-2 font-medium">Intuitive Organization:</span>
              Effortlessly categorize and manage your snippets.
            </li>
            <li>
              <span className="mr-2 font-medium">Easy Sharing:</span>
              Collaborate with your team or the community.
            </li>
            <li>
              <span className="mr-2 font-medium">Endless Discovery: </span>
              Explore a vast library of snippets shared by other developers.
            </li>
          </ul> */}
        </div>
      </div>
      {/* <h3 className="mt-12 w-full max-w-96 text-center text-xl text-base-500 md:mt-24 md:text-2xl dark:text-base-400">
        UNINTERRUPTED CREATIVITY FOR CREATIVE CODERS – YOUR SNIPPET ORGANIZER
      </h3> */}
      <a
        href="/browse"
        className={`${stats ? "opacity-100" : "opacity-0"} group relative mt-12 flex items-center justify-center overflow-hidden rounded-sm bg-base-950 px-4 text-base-50 shadow-md duration-75 md:mt-24 dark:bg-base-50 dark:text-base-950 dark:shadow-sm dark:shadow-base-600`}
      >
        <div
          className="absolute inset-0 -translate-x-full transform bg-blue-700 transition-transform duration-75 ease-in-out group-hover:translate-x-0 dark:text-base-950"
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
      <button
        className="my-4 mb-24 text-sm text-base-500"
        onClick={() => navigate("/stats")}
      >
        more stats
      </button>

      <div className="absolute bottom-0 w-[95%] p-2">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
