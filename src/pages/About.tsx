import RoadmapDisplay from "../components/browserComponents/roadmap/RoadmapDisplay";
import { Footer } from "../components/nav/Footer";
import { Navbar } from "../components/nav/Navbar";
import { releases } from "./Roadmap";

export const About = () => {
  document.title = `Snippp - About`;

  return (
    <div className="flex h-fit min-h-[100vh] w-full flex-col gap-5 bg-base-50 p-2 pt-32 md:p-10 md:pt-32 dark:bg-base-950">
      <Navbar />
      <div className="flex h-full w-full flex-col p-2 text-base-950 dark:text-base-50">
        <div className="my-44 flex w-full flex-col self-center md:w-1/2 md:min-w-[40rem]">
          <h1 className="-mb-[9px] border-2 border-base-950 px-2 pt-2 text-4xl md:-mb-[12px] md:text-7xl dark:border-base-50">
            What is SNIPPP?
          </h1>
          <p className="w-full rounded-sm bg-base-950 p-6 text-xl font-light leading-10 text-base-50 md:p-24 dark:bg-base-50 dark:text-base-950">
            SNIPPP was created for graphics programmers and creative coders, a
            snippet tool with as little friction as possible - so you can stay
            in the zone instead of searching old repos for that one angle
            function you built.
          </p>
        </div>
        <div className="mb-24 flex w-full flex-col gap-10 xl:px-12">
          <h1 className="w-full px-4 text-left text-4xl underline decoration-dashed underline-offset-8 md:-mb-3 md:text-7xl">
            Core Concepts:
          </h1>

          <div className="mt-12 flex w-full flex-col rounded-sm p-4 md:w-3/5 md:min-w-[40rem]">
            <h1 className="-mb-[9px] border-2 border-base-950 px-4 pt-2 text-4xl md:-mb-[12px] md:text-7xl dark:border-base-50">
              EFFICIENCY
            </h1>
            <p className="w-full rounded-sm bg-base-950 p-6 text-xl font-light leading-10 text-base-50 md:p-12 dark:bg-base-50 dark:text-base-950">
              Every second spent searching for code is a second not spent
              creating.
            </p>
          </div>

          <div className="flex w-full flex-col rounded-sm p-4 md:w-3/5 md:min-w-[40rem] md:self-end">
            <h1 className="-mb-[9px] border-2 border-base-950 px-4 pt-2 text-4xl md:-mb-[12px] md:text-right md:text-7xl dark:border-base-50">
              ORGANIZATION
            </h1>
            <p className="w-full rounded-sm bg-base-950 p-6 text-xl font-light leading-10 text-base-50 md:p-12 dark:bg-base-50 dark:text-base-950">
              File your snippets into lists, "Color Tools", "Vector Math", etc.
              so you can keep a relevant list open for the work you're doing.
            </p>
          </div>

          <div className="flex w-full flex-col rounded-sm p-4 md:w-3/5 md:min-w-[40rem]">
            <h1 className="-mb-[9px] border-2 border-base-950 px-4 pt-2 text-4xl md:-mb-[12px] md:text-7xl dark:border-base-50">
              COMMUNITY
            </h1>
            <p className="w-full rounded-sm bg-base-950 p-6 text-xl font-light leading-10 text-base-50 md:p-12 dark:bg-base-50 dark:text-base-950">
              Stop reinventing the wheel when you need to build something new --
              search for what you need in the browser, or by category.
            </p>
          </div>

          <div className="flex w-full flex-col rounded-sm p-4 md:w-3/5 md:min-w-[40rem] md:self-end">
            <h1 className="-mb-[9px] w-full border-2 border-base-950 px-2 pt-2 text-4xl md:-mb-[12px] md:text-right md:text-7xl dark:border-base-50">
              FLEXIBILITY
            </h1>
            <p className="w-full rounded-sm bg-base-950 p-6 text-xl font-light leading-10 text-base-50 md:p-12 dark:bg-base-50 dark:text-base-950">
              {
                "Snippets are whatever you want them to be: chunks of code, functions, strings, nice notes to yourself :)"
              }
            </p>
          </div>
        </div>
      </div>
      <RoadmapDisplay releases={releases} />

      <Footer />
    </div>
  );
};
