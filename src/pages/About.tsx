import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export const About = () => {
  return (
    <div className="flex h-fit min-h-[100vh] w-full flex-col gap-5 bg-base-50 p-2 pt-32 md:p-10 md:pt-32 dark:bg-base-950">
      <Navbar />
      <div className="h-full w-full gap-10 text-base-950 dark:text-base-50">
        <div className="flex w-full flex-col gap-6 p-4 md:w-1/2">
          <h1 className="text-7xl">What is SNIPPP</h1>
          <p>
            SNIPPP was created for graphics programmers to provide the fastest
            method to reuse tools.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-2">
        <Footer />
      </div>
    </div>
  );
};
