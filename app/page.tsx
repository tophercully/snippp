import "./output.css";
import SnipppButton from "./src/components/universal/SnipppButton";
import SubtleGridBackground from "./src/components/universal/SubtleGridBackground";
import { Navbar } from "./src/components/nav/Navbar";
import { Footer } from "./src/components/nav/Footer";
import CTA from "./src/components/home/CTA";
import LandingStats from "./src/components/statsTools/LandingStats";

const Home = () => {
  return (
    <div className="font-satoshi relative flex h-fit min-h-[100svh] w-[100svw] flex-col items-center justify-center gap-12 p-2 pb-32 pt-32 md:p-16">
      <Navbar />
      <SubtleGridBackground />
      <div className="relative flex h-[90svh] w-full flex-col justify-center">
        <div
          id="hero-spread"
          className="flex items-center justify-between gap-3"
        >
          <div
            id="hero-text"
            className="z-10 flex h-fit flex-col items-start justify-center gap-8 p-2 md:gap-16"
          >
            <h1 className="flex flex-col self-start text-7xl font-bold text-base-950 md:max-w-[66vw] md:text-9xl dark:text-base-50">
              <span className="w-fit bg-info p-1 text-white">Your</span>
              <span className="w-fit bg-info p-1 text-white">toolkit,</span>
              <span className="w-fit bg-info p-1 text-white">amplified</span>
            </h1>
            <div
              id="desc"
              className="text-md flex w-fit flex-col text-left text-black md:p-0 md:text-4xl"
            >
              <h2 className="mb-6 w-full max-w-[50ch] self-start rounded-md text-xl backdrop-blur-sm md:text-3xl dark:text-white">
                Join a community of developers building reusable code snippets
                and toolkits. Open Source and free to use.
              </h2>
            </div>
          </div>
          <div className="relative hidden h-1/2 w-2/3 flex-col items-center justify-center xl:flex">
            <img
              src="dashboardMockup2.png"
              alt="Snippp Dashboard displayed on a laptop screen"
              className="z-20"
            />
          </div>
        </div>
        <div
          id="CTA"
          className="z-10 flex items-center gap-4 self-center md:self-end"
        >
          <CTA />
          <SnipppButton
            href="/browse"
            size="lg"
            colorType="neutral"
            tooltip="Browse tools from our community of developers"
            tooltipPosition="right"
            pronounced={false}
          >
            <span className="text-md relative z-10 flex flex-nowrap items-center md:text-lg dark:group-hover:text-base-50">
              Browse tools
              <img
                src="arrow-right-long.svg"
                alt="Right arrow"
                className="relative ml-3 h-6 invert group-hover:invert-0 dark:invert-0"
              />
            </span>
          </SnipppButton>
        </div>
      </div>

      <LandingStats />

      <div className="flex min-h-[70svh] w-full flex-col items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-around gap-8 xl:flex-row">
          <div className="flex flex-col gap-8 p-2 text-black md:gap-16 dark:text-white">
            <h3 className="flex w-2/3 flex-col text-7xl font-bold text-black md:text-9xl dark:text-white">
              <span className="w-fit bg-error p-1 text-white">Toolkits</span>
              <span className="w-fit bg-error p-1 text-white">{`>>>>>>>`}</span>
              <span className="w-fit text-nowrap bg-error p-1 text-white">
                libraries
              </span>
            </h3>
            <p className="text-xl backdrop-blur-sm md:text-3xl">
              Keep relevant snippets within reach, without bloating your
              project.
            </p>
          </div>
          <img
            src="/listsScreenshot.png"
            alt="Screenshot of Lists View"
            className="max-w-[70vw] rounded-lg shadow-xl md:max-w-[35vw]"
          />
        </div>
      </div>

      <div className="mb-12 flex min-h-[90svh] w-full flex-col items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-around gap-8 xl:flex-row">
          <div className="flex flex-col gap-8 text-black md:gap-16 dark:text-white">
            <h3 className="flex w-2/3 flex-col p-2 text-7xl font-bold text-black md:text-9xl dark:text-white">
              <span className="z-10 w-fit bg-success p-1 text-white">
                Leverage
              </span>
              <span className="w-fit bg-success p-1 text-white">
                collective
              </span>
              <span className="w-fit bg-success p-1 text-white">knowledge</span>
            </h3>
            <p className="p-2 text-xl backdrop-blur-sm md:text-3xl">
              Explore a rich library of snippets from developers around the
              world, and share your own with the community.
            </p>
            <p className="p-2 text-xl backdrop-blur-sm md:text-3xl">
              At Snippp, contributors are valued, empowering new developers and
              nurturing a culture of collaboration.
            </p>
          </div>
          <div className="w-full p-2 md:p-0">
            <img
              src="/profileScreenshot.png"
              alt="Screenshot of Snippp profile"
              className="md:max-h-2/3 rounded-lg shadow-xl md:max-w-[35vw]"
            />
          </div>
        </div>
      </div>

      <div className="mb-12 flex min-h-[90svh] w-full flex-col items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-around gap-8 xl:flex-row">
          <div className="flex flex-col gap-8 text-black md:gap-16 dark:text-white">
            <h3 className="flex w-2/3 flex-col p-2 text-7xl font-bold text-black md:text-9xl dark:text-white">
              <span className="flex w-fit flex-wrap">
                <span className="w-fit bg-special p-1 text-white">Your</span>
                <span className="w-fit bg-special p-1 text-white">code,</span>
              </span>
              <span className="flex w-fit flex-wrap">
                <span className="z-10 w-fit bg-special p-1 text-white">
                  your
                </span>
                <span className="w-fit bg-special p-1 text-white">control</span>
              </span>
            </h3>
            <p className="p-2 text-xl backdrop-blur-sm md:text-3xl">
              We prioritize your privacy. Control who sees your snippets with
              customizable privacy settings, ensuring your code is safe and
              secure.
            </p>
            {/* <p className="p-2 text-xl backdrop-blur-sm md:text-3xl">
              Need more security? Keep an ear out for our upcoming desktop app
              by following us on{" "}
              <a
                target="_blank"
                href="https://twitter.com/snipppio"
                className="underline"
              >
                Twitter
              </a>
              . All of the power of Snippp, without sharing your code with us.
            </p> */}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex w-full flex-col gap-4 p-2 md:p-0">
              <img
                src="/privacyScreenshot.png"
                alt="Screenshot of a snippet marked as private"
                className="md:max-h-2/3 rounded-lg shadow-xl md:max-w-[35vw]"
              />
              <img
                src="/privateScreenshot.png"
                alt="Screenshot of Privacy Settings"
                className="md:max-h-2/3 rounded-lg shadow-xl md:max-w-[35vw]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-12 flex min-h-[90svh] w-full flex-col items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-around gap-8 xl:flex-row">
          <div className="flex flex-col gap-8 text-black md:gap-16 dark:text-white">
            <h3 className="flex w-2/3 flex-col p-2 text-7xl font-bold text-black md:text-9xl dark:text-white">
              {/* <span className="w-fit bg-info p-1 text-white">Start </span> */}
              {/* <span className="w-fit bg-info p-1 text-white">It's </span> */}
              <span className="w-fit bg-info p-1 text-white">Free</span>
              <span className="w-fit bg-info p-1 text-white">ninety</span>
              <span className="w-fit bg-info p-1 text-white">nine</span>
            </h3>
            <p className="p-2 text-xl backdrop-blur-sm md:text-3xl">
              Sign up now and join a growing community of developers optimizing
              their workflow with our powerful snippet organizer.
            </p>
            <div className="self-center">
              <CTA />
            </div>
            {/* <p className="p-2 text-xl backdrop-blur-sm md:text-3xl">
              Unlock advanced features and unlimited storage with our upcoming
              Pro plan.
            </p> */}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-[95%] p-2">
        {/* <Link
          href="/stats"
          className="my-4 justify-self-end text-sm text-base-500"
        >
          stats
        </Link> */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
