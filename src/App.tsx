import { useLocalStorage } from "@uidotdev/usehooks";
import { Footer } from "./components/nav/Footer";
import { Navbar } from "./components/nav/Navbar";
import SnipppButton from "./components/SnipppButton";

import "./output.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  document.title = `Snippp - Snippet Organizer`;
  const [userProfile] = useLocalStorage("userProfile", null);
  const navigate = useNavigate();

  return (
    <div className="relative flex h-fit min-h-[100svh] w-[99svw] flex-col items-center justify-center bg-base-50 p-2 pb-32 pt-32 font-satoshi md:p-10 dark:bg-base-950">
      <Navbar />

      <div className="flex w-full flex-row items-center justify-center gap-8 lg:mt-24">
        {/* <div
          id="hero"
          className="box-content flex h-fit items-center justify-center self-center border-2 border-dashed border-base-150 p-4 text-blue-600 transition-all dark:border-base-800 dark:text-blue-700"
        >
          <img
            src="/snippp.svg"
            className="h-24"
          />
        </div> */}
        {/* <div className="absolute inset-0 -z-10 m-[-6px] border-8 border-transparent" /> */}

        <div
          id="desc"
          className="flex w-fit max-w-[60ch] flex-col justify-center gap-4 p-4 text-left text-sm md:p-0 md:text-2xl dark:text-base-400"
        >
          <h2 className="max-w-[40ch] text-xl font-medium text-base-950 dark:text-base-50">
            Sort Smarter, Build Faster
          </h2>
          <p className="text-base">Your toolkit, amplified.</p>

          <p className="text-base">
            Organize, share, and discover code snippets FAST, so you can get
            back to coding.
          </p>
        </div>
      </div>
      <div
        id="CTA"
        className="mt-12 flex flex-col items-center gap-4"
      >
        <a
          href="/browse"
          className={`group relative flex items-center justify-center overflow-hidden rounded-sm bg-base-950 px-4 py-3 text-base-50 shadow-md duration-75 dark:bg-base-50 dark:text-base-950 dark:shadow-sm dark:shadow-base-600`}
        >
          <div
            className="absolute inset-0 -translate-x-full transform bg-blue-700 transition-transform duration-75 ease-in-out group-hover:translate-x-0 dark:text-base-950"
            aria-hidden="true"
          />
          <span className="relative z-10 text-xl md:text-2xl dark:group-hover:text-base-50">
            {`Browse tools from the community`}
          </span>
          <img
            src="arrow-right-long.svg"
            className="relative ml-3 h-10 dark:invert dark:group-hover:invert-0"
          />
        </a>
        {userProfile && (
          <>
            OR
            <SnipppButton
              colorType="add"
              onClick={() => navigate("/builder")}
            >
              <span className="flex items-center justify-center text-xl md:text-2xl">
                Add a snippet
                <img
                  src="add.svg"
                  className="ml-3 h-10 invert group-hover:invert-0 dark:invert-0"
                />
              </span>
            </SnipppButton>
          </>
        )}
      </div>

      <div className="absolute bottom-0 w-[95%] p-2">
        <button
          className="my-4 justify-self-end text-sm text-base-500"
          onClick={() => navigate("/stats")}
        >
          stats
        </button>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
