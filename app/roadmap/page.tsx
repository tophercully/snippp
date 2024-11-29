
import { Footer } from "../src/components/nav/Footer";
import { Navbar } from "../src/components/nav/Navbar";
import RoadmapDisplay from "../src/components/universal/RoadmapDisplay";
import { releases } from "../src/data/roadmapData";



const Roadmap = () => {

  return (
      <div className="flex h-fit min-h-[100vh] w-full flex-col gap-5 bg-base-50 p-2 pt-32 md:p-10 md:pt-32 dark:bg-base-950">
        <Navbar />
        <RoadmapDisplay releases={releases} />
        <Footer />
      </div>
  );
};

export default Roadmap;
