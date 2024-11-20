import RoadmapDisplay from "../components/RoadmapDisplay";
import SubtleGridBackground from "../components/global/SubtleGridBackground";
import { Footer } from "../components/nav/Footer";
import { Navbar } from "../components/nav/Navbar";
import { releases } from "./Roadmap";

export const About = () => {
  document.title = `Snippp - About`;

  return (
    <div className="flex h-fit min-h-[100vh] w-full max-w-[100vw] flex-col items-center gap-5 p-2 pt-32 md:p-10 md:pt-32 dark:text-white">
      <Navbar />
      <SubtleGridBackground />
      <div className="flex flex-col gap-8 backdrop-blur-sm lg:p-4">
        <span className="flex w-full flex-wrap p-4 text-7xl font-bold text-white md:p-0">
          <span className="w-fit bg-info p-1">What</span>
          <span className="w-fit bg-info p-1">is</span>
          <span className="w-fit bg-info p-1">Snippp?</span>
        </span>
        <div className="flex max-w-prose flex-col gap-4 p-4 text-xl md:p-0">
          <p>
            At Snippp, we see coding as the means to bring ideas to life. But
            too often, valuable time is lost searching for the right tools,
            reusable code, or just figuring out how to start. We believe
            developers should be free to focus on building, not digging through
            scattered snippets or reinventing the wheel. That’s why we’ve
            created a platform dedicated to making code organization effortless
            and collaborative.
          </p>
          <p>
            We’re here to help developers organize their snippets into cohesive
            toolkits—collections of code that solve real problems, ready to be
            reused and shared. By bringing these toolkits together in one place,
            we aim to foster a culture of contribution, where developers can
            share knowledge and build on each other’s work.
          </p>
          <p>
            Our goal is simple: to make coding smoother, faster, and more
            collaborative. Because when the right tools are in place, creativity
            flows, and ideas become reality.
          </p>
        </div>
        <a
          href="/privacy-policy"
          className="text-base-500 hover:text-base-950 hover:underline"
        >
          Privacy Policy
        </a>
        <h1 className="mt-24 w-fit self-start bg-success p-1 text-7xl font-bold text-white">
          Roadmap:
        </h1>
      </div>
      <RoadmapDisplay releases={releases} />

      <Footer />
    </div>
  );
};
