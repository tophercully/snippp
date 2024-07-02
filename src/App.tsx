import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

const Home = () => {
  return (
    <div className="font-satoshi flex min-h-svh w-screen flex-col items-center justify-center bg-base-50 p-2 pt-24 md:p-10 dark:bg-base-900">
      <Navbar />
      <div
        id="hero"
        className="border-base-150 box-content flex flex-col items-center justify-center border-2 border-dashed p-10 duration-200 hover:border-8 hover:p-9 dark:border-base-800 dark:text-base-50"
      >
        <h1 className="text-7xl md:text-9xl">SNIPPP</h1>
      </div>
      <a
        href="/browse"
        className="mt-24 rounded-sm bg-base-950 p-4 text-xl text-base-50 hover:bg-base-800 md:text-3xl dark:bg-base-50 dark:text-base-950 dark:hover:bg-base-200"
      >
        BROWSE SNIPPPETS
      </a>
      <a
        href="/builder"
        className="mt-24 rounded-sm bg-base-950 p-4 text-lg text-base-50 hover:bg-base-800 md:text-xl dark:bg-base-50 dark:text-base-950 dark:hover:bg-base-200"
      >
        BUILD
      </a>
      <div className="absolute bottom-0 w-full p-2">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
